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

resource "google_redis_instance" "redis" {
  name           = "sentimental-chat-redis"
  memory_size_gb = 1
}

resource "google_vpc_access_connector" "connector" {
  name          = "vpc-access-connector"
  ip_cidr_range = "10.8.0.0/28"
  network       = "default"
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
    "run.googleapis.com/cloudsql-instances"   = google_sql_database_instance.database.connection_name
    "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.connector.name
    "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
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
