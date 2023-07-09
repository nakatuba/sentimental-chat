from faker import Faker
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)
fake = Faker("ja_JP")


def test_analyze():
    response = client.post("/analyze", json={"body": fake.text()})
    assert response.status_code == 200
    for emotion in [
        "joy",
        "sadness",
        "anticipation",
        "surprise",
        "anger",
        "fear",
        "disgust",
        "trust",
    ]:
        score = response.json().get(emotion)
        assert isinstance(score, float)
        assert 0 <= score <= 1
