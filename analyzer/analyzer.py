from dataclasses import dataclass
from typing import Dict, List

import torch
from transformers import BertJapaneseTokenizer

from model import WrimeBert


@dataclass
class WrimeAnalyzer:
    model: WrimeBert
    tokenizer: BertJapaneseTokenizer
    emotions: List[str]

    def __post__init__(self) -> None:
        self.model = self.model.to("cpu")

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
            output = (output - output.min()) / (output.max() - output.min())

        return dict(zip(self.emotions, output.tolist()))
