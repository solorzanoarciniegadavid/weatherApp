
const key  ="a375ee295a2bc9fc9bbaf39f72ff76d3";


async function search(){
    const phrase = document.querySelector('#search').value;
    const response = await fetch('https://api.openweathermap.org/geo/1.0/direct?q='+phrase+'&limit=5&appid='+key)
    const data = await response.json();
    const ul = document.querySelector('#listado');
    ul.innerHTML = '';

    for (let i = 0; i < data.length; i++){
        
        const {name,lat,lon,country} = data[i];
        ul.innerHTML += `<li data-lat="${lat}" data-lon="${lon}" data-name="${name}">${name}<span>&nbsp;(${country})</span></li>`;

    }

}

const debouncedSearch = _.debounce(()=> {
    search();
},600);


document.querySelector('#search')
.addEventListener('keyup', debouncedSearch)


async function showWeather(lat,lon,name){
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&units=metric&appid=a375ee295a2bc9fc9bbaf39f72ff76d3');
    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon;

    document.getElementById('city').innerHTML = name;
    document.getElementById('degrees').innerHTML = temp+'<span>°C</span>';
    document.getElementById('feelsVal').innerHTML = feels+'<span>°C</span>';
    document.getElementById('windVal').innerHTML = wind+'<span>Km/h</span>';
    document.getElementById('humVal').innerHTML = humidity+'<span>%</span>';
    document.getElementById('icon').src = 'http://openweathermap.org/img/wn/'+icon+'@4x.png';
    document.querySelector('form').style.display = 'none';
    document.getElementById('weather').style.display = 'block';
}


document.body.addEventListener('click', ev => {
    const li = ev.target;
    const {lat,lon,name} = li.dataset;
    localStorage.setItem('lat',lat);
    localStorage.setItem('lon',lon);
    localStorage.setItem('name',name);
    if(!lat){
        return
    }

    showWeather(lat,lon,name);

})

document.getElementById('change').addEventListener('click',()=>{
    document.querySelector('form').style.display = 'block';
    document.getElementById('weather').style.display = 'none';
})

document.body.onload = ()=>{
    if(localStorage.getItem('lat')){
        const lat = localStorage.getItem('lat');
        const lon = localStorage.getItem('lon');
        const name = localStorage.getItem('name');

        showWeather(lat,lon,name);
    }
}