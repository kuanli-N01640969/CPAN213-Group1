import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Button, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//========================================
// M2 TODO: Data load from firestore/redux 
//========================================
export const WatchlistScreen = ({route, navigation}) => {
    //Temporary List and planner state until firestore implementation
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

    //Receives validated newPlan from PlannerScreen, keeps new movie plans alive without cloud database
    useEffect(() => {
        //Check if movie plan was passed
        if(route.params?.newPlan){
            try{
                setIsLoading(true);
                setError('');
                const incomingPlan = route.params.newPlan; //store plan obj

                //Check for duplication before adding newPlan
                setPlannedEvents((prev) => {
                    const exists = prev.some((plan) => plan.id === incomingPlan.id);
                    return exists ? prev : [incomingPlan, ...prev]
                })
            } catch(error){
                Alert.alert('','');
            } finally {
                setIsLoading(false);
            }
        }
    })

}