import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { enableScreens } from 'react-native-screens';
import HomeScreen from "./screens/HomeScreen";
import FavouritesScreen from "./screens/FavouritesScreen";
import { useEffect } from 'react';
import { initDB } from './screens/HomeScreen';


import { StyleSheet, Text, View, TextInput, FlatList, Image, ScrollView} from 'react-native';


const Drawer =createDrawerNavigator();


export default function App() {
 
  return (
   
    
    <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Favourites" component={FavouritesScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    
    
    );
  }
  enableScreens();

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 100,
    
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  resultText: {
    marginTop: 20,
  },
  picker: {
    width:'100%',
    borderWidth: 1,
    height: '30%',
    borderColor: 'gary',
    padding: 1,

  },scrollView: {
    flex: 1, 
    backgroundColor: '#fff',
  },
  
});
