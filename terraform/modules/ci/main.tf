resource "google_cloudbuild_trigger" "trigger" {
  name           = "${var.service_name}-ci"
  filename       = "${var.service_name}/cloudbuild-ci.yaml"
  included_files = ["${var.service_name}/**"]

  github {
    owner = "nakatuba"
    name  = "sentimental-chat"
    pull_request {
      branch = "^main$"
    }
  }
}
