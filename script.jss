const PASSWORD = "zanenitrogen";

document.getElementById('toolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    startGenerating();
});

function startGenerating() {
    const passwordInput = document.getElementById('password').value;
    const resultDiv = document.getElementById('result');

    if (passwordInput !== PASSWORD) {
        resultDiv.innerHTML = "<p style='color: red;'>Incorrect password</p>";
        return;
    }

    resultDiv.innerHTML = "<p>Generating and checking codes...</p>";
    generateAndCheckCodes();
}

async function generateAndCheckCodes() {
    const resultDiv = document.getElementById('result');

    while (true) {
        const generatedCode = generateNitroCode();
        const isValid = await checkCodeValidity(generatedCode);

        if (isValid) {
            // Recheck the code for expiration
            const isExpired = await checkCodeExpiration(generatedCode);
            if (!isExpired) {
                // Display the working link
                resultDiv.innerHTML = `<p style='color: green;'>You got a real working Nitro link: <a href="${generatedCode}" target="_blank" style="color: #00ff00;">${generatedCode}</a></p>`;
                return; // Exit the function as we found a valid non-expired link
            } else {
                resultDiv.innerHTML += `<p>Rechecked code: ${generatedCode} - Expired</p>`;
            }
        } else {
            resultDiv.innerHTML += `<p>Checked code: ${generatedCode} - Invalid</p>`;
        }
        
        // Optional: Add a slight delay to avoid overwhelming resources
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

function generateNitroCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "https://discord.gift/";
    for (let i = 0; i < 16; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function checkCodeValidity(code) {
    const apiUrl = `/api/checkCodeValidity?code=${encodeURIComponent(code)}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data.valid)
        .catch(() => false);
}

async function checkCodeExpiration(code) {
    const apiUrl = `/api/checkCodeExpiration?code=${encodeURIComponent(code)}`;
    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => data.expired)
        .catch(() => true);
}
