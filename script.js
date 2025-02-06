document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const header = document.querySelector("header");
    const chatOutput = document.getElementById("chat-output");
    const chatInput = document.getElementById("chat-input");

    let gameMode = ""; // Store the selected mode
    let currentJapaneseWord = ""; // Store the Japanese word for Mode B

    startButton.addEventListener("click", () => {
        header.style.display = "none";
        startButton.style.display = "none";

        // Ask for the player's name inside the chat
        chatOutput.innerHTML = "<p>Hello! What is your name?</p>";
        chatInput.placeholder = "Enter your name...";
        chatInput.focus();

        // Wait for the user to enter their name
        chatInput.removeEventListener("keypress", enterName);
        chatInput.addEventListener("keypress", enterName);
    });

    function enterName(event) {
        if (event.key === "Enter") {
            const playerName = chatInput.value.trim();
            chatInput.value = ""; // Clear input field
            
            if (playerName === "") {
                chatOutput.innerHTML += "<p>Please enter a valid name.</p>";
                return;
            }

            // Send name to Flask
            fetch("http://127.0.0.1:5000/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: playerName })
            })
            .then(response => response.json())
            .then(data => {
                chatOutput.innerHTML += `<p>${data.message}</p>`;
                showGameModeSelection();
            });

            // Remove this event listener to prevent multiple triggers
            chatInput.removeEventListener("keypress", enterName);
        }
    }

    function showGameModeSelection() {
        chatOutput.innerHTML += `
            <p>Do you want me to translate English words into Japanese (A), or answer my prompts (B)?</p>
            <button id="mode-a">Mode A</button>
            <button id="mode-b">Mode B</button>
        `;

        document.getElementById("mode-a").addEventListener("click", () => selectMode("a"));
        document.getElementById("mode-b").addEventListener("click", () => selectMode("b"));
    }

    function selectMode(mode) {
        fetch("http://127.0.0.1:5000/choose_mode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: mode })
        })
        .then(response => response.json())
        .then(data => {
            chatOutput.innerHTML = `<p>${data.message}</p>`;
            gameMode = mode;
            if (mode === "a") enableTranslationInput();
            if (mode === "b") startModeB();
        });
    }

    function enableTranslationInput() {
        chatInput.placeholder = "Type an English word...";
        
        // Remove previous event listener before adding a new one
        chatInput.removeEventListener("keypress", handleTranslationInput);
        chatInput.addEventListener("keypress", handleTranslationInput);
    }

    function handleTranslationInput(event) {
        if (event.key === "Enter") {
            const word = chatInput.value.trim().toLowerCase();
            chatInput.value = "";

            fetch("http://127.0.0.1:5000/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ word: word })
            })
            .then(response => response.json())
            .then(data => {
                if (data.translation) {
                    chatOutput.innerHTML += `<p><strong>${word}</strong> in Japanese is: <strong>${data.translation}</strong></p>`;
                } else {
                    chatOutput.innerHTML += `<p>${data.error}</p>`;
                }
                chatOutput.scrollTop = chatOutput.scrollHeight;
            });
        }
    }

    function startModeB() {
        chatOutput.innerHTML = "<p>I'll give you a Japanese word, and you translate it into English!</p>";
        getNextJapaneseWord();
    }

    function getNextJapaneseWord() {
        fetch("http://127.0.0.1:5000/get_japanese_word")
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                chatOutput.innerHTML += `<p>${data.message} Your final score is: <strong>${data.score}</strong></p>`;
                return;
            }

            currentJapaneseWord = data.english_word;
            chatOutput.innerHTML += `<p>Translate this: <strong>${data.japanese_word}</strong></p>`;
            chatOutput.scrollTop = chatOutput.scrollHeight; // Ensures scrolling to the latest question
            enableAnswerInput();
        });
    }

    function enableAnswerInput() {
        chatInput.placeholder = "Type your English translation...";
        
        // Remove previous event listener before adding a new one
        chatInput.removeEventListener("keypress", handleAnswerInput);
        chatInput.addEventListener("keypress", handleAnswerInput);
    }

    function handleAnswerInput(event) {
        if (event.key === "Enter") {
            const userTranslation = chatInput.value.trim().toLowerCase();
            chatInput.value = "";

            fetch("http://127.0.0.1:5000/check_answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_translation: userTranslation,
                    correct_word: currentJapaneseWord
                })
            })
            .then(response => response.json())
            .then(data => {
                chatOutput.innerHTML += `<p>${data.message} Your score: <strong>${data.score}</strong></p>`;
                chatOutput.scrollTop = chatOutput.scrollHeight; // Ensures scrolling after answer feedback
                getNextJapaneseWord();
            });
        }
    }
});
