from typing import Literal


class EarlyStopping:
    def __init__(self, patience: int, mode: Literal["min", "max"] = "min") -> None:
        self.best = None
        self.patience = patience
        if mode == "min":
            self.is_better = lambda a, best: a < best
        elif mode == "max":
            self.is_better = lambda a, best: a > best

    def step(self, metric: float) -> bool:
        if self.best is None:
            self.best = metric
            return False

        if self.is_better(metric, self.best):
            self.num_bad_epochs = 0
            self.best = metric
        else:
            self.num_bad_epochs += 1

        if self.num_bad_epochs >= self.patience:
            return True

        return False
