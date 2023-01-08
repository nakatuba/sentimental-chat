from typing import Dict

from fastapi import FastAPI
from pydantic import BaseModel

from analyzer import WrimeAnalyzer
from utils.gcloud import download_from_gcs

app = FastAPI()
analyzer: WrimeAnalyzer = download_from_gcs(
    bucket_name="sentimental-chat-analyzer", blob_name="analyzer.pkl"
)


class Message(BaseModel):
    body: str


@app.post("/analyze")
def analyze(message: Message) -> Dict[str, float]:
    return analyzer(message.body)
