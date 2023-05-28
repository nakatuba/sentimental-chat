variable "project_id" {
  type = string
}

variable "service_name" {
  type = string
}

variable "port" {
  type = number
}

variable "limits" {
  type    = map(string)
  default = null
}

variable "template_annotations" {
  type    = map(string)
  default = null
}
