import io
from typing import Any

import cloudpickle
from google.cloud import storage


def download_from_gcs(project: str, bucket_name: str, blob_name: str) -> Any:
    storage_client = storage.Client(project=project)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    contents = blob.download_as_string()

    with io.BytesIO(contents) as f:
        return cloudpickle.load(f)
