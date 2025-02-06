from flask import Flask, request, jsonify
from flask_cors import CORS
import Translations
import random

app = Flask(__name__)
CORS(app)

# Store player data globally
player_data = {"name": "", "score": 0, "used_words": []}


@app.route("/start", methods=["POST"])
def start_game():
    """Start the game and store the player's name."""
    data = request.json
    player_data["name"] = data.get("name", "Player")
    return jsonify({"message": f"Hi, {player_data['name']}! Welcome to the Japanese Study Game."})

# Choose game mode
@app.route("/choose_mode", methods=["POST"])
def choose_mode():
    """Choose game mode (A or B)."""
    data = request.json
    game_type = data.get("mode", "").lower()

    if game_type == "a":
        return jsonify({"message": "Type an English word, and I'll translate it into Japanese!"})
    elif game_type == "b":
        player_data["score"] = 0
        player_data["used_words"] = []
        return jsonify({"message": "I'll give you a Japanese word, and you translate it into English!", "score": player_data["score"]})
    else:
        return jsonify({"error": "Invalid mode. Choose A or B."}), 400


@app.route("/translate", methods=["POST"])
def translate_word():
    """Handle English to Japanese translation (Mode A)."""
    data = request.json
    word = data.get("word", "").lower()

    if word in Translations.translations:
        return jsonify({"word": word, "translation": Translations.translations[word]})
    else:
        return jsonify({"error": f"Sorry, I don't have a translation for '{word}' yet."})


@app.route("/get_japanese_word", methods=["GET"])
def get_japanese_word():
    """Send a random Japanese word for Mode B."""
    available_words = [word for word in Translations.translations if word not in player_data["used_words"]]

    if not available_words:
        return jsonify({"message": "You have completed all translations!", "score": player_data["score"]})

    word = random.choice(available_words)
    player_data["used_words"].append(word)

    return jsonify({"japanese_word": Translations.translations[word], "english_word": word})


@app.route("/check_answer", methods=["POST"])
def check_answer():
    """Check if the user's answer is correct in Mode B."""
    data = request.json
    user_translation = data.get("user_translation", "").lower()
    correct_word = data.get("correct_word", "")

    if user_translation == correct_word:
        player_data["score"] += 1
        return jsonify({"correct": True, "score": player_data["score"], "message": "Correct! Well done."})
    else:
        return jsonify({"correct": False, "score": player_data["score"], "message": f"Oops! The correct translation is '{correct_word}'."})


if __name__ == "__main__":
    app.run(debug=True)
