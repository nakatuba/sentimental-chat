resource "google_storage_bucket" "tfstate" {
  name     = "sentimental-chat-tfstate"
  location = "ASIA-NORTHEAST1"
}

resource "google_storage_bucket" "analyzer" {
  name     = "sentimental-chat-analyzer"
  location = "ASIA-NORTHEAST1"
}

resource "google_secret_manager_secret" "django_settings" {
  secret_id = "django_settings"
  replication {
    automatic = true
  }
}

module "analyzer_cd" {
  source = "./modules/cd"

  service_name = "analyzer"
}

module "backend_cd" {
  source = "./modules/cd"

  service_name = "backend"
}
