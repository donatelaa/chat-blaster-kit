# WhatsApp Sender - Инструкция по установке и запуску

## Системные требования

- Python 3.8 или выше
- Node.js 16 или выше
- Google Chrome (для Selenium WebDriver)
- Git (опционально)

---

## Часть 1: Установка Python Backend

### Шаг 1: Установка Python

**Windows:**
1. Скачайте Python с [python.org](https://www.python.org/downloads/)
2. При установке **обязательно** отметьте "Add Python to PATH"
3. Проверьте установку в командной строке:
   ```bash
   python --version
   ```

**macOS:**
```bash
brew install python3
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install python3 python3-pip
```

### Шаг 2: Установка Chrome и ChromeDriver

**Windows:**
1. Установите Google Chrome с [google.com/chrome](https://www.google.com/chrome/)
2. ChromeDriver установится автоматически через webdriver-manager

**macOS:**
```bash
brew install --cask google-chrome
```

**Linux:**
```bash
sudo apt install chromium-browser
```

### Шаг 3: Настройка Python Backend

1. Откройте терминал/командную строку
2. Перейдите в папку проекта:
   ```bash
   cd путь/к/проекту
   ```

3. Перейдите в папку python-backend:
   ```bash
   cd python-backend
   ```

4. Создайте виртуальное окружение:
   ```bash
   python -m venv venv
   ```

5. Активируйте виртуальное окружение:
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```bash
   source venv/bin/activate
   ```

6. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

### Шаг 4: Запуск Python API сервера

```bash
python api_server.py
```

API сервер запустится на `http://localhost:5000`

**⚠️ ВАЖНО:** Оставьте это окно терминала открытым! API сервер должен работать постоянно.

**Проверка работы:**
Откройте браузер и перейдите на `http://localhost:5000/api/health`
Вы должны увидеть: `{"status": "ok", "message": "WhatsApp Sender API is running"}`

---

## Часть 2: Установка Frontend (React)

### Шаг 1: Установка Node.js

**Windows/macOS:**
Скачайте с [nodejs.org](https://nodejs.org/) и установите

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Проверьте установку:
```bash
node --version
npm --version
```

### Шаг 2: Установка зависимостей Frontend

1. Откройте **новое** окно терминала
2. Перейдите в корневую папку проекта:
   ```bash
   cd путь/к/проекту
   ```

3. Установите зависимости:
   ```bash
   npm install
   ```

### Шаг 3: Запуск Frontend

```bash
npm run dev
```

Frontend запустится на `http://localhost:5173`

**⚠️ ВАЖНО:** Оставьте это окно терминала открытым! Frontend должен работать постоянно.

---

## Часть 3: Полный запуск приложения

Для работы приложения нужны **оба** сервера:

### Терминал 1: Python Backend
```bash
cd python-backend
source venv/bin/activate  # или venv\Scripts\activate на Windows
python api_server.py
```

### Терминал 2: React Frontend
```bash
npm run dev
```

### Открыть приложение

Откройте браузер и перейдите на: `http://localhost:5173`

**✅ Проверка подключения:**
1. Откройте консоль браузера (F12)
2. Если видите ошибки CORS или "Failed to fetch" - значит Python backend не запущен
3. Убедитесь, что оба терминала работают (Python и Node.js)

---

## Использование приложения

### 1. Создание профиля WhatsApp

⚠️ **ВАЖНО:** При создании профиля Chrome должен автоматически открыться!

1. Перейдите на вкладку **"Создать"**
2. Введите имя профиля (например, "Рабочий")
3. Нажмите **"Создать профиль"**
4. **Должно открыться окно Chrome с WhatsApp Web**
5. Отсканируйте QR-код в приложении WhatsApp на телефоне
6. После успешного входа профиль сохранится
7. Chrome закроется автоматически

**Если Chrome не открылся:**
- Проверьте, что Python backend запущен (в терминале должно быть "Running on http://localhost:5000")
- Проверьте консоль браузера (F12) - там будет ошибка подключения
- Убедитесь, что Chrome установлен на вашем компьютере

### 2. Отправка одиночного сообщения

1. Перейдите на вкладку **"Отправить"**
2. Выберите профиль из списка
3. Введите номер телефона (формат: +79991234567)
4. Введите текст сообщения
5. Нажмите **"Отправить сообщение"**

### 3. Массовая рассылка

1. Перейдите на вкладку **"Массовая рассылка"**
2. Введите список номеров (по одному на строку):
   ```
   +79991234567
   +79997654321
   +79995551234
   ```
3. Настройте задержку:
   - **Фиксированная**: выберите время задержки ползунком
   - **Случайная**: включите переключатель "Случайная задержка"
4. Выберите профили (можно несколько)
5. Для каждого профиля введите своё сообщение
6. Нажмите **"Запустить массовую рассылку"**

### 4. Просмотр аналитики

1. Перейдите на вкладку **"Аналитика"**
2. Просмотрите статистику:
   - Количество отправленных сообщений
   - Количество доставленных
   - Количество ошибок
   - Процент успешности
   - Среднюю задержку отправки
3. Просмотрите последние 5 отправленных сообщений

---

## Устранение проблем

### Python Backend не запускается

**Проблема:** `ModuleNotFoundError: No module named 'selenium'`
**Решение:**
```bash
cd python-backend
pip install -r requirements.txt
```

**Проблема:** `WebDriverException: ChromeDriver not found`
**Решение:**
1. Установите Google Chrome
2. Переустановите selenium: `pip install --upgrade selenium`

### Frontend не запускается

**Проблема:** `Error: Cannot find module`
**Решение:**
```bash
rm -rf node_modules
npm install
```

**Проблема:** Порт 8080 занят
**Решение:** В файле `vite.config.ts` измените порт на другой

### WhatsApp Web не открывается при создании профиля

**Проблема:** Chrome не открывается, но сайт показывает "Профиль создан"
**Решение:**
1. Проверьте, что Python API сервер **действительно запущен**:
   - В терминале должно быть "Running on http://localhost:5000"
   - Откройте `http://localhost:5000/api/health` в браузере
2. Проверьте консоль браузера (F12):
   - Если видите `net::ERR_CONNECTION_REFUSED` - значит Python backend не запущен
   - Если видите `CORS policy error` - перезапустите Python backend
3. Убедитесь, что Google Chrome установлен на компьютере
4. Попробуйте создать профиль через командную строку:
   ```bash
   cd python-backend
   python whatsapp_sender.py
   ```

**Проблема:** Показываются профили, которые я не создавал
**Решение:**
Это профили из папки `python-backend/profiles/`. Удалите ненужные:
```bash
cd python-backend/profiles
ls  # посмотреть список
rm -rf НенужныйПрофиль  # удалить профиль
```

### Веб-интерфейс не работает, но командная строка работает

**Проблема:** Через `python whatsapp_sender.py` всё работает, но через сайт нет
**Причина:** Python API сервер не запущен или фронтенд не подключается к нему

**Решение:**
1. Откройте **два** терминала (не один!)
2. В первом терминале:
   ```bash
   cd python-backend
   source venv/bin/activate  # для Windows: venv\Scripts\activate
   python api_server.py  # НЕ whatsapp_sender.py!
   ```
3. Во втором терминале:
   ```bash
   npm run dev
   ```
4. Должны работать оба сервера одновременно

### API не доступен из Frontend

**Проблема:** `Failed to fetch` или `CORS policy error`
**Решение:** 
1. Убедитесь, что Python API сервер запущен на порту 5000
2. Проверьте в терминале Python - там должна быть строка "Running on http://localhost:5000"
3. Если порт 5000 занят другим приложением, измените порт в:
   - `python-backend/api_server.py` (последняя строка: `port=5000`)
   - `src/lib/api.ts` (первая строка: `const API_BASE_URL = 'http://localhost:5000/api'`)

---

## API Endpoints (для разработчиков)

### GET /api/profiles
Получить список профилей
```json
{
  "profiles": [
    {"name": "Admin", "messages_sent": 145, "phone": "N/A"}
  ]
}
```

### POST /api/profiles/create
Создать новый профиль
```json
{
  "name": "NewProfile"
}
```

### POST /api/send
Отправить одно сообщение
```json
{
  "profile": "Admin",
  "phone": "+79991234567",
  "message": "Hello!"
}
```

### POST /api/mass-send
Массовая рассылка
```json
{
  "phone_numbers": ["+79991234567", "+79997654321"],
  "profiles_config": {
    "Admin": "Message from Admin",
    "Olinda": "Message from Olinda"
  },
  "delay_config": {
    "random": false,
    "delay": 30
  }
}
```

### GET /api/analytics
Получить аналитику
```json
{
  "sent": 369,
  "delivered": 351,
  "failed": 18,
  "success_rate": 95.1,
  "avg_delay": 42,
  "recent_messages": [...]
}
```

---

## Дополнительные возможности

### Автозапуск при старте системы

**Windows (Task Scheduler):**
1. Создайте `.bat` файлы для запуска серверов
2. Добавьте их в планировщик заданий

**macOS/Linux (systemd):**
Создайте service файлы для автозапуска

### Docker версия (опционально)

Для упрощения развертывания можно создать Docker контейнеры.
Обратитесь к документации Docker для создания `Dockerfile` и `docker-compose.yml`.

---

## Поддержка

При возникновении проблем проверьте:
1. Версии Python и Node.js
2. Логи в терминалах
3. Наличие интернет-соединения
4. Установлен ли Chrome

---

**Успешной работы с WhatsApp Sender! 🚀**
