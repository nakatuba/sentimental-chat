import os

import cloudpickle
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
import wandb
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader
from transformers import BertJapaneseTokenizer

from analyzer import WrimeAnalyzer
from model import WrimeBert
from utils.args import get_args
from utils.collator import WrimeCollator
from utils.dataset import WrimeDataset
from utils.early_stopping import EarlyStopping
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


def evaluate(model: nn.Module, dataloader: DataLoader, criterion: nn.Module) -> float:
    model.eval()
    epoch_loss = 0

    with torch.no_grad():
        for input, label in dataloader:
            output = model(input)
            loss = criterion(output, label)
            epoch_loss += loss.item()

    return epoch_loss / len(dataloader)


def main() -> None:
    args = get_args()

    wandb.init(project=args.project, config=vars(args), mode=args.mode)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    fix_seed(args.seed)

    df = pd.read_csv(args.wrime_tsv, sep="\t")

    train_df, valid_df = train_test_split(
        df, test_size=args.validation_size, random_state=args.seed
    )

    train_dataset = WrimeDataset(train_df, emotions=args.emotions)
    valid_dataset = WrimeDataset(valid_df, emotions=args.emotions)

    tokenizer = BertJapaneseTokenizer.from_pretrained(args.pretrained_model)
    collator = WrimeCollator(tokenizer, device=device)

    train_dataloader = DataLoader(
        train_dataset,
        batch_size=args.batch_size,
        shuffle=True,
        collate_fn=collator,
    )
    valid_dataloader = DataLoader(
        valid_dataset,
        batch_size=args.batch_size,
        shuffle=False,
        collate_fn=collator,
    )

    model = WrimeBert(
        pretrained_model=args.pretrained_model,
        dropout_prob=args.dropout_prob,
        output_dim=len(args.emotions),
    ).to(device)
    criterion = nn.MSELoss().to(device)
    optimizer = optim.Adam(model.parameters(), lr=args.learning_rate)
    es = EarlyStopping(patience=args.patience)

    for epoch in range(args.num_epochs):
        train_loss = train(model, train_dataloader, criterion, optimizer)
        valid_loss = evaluate(model, valid_dataloader, criterion)
        print(
            f"Epoch {epoch + 1}/{args.num_epochs} | train | Loss: {train_loss:.4f} | valid | Loss: {valid_loss:.4f}"
        )
        if es.step(valid_loss):
            break

    analyzer = WrimeAnalyzer(model, tokenizer, args.emotions)

    with open(os.path.join(wandb.run.dir, "analyzer.pkl"), mode="wb") as f:
        cloudpickle.dump(analyzer, f)


if __name__ == "__main__":
    main()
