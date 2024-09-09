const PASSWORD = "zanenitrogen";
let isGenerating = false;
const MAX_PARALLEL_CHECKS = 5; // Number of codes to check in parallel
let rateLimitDelay = 500; // Adjust throttle based on rate limiting

document.getElementById('toolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (isGenerating) return; // Prevent multiple submissions
    startGenerating();
});

function startGenerating() {
    const passwordInput = document.getElementById('password').value;
    const webhookUrl = document.getElementById('webhookUrl').value;
    const resultDiv = document.getElementById('result');

    if (passwordInput !== PASSWORD) {
        resultDiv.innerHTML = "<p style='color: red;'>Incorrect password</p>";
        return;
    }

    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
        resultDiv.innerHTML = "<p style='color: red;'>Invalid Discord Webhook URL</p>";
        return;
    }

    resultDiv.innerHTML = "<p>Generating and checking codes...</p>";
    isGenerating = true;
    generateAndCheckCodes(webhookUrl).finally(() => {
        isGenerating = false;
        resultDiv.innerHTML += "<p>Stopped generating codes.</p>";
    });
}

async function generateAndCheckCodes(webhookUrl) {
    const resultDiv = document.getElementById('result');
    let codesChecked = 0;

    while (isGenerating) {
        const codeBatch = [];
        for (let i = 0; i < MAX_PARALLEL_CHECKS; i++) {
            codeBatch.push(generateNitroCode());
        }

        const checkPromises = codeBatch.map(code => checkAndHandleCode(code, webhookUrl, resultDiv));
        await Promise.all(checkPromises);

        codesChecked += codeBatch.length;
        resultDiv.innerHTML += `<p>Checked ${codesChecked} codes...</p>`;

        // Adjust throttle based on progress
        await new Promise(resolve => setTimeout(resolve, rateLimitDelay));
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

async function checkAndHandleCode(code, webhookUrl, resultDiv) {
    try {
        const isValid = await checkCodeValidity(code);
        if (isValid) {
            const isExpired = await checkCodeExpiration(code);
            if (!isExpired) {
                resultDiv.innerHTML = `<p style='color: green;'>You got a real working Nitro link: <a href="${code}" target="_blank" style="color: #00ff00;">${code}</a></p>`;
                await sendToDiscordWebhook(webhookUrl, code); // Send valid code to Discord
                isGenerating = false; // Stop once we find a valid code
            } else {
                resultDiv.innerHTML += `<p>Rechecked code ${code} - Expired</p>`;
            }
        } else {
            resultDiv.innerHTML += `<p>Checked code ${code} - Invalid</p>`;
        }
    } catch (error) {
        console.error(`Error handling code ${code}:`, error);
    }
}

async function checkCodeValidity(code) {
    try {
        const apiUrl = `https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3?code=${encodeURIComponent(code)}`;
        const response = await fetch(apiUrl, { cache: 'no-cache' }); // Prevent cached results
        if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
        const data = await response.json();
        return data.valid === true;
    } catch (error) {
        console.error(`Error checking code validity for ${code}:`, error);
        return false;
    }
}

async function checkCodeExpiration(code) {
    try {
        const apiUrl = `https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3?code=${encodeURIComponent(code)}`;
        const response = await fetch(apiUrl, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
        const data = await response.json();
        return data.expired === true; // Explicitly check if expired is true
    } catch (error) {
        console.error(`Error checking code expiration for ${code}:`, error);
        return true;
    }
}

async function sendToDiscordWebhook(webhookUrl, code) {
    const payload = {
        content: `ZANE CODED GEN: ${code}`
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Failed to send message to Discord');
        }

        console.log('Successfully sent Nitro code to Discord.');
    } catch (error) {
        console.error('Error sending code to Discord:', error);
    }
}
