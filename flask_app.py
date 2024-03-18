import pandas as pd
from flask import Flask, render_template, request

app = Flask(__name__)
THRESHOLD = 0.9


@app.route("/", methods=["GET", "POST"])
def home():
    # get elements from form
    ken_ten_name = "Ken_Ten_Jan_15_2022"
    lsu_ukmc_name = "LSU_UMKC_Nov_9_2022"
    unc_duke_name = "UNC_v_Duke_apr_24_2022"
    video = "../static/videos/Ken_Ten_Jan_15_2022.mp4"

    time = 0

    load_time = "loadingVideo(" + str(time) + ")"
    ken_ten_data = get_shot_labels(ken_ten_name, time)
    lsu_umkc_data = get_shot_labels(lsu_ukmc_name, time)
    unc_duke_data = get_shot_labels(unc_duke_name, time)
    user_agent = request.headers.get("User-Agent")
    
    # if "Mobile" in user_agent:
    #     return render_template(
    #         "demo_mobile.html",
    #         video=video,
    #         load_time=load_time,
    #         ken_ten_data=ken_ten_data,
    #         lsu_umkc_data=lsu_umkc_data,
    #         unc_duke_data=unc_duke_data,
    #     )
    # else:
    return render_template(
        "demo.html",
        video=video,
        load_time=load_time,
        ken_ten_data=ken_ten_data,
        lsu_umkc_data=lsu_umkc_data,
        unc_duke_data=unc_duke_data,
    )


def process_line(line):
    time = line.split(" at ")[1]
    type = line[:3]
    outcome = line.split(": ")[-1]
    x = line.split(" at ")[2].split(":")[0].split()[0]
    y = line.split(" at ")[2].split(":")[0].split()[1]
    string = time + ", " + type + ", " + outcome + ", " + x + ", " + y
    return string


def get_shot_labels(name, time):
    time = float(time)
    directory = "./static/output_files/final_val_output.csv"

    df = pd.read_csv(directory)
    df = df[df["predicted_binary_label"] > THRESHOLD]
    df["file_name"] = df["file_name"].apply(lambda x: x.split("/")[-1].split(".")[0])
    df = df[df["file_name"] == name]

    items = []
    for i in range(len(df)):
        row = df.iloc[i]
        predicted_time_stamp = row["predicted_time_stamp"]
        start_time = predicted_time_stamp - 2.4
        end_time = predicted_time_stamp + 2.4
        shot_confidence = row["predicted_binary_label"]
        cluster = row["predicted_cluster_label"]
        shot_quality = row["predicted_shot_quality"]
        shot_side = row["predicted_shot_side"]
        actual_timestamp = row["actual_timestamp"]

        items.append(
            f"{start_time}, {end_time}, {predicted_time_stamp}, {shot_confidence}, "
            f"{cluster}, {shot_quality}, {shot_side}, {actual_timestamp}"
        )

    return items

def create_app():
    return app


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
