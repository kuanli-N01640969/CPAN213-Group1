import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Button, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//========================================
// M2 TODO: Data load from firestore/redux 
//========================================
export const WatchlistScreen = ({route, navigation}) => {
    //List and planner state
    const [watchlist, setWatchlist] = useState([]);
    const [plannedEvents, setPlannedEvents] = useState([]);
    //Loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = ('');

    //Retrieve added movie from detail screen
    useEffect(() =>{
        //Check if movie was passed 
        if(route.params?.addedMovie){
            try{
                setIsLoading(true);
                setError(''); //clear prev errors
                const incoming = route.params.addedMovie; //store passed movie obj

                //Checks for duplication before adding to watchlist
                setWatchlist((prev) => {
                    const exists = prev.some((item) => item.id === incoming.id);
                    return exists ? prev : [...prev, incoming];
                })
            } catch(error){
                Alert.alert('Error','Failed to update your watchlist.')
            } finally {
                setIsLoading(false);
            }
        }
    }, [route.params?.addedMovie]); //effect runs again if addedMovie changes
}