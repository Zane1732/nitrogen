const PASSWORD = "zanenitrogen";
let isGenerating = false;
let codesChecked = 0;
let validCodes = 0;
let expiredCodes = 0;
const BASE_API_URL = 'https://run.mocky.io/v3/b88bfae0-a26b-49d3-8bf4-17ba902986e3';
const MAX_PROCESS_TIME = 5 * 60 * 1000; // 5 minutes timeout

document.getElementById('toolForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (isGenerating) return; // Prevent multiple submissions
    startGenerating();
});

function startGenerating() {
    const passwordInput = document.getElementById('password').value;
    const resultDiv = document.getElementById('result');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (passwordInput !== PASSWORD) {
        resultDiv.innerHTML = "<p style='color: red;'>Incorrect password</p>";
        return;
    }

    resultDiv.innerHTML = "<p>Generating and checking codes...</p>";
    loadingSpinner.style.display = 'block'; // Show loading spinner
    isGenerating = true;
    codesChecked = 0;
    validCodes = 0;
    expiredCodes = 0;

    // Set a timeout to automatically stop the process after 5 minutes
    setTimeout(() => {
        isGenerating = false;
        loadingSpinner.style.display = 'none';
        resultDiv.innerHTML += "<p>Process timed out.</p>";
    }, MAX_PROCESS_TIME);

    generateAndCheckCodes().finally(() => {
        isGenerating = false;
        loadingSpinner.style.display = 'none'; // Hide loading spinner
    });
}

function stopGenerating() {
    isGenerating = false;
    document.getElementById('result').innerHTML += "<p>Process stopped by the user.</p>";
}

async function generateAndCheckCodes() {
    const resultDiv = document.getElementById('result');

    while (isGenerating) {
        // Show generated code in the UI
        const generatedCode = generateNitroCode();
        resultDiv.innerHTML += `<p>Generated code: ${generatedCode}</p>`;
        
        // Indicate checking process
        resultDiv.innerHTML += `<p>Checking code: ${generatedCode}...</p>`;
        
        const isValid = await checkCodeValidity(generatedCode);

        codesChecked++;
        if (isValid) {
            const isExpired = await checkCodeExpiration(generatedCode);
            if (!isExpired) {
                validCodes++;
                resultDiv.innerHTML = `<p style='color: green;'>You got a real working Nitro link: <a href="${generatedCode}" target="_blank" style="color: #00ff00;">${generatedCode}</a></p>`;
                console.log(`Valid code: ${generatedCode}`);
                return; // Stop on first valid non-expired code
            } else {
                expiredCodes++;
                resultDiv.innerHTML += `<p>Rechecked code ${generatedCode} - Expired</p>`;
                console.log(`Expired code: ${generatedCode}`);
            }
        } else {
            resultDiv.innerHTML += `<p>Checked code ${generatedCode} - Invalid</p>`;
        }

        if (codesChecked % 10 === 0) {
            resultDiv.innerHTML += `<p>Checked ${codesChecked} codes... (Valid: ${validCodes}, Expired: ${expiredCodes})</p>`;
        }

        // Throttle to avoid overwhelming resources
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between requests
    }

    resultDiv.innerHTML += `<p>Process finished. Total codes checked: ${codesChecked}, Valid: ${validCodes}, Expired: ${expiredCodes}</p>`;
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
    const apiUrl = `${BASE_API_URL}?code=${encodeURIComponent(code)}`;
    const data = await fetchWithRetry(apiUrl);
    return data?.valid === true; // Null-check and ensure valid is true
}

async function checkCodeExpiration(code) {
    const apiUrl = `${BASE_API_URL}?code=${encodeURIComponent(code)}`;
    const data = await fetchWithRetry(apiUrl);
    return data?.expired === true; // Null-check and ensure expired is true
}

async function fetchWithRetry(url, retries = 3, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, { cache: 'no-cache' });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Attempt', i + 1, 'failed:', error);
            if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
        }
    }
    return null; // Return null if all attempts fail
}

