from dataclasses import dataclass
from typing import Dict, List

import cloudpickle
import torch
import torch.nn as nn
from transformers import AutoTokenizer


@dataclass
class WrimeAnalyzer:
    model: nn.Module
    tokenizer: AutoTokenizer
    emotions: List[str]

    def __call__(self, text: str) -> Dict[str, float]:
        self.model.eval()

        with torch.no_grad():
            input = self.tokenizer(
                text,
                padding=True,
                truncation=True,
                max_length=512,
                return_tensors="pt",
            )
            output = self.model(input)
            output = output.squeeze()
            output = (output / 3).clamp(min=0, max=1)

        return dict(zip(self.emotions, output.tolist()))

    def save(self, path: str) -> None:
        self.model.to("cpu")

        with open(path, mode="wb") as f:
            cloudpickle.dump(self, f)
