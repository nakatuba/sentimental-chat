import argparse
import os

import cloudpickle
import torch
import torch.nn as nn
import torch.optim as optim
import wandb
from torch.utils.data import DataLoader
from transformers import BertJapaneseTokenizer

from model import BertAnalyzer
from utils.collator import BertCollator
from utils.dataset import WrimeDataset


def get_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", default="sentimental-chat", type=str)
    parser.add_argument(
        "--mode", default="online", type=str, choices=["online", "offline", "disabled"]
    )
    parser.add_argument("--wrime-tsv", default="./data/wrime-ver1.tsv", type=str)
    parser.add_argument(
        "--emotions",
        nargs="+",
        default=[
            "joy",
            "sadness",
            "anticipation",
            "surprise",
            "anger",
            "fear",
            "disgust",
            "trust",
        ],
        type=str,
        choices=[
            "joy",
            "sadness",
            "anticipation",
            "surprise",
            "anger",
            "fear",
            "disgust",
            "trust",
        ],
    )
    parser.add_argument(
        "--pretrained-model", default="cl-tohoku/bert-base-japanese-v2", type=str
    )
    parser.add_argument("--batch-size", default=32, type=int)
    parser.add_argument("--dropout-prob", default=0.1, type=float)
    parser.add_argument("--learning-rate", default=2e-5, type=float)
    parser.add_argument("--num-epochs", default=10, type=int)

    return parser.parse_args()


def train(
    model: nn.Module,
    dataloader: DataLoader,
    criterion: nn.Module,
    optimizer: optim.Optimizer,
) -> float:
    model.train()
    epoch_loss = 0

    for input, label in dataloader:
        output = model(input)

        loss = criterion(output, label)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        epoch_loss += loss.item()

    return epoch_loss / len(dataloader)


def main() -> None:
    args = get_args()

    wandb.init(project=args.project, config=vars(args), mode=args.mode)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    train_dataset = WrimeDataset(args.wrime_tsv, args.emotions)

    tokenizer = BertJapaneseTokenizer.from_pretrained(args.pretrained_model)
    collator = BertCollator(tokenizer, device=device)

    train_dataloader = DataLoader(
        train_dataset,
        batch_size=args.batch_size,
        shuffle=True,
        collate_fn=collator,
    )

    model = BertAnalyzer(
        pretrained_model=args.pretrained_model,
        dropout_prob=args.dropout_prob,
        output_dim=len(args.emotions),
    ).to(device)
    criterion = nn.MSELoss().to(device)
    optimizer = optim.Adam(model.parameters(), lr=args.learning_rate)

    for epoch in range(args.num_epochs):
        train_loss = train(model, train_dataloader, criterion, optimizer)
        print(f"Epoch {epoch + 1}/{args.num_epochs} | train | Loss: {train_loss:.4f}")

    with open(os.path.join(wandb.run.dir, "model.pt"), mode="wb") as f:
        cloudpickle.dump(model, f)


if __name__ == "__main__":
    main()
