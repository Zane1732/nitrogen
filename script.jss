const correctPassword = "zane123"; // Replace with your desired password

document.getElementById("toolForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const numGroups = parseInt(document.getElementById("numGroups").value, 10);

    if (password === correctPassword) {
        document.getElementById("result").innerHTML = "<p class='neon-text'>Password correct! Tool is running...</p>";
        document.getElementById("result").innerHTML += "<p class='neon-text'>Generating and checking Nitro codes...</p>";

        let validCodes = [];

        for (let i = 0; i < numGroups; i++) {
            let code = generateNitroCode();
            let isValid = await checkCodeValidity(code);

            if (isValid) {
                validCodes.push(code);
                document.getElementById("result").innerHTML += `<p class='neon-text'>Valid Code Found: <a href="${code}" class="neon-text">${code}</a></p>`;
                // Optional: Update with a pause to simulate checking delay
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
            }
        }

        if (validCodes.length === 0) {
            document.getElementById("result").innerHTML += "<p class='neon-text'>No valid codes found.</p>";
        }
    } else {
        document.getElementById("result").innerHTML = "<p class='error'>Incorrect password. Please try again.</p>";
    }
});

function generateNitroCode() {
    const alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = '';
    for (let i = 0; i < 16; i++) {
        code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
    }
    return `https://discord.gift/${code}`;
}

async function checkCodeValidity(code) {
    // Simulate an API call or validation check
    // In real use, you might make an actual network request here
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate that 80% of codes are valid
            resolve(Math.random() < 0.8);
        }, 500); // Simulate a delay for checking
    });
}
