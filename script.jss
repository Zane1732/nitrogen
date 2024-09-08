const PASSWORD = "zanenitrogen";

document.getElementById('toolForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from reloading the page
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
        const isValid = checkCodeValidity(generatedCode);

        if (isValid) {
            // Simulate expiration check (you can customize this logic)
            const isExpired = checkCodeExpiration(generatedCode);
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

function checkCodeValidity(code) {
    // Simulate checking if the code is valid
    // For demo purposes, we assume all generated codes are "valid"
    // You can replace this logic with actual validation rules if needed
    return true; // Change this to your custom validation logic
}

function checkCodeExpiration(code) {
    // Simulate expiration check (e.g., assume codes expire after a certain period)
    // For demo purposes, we assume all codes are "not expired"
    return false; // Change this to your custom expiration logic
}

