variable "aws_region" {
  type        = string
  description = "AWS region for deployment"
  default     = "us-east-1"
}

variable "cluster_name" {
  type        = string
  description = "Name of ECS cluster"
  default     = "chatbot-cluster"
}

variable "db_name" {
  type        = string
  description = "Database name"
  default     = "chatbot"
}
