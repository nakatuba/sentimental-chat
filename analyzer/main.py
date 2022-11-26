import io

import torch
import yaml
from fastapi import FastAPI
from google.cloud import storage
from pydantic import BaseModel
from transformers import BertJapaneseTokenizer

from model import BertAnalyzer

app = FastAPI()

storage_client = storage.Client()
bucket = storage_client.bucket("sentimental-chat-analyzer_model")
blob = bucket.blob("model.pt")
data = blob.download_as_string()

with open("config.yaml") as f:
    config = yaml.safe_load(f)

model = BertAnalyzer(
    pretrained_model=config["model"]["pretrained_model"],
    dropout_prob=config["model"]["dropout_prob"],
    output_dim=len(config["data"]["emotions"]),
)
model.load_state_dict(torch.load(io.BytesIO(data), map_location=torch.device("cpu")))
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
