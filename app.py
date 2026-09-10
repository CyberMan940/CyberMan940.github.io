from flask import Flask, render_template, request, redirect, send_file, url_for
import json
import os
from datetime import datetime

app = Flask(__name__)

REQUESTS_FILE = os.path.join(app.root_path, "requests.json")


def load_requests():
    if not os.path.exists(REQUESTS_FILE):
        return []

    with open(REQUESTS_FILE, "r") as file:
        return json.load(file)


def save_requests(requests):
    with open(REQUESTS_FILE, "w") as file:
        json.dump(requests, file, indent=4)


@app.route("/")
def home():
    return send_file(os.path.join(app.root_path, "index.html"))


@app.route("/submit-request", methods=["POST"])
def submit_request():

    idea = request.form.get("idea", "").strip()
    description = request.form.get("description", "").strip()

    if not idea:
        return redirect(url_for("home"))

    requests = load_requests()

    new_request = {
        "id": len(requests) + 1,
        "idea": idea,
        "description": description,
        "status": "RECEIVED",
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    requests.append(new_request)

    save_requests(requests)

    return redirect(url_for("request_success"))


@app.route("/request-success")
def request_success():
    return render_template("success.html")


@app.route("/requests")
def view_requests():
    requests = load_requests()

    return render_template(
        "requests.html",
        requests=requests
    )


if __name__ == "__main__":
    app.run(
        debug=os.environ.get("FLASK_DEBUG", "0") == "1",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "5001"))
    )