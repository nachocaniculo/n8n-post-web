const button = document.getElementById('sendBtn');
const status = document.getElementById('status');

button.addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value.trim();
    if (!prompt) {
        status.textContent = 'Please, type your prompt.';
        status.style.color = 'red';
        return;
    }

    status.textContent = 'Sending...';
    status.style.color = '#1a73e8';

    try {
        const response = await fetch('https://nacho.empathic.solutions/webhook-test/e56bd517-a251-42c5-bef0-43239b32af8c', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (response.ok) {
            status.textContent = 'Prompt sent correctly. n8n will generate your playbook and apply it on an ec2.';
            status.style.color = 'green';
        } else {
            const text = await response.text();
            status.textContent = `Error: ${text}`;
            status.style.color = 'red';
        }
    } catch (err) {
        status.textContent = `Connection error: ${err.message}`;
        status.style.color = 'red';
    }
});
