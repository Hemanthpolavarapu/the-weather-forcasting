# Weather Forecasting Application

![Application screenshot](./public/screenshot.png)

A React-based weather forecasting application that allows users to search for locations by city name and view detailed weather information for the next 5-6 days with 3-hour intervals.

## Features

- Search for cities worldwide
- Current weather conditions with temperature, humidity, wind, etc.
- Hourly forecast for the current day
- 5-6 day weather forecast
- Clean, responsive Material UI design

## Live Demo

https://the-weather-forecasting.netlify.app

## Setup Instructions

### Prerequisites
- Node.js and npm installed on your system
- OpenWeatherMap API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Hemanthpolavarapu/the-weather-forecasting.git
```

2. Navigate to the project directory:
```bash
cd the-weather-forecasting
```

3. Install dependencies:
```bash
npm install
```

4. Configure API keys:
   - Open `src/api/OpenWeatherService.js`
   - Replace `'Your API KEY'` with your OpenWeatherMap API key (line 5)
   ```javascript
   const WEATHER_API_KEY = 'your-api-key-here';
   ```

5. Start the application:
```bash
npm start
```

## Troubleshooting Common Issues

### "Something went wrong" Error
If you see a "Something went wrong" error when searching for cities:

1. **Check API Key**: Ensure you've replaced the placeholder with your valid OpenWeatherMap API key in `src/api/OpenWeatherService.js`.

2. **API Limits**: Free OpenWeatherMap accounts have request limits. Check if you've exceeded your daily quota.

3. **Network Issues**: Verify your internet connection is working properly.

4. **CORS Issues**: If using locally, you might encounter CORS restrictions. Consider using a CORS proxy or browser extension.

### Incorrect Time Display
If the UTC time shown in the application is incorrect:

1. The application uses the local system time to calculate and display UTC time. Ensure your system clock is correctly set.

2. The displayed time is in UTC format, not your local timezone. This is intentional to provide consistent time reference regardless of user location.

## Technologies Used

- React.js
- Material UI
- OpenWeatherMap API
- GeoDB Cities API

## Future Enhancements

- [ ] Styled-components implementation
- [ ] TypeScript conversion
- [ ] Unit Testing
- [ ] Geolocation for automatic weather detection
- [ ] Celsius/Fahrenheit toggle
- [ ] Dark/Light Mode theme switch

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the application.

## License

This project is open source and available under the MIT License. 