import torch
import torch.nn as nn
from transformers import AutoModel, BatchEncoding, BertForPreTraining

from utils.path import hottoSNS_bert


class WrimeBert(nn.Module):
    def __init__(
        self, pretrained_model: str, dropout_prob: float, output_dim: int
    ) -> None:
        super().__init__()
        if pretrained_model == "hottoSNS-bert":
            self.bert = BertForPreTraining.from_pretrained(
                hottoSNS_bert.BERT_MODEL_FILE,
                from_tf=True,
                config=hottoSNS_bert.CONFIG_FILE,
            ).bert
        else:
            self.bert = AutoModel.from_pretrained(pretrained_model)
        self.dropout = nn.Dropout(dropout_prob)
        self.linear = nn.Linear(self.bert.config.hidden_size, output_dim)

    def forward(self, input: BatchEncoding) -> torch.Tensor:
        _, pooler_output = self.bert(**input, return_dict=False)
        output = self.dropout(pooler_output)
        output = self.linear(output)

        return output
