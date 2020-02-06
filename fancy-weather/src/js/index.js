// const weather_block = document.createElement('div');
// const weather_block_country = document.createElement('div');
// const weather_block_current_weather = document.createElement('div');
// const weather_block_three_days = document.createElement('div');

const main_wrapper = document.querySelector('.main_wrapper');
const refresh = document.querySelector('.refresh');
const test = document.getElementById('test');
let backgroundpicture;
const search_button = document.getElementById('search');
const region = document.querySelector('.weather_block_country');
const curerent_weather = document.querySelector('.weather_block_current_weather');
const dateblock = document.querySelector('.dateblock');
let latlat = document.querySelector('.latlat');
let latlon = document.querySelector('.latlon');
let faringate = document.querySelector('.faringate');
let celsium = document.querySelector('.celsium');
let dayofweek1 = document.querySelector('.dayofweek1');
let dayofweek2 = document.querySelector('.dayofweek2');
let dayofweek3 = document.querySelector('.dayofweek3');
let temperature1 = document.querySelector('.temperature1');
let temperature2 = document.querySelector('.temperature2');
let temperature3 = document.querySelector('.temperature3');
let feelslike = document.querySelector('.feelslike');
let wind = document.querySelector('.wind');
let humidity = document.querySelector('.humidity');
let marker = true;
let mapplace = document.getElementById('map');
let icon_name = document.querySelector('.icon_name');

refresh.addEventListener('click',getBackground);
getBackground();
search_button.addEventListener('click', getBackground);
search_button.addEventListener('click', geocoding);
async function getBackground(){
    const url = 'https://api.unsplash.com/photos/random?query=town,';
    const query = document.getElementById('textinput').value;
    const queryString = `${query}&client_id=6bd74a2334263752dc9172ab46633df29c964660e02d79c0b771d1128fc74572`;
    const finalUrl = url + queryString;
    const res = await fetch(finalUrl);
    const data = await res.json();
    backgroundpicture = data.urls.regular;
    main_wrapper.style.backgroundImage = `url(${backgroundpicture})`;
}

window.onload =  navigator.geolocation.getCurrentPosition(function(position) {
  let currentlatitude = position.coords.latitude.toFixed(4);
  let currentlongitude = position.coords.longitude.toFixed(4);
  getWeather(currentlatitude, currentlongitude);
});

async function geocoding(){
  let query = document.getElementById('textinput').value;
  let url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=eff58c2b9be8485d92e84b3f73cf9c22`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  let new_lat =  data.results[0].geometry.lat.toFixed(4);
  let new_long =  data.results[0].geometry.lng.toFixed(4);
  getWeather(new_lat, new_long);
}

function getWeather(a, b){
    getCurrentData();
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = `https://api.darksky.net/forecast/ff374f573e26e7438ccb15f055067c1f/${a},${b}?`
fetch(proxyUrl + targetUrl)
  .then(blob => blob.json())
  .then(data => {
    console.log(data)
    // For main weather section
    region.innerHTML = data.timezone;
    curerent_weather.innerHTML = Math.floor(data.currently.temperature);
    latlat.innerHTML = `Latitude: ${Math.trunc(data.latitude)}&deg ${Math.ceil((data.latitude - Math.trunc(data.latitude)) * 60)}`;
    latlon.innerHTML = `Longitude: ${Math.trunc(data.longitude)}&deg ${Math.ceil((data.longitude - Math.trunc(data.longitude)) * 60)}`;
    icon_name.innerHTML = data.currently.icon;
    let icon  = data.currently.icon;
    function setIcons(icon, iconID){
      const skycons = new Skycons({color:'black'});
      if(iconID.id === 'icon1'){
        let currentIcon = data.daily.data[0].icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
      }
      if(iconID.id === 'icon2'){
        let currentIcon = data.daily.data[1].icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
      }
      if(iconID.id === 'icon3'){
        let currentIcon = data.daily.data[2].icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
      } else{
        let currentIcon = data.currently.icon.replace(/-/g, "_").toUpperCase();
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
      }
    }
    setIcons(icon, document.querySelector('.icon'));
    humidity.innerHTML = ` HUMIDITY : ${data.currently.humidity}`;
    wind.textContent = `WIND: ${data.currently.windSpeed} m/s`;
    let fiislikenumber  = Math.floor(Math.floor(data.currently.temperature) - 0.4 * (Math.floor(data.currently.temperature) - 10) * (1 - data.currently.humidity));
    feelslike.textContent = `FEELS LIKE: ${fiislikenumber}`;
    // MAP
    initMap();
    function initMap() {
      let coordinates = {lat: data.latitude, lng: data.longitude},
          map = new google.maps.Map(mapplace, {
              center: coordinates,
              zoom: 7,
              disableDefaultUI: true
          });
  }
// init();
// async function init(){
//   if(marker === true){
//     let myMap = new ymaps.Map(mapplace, {
//     center: [data.latitude, data.longitude],
//     zoom: 7
//   });
//   console.log('инициализирую');}
//   if(marker === false){
//     let myMap = new ymaps.Map(mapplace, {
//       center: [data.latitude, data.longitude],
//       zoom: 7
//     });
//     // myMap.panTo([data.latitude, data.longitude],{duration:1000});
//     console.log('меняю');
//   }
//   return myMap;
//   marker = false;
//   }

    // FROM FARINGATE TO CELSIUM AND BACK
    celsium.addEventListener('click', perevodvcelsii);
    faringate.addEventListener('click', perevodvfaringati)
    
    function perevodvcelsii(){
      console.log(faringate.classList)
     if(faringate.classList.length === 2){
      faringate.classList.toggle('disabled');
     }
      curerent_weather.innerHTML = Math.floor((curerent_weather.innerHTML - 32) * (5 / 9));
      temperature1.innerHTML = Math.floor((temperature1.innerHTML - 32) * (5 / 9));
      temperature2.innerHTML = Math.floor((temperature2.innerHTML - 32) * (5 / 9));
      temperature3.innerHTML = Math.floor((temperature3.innerHTML - 32) * (5 / 9));
      feelslike.innerHTML = `FELLS LIKE : ${Math.floor((fiislikenumber - 32) * (5 / 9))}`;
      celsium.classList.toggle('disabled');
    }
    
    function perevodvfaringati(){
      curerent_weather.innerHTML = Math.floor(data.currently.temperature);
      temperature1.innerHTML = Math.floor(data.daily.data[0].temperatureMin);
      temperature2.innerHTML = Math.floor(data.daily.data[1].temperatureMin);
      temperature3.innerHTML = Math.floor(data.daily.data[2].temperatureMin);
      feelslike.innerHTML = `FELLS LIKE : ${fiislikenumber}`;
      faringate.classList.toggle('disabled');
      celsium.classList.toggle('disabled');
    }
    // Three days forecast
    temperature1.innerHTML = Math.floor(data.daily.data[0].temperatureMin);
    setIcons(icon, document.querySelector('#icon1'));
    temperature2.innerHTML = Math.floor(data.daily.data[1].temperatureMin);
    setIcons(icon, document.querySelector('#icon2'));
    temperature3.innerHTML = Math.floor(data.daily.data[2].temperatureMin);
    setIcons(icon, document.querySelector('#icon3'));
  })
  .catch(e => {
    console.log(e);
    return e;
  });
}

function getCurrentData(){
 let today = new Date();
const monthsEng = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayarray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday","Wednesday"];
let day = today.getDate();
let month = today.getMonth();
let time = today.getHours() + ":" + today.getMinutes();
let dayOfTheWeek = today.getDay();
// const monthsRus = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
dateblock.innerHTML = `${dayarray[dayOfTheWeek - 1]} ${day} ${monthsEng[month]} ${time}`;
dayofweek1.innerHTML = dayarray[dayOfTheWeek];
dayofweek2.innerHTML = dayarray[dayOfTheWeek + 1];
dayofweek3.innerHTML = dayarray[dayOfTheWeek + 2]; 
}












