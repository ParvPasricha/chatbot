resource "aws_s3_bucket" "knowledge" {
  bucket = "${var.cluster_name}-knowledge"
}
