resource "google_cloud_run_service" "service" {
  name                       = var.service_name
  location                   = "asia-northeast1"
  autogenerate_revision_name = true

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/${var.service_name}"
        ports {
          container_port = var.port
        }
        resources {
          limits = var.limits
        }
      }
    }
    metadata {
      annotations = var.template_annotations
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].metadata[0].annotations["run.googleapis.com/client-name"],
      template[0].metadata[0].annotations["run.googleapis.com/client-version"]
    ]
  }
}
