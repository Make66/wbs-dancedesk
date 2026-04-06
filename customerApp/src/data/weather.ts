export type WeatherWidgetData = {
  temperature: number;
  weatherCode: number;
  isDay: number;
};

export type ForecastDay = {
  date: string;
  tempMin: number;
  tempMax: number;
  weatherCode: number;
};

export async function fetchCityCoordinates(city: string) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de&format=json`,
  );

  if (!res.ok) {
    throw new Error("Ort konnte nicht gefunden werden.");
  }

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Kein Ort gefunden.");
  }

  const place = data.results[0];

  return {
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone,
  };
}

export async function fetchCurrentWeather(latitude: number, longitude: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`,
  );

  if (!res.ok) {
    throw new Error("Aktuelles Wetter konnte nicht geladen werden.");
  }

  const data = await res.json();

  return {
    temperature: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day,
  } satisfies WeatherWidgetData;
}

export async function fetch7DayForecast(latitude: number, longitude: number) {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`,
  );

  if (!res.ok) {
    throw new Error("7-Tage-Wetter konnte nicht geladen werden.");
  }

  const data = await res.json();

  return data.daily.time.map((date: string, index: number) => ({
    date,
    tempMin: Math.round(data.daily.temperature_2m_min[index]),
    tempMax: Math.round(data.daily.temperature_2m_max[index]),
    weatherCode: data.daily.weather_code[index],
  })) satisfies ForecastDay[];
}
