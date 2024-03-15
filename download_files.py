from huggingface_hub import hf_hub_download
import os

if __name__=='__main__':
    files = [
        "UNC_v_Duke_apr_24_2022.mp4",
        "Ken_Ten_Jan_15_2022.mp4",
        "LSU_UMKC_Nov_9_2022.mp4"
    ]
    correct_path = os.path.join(os.getcwd(), "static", "videos_test")
    for file in files:
        path = hf_hub_download(repo_id="dcaustin33/videos", filename=file, repo_type="dataset")
        # move the file to the correct path
        os.rename(path, os.path.join(correct_path, file))
        print(f"Downloaded {file} to {correct_path}")