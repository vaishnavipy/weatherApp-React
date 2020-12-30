import React, { Fragment, useEffect, useState } from "react"


import iconCodeMapping from './weatherIcon';



function WeatherBoard({weatherArr,cityInfo,error}){

    const [date,setDate] = useState(new Date().getDate()+1)

    const [selectedDates,setselectedDates] = useState("");

    const [selectedDatesElm,setSelectedDatesElm] = useState("")

    const [displayTime,setDisplayTime]= useState("")
   
    const [days,setDays] = useState([])

    const [divDayGrid,setDivDayGrid] = useState("")

    const weekday =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    const timeLabels =["2 am","5 am","8 am","11 am","2 pm","5 pm","8 pm","11 pm"]
       
    //On Component Mount setup the days array, with the next 5 days of the week starting from tomorrow
    useEffect(()=>{
       
        if(days.length == 0){
        for(let i=1;i< 6;i++){
            let nextDate = new Date()
            let todaysDate = new Date()
            nextDate.setDate( todaysDate.getDate() + i)
            let tempDate = nextDate.getDate()
            let tempDay =nextDate.getDay()
           console.log(nextDate.getDay(),nextDate.getDate(),nextDate.getFullYear(),i,"hi")
            setDays(prevDay => [...prevDay,{dayCode:tempDay,date:tempDate} ])
           
        }
    }

    setDisplayTime(0)
    },[])

   
    // Whenever user chooses different date , show data mathcing the date
    useEffect(()=>{
      
     if(weatherArr.length != 0){
        

       const temp=  weatherArr.filter(obj => {
             return   ((obj.dt_txt.split(" "))[0].slice(-2)) == date
            })
       console.log(temp)
            setselectedDates(temp)
       
        }
       
    },[date,weatherArr])

    //Once you get the weather Array , fill in the bottom weather cards for next 5 days
    useEffect(()=>{
     
        if(days.length !== 0 && weatherArr.length !== 0){
            let matchDate = " " 
         let tempDayGrid =   weatherArr.map((obj,i) => {
                var d = ((obj.dt_txt.split(" "))[0].slice(-2))
               
              
                if(matchDate !== d ){
                   
                  
                    matchDate =  ((obj.dt_txt.split(" "))[0].slice(-2))
               
                    return (
                    <div id={matchDate} onClick={chooseDay} className="choose-day-div">
                        <p className="day">{weekday[days.filter(elm => elm.date == d).map(elm => elm.dayCode)]}</p>
                        <div className="weather-card-icon"> <img src={iconCodeMapping[obj.weather[0].icon]} /></div>
                        <p className="max-temp">{obj.main.temp_max}<span>&#176;</span>C</p>
                        <p className="min-temp">{obj.main.temp_min}<span>&#176;</span>C</p>
                    </div>)
                }
                
            })
            tempDayGrid = tempDayGrid.filter(obj => obj)

            if(tempDayGrid.length >5){
              
                tempDayGrid.pop()
                
            }
            setDivDayGrid(tempDayGrid)
        }
        
    },[days,weatherArr])


    // Helps chnage the selected display time
    function selectedDisplayTime(index){
        setDisplayTime(index)
    }
    //Helps change the day from the weather card at the cottom
    function chooseDay(e){
        console.log(e.currentTarget.id,"id")
        setDate(e.currentTarget.id)
       
    }

    // Based on the date selected and the display time selected, the display changes
    useEffect(()=>{
        if(selectedDates){
         
      const tempSelectedDatesElm =  selectedDates.map((obj,i) => {
        var d = ((obj.dt_txt.split(" "))[0].slice(-2))
               
              
          return  (
          <div className="day-weather-container">
              
                <p className="weather-desc"><strong>{weekday[days.filter(elm => elm.date == d).map(elm => elm.dayCode)]} {timeLabels[displayTime]}</strong>, {obj.weather[0].description}</p>
                <div className="inner-container">
                    <div className="left">
                        <div className="main-temp-img-grid">
                            <div className="main-icon"><img src={iconCodeMapping[obj.weather[0].icon]} /></div>
                            <h1>{obj.main.temp}<span className="small-celsius">&#176; C</span></h1>
                        </div>
                      
                    </div>
                    <div className="right">
                        <p>Clouds:{obj.clouds.all}%</p>
                        <p>Humidity:{obj.main.humidity}%</p>
                        <p>Wind:{obj.wind.speed}m/s</p>
                    </div>
                </div>
                <TimeRuler times={selectedDates} selectedDisplayTime={selectedDisplayTime} displayTime={displayTime}/>
            </div> ) 
        })
        setSelectedDatesElm(tempSelectedDatesElm)
    }
       
    },[displayTime,selectedDates])
   

    
    return(
    <div className="weather-board">
        {error ? error :  
        
        <Fragment>
        
        {cityInfo &&   <h3 className="city">{cityInfo.name},{cityInfo.country} </h3> }
        
        {selectedDatesElm && selectedDatesElm[displayTime]}

        <div className="div-grid">
            {divDayGrid && divDayGrid}
        </div> 
        </Fragment>

        }

       

    </div>)
}




// Time slider componnet, to display the differnt hourly times
function TimeRuler({times,selectedDisplayTime,displayTime}){
    const [selectedTime,setSelectedTime] = useState(displayTime)

    useEffect(()=>{
        setSelectedTime(displayTime)
    },[displayTime])

    const margin = 100/times.length;

    const labelMargin = margin;

    function handleTimeChange(e){
        if(e.target.id){
        selectedDisplayTime(e.target.id)
        setSelectedTime(e.target.id)
        }
    }
  
    const timeLabels =[
        {"00":"2am"},
        {"03":"5 am"},
        {"06":"8 am"},
        {"09":"11 am"},
        {"12": "2 pm"},
        {"15": "5 pm"},
        {"18": "8 pm"},
        {"21": "11 pm"}
    ]

    const labels = times.map((elm,i) => {
        return(<div key={i} id={i} style={{left:`${i*labelMargin}%`}}  className="label">{timeLabels.map(obj => obj[((elm.dt_txt.split(" "))[1].slice(0,2))])}</div>)
    })

    const circle = times.map((elm,i) => {
        if( i == selectedTime ){
        return(<div key={i} id={i} style={{left:`${i*margin}%`}}  className="circles active" onClick={handleTimeChange}></div>) }
        else{
            return(<div key={i} id={i} style={{left:`${i*margin}%`}}  className="circles" onClick={handleTimeChange}></div>)    
        }
    })

    return(
    <div className="time-ruler">
            {circle}
           <hr className="hr"/>
           {labels}
    </div>)


}

export default WeatherBoard;