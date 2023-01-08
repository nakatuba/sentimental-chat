from dataclasses import dataclass
from typing import List, Tuple

import numpy as np
import numpy.typing as npt
import torch
from transformers import BatchEncoding, BertJapaneseTokenizer


@dataclass
class WrimeCollator:
    tokenizer: BertJapaneseTokenizer
    device: torch.device

    def __call__(
        self, batch: List[Tuple[str, npt.NDArray[np.int64]]]
    ) -> Tuple[BatchEncoding, torch.Tensor]:
        input = self.tokenizer(
            [text for text, _ in batch],
            padding=True,
            truncation=True,
            max_length=512,
            return_tensors="pt",
        )
        label = torch.tensor(np.array([label for _, label in batch]), dtype=torch.float)

        return input.to(self.device), label.to(self.device)
