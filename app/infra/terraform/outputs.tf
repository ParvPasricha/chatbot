output "cluster_arn" {
  value       = module.network.cluster_arn
  description = "ARN of the ECS cluster"
}

output "db_endpoint" {
  value       = module.network.db_endpoint
  description = "Endpoint of the RDS instance"
}
