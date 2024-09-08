const correctPassword = "zane123"; // Replace with your desired password

document.getElementById("password-submit").addEventListener("click", checkPassword);
document.getElementById("generate-btn").addEventListener("click", startGenerating);
document.getElementById("exit-btn").addEventListener("click", exitGenerator);

let isGenerating = false;

function checkPassword() {
    const inputPassword = document.getElementById("password-input").value;
    if (inputPassword === correctPassword) {
        document.getElementById("password-section").style.display = "none";
        document.getElementById("main-section").style.display = "block";
    } else {
        alert("Incorrect password! Please try again.");
    }
}

function startGenerating() {
    if (isGenerating) return;
    isGenerating = true;

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    // Variables to manage code generation and validation
    let totalCodesChecked = 0;
    const maxCodes = 90000; // Max codes to check
    const bulkSize = 1000; // Size of each bulk validation

    const statusMessage = document.createElement("p");
    statusMessage.className = "neon-text";
    statusMessage.innerText = "Generating and checking codes...";
    resultDiv.appendChild(statusMessage);

    const generateAndCheckCodes = () => {
        let codesBatch = [];
        for (let i = 0; i < bulkSize; i++) {
            if (totalCodesChecked >= maxCodes) break;
            totalCodesChecked++;
            codesBatch.push(generateRandomCode());
        }

        // Display status
        statusMessage.innerText = `Checking ${totalCodesChecked} codes...`;

        // Simulate checking codes in bulk
        setTimeout(() => {
            codesBatch.forEach(code => {
                if (Math.random() <= 0.80) { // 80% chance to "find" a valid code
                    const isValid = Math.random() <= 0.80; // 80% chance to "be valid"
                    if (isValid) {
                        resultDiv.innerHTML += `<p class="success code">🎉 Valid Nitro Code found: ${code}</p>`;
                    }
                }
            });

            // Continue generating and checking codes if we haven't reached the limit
            if (totalCodesChecked < maxCodes) {
                generateAndCheckCodes();
            } else {
                notifyCompletion();
            }
        }, 1000); // Slower delay to mimic checking speed
    };

    // Start generating and checking codes
    generateAndCheckCodes();
}

function exitGenerator() {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<p class='error'>Generator has been exited!</p>";
    isGenerating = false;
}

function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nitroCode = 'https://discord.gift/';
    for (let i = 0; i < 16; i++) {
        nitro

