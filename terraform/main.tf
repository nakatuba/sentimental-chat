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

resource "google_sql_database_instance" "database" {
  name             = "sentimental-chat-database"
  database_version = "POSTGRES_14"
  region           = "us-central1"
  settings {
    availability_type = "ZONAL"
    tier              = "db-f1-micro"
    disk_type         = "PD_HDD"
    disk_size         = 10
    disk_autoresize   = true
    backup_configuration {
      enabled = false
    }
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

module "analyzer" {
  source = "./modules/cloud_run"

  project_id   = var.project_id
  service_name = "analyzer"
  port         = 9000
  limits = {
    cpu    = "1000m"
    memory = "2Gi"
  }
}

module "backend" {
  source = "./modules/cloud_run"

  project_id   = var.project_id
  service_name = "backend"
  port         = 8000
  template_annotations = {
    "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.database.connection_name
  }
}

resource "google_cloud_run_service_iam_binding" "backend_iam_binding" {
  location = module.backend.location
  service  = module.backend.service_name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

resource "google_cloud_run_service_iam_binding" "analyzer_iam_binding" {
  location = module.analyzer.location
  service  = module.analyzer.service_name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}
