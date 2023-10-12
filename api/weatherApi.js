import axios from "axios"
import { apiKey } from "../apikey/apikey"


const locationsEndpoint = searchTerm => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${searchTerm}`
const forecastEndpoint = (cityName,days) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=${days}&aqi=no&alerts=no`



const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try {
        const response = await axios.request(endpoint,options)
        return response.data
    } catch (error) {
        console.log('error',error);
    }
}


export const fetchLocations = async (searchTerm) => {
    return await apiCall(locationsEndpoint(searchTerm))
}

export const fetchForecast = async (cityName, days) => {
    return await apiCall(forecastEndpoint(cityName,days))
}