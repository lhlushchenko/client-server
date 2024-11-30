// URL вашого сервера (заміни на реальний адресу сервера)
const serverUrl = "http://localhost:3000";

// Функція для обробки помилок запитів
function handleError(response) {
    if (!response.ok) {
        throw new Error(`Помилка: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

// Функція для отримання HTML-сторінки
document.getElementById('getHtmlBtn').addEventListener('click', () => {
    fetch(`${serverUrl}/`)
        .then(handleError)
        .then(data => {
            document.getElementById('htmlResponse').innerHTML = data;
        })
        .catch(error => {
            document.getElementById('htmlResponse').innerText = `Помилка: ${error.message}`;
        });
});

// Функція для відправки JSON-даних
document.getElementById('jsonForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;

    const data = {
        name: name,
        age: age
    };

    fetch(`${serverUrl}/data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(handleError)
        .then(responseData => {
            document.getElementById('jsonResponse').innerHTML = JSON.stringify(responseData, null, 2);
        })
        .catch(error => {
            document.getElementById('jsonResponse').innerText = `Помилка: ${error.message}`;
        });
});

// Функція для отримання статусу сервера
document.getElementById('getStatusBtn').addEventListener('click', () => {
    fetch(`${serverUrl}/status`)
        .then(handleError)
        .then(statusData => {
            document.getElementById('statusResponse').innerHTML = JSON.stringify(statusData, null, 2);
        })
        .catch(error => {
            document.getElementById('statusResponse').innerText = `Помилка: ${error.message}`;
        });
});
