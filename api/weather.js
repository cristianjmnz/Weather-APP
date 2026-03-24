// api/weather.js
// Esta función corre en el servidor de Vercel, nunca en el navegador.
// La API key solo existe aquí, nunca llega al cliente.

export default async function handler(req, res) {
  const { lat, lon, city, type } = req.query;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key no configurada en Vercel' });
  }

  let url;

  // type=geo → solo geocoding para obtener coordenadas + nombre
  if (type === 'geo' && city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=es`;
  } else {
    return res.status(400).json({ error: 'Parámetros insuficientes' });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al contactar OpenWeatherMap' });
  }
}
