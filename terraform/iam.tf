data "google_project" "project" {
}

resource "google_project_iam_member" "default_compute_sa_iam" {
  for_each = toset([
    "roles/secretmanager.secretAccessor"
  ])

  project = data.google_project.project.project_id
  role    = each.value
  member  = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
}

resource "google_project_iam_member" "cloudbuild_sa_iam" {
  for_each = toset([
    "roles/cloudsql.client",
    "roles/iam.serviceAccountUser",
    "roles/run.admin",
    "roles/secretmanager.secretAccessor"
  ])

  project = data.google_project.project.project_id
  role    = each.value
  member  = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}
