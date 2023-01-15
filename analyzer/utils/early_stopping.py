import copy
from typing import Literal

import torch.nn as nn


class EarlyStopping:
    def __init__(self, patience: int, mode: Literal["min", "max"] = "min") -> None:
        self.patience = patience
        self.best = None
        self.num_bad_epochs = 0
        if mode == "min":
            self.is_better = lambda a, best: a < best
        elif mode == "max":
            self.is_better = lambda a, best: a > best

    def __call__(self, metric: float, model: nn.Module) -> bool:
        if self.best is None:
            self.best = metric
            self.best_model = copy.deepcopy(model)
            return False

        if self.is_better(metric, self.best):
            self.num_bad_epochs = 0
            self.best = metric
            self.best_model = copy.deepcopy(model)
        else:
            self.num_bad_epochs += 1

        if self.num_bad_epochs >= self.patience:
            return True

        return False
