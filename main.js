import { ICON_MAP } from "./iconsMap";
import "./style.css"
import { getWeather } from "./weather"

navigator.geolocation.getCurrentPosition(positionSuccess,positionError)
function positionSuccess({coords}){

  getWeather(coords.latitude,coords.longitude,Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).catch(e=>{
    // e.preventDefault()
    alert("getting error")
    console.log(e);
  })
}

function positionError(){
  alert("there was an error getting your location make sure you allow us to access your location")
}


function renderWeather({current,hourly,daily}){
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);

  document.body.classList.remove("blurred")
}

function setValue(selector , value, {parent=document}={}){
  parent.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode){
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}
const currentIcon = document.querySelector("[data-current-icon]")
function renderCurrentWeather(current){
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp",current.currentTemp)
  setValue("current-high",current.highTemp)
  setValue("current-low",current.lowTemp)
  setValue("current-fl-high",current.highFeelsLike)
  setValue("current-fl-low",current.lowFeelsLike)
  setValue("current-precip",current.precip)
  setValue("current-wind",current.windSpeed)
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined,{weekday:"long"})
const dailySection = document.querySelector("[data-day-section]")
const dayCardTemplate = document.getElementById("day-card-template")
function renderDailyWeather(daily){
  dailySection.innerHTML = " "
  daily.forEach(day=>{
    const element = dayCardTemplate.content.cloneNode(true)
    setValue("temp",day.maxTemp,{parent : element})
    setValue("day",DAY_FORMATTER.format(day.timestamp) ,{parent : element})
    element.querySelector("[data-icon]").src = getIconUrl(day.iconCode)
    dailySection.append(element)
  })
}

const Hour_FORMATTER = new Intl.DateTimeFormat(undefined,{hour:"numeric",hourCycle:"h12"})
const hourlySection = document.querySelector("[data-hour-section]")
const hourRowTemplate = document.getElementById("hour-row-template")

function renderHourlyWeather(hourly){
  hourlySection.innerHTML = " "
  hourly.forEach(hour=>{
    const element = hourRowTemplate.content.cloneNode(true)
    setValue("temp",hour.temp,{parent : element})
    setValue("fl-temp",hour.feelsLike,{parent : element})
    setValue("wind",hour.windSpeed,{parent : element})
    setValue("precip",hour.preci,{parent : element})
    setValue("day",DAY_FORMATTER.format(hour.timestamp) ,{parent : element})
    setValue("time",Hour_FORMATTER.format(hour.timestamp) ,{parent : element})
    element.querySelector("[data-icon]").src = getIconUrl(hour.iconCode)
    hourlySection.append(element)
  })
}