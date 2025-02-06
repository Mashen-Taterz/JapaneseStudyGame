import json

# Translations for English and Japanese with Romaji for pronounciation
translations = {
# Common words
    "hello": "こんにちは (Konnichiwa)",
    "goodbye": "さようなら (Sayōnara)",
    "this": "これ (Kore)",
    "that": "それ (Sore)",
    "here": "ここ (Koko)",
    "there": "そこ (Soko)",
    "over there": "あそこ (Asoko)",
    "he": "彼 (Kare)",
    "she": "彼女 (Kanojo)",
    "they": "彼ら (Karera)",
    "hot": "暑い (Atsui)",
    "cold": "寒い (Samui)",
# Colors
    "red": "赤 (Aka)",
    "blue": "青 (Ao)",
    "green": "緑 (Midori)",
    "yellow": "黄色 (Kiiro)",
    "purple": "紫 (Murasaki)",
    "orange": "オレンジ (Orenji)",
    "white": "白 (Shiro)",
    "black": "黒 (Kuro)",
# Numbers
    "1": "一 (Ichi)",
    "2": "二 (Ni)",
    "3": "三 (San)",
    "4": "四 (Shi/Yon)",
    "5": "五 (Go)",
    "6": "六 (Roku)",
    "7": "七 (Shichi/Nana)",
    "8": "八 (Hachi)",
    "9": "九 (Kyū)",
    "10": "十 (Jū)"
}

# Capitalize only the first letter of each key (English word)
capitalized_translations = {key.title(): value for key, value in translations.items()}

# Save the dictionary to a JSON file
with open("translations.json", "w", encoding="utf-8") as file:
    json.dump(capitalized_translations, file, ensure_ascii=False, indent=4)


print("Translations saved to translations.json")
