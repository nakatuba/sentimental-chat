import os

BERT_MODEL_DIR = "./hottoSNS-bert/trained_model/masked_lm_only_L-12_H-768_A-12/"
CONFIG_FILE = os.path.join(BERT_MODEL_DIR, "bert_config.json")
VOCAB_FILE = os.path.join(BERT_MODEL_DIR, "tokenizer_spm_32K.vocab.to.bert")
SP_MODEL_FILE = os.path.join(BERT_MODEL_DIR, "tokenizer_spm_32K.model")
BERT_MODEL_FILE = os.path.join(BERT_MODEL_DIR, "model.ckpt-1000000.index")
