terraform {
  backend "gcs" {
    bucket = "sentimental-chat-tfstate"
    prefix = "terraform/state"
  }
}
