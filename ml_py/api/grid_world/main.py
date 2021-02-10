from typing import Tuple

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic.main import BaseModel

from base import GridWorldBase, GridWorldRandom
from constants import AlgorithmTypes, grid_size
from gym_grid_world.envs import GridWorldEnv
from pg import GridWorldPG

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models = {
    AlgorithmTypes.pg: GridWorldPG(),
    AlgorithmTypes.random: GridWorldRandom()
}


class PositionsData(BaseModel):
    player: Tuple[int, int]
    wall: Tuple[int, int]
    pit: Tuple[int, int]
    win: Tuple[int, int]


class StepData(BaseModel):
    positions: PositionsData
    action: int


@app.get('/init')
def index(algo: str):
    env = GridWorldEnv(grid_size, mode='random')
    env.reset()
    player, win, pit, wall = GridWorldBase.get_item_positions(env.state)
    model = models[algo]
    predictions = model.predict(env)
    return {"positions": {"player": player, "wall": wall, "win": win, "pit": pit}, 'grid_size': grid_size,
            'predictions': predictions}


@app.post('/step')
def step(algo: str, data: StepData):
    env = GridWorldEnv(grid_size, mode='random')
    env.reset()
    env.state = dict(data.positions)
    state, reward, done, info = env.step(data.action)
    model = models[algo]
    predictions = model.predict(env)
    player, win, pit, wall = GridWorldBase.get_item_positions(state)
    return {'reward': reward, 'done': done, 'info': info, 'predictions': predictions,
            "positions": {"player": player, "wall": wall, "win": win, "pit": pit}}