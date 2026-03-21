// api/weather.js
// Esta función corre en el servidor de Vercel, nunca en el navegador.
// La API key solo existe aquí, nunca llega al cliente.

export default async function handler(req, res) {
  const { lat, lon, city, type } = req.query;

  // La key viene de las variables de entorno de Vercel (nunca del cliente)
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key no configurada en Vercel" });
  }

  // Construir la URL según si buscan por ciudad o por coordenadas
  let baseUrl;
  const endpoint = type === "forecast" ? "forecast" : "weather";

  if (lat && lon) {
    baseUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;
  } else if (city) {
    baseUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric&lang=es`;
  } else {
    return res.status(400).json({ error: "Parámetros insuficientes" });
  }

  try {
    const response = await fetch(baseUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al contactar OpenWeatherMap" });
  }
}