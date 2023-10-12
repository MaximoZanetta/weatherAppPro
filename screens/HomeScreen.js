import { StatusBar } from "expo-status-bar"
import {FontAwesome} from "@expo/vector-icons"
import { useCallback, useEffect, useState } from "react"

const { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView } = require("react-native")
import {debounce} from "lodash"
import { fetchForecast, fetchLocations } from "../api/weatherApi"
import { weatherImages } from "../constants"
import Loading from "../Loading"

const HomeScreen = () => {

    const [locations, setLocations] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [weather, setWeather] = useState({})
    const [loading, setLoading] = useState(false)

    const handleLocation = (loc) => {
        setLoading(true)
        setLocations([])
        setShowSearch(false)
        fetchForecast(loc.name, 7).then((data=> {
            setWeather(data)
            setLoading(false)
        }))
    }

    const handleSearch = (text) => {

        if(text.length>2) {
            fetchLocations(text).then(data => setLocations(data))
        }
        
    }

    const handleDebounceText = useCallback(debounce(handleSearch, 400),[])

    useEffect(()=> {
        setLoading(true)
        fetchMyWeatherData()
        
    },[])

    const fetchMyWeatherData = async () => {
        fetchForecast("Santa Fe", 7).then(data => {
            setWeather(data)
            setLoading(false)
        })
        
    }

    const {current, location} = weather
   

    return (
        <View className="flex-1 relative">
            <StatusBar style="light" />
            <Image 
            source={require("../assets/images/bg.jpg")}
            className="absolute h-full w-full"
            blurRadius={10}
            />
            <SafeAreaView className="flex flex-1">
                <View style={{height: "7%"}} className="mx-4 relative z-50">
                    <View className="flex-row justify-end items-center rounded-full" style={{backgroundColor: showSearch ? "rgba(255,255,255,0.2)" : "transparent"}}>
                        {
                            showSearch ? (
                                <TextInput 
                                onChangeText={handleDebounceText}
                                placeholder="Search City"
                                placeholderTextColor={"lightgray"}
                                className="pl-6 h-10 flex-1 text-base text-white"
                            />
                            ) : null
                        }
                        
                         <TouchableOpacity style={{backgroundColor: "rgba(255,255,255,0.3)"}} className="rounded-full p-3 m-1" onPress={()=> setShowSearch(!showSearch)}>
                            <FontAwesome name="search" size={22} />
                         </TouchableOpacity>
                    </View>
                    {
                        locations.length>0 && showSearch ? (
                            <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                                {
                                    locations.map((loc,index)=> {
                                        let showBorder = index+1 != locations.length
                                        let borderClass = showBorder ? "border-b-2 border-b-gray-400" : ""
                                        return (
                                            <TouchableOpacity onPress={()=>handleLocation(loc)} key={index} className={"flex-row items-center border-0 p-3 px-4 mb-1" + borderClass}>
                                                <FontAwesome name="map-pin" size={20} color="gray" />
                                                <Text className="text-block text-lg ml-2">{loc.name}, {loc.country}</Text>
                                            </TouchableOpacity>
                                        )
                                        })
                                }
                            </View>
                        ): null
                    }
                </View>

                {
                    loading ? (
                        <Loading />
                    ) : (
                        <>
                            <View className="mx-4 flex justify-around flex-1 mb-2">
                    <Text className="text-white text-center text-2xl font-bold">
                        {location?.name},
                        <Text className="text-lg font-semibold text-gray-300">
                            {location?.country}
                        </Text>
                    </Text>
                    <View className="flex-row justify-center">
                        <Image className="w-52 h-52" source={weatherImages[current?.condition?.text]} />
                    </View>
                    <View className="space-y-2">
                        <Text className="text-center font-bold text-white text-6xl ml-5">
                            {current?.temp_c}°
                        </Text>
                        <Text className="text-center text-white text-xl tracking-widest ">
                            {current?.condition?.text}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mx-4">
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require("../assets/images/wind.png")} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">
                                {current?.wind_kph}km
                            </Text>
                        </View>
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require("../assets/images/drop.png")} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">
                                {current?.humidity}%
                            </Text>
                        </View>
                        <View className="flex-row space-x-2 items-center">
                            <Image source={require("../assets/images/sun.png")} className="h-6 w-6" />
                            <Text className="text-white font-semibold text-base">
                                6:05 AM
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="mb-2 space-y-3">
                    <View className="flex-row items-center mx-5 space-x-2">
                        <FontAwesome name="calendar" size={22} color="white" />
                        <Text className="text-white text-base">Daily Forecast</Text>
                    </View>
                    <ScrollView horizontal contentContainerStyle={{paddingHorizontal:15}} showsHorizontalScrollIndicator={false}>
                        {
                            weather?.forecast?.forecastday.map((item, index)=> {
                                let date = new Date(item.date)
                                let options = {weekday: "long"}
                                let dayName = date.toLocaleDateString("en-US", options)
                                dayName = dayName.split(",")[0]

                                return (
                                <View key={index} style={{backgroundColor: "rgba(255,255,255,0.15)"}} className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4">
                                    <Image source={weatherImages[item?.day?.condition?.text]} className="h-11 w-11" />
                                    <Text className="text-white">{dayName}</Text>
                                    <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}°</Text>
                                </View>
                                )
                                })
                        }
                       
                    </ScrollView>
                </View>
                        </>
                    )
                }

                
            </SafeAreaView>
        </View>
    )
}

export default HomeScreen