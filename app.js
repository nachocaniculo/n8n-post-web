const button = document.getElementById('sendBtn');
const status = document.getElementById('status');
const httpsCheckbox = document.getElementById('httpsAccess');
const apiKeyInput = document.getElementById('apiKey');

button.addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value.trim();
    const httpsAccess = httpsCheckbox.checked;

    if (!prompt) {
        status.textContent = 'Please type your prompt.';
        status.style.color = 'red';
        return;
    }

    status.textContent = 'Generating EC2 with your requirements... This may take a few minutes.';
    status.style.color = '#1a73e8';

    // Bloquear controles
    button.disabled = true;
    httpsCheckbox.disabled = true;

    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        status.textContent = 'API key is required.';
        status.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(
            'https://n8n3.alpinia.digital/webhook-test/838da8ef-6840-4850-af47-3806d00c2d20',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${apiKey}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    allow_https: httpsAccess
                })
            }
        );

        switch (response.status) {

            case 200: {
                const data = await response.json();

                let html = `
                    Workflow finished successfully.<br>
                    HTTP: <a href="${data.addressHTTP}" target="_blank">${data.addressHTTP}</a><br>
                `;

                if (httpsAccess && data.addressHTTPS) {
                    html += `
                        HTTPS: <a href="${data.addressHTTPS}" target="_blank">${data.addressHTTPS}</a>
                    `;
                }

                status.innerHTML = html;
                status.style.color = 'green';

                if (httpsAccess && data.addressHTTPS) {
                    window.open(data.addressHTTPS, '_blank');
                } else if (data.addressHTTP) {
                    window.open(data.addressHTTP, '_blank');
                }

                break;
            }

            case 401: {
                const text = await response.text();
                status.textContent = 'Invalid or missing AUTH key.';
                status.style.color = 'red';
                break;
            }

            case 400: {
                const text = await response.text();
                status.textContent = 'Invalid prompt. Please check your input.';
                status.style.color = 'red';
                break;
            }

            case 422: {
                const text = await response.text();
                status.textContent = 'The prompt could not be processed correctly.';
                status.style.color = 'orange';
                break;
            }

            case 502: {
                const text = await response.text();
                status.textContent = 'Infrastructure provisioning failed (Terraform/Ansible error).';
                status.style.color = 'red';
                break;
            }

            default: {
                const text = await response.text();
                status.textContent = `Unexpected error (${response.status}): ${text}`;
                status.style.color = 'red';
            }
        }

    } catch (err) {
        status.textContent = `Connection error: ${err.message}`;
        status.style.color = 'red';

    } finally {
        // Desbloquear controles SIEMPRE
        button.disabled = false;
        httpsCheckbox.disabled = false;
    }
});
