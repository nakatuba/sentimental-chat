import torch
import yaml
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BertJapaneseTokenizer

from model import BertAnalyzer

app = FastAPI()

with open("config.yaml") as f:
    config = yaml.safe_load(f)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = BertAnalyzer(
    pretrained_model=config["model"]["pretrained_model"],
    dropout_prob=config["model"]["dropout_prob"],
    output_dim=len(config["data"]["emotions"]),
)
model.load_state_dict(torch.load("./trained_models/model.pt", device))
tokenizer = BertJapaneseTokenizer.from_pretrained(config["model"]["pretrained_model"])


class Message(BaseModel):
    body: str


@app.post("/analyze")
def analyze_sentiment(message: Message):
    model.eval()
    with torch.no_grad():
        input = tokenizer(
            message.body,
            padding=True,
            truncation=True,
            max_length=512,
            return_tensors="pt",
        )
        output = model(input)
        output = output.squeeze()
        output = (output / 3).clamp(min=0, max=1)

    return dict(zip(config["data"]["emotions"], output.tolist()))
