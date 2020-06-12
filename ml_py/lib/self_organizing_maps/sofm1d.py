import torch
from lib.nn_utils import get_scaled_random_weights


class SOFM1D(torch.nn.Module):

    COSINE_OP = 'cosine'
    DISTANCE_OP = 'distance'

    def __init__(self, input_size, output_size, operation=DISTANCE_OP):
        super().__init__()
        self.weights = get_scaled_random_weights((input_size, output_size), -1, 1)

    def forward(self, x):
        """
        1. Find distances b/w wi and x.
        2. i* = arg min of distances
        3. Get neuron_distance factor
        4.

        Parameters
        ----------
        x: batch of 1D Tensors

        Returns
        -------

        """

        pass  # TODO: Do the operation

    def backward(self):
        pass

