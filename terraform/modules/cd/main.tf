resource "google_cloudbuild_trigger" "trigger" {
  name           = "${var.service_name}-cd"
  filename       = "${var.service_name}/cloudbuild-cd.yaml"
  included_files = ["${var.service_name}/**"]

  github {
    owner = "nakatuba"
    name  = "sentimental-chat"
    push {
      branch = "^main$"
    }
  }
}
