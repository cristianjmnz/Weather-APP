# 🌤️ Weather APP — App del Tiempo

App del tiempo en el navegador hecha con HTML, CSS y JavaScript vanilla. Muestra temperatura, clima, pronóstico y se adapta visualmente al estado del cielo en tiempo real.

---

## 📸 Vista previa

> Fondo animado con estrellas, nubes, lluvia o nieve según el clima actual · Geolocalización automática · Pronóstico 7 días

---

## ✨ Características

- **Geolocalización automática** — detecta tu ubicación al abrir la app
- **Búsqueda por ciudad** — cualquier ciudad del mundo
- **Temperatura y sensación térmica** — datos en tiempo real
- **Humedad y viento** — con dirección cardinal
- **Pronóstico 7 días** — máximas y mínimas de la semana
- **Fondo dinámico** — cielo, estrellas, nubes, lluvia o nieve según el clima
- **API key protegida** — función serverless en Vercel, la key nunca llega al cliente

---

## 🚀 Instalación y uso

### Opción 1 — Ver en producción

👉 [weather.vercel.app](weather-app-theta-ten-71.vercel.app) 

### Opción 2 — Correrlo en local

**Requisitos:** cuenta en [OpenWeatherMap](https://openweathermap.org/api) para obtener una API key gratuita.

```bash
# 1. Clona el repositorio
git clone https://github.com/TU_USUARIO/weather-app.git
cd weather-app

# 2. Crea un archivo .env en la raíz
echo "API_KEY=tu_api_key_aqui" > .env
```

Para correrlo en local necesitas un servidor que soporte funciones serverless (por ejemplo [Vercel CLI](https://vercel.com/docs/cli)):

```bash
# 3. Instala Vercel CLI
npm i -g vercel

# 4. Arranca el servidor local
vercel dev
```

---

## 📁 Estructura del proyecto

```
WEATHER_APP/
├── index.html          # Estructura de la app
├── style.css           # Estilos y animaciones del fondo
├── app.js              # Lógica, llamadas a la API y render
├── .gitignore
├── README.md
└── api/
    └── weather.js      # Función serverless — protege la API key
```

---

## 🛠️ Tecnologías

- **HTML / CSS / JavaScript** — sin frameworks ni dependencias
- **OpenWeatherMap API** — datos meteorológicos en tiempo real
- **Vercel Serverless Functions** — proxy seguro para la API key
- **Vercel** — hosting y despliegue continuo

---

## 🔒 Variables de entorno

| Variable  | Descripción                          |
|-----------|--------------------------------------|
| `API_KEY` | Tu API key de OpenWeatherMap         |

En producción se configura desde **Vercel → Settings → Environment Variables**.  
En local se lee desde el archivo `.env` (no se sube al repo).

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

Hecho por [cristianjmnz](https://github.com/cristianjmnz) — proyecto personal de aprendizaje.
