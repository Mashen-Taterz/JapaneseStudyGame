let translations = {}; // Empty object to store the dictionary

// Fetch the JSON file
fetch("translations.json")
    .then(response => response.json())
    .then(data => {
        translations = data; // Store the dictionary in JavaScript
        console.log(translations); // Log the dictionary to make sure it's loaded correctly
    })
    .catch(error => console.error("Error loading translations:", error));

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const header = document.querySelector("header");

    startButton.addEventListener("click", () => {
        // Hide header and start button
        header.style.display = "none";
        startButton.style.display = "none";

        // Initialize the game (more logic will go here)
        startGame();
    });

    function startGame() {
        const chatOutput = document.getElementById("chat-output");

        // Clear chat output and prompt the user to choose a game mode
        chatOutput.innerHTML = `
            <p>Do you want me to translate English words into Japanese (A), or answer my prompts (B)?</p>
            <button id="mode-a">Mode A (English → Japanese)</button>
            <button id="mode-b">Mode B (Japanese → English)</button>
        `;

        // Wait for user to click on a mode
        document.getElementById("mode-a").addEventListener("click", () => startModeA());
        document.getElementById("mode-b").addEventListener("click", () => startModeB());
    }

    function startModeA() {
        const chatOutput = document.getElementById("chat-output");
        const chatInput = document.getElementById("chat-input");
    
        chatOutput.innerHTML = "<p>Type an English word, and I'll translate it into Japanese!</p>";
    
        chatInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                const word = chatInput.value.toLowerCase().trim(); // Get the input word
                chatInput.value = ""; // Clear the input field
    
                // Check if the word exists in the translations dictionary
                if (translations[word]) {
                    chatOutput.innerHTML += `<p><strong>${word}</strong> in Japanese is: <strong>${translations[word]}</strong></p>`;
                } else {
                    chatOutput.innerHTML += `<p>Sorry, I don't have a translation for <strong>${word}</strong> yet.</p>`;
                }
    
                // Auto-scroll to the bottom of the chat output
                chatOutput.scrollTop = chatOutput.scrollHeight;
            }
        });
    }    

    function startModeB() {
        const chatOutput = document.getElementById("chat-output");
        chatOutput.innerHTML = "<p>I'll give you a Japanese word, and you translate it into English!</p>";
    }
});

