resource "aws_db_instance" "chatbot" {
  identifier         = "${var.cluster_name}-db"
  engine             = "postgres"
  instance_class     = "db.t3.micro"
  allocated_storage  = 20
  username           = "chatbot"
  password           = "changeme123"
  skip_final_snapshot = true
}

output "db_endpoint" {
  value = aws_db_instance.chatbot.address
}
