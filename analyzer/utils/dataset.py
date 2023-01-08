import re
from typing import List, Tuple

import numpy as np
import numpy.typing as npt
import pandas as pd
from torch.utils.data import Dataset


class WrimeDataset(Dataset):
    def __init__(self, path: str, emotions: List[str]) -> None:
        df = pd.read_csv(path, sep="\t")
        df["Sentence"] = df["Sentence"].map(self._clean_tweet_text)
        self.texts = df["Sentence"].to_numpy()
        self.labels = df[
            [f"Writer_{emotion.capitalize()}" for emotion in emotions]
        ].to_numpy()

    def _clean_tweet_text(self, text: str) -> str:
        text = text.replace("\n", " ")
        text = text.replace("\\n", " ")
        text = re.sub("@[^\s]+", "", text)
        text = re.sub("http[^\s]+", "", text)
        return text

    def __len__(self) -> int:
        return len(self.texts)

    def __getitem__(self, index: int) -> Tuple[str, npt.NDArray[np.int64]]:
        return self.texts[index], self.labels[index]
