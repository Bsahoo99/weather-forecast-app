# Weather Forecast App

A vanilla-JS weather app that fetches live forecasts from the OpenWeather API.

## Overview

The user enters a city or zip code into a form. The app calls the OpenWeather API via `fetch()`, parses the JSON response, and displays the forecast on the page. Note: the API key is currently hardcoded in the JS source.

## Requirements

- A modern web browser
- Network access (OpenWeather API)

## Project Structure

```
weather-forecast-app/
├── index.html    # Search form and forecast display
├── script.js     # API calls and response rendering
├── style.css     # Page styling
├── .gitignore
└── README.md
```

## Usage

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## Key Files

| File | What it does |
|------|--------------|
| `index.html` | Input form for city/zip and the container for forecast output |
| `script.js` | Calls OpenWeather API via `fetch()`, parses JSON, updates the DOM |
| `style.css` | Page styling |

## Author

Biswajeet Sahoo

## License

MIT License
