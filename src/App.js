
import './App.css';
import React,{useState,useEffect} from "react"
import WeatherBoard from "./weatherBoard"

function App() {

  const [input,setInput] = useState()

  const [city,setCity] = useState("")

  const [cityInfo,setCityInfo] = useState("")  

  const [weatherArr,setWeatherArr] = useState([])

  const [error,setError] = useState("")

  function hanldeChange(event){
    setInput(event.target.value)
  }

  function handleEnter(event){
    if(event.keyCode === 13){
      console.log("enter")
      setCity(input)
      console.log(input)
    }
  }

  useEffect(()=>{
    console.log(city)
  if(city){
      
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=API_KEY`)
    .then(response => response.json())
    .then(data => { 
      if(data.cod == "200") {setWeatherArr([...data.list])
        setCityInfo(data.city)
        setError("")
      }
        else{ setError("Oops, We cannot find the city. Try again..")}
        })
        }
    },[city])


  return (
    <div className="app-container" >
      <input type="text" className="search" value={input} onChange={hanldeChange} onKeyDown={handleEnter}  placeholder="Enter city name.."/>
      <WeatherBoard cityInfo={cityInfo} weatherArr={weatherArr} error={error}/>
    </div>
  );
}

export default App;
