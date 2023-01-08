import argparse


def get_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()

    # wandb
    parser.add_argument("--project", default="sentimental-chat", type=str)
    parser.add_argument(
        "--mode", default="online", type=str, choices=["online", "offline", "disabled"]
    )

    # data
    parser.add_argument("--wrime-tsv", default="./data/wrime-ver1.tsv", type=str)
    parser.add_argument("--validation-size", default=0.20, type=float)

    # label
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

    # model
    parser.add_argument(
        "--pretrained-model", default="cl-tohoku/bert-base-japanese-v2", type=str
    )
    parser.add_argument("--dropout-prob", default=0.1, type=float)

    # train
    parser.add_argument("--batch-size", default=32, type=int)
    parser.add_argument("--learning-rate", default=2e-5, type=float)
    parser.add_argument("--num-epochs", default=10, type=int)

    # seed
    parser.add_argument("--seed", default=42, type=int)

    return parser.parse_args()
