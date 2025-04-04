const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
// ===== IMPORTANT =====
// The OpenWeatherMap API key is now valid
// Without a valid API key, the application will show "Something went wrong" errors
const WEATHER_API_KEY = 'f5ede61086f4d40c959379a6908f0c40'; // Working API key

// Fallback major cities for when GeoDB API is unavailable
const FALLBACK_CITIES = [
  { name: 'London', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278 },
  { name: 'New York', countryCode: 'US', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Tokyo', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Paris', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Berlin', countryCode: 'DE', latitude: 52.5200, longitude: 13.4050 },
  { name: 'Moscow', countryCode: 'RU', latitude: 55.7558, longitude: 37.6173 },
  { name: 'Sydney', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Beijing', countryCode: 'CN', latitude: 39.9042, longitude: 116.4074 },
  { name: 'Delhi', countryCode: 'IN', latitude: 28.7041, longitude: 77.1025 },
  { name: 'Mumbai', countryCode: 'IN', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Cairo', countryCode: 'EG', latitude: 30.0444, longitude: 31.2357 },
  { name: 'Rio de Janeiro', countryCode: 'BR', latitude: -22.9068, longitude: -43.1729 },
  { name: 'Singapore', countryCode: 'SG', latitude: 1.3521, longitude: 103.8198 },
  { name: 'Rome', countryCode: 'IT', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Madrid', countryCode: 'ES', latitude: 40.4168, longitude: -3.7038 },
  { name: 'Chicago', countryCode: 'US', latitude: 41.8781, longitude: -87.6298 },
  { name: 'Los Angeles', countryCode: 'US', latitude: 34.0522, longitude: -118.2437 },
  { name: 'Toronto', countryCode: 'CA', latitude: 43.6532, longitude: -79.3832 },
  { name: 'Shanghai', countryCode: 'CN', latitude: 31.2304, longitude: 121.4737 },
  { name: 'Mexico City', countryCode: 'MX', latitude: 19.4326, longitude: -99.1332 },
  { name: 'Istanbul', countryCode: 'TR', latitude: 41.0082, longitude: 28.9784 },
  { name: 'Dubai', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708 },
  { name: 'Hong Kong', countryCode: 'HK', latitude: 22.3193, longitude: 114.1694 },
  { name: 'Bangkok', countryCode: 'TH', latitude: 13.7563, longitude: 100.5018 },
  { name: 'Seoul', countryCode: 'KR', latitude: 37.5665, longitude: 126.9780 },
];

// Use RapidAPI directly instead of test/fallback mechanism
const GEO_API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'a999a3abb9mshdc1b0d520122729p1006afjsnb93b1d0add9a',
    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
  },
};

export async function fetchWeatherData(lat, lon) {
  try {
    console.log(`Fetching weather data for coordinates: lat=${lat}, lon=${lon}`);
    
    let [weatherPromise, forcastPromise] = await Promise.all([
      fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
      fetch(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      ),
    ]);

    const weatherResponse = await weatherPromise.json();
    const forcastResponse = await forcastPromise.json();
    
    console.log('Weather API response:', weatherResponse);
    
    if (weatherResponse.cod === 401 || forcastResponse.cod === 401) {
      console.error('API Key error: Unauthorized. Please check your API key.');
      throw new Error('API Key is invalid or unauthorized');
    }
    
    return [weatherResponse, forcastResponse];
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchCities(input) {
  try {
    // First try using the RapidAPI GeoDB Cities API
    console.log(`Searching for cities with input "${input}" via RapidAPI`);
    const searchUrl = `${GEO_API_URL}/cities?minPopulation=10000&namePrefix=${input}&limit=10`;
    
    const response = await fetch(searchUrl, GEO_API_OPTIONS);
    
    // If the API call was successful, return the data
    if (response.ok) {
      const data = await response.json();
      console.log('Cities API response:', data);
      return data;
    }
    
    // If there was an error with the API call, use fallback
    console.log('RapidAPI request failed, using fallback cities');
    return getFallbackCities(input);
    
  } catch (error) {
    // If there was an exception, use fallback
    console.error('Error fetching cities:', error);
    return getFallbackCities(input);
  }
}

// Helper function to get fallback cities
function getFallbackCities(input) {
  console.log(`Using fallback cities for input: "${input}"`);
  
  if (!input || input.length < 2) {
    return { data: [] };
  }
  
  const filteredCities = FALLBACK_CITIES.filter(city => 
    city.name.toLowerCase().includes(input.toLowerCase())
  );
  
  console.log(`Found ${filteredCities.length} fallback cities matching "${input}"`);
  
  return {
    data: filteredCities.map(city => ({
      name: city.name,
      countryCode: city.countryCode,
      latitude: city.latitude,
      longitude: city.longitude
    }))
  };
}
