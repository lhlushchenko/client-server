const http = require('http');
const url = require('url');
const fs = require('fs');

// Лічильник запитів
let requestCount = 0;
const serverStartTime = new Date();

// Створення HTTP-сервера
const server = http.createServer((req, res) => {
    // Логування запиту
    requestCount++;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Визначаємо URL і метод запиту
    const parsedUrl = url.parse(req.url, true);

    try {
        // Обробка маршруту
        if (parsedUrl.pathname === '/' && req.method === 'GET') {
            handleRootRequest(res);
        } else if (parsedUrl.pathname === '/data' && req.method === 'POST') {
            handleDataRequest(req, res);
        } else if (parsedUrl.pathname === '/status' && req.method === 'GET') {
            handleStatusRequest(res);
        } else {
            handleNotFound(res); // Обробка невідомого маршруту
        }
    } catch (err) {
        // Загальна обробка помилок на сервері
        console.error('Серверна помилка:', err);
        handleInternalServerError(res); // Повертаємо помилку 500
    }
});

// Обробка GET /
function handleRootRequest(res) {
    const htmlContent = `
    <html>
      <body>
        <h1>Вітання на сервері!</h1>
      </body>
    </html>`;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
}

// Обробка POST /data
function handleDataRequest(req, res) {
    let body = '';

    // Зчитуємо дані з потоку запиту
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body); // Парсимо JSON
            const responseMessage = { message: `Отримано дані: ${JSON.stringify(data)}` };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseMessage));
        } catch (error) {
            // Якщо помилка в парсингу
            console.error('Невірний формат JSON:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Невірний формат JSON' }));
        }
    });

    req.on('error', (err) => {
        // Якщо сталася помилка під час зчитування
        console.error('Помилка при обробці запиту:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Помилка сервера' }));
    });
}

// Обробка GET /status
function handleStatusRequest(res) {
    const uptime = (new Date() - serverStartTime) / 1000; // Час роботи в секундах
    const statusMessage = {
        uptime: `${uptime.toFixed(2)} секунд`,
        requestCount: requestCount
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(statusMessage));
}

// Обробка помилки 404 (невідомий маршрут)
function handleNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Не знайдено');
}

// Обробка помилки 500 (внутрішня помилка сервера)
function handleInternalServerError(res) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Внутрішня помилка сервера' }));
}

// Запуск сервера на порту 3000
server.listen(3000, () => {
    console.log('Сервер запущено на http://localhost:3000/');
});
