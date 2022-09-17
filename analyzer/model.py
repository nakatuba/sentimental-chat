import torch.nn as nn
from transformers import BertModel


class BertAnalyzer(nn.Module):
    def __init__(
        self, pretrained_model: str, dropout_prob: float, output_dim: int
    ) -> None:
        super().__init__()
        self.bert = BertModel.from_pretrained(pretrained_model)
        self.dropout = nn.Dropout(dropout_prob)
        self.linear = nn.Linear(self.bert.config.hidden_size, output_dim)

    def forward(self, input):
        _, pooler_output = self.bert(**input, return_dict=False)
        output = self.dropout(pooler_output)
        output = self.linear(output)

        return output
