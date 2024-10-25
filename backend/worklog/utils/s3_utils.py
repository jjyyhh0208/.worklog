from django.http import JsonResponse
import os
import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

def get_signed_url(image_path):
    s3_client = boto3.client('s3', 
                             region_name=os.getenv('AWS_REGION_NAME'),
                             config=Config(signature_version='s3v4'))  # Use AWS4-HMAC-SHA256
    try:
        url = s3_client.generate_presigned_url('get_object',
                                               Params={'Bucket': os.getenv("AWS_STORAGE_BUCKET_NAME"),
                                                       'Key': image_path},
                                               ExpiresIn=3600)  # URL expires in 1 hour
    except ClientError as e:
        return None
    
    return url

def get_signed_url_view(request, image_path):
    url = get_signed_url(image_path)
    if url is None:
        return JsonResponse({'error': 'Failed to generate signed URL'}, status=500)
    return JsonResponse({'signed_url': url})
