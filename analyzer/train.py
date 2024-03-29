import os

import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
import wandb
from torch.utils.data import DataLoader
from transformers import AutoTokenizer

from analyzer import WrimeAnalyzer
from model import WrimeBert
from utils.args import get_args
from utils.collator import WrimeCollator
from utils.dataset import WrimeDataset
from utils.seed import fix_seed


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

    fix_seed(args.seed)

    df = pd.read_csv(args.wrime_tsv, sep="\t")

    train_dataset = WrimeDataset(df, emotions=args.emotions)

    tokenizer = AutoTokenizer.from_pretrained(args.pretrained_model)
    collator = WrimeCollator(tokenizer, device=device)

    train_dataloader = DataLoader(
        train_dataset,
        batch_size=args.batch_size,
        shuffle=True,
        collate_fn=collator,
    )

    model = WrimeBert(
        pretrained_model=args.pretrained_model,
        dropout_prob=args.dropout_prob,
        output_dim=len(args.emotions),
    ).to(device)
    criterion = nn.MSELoss().to(device)
    optimizer = optim.Adam(model.parameters(), lr=args.learning_rate)

    for epoch in range(args.num_epochs):
        train_loss = train(model, train_dataloader, criterion, optimizer)
        print(f"Epoch {epoch + 1}/{args.num_epochs} | train | Loss: {train_loss:.4f}")

    analyzer = WrimeAnalyzer(model, tokenizer, args.emotions)

    if wandb.run:
        analyzer.save(os.path.join(wandb.run.dir, "analyzer.pkl"))


if __name__ == "__main__":
    main()
