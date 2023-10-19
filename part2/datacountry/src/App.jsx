import { useState, useEffect } from 'react'
import Server from './backend/backend';
const api_key = 'e48c64eaa354c8d788dc574e41c966c6'


const ShowCountries = ({ countries, onShow }) => {

  const mapped_countries = countries.map((country) => (
    <p key={country.name.common}>
      {country.name.common} 
      <button onClick={() => onShow(country.name.common)}>Show</button>
    </p>
  ));

  if (mapped_countries.length === 1) {
    console.log('Country:' ,countries[0]);
    const langArray = Object.values(countries[0].languages);
    return (
      <div>
      <h1>{countries[0].name.common}</h1>
      <p>Capital: {countries[0].capital}</p>
      <p>Area: {countries[0].area} m² </p>
      <h2>Languages: </h2>
      <ul>{langArray.map(lang => <li>{lang}</li>)}</ul>
      <img src={countries[0].flags.png} alt={countries[0].flags.alt} />
      <WeatherForecast country={countries[0]}/>
      </div>
    )
  }

  if (mapped_countries.length > 10) {
    return ['Too many matches, specify another filter']
  }

  return mapped_countries;
};

const WeatherForecast = ({ country }) => {
  const [weather, setWeather] = useState(null);

  console.log('Forecast: ', country);
  console.log(api_key);
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&APPID=${api_key}`;
  console.log('url:', apiURL);

  useEffect(() => {
    Server.getURL(apiURL)
     .then((weatherRes) => {
       console.log('Works?: ', weatherRes)
        setWeather(weatherRes);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }, []);

  console.log('Weather: ', weather);

  return (
    <div>
      <h1>Weather in {country.capital}</h1>
      {weather && (
        <div>
          <p>Temperature: {Math.round(weather.main.temp - 273)}°C</p>
          <p>Wind: {weather.wind.speed} m/s</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather.description}
          />
        </div>
      )}
    </div>
  );
};

const SearchForm = ({handleFilterChange, newFilter}) => {
  return (
    <form onChange={handleFilterChange}>
    <div>
      Search: <input value={newFilter} onChange={handleFilterChange} />
    </div>
  </form>
  )
}

function App() {
  //const api_key = import.meta.env.VITE_WEATHER_KEY
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    console.log('effect');
    console.log(api_key);
    Server.getAll().then(data => {
      //setCountries(data.map(countries => countries.name.common))
      setCountries(data)
      console.log(data);
    })
  },[])

  // let countries = [{name: 'america'}, {name: 'usa'}]

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
    console.log(newFilter);
  };
  
  const handleShowButton = (name) => {
    setNewFilter(name);
    console.log(newFilter);
  };

  const searchFilter = (contries) => contries.filter((country) =>
  country.name.common.toLowerCase().includes(newFilter.toLowerCase())
);

  return (
    <div>
      <h2>Find countries: </h2>
      <SearchForm handleFilterChange={handleFilterChange} newFilter={newFilter}/>
      <ShowCountries countries={searchFilter(countries)} onShow={handleShowButton} />
    </div>
  )
}



export default App
