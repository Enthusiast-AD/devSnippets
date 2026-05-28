import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout(){
    return (
        <Tabs screenOptions={
        ({route})=>({
            tabBarActiveTintColor:'#A3FF3F',
            tabBarStyle:{
              backgroundColor:'black',
              height:55,
              borderBlockColor:'black'
            },
            tabBarIcon:({focused,color,size})=>{
                const icon = route.name === "index"
                ? focused ? "home" : "home-outline"
                : route.name === "favourites"
                ? focused ? "heart" : "heart-outline"
                : route.name === "files"
                ? focused ? "folder" : "folder-outline"
                : focused ? "settings" : "settings-outline"

                return <Ionicons name={icon} size={size} color={color}/>
            },
            headerShown:false,
            // animation: 'fade'
        })
    }
    >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="favourites" options={{ title: "Favourites" }} />
      <Tabs.Screen name="files" options={{ title: "Files" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
    )
}