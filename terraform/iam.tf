locals {
  roles = [
    "roles/iam.serviceAccountUser",
    "roles/run.admin",
  ]
}

data "google_project" "project" {
}

resource "google_project_iam_member" "iam" {
  for_each = toset(local.roles)

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}
