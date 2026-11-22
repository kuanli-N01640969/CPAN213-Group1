import React from 'react';
import { Button, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { MovieDetailScreen } from './src/screens/MovieDetailScreen';
import { WatchlistScreen } from './src/screens/WatchlistScreen';
import { PlannerScreen } from './src/screens/PlannerScreen';

//Stack enables screen navigation
const Stack = createNativeStackNavigator();

export default function App() {
  //Global header configuration
  const sharedHeaderOptions = {
    headerStyle: { backgroundColor: '#B71C1C'},
    headerTintColor: '#ffffff',
    headerTitleAlign: 'center',
    headerTitleStyle: { fontWeight: 'bold'},
  }
    
  return (
      <SafeAreaProvider>
        <NavigationContainer>
          {/*App starting page*/}
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Group screenOptions={sharedHeaderOptions}>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{title: 'Cinema Geek'}}
              />
              <Stack.Screen
                name="MovieDetail"
                component={MovieDetailScreen}
                options={{title: 'Movie Details'}}
              />
              <Stack.Screen
                name="Watchlist"
                component={WatchlistScreen}
                options={{title: 'My Watchlist'}}
              />
              <Stack.Screen
                name="Planner"
                component={PlannerScreen}
                options={{title: 'Movie Planner'}}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
  );
}


