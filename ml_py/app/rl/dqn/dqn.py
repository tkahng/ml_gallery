"""

What's desired?
- Use yaml files for hyperparameters
  - because it is easy to comment and add whatever notes you want in the yaml file
- Use batches of envs
  - Not all envs are meant to start at the same time and when one env is done,
    it will be reset independent of other envs in the batch.
- Run the algo in steps rather than epoch + batch
- Use env wrapper

Questions:
- How do we handle 2 player setup?

"""

from typing import Type, List, Tuple
import torch
import wandb
from omegaconf import DictConfig
from torch import nn
from torch.nn import functional as F
from app.rl.dqn.env_wrapper import EnvWrapper
from settings import BASE_DIR


def train_dqn(
    env_class: Type[EnvWrapper], model: nn.Module, config: DictConfig, name=None
):
    envs = [env_class() for _ in range(config.batch_size)]
    [env.reset() for env in envs]
    wandb.init(
        # name="",  # Name of the run
        project=name or "testing_dqn",
        config=config,
        save_code=True,
        group=None,
        tags=None,  # List of string tags
        notes=None,  # longer description of run
        dir=BASE_DIR,
    )
    wandb.watch(model)
    cumulative_reward = 0
    cumulative_done = 0

    optim = torch.optim.Adam(model.parameters(), lr=config.lr)

    for step in range(config.steps):
        log = DictConfig({})
        log.step = step

        states = env_class.get_state_batch(envs)
        q_pred = model(states)

        actions = sample_actions(q_pred, epsilon=config.epsilon_exploration).tolist()

        # ============ Observe the reward && predict value of next state ==============

        _, rewards, done_list, _ = step_environments(envs, actions)
        rewards = torch.tensor(rewards).float()
        next_states = env_class.get_state_batch(envs)
        model.eval()
        with torch.no_grad():
            q_next = model(next_states)
        model.train()

        value = rewards + config.gamma_discount * torch.amax(q_next, 1)
        q_actions = q_pred[:, actions]

        # =========== LEARN ===============

        loss = F.mse_loss(q_actions, value)

        optim.zero_grad()
        loss.backward()
        optim.step()

        # ============ Logging =============

        log.loss = loss.item()

        cumulative_done += get_done_count(done_list)
        log.cumulative_done = cumulative_done

        max_reward = torch.amax(rewards, 0).item()
        log.max_reward = max_reward

        mean_reward = torch.mean(rewards, 0).item()
        log.mean_reward = mean_reward

        cumulative_reward += mean_reward
        log.cumulative_reward = cumulative_reward

        wandb.log(log)


def sample_actions(q_values: torch.Tensor, epsilon: float):
    batch_size, num_actions = q_values.shape
    exploit_actions = torch.argmax(q_values, 1)
    explore_actions = torch.randint(low=0, high=num_actions, size=(batch_size,))
    random_indices = torch.multinomial(
        torch.Tensor([epsilon, 1 - epsilon]), batch_size, replacement=True
    )
    explore_indices = random_indices == 0
    exploit_actions[explore_indices] = explore_actions[explore_indices]
    return exploit_actions


def step_environments(
    envs: List[EnvWrapper], actions: List
) -> Tuple[List, List, List, List]:
    assert len(envs) > 0
    assert len(envs) == len(actions)

    states = []
    rewards = []
    dones = []
    infos = []

    for env, action in zip(envs, actions):
        next_state, reward, done, info = env.step(action)

        states.append(next_state)
        rewards.append(reward)
        dones.append(done)
        infos.append(info)

        if done:
            env.reset()

    return states, rewards, dones, infos


def get_done_count(done_list: List[bool]):
    count = 0
    for done in done_list:
        if done:
            count += 1
    return count