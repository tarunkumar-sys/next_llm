import { Tool } from "@langchain/core/tools";

/**
 * Weather tool
 * Gets live weather data for a city
 */
export class WeatherTool extends Tool {
  name = "get_weather";
  description = `
Use this tool to get current weather.
Input should be a city name.
`;

  async _call(city) {
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return "Weather API key not configured.";
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );

      const data = await res.json();

      if (data.cod !== 200) {
        return `Weather data not found for ${city}.`;
      }

      return `
🌤️ Weather in ${data.name}:
• Temperature: ${data.main.temp}°C
• Feels like: ${data.main.feels_like}°C
• Condition: ${data.weather[0].description}
• Humidity: ${data.main.humidity}%
• Wind: ${data.wind.speed} m/s
`;
    } catch (error) {
      return `Failed to fetch weather: ${error.message}`;
    }
  }
}