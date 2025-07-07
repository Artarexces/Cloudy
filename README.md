## ☁️ Cloudy

**Cloudy** es una aplicación de clima full-stack que permite a los usuarios registrarse, iniciar sesión y consultar el clima actual y pronósticos semanales de cualquier ciudad. Registra el historial de consultas de cada usuario.

---

## 🚀 Características

- Autenticación de usuario con tokens (registro, login, logout).
- Consulta de clima actual y pronóstico a 7 días via API de WeatherAPI.
- Historial de búsquedas guardado por usuario.
- Frontend dinámico con React, Tailwind CSS y animaciones con GSAP.
- Backend RESTful con Django y Django REST Framework.

---

## 📁 Estructura del Proyecto

```
Cloudy/
├── backend/                 # API Django
│   ├── cloudy_server/       # Configuración del proyecto Django
│   ├── api/                 # App con vistas, modelos y serializers
│   ├── manage.py
│   └── requirements.txt     # Dependencias Python
├── frontend/cloudy/         # Cliente React + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/      # Login, Register, Weather
│   │   ├── styles.css
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
└── .gitignore
```

---


## 🛠️ Tecnologías

### Backend
- Python 3
- Django 5.2.2
- Django REST Framework
- django-cors-headers
- requests
- python-decouple

### Frontend
- React 19
- Vite
- Tailwind CSS
- GSAP (animaciones)

---

## ⚙️ Setup y Ejecución

### 1. Clonar repositorio

```bash
git clone https://github.com/Artarexces/Cloudy.git
cd Cloudy
```

### 2. Configurar y levantar Backend

Crear y activar un entorno virtual:

```bash
Python -m venv ve2nv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate    # Windows
```

Instalar dependencias:

```bash
pip install -r backend/requirements.txt
```

 Crear archivo .env en backend/ con variables:

```bash
SECRET_KEY=tu_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
OWM_API_KEY=tu_api_key_de_weatherapi
```
Migrar la base de datos y ejecutar el servidor:

```bash
cd backend
python manage.py migrate
python manage.py runserver
```
El backend escuchará por defecto en http://localhost:8000.

### 3. Configurar y levantar Frontend

Instalar dependencias:

```bash
cd frontend/cloudy
npm install
```
Crear archivo .env en frontend/cloudy:
```
VITE_API_BASE_URL=http://localhost:8000/api
```
Iniciar la aplicación:
```bash
npm run dev
```

El cliente se ejecutará en http://localhost:5173 (o puerto asignado por Vite).



## ⚡️ Uso

1. Accede al frontend.

2. Regístrate con un nombre de usuario y contraseña.

3. Inicia sesión para obtener el token.

4. Consulta el clima de cualquier ciudad.

5. Visualiza tu historial de búsquedas en tu cuenta.

---
## 🗺️ Endpoints de la API

| Ruta             | Método | Descripción                        |
| ---------------- | ------ | ---------------------------------- |
| `/api/register/` | POST   | Registro de usuario                |
| `/api/login/`    | POST   | Login y obtención de token         |
| `/api/logout/`   | POST   | Logout (elimina token)             |
| `/api/weather/`  | GET    | Clima actual + pronóstico (ciudad) |
| `/api/history/`  | GET    | Últimas 10 búsquedas del usuario   |
