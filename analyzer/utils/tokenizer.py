import sys
from typing import List, Optional, Union

import torch
from torch.nn.utils.rnn import pad_sequence
from transformers import BatchEncoding

from utils.path import hottoSNS_bert

sys.path.append("./hottoSNS-bert/src/")
import tokenization
from preprocess import normalizer


class HottoSnsBertTokenizer(tokenization.JapaneseTweetTokenizer):
    def __init__(self) -> None:
        super().__init__(
            vocab_file=hottoSNS_bert.VOCAB_FILE,
            model_file=hottoSNS_bert.SP_MODEL_FILE,
            normalizer=normalizer.twitter_normalizer_for_bert_encoder,
            do_lower_case=False,
        )

    def __call__(self, text: Union[str, List[str]], **kwargs) -> BatchEncoding:
        if isinstance(text, str):
            ids = self._get_ids(text, kwargs.get("max_length"))
            input_ids = torch.tensor(ids)
            attention_mask = torch.ones(len(ids))
        elif isinstance(text, List):
            input_ids = []
            attention_mask = []
            for t in text:
                ids = self._get_ids(t, kwargs.get("max_length"))
                input_ids.append(torch.tensor(ids))
                attention_mask.append(torch.ones(len(ids)))
            input_ids = pad_sequence(input_ids, batch_first=True)
            attention_mask = pad_sequence(attention_mask, batch_first=True)

        return BatchEncoding({"input_ids": input_ids, "attention_mask": attention_mask})

    def _get_ids(self, text: str, max_length: Optional[int] = None) -> List[int]:
        words = super().tokenize(text)
        if max_length is not None:
            words = words[: max_length - 2]
        ids = super().convert_tokens_to_ids(["[CLS]"] + words + ["[SEP]"])

        return ids
