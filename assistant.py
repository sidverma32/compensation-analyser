from flask import Flask, request, jsonify

from leetcomp.utils import config, get_model_predict

app = Flask(__name__)

predict = get_model_predict(config["app"]["llm_predictor"])


@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"error": "No message provided"}), 400
    try:
        reply = predict(message)
        return jsonify({"reply": reply})
    except Exception as e:  # pragma: no cover - runtime safety
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
