import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {NavigationContainer} from "@react-navigation/native"
import HomeScreen from "../screens/HomeScreen"
import { LogBox } from "react-native"

const Stack = createNativeStackNavigator()
LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state"
])

const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
            </Stack.Navigator>
            
        </NavigationContainer>
    )
}

export default AppNavigation