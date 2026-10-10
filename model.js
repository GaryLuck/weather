export function easternDate(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now).map(p => [p.type, p.value]));
  return { year: +parts.year, month: +parts.month, day: +parts.day, minutes: +parts.hour * 60 + +parts.minute };
}
export function birthdayDays({year, month, day}) {
  const today = Date.UTC(year, month - 1, day);
  let birthday = Date.UTC(year, 3, 22);
  if (today > birthday) birthday = Date.UTC(year + 1, 3, 22);
  return Math.round((birthday - today) / 86400000);
}
export const weatherDescription = code => ({0:'Clear skies',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Freezing fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',56:'Freezing drizzle',57:'Heavy freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Freezing rain',67:'Heavy freezing rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Light rain showers',81:'Rain showers',82:'Heavy rain showers',85:'Snow showers',86:'Heavy snow showers',95:'Thunderstorms',96:'Thunderstorms with hail',99:'Heavy thunderstorms with hail'}[code] ?? 'Weather unavailable');
export function skyAt(minutes) {
  const hour = minutes / 60;
  const stops = [
    [0,[13,20,46],[34,40,74],'MIDNIGHT STILLNESS'],
    [5,[41,44,85],[118,84,119],'BEFORE THE WORLD WAKES'],
    [7,[118,153,192],[248,183,141],'FIRST LIGHT'],
    [12,[68,143,192],[185,218,228],'A LITTLE DAYLIGHT'],
    [16,[87,146,179],[226,193,160],'AFTERNOON EASE'],
    [19,[81,72,128],[237,154,128],'EVENING GLOW'],
    [21,[25,35,72],[87,71,111],'AFTER DARK'],
    [24,[13,20,46],[34,40,74],'MIDNIGHT STILLNESS']
  ];
  const i = stops.findIndex((s,j) => j < stops.length-1 && hour >= s[0] && hour < stops[j+1][0]);
  const a = stops[i], b = stops[i+1], t = (hour-a[0])/(b[0]-a[0]);
  const mix = n => a[n].map((v,j)=>Math.round(v+(b[n][j]-v)*t)).join(',');
  return { top: `rgb(${mix(1)})`, bottom: `rgb(${mix(2)})`, label: a[3], night: hour < 6 || hour >= 20, orbHeight: 14 + 50 * Math.max(0, Math.sin((hour-6)/12*Math.PI)) };
}
