# Skytime

A single-page clock and weather app for Germantown, Maryland. No build step or runtime packages are required.

Run `npm start` from this directory to serve the app on port 3000. Run `npm test` for the date, birthday, weather-code, and sky-transition checks.

Select a time using the digital clock or slider. **Back to now** restores the live Eastern-time clock. Today's date and Ethan's April 22 birthday countdown always use the actual date in Germantown, independently of the selected clock time.

Current conditions come from the Open-Meteo HTTPS API and refresh every ten minutes. Internet access to `api.open-meteo.com` is needed for weather. Failed requests show an unavailable state with a retry button. Google Fonts are optional; local sans-serif fallbacks work without them.
