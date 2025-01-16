import Translations
import random

# Start off asking the players name.
name = input ("Hello! What is your name? ")
print (f"Hi, {name} ")

# Ask if we are ready to start the game.
while True:
    ready = input ("Are you ready to play a game? ").lower() # Convert input to lowercase.
    if ready == "yes":
        print ("Great!")
        break # Exit loop.
    elif ready == "no":
        print ("Maybe another time!")
        break # Exit loop.
    else: 
        print ("I did not quite get that. Lets try again!") # Repeat the loop.

# Chose a game you want to play (ask or answer).
while True:
    game_type = input ("Do you want me to translate English words into Japanese (A), or answer my promtps (B)? ").lower()
    if game_type == "a":
        print ("Ok, you give me a word and I will attemp to translate for you.")
        break 
    elif game_type == "b":
        print ("Ok, You will have to translate my Japanese into English.")
        break
    else:
        print ("Try game type A or B. ")

# Game type A : Ask to translate English to Japanese.
if game_type == "a":
    while True:
        word = input ("Enter a word you would like translated: ").lower() # The user provides an English word.
        if word in Translations.translations: # Check if the word is in the dictionary (key).
            translation = Translations.translations[word] # Look up the translation (value).
            print (f"The Japanese translation for '{word}' is: {translation}")
        else:
            print (f"Sorry I don't have the translation for '{word}' yet.")
        play_again = input ("Do you want to try another word? (yes/no) ").lower()
        if play_again != "yes": # Anything but a "yes" will end the game.
            print("Thanks for playing!")
            break

# Game type B : Answer the Japanese promt to English. 
elif game_type == "b":
    #import random.
    # list of words to translate from Japanese to English.
    japanese_words = list(Translations.translations.keys())

    # If a word is picked once, do not repeat it.
    used_words = [] 

    while True: 
        # Filter out used words at the start of the loop.
        available_words = [word for word in Translations.translations if word not in used_words]

        # End game once all words have been used.
        if not available_words:
            print("You have completed all the available translations!")
            break

        # Pick a random word for player to translate to English.
        word = random.choice(available_words) # Randomly pick a Japanese word (key).
        translation = Translations.translations[word] # Look up the Japanese translation (value).

        # Get the players translation.
        player_translation = input(f"What is the English word for '{translation}'? ").lower()

        # Check if players translation is correct.
        if player_translation == word.lower():
            print("Correct! Well done.")
        else:
            print(f"Oops! The correct translation is '{word}'.")

        # Add the word to the used list
        used_words.append(word)

        play_again = input("Do you want to try another word? (yes/no) ").lower()
        if play_again != "yes":
            print("Thanks for playing!")
            break