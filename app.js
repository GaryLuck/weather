import {easternDate, birthdayDays, skyAt, weatherDescription} from './model.js';
const $ = id => document.getElementById(id);
let followsNow = true;
let lastDate = '';
function setTime(minutes) {
  $('time').value = `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
  $('slider').value = minutes;
  const sky = skyAt(minutes);
  document.documentElement.style.setProperty('--sky-top', sky.top);
  document.documentElement.style.setProperty('--sky-bottom', sky.bottom);
  document.documentElement.style.setProperty('--orb-height', `${sky.orbHeight}%`);
  document.body.classList.toggle('night', sky.night);
  $('period').textContent = sky.label;
  $('time-mode').textContent = followsNow ? 'In sync with the moment' : 'Your time, your sky';
  $('time-dot').classList.toggle('custom', !followsNow);
}
function updateToday() {
  const date = easternDate();
  const key = `${date.year}-${date.month}-${date.day}`;
  if (key !== lastDate) {
    lastDate = key;
    const day = new Date(Date.UTC(date.year, date.month-1, date.day,12));
    $('weekday').textContent = day.toLocaleDateString('en-US',{weekday:'long',timeZone:'UTC'});
    $('full-date').textContent = day.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
    $('month-short').textContent = day.toLocaleDateString('en-US',{month:'short',timeZone:'UTC'}).toUpperCase();
    $('day-number').textContent = date.day;
    const days = birthdayDays(date);
    $('birthday-count').textContent = days === 0 ? 'Happy birthday!' : `${days} ${days===1?'day':'days'}`;
    $('birthday-label').textContent = days === 0 ? 'Happy birthday, Ethan! 🎉' : 'until Ethan’s birthday';
    $('birthday-note').textContent = days === 0 ? 'April 22 · Today is your day!' : 'April 22 · A day worth celebrating';
  }
  if (followsNow) setTime(date.minutes);
}
$('time').addEventListener('input', event => {
  if (!event.target.value) return;
  followsNow = false;
  const [hours, minutes] = event.target.value.split(':').map(Number);
  setTime(hours*60+minutes);
});
$('slider').addEventListener('input', event => { followsNow=false; setTime(+event.target.value); });
$('now').addEventListener('click', () => { followsNow=true; updateToday(); });
let loading = false;
async function updateWeather() {
  if (loading) return;
  loading = true;
  $('refresh').disabled = true;
  $('conditions').textContent = 'Checking the sky…';
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.1732&longitude=-77.2717&current=temperature_2m,relative_humidity_2m,weather_code,is_day,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York', {signal:AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error('Weather request failed');
    const {current} = await response.json();
    if (!current || !Number.isFinite(current.temperature_2m)) throw new Error('Missing weather data');
    $('temperature').replaceChildren(document.createTextNode(Math.round(current.temperature_2m)));
    const unit = document.createElement('span'); unit.textContent = '°F'; $('temperature').append(unit);
    $('conditions').textContent = weatherDescription(current.weather_code);
    $('weather-icon').textContent = current.weather_code <= 1 ? (current.is_day ? '☀' : '☾') : current.weather_code <= 3 ? '☁' : current.weather_code >= 95 ? 'ϟ' : current.weather_code >= 71 && current.weather_code <= 77 ? '❄' : '☂';
    $('weather-detail').textContent = `Wind ${Math.round(current.wind_speed_10m)} mph · Humidity ${current.relative_humidity_2m}%`;
  } catch {
    $('conditions').textContent = 'Weather unavailable';
    $('temperature').innerHTML = '—<span>°F</span>';
    $('weather-detail').textContent = 'Couldn’t reach live weather. Tap ↻ to retry.';
  } finally { loading=false; $('refresh').disabled=false; }
}
$('refresh').addEventListener('click', updateWeather);
updateToday(); updateWeather();
setInterval(updateToday, 15000);
setInterval(updateWeather, 600000);
