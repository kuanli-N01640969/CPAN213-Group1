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
    }, [route.params?.addedMovie]); //safe guard, effect runs again if addedMovie changes

    //Receives validated newPlan from PlannerScreen, keeps new movie plans alive without cloud database
    useEffect(() => {
        //Check if movie plan was passed
        if(route.params?.newPlan){
            try{
                setIsLoading(true);
                setError(''); //clear prev error
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
    }, [route.params?.newPlan]) //safe guard, effect runs again if newPlan changes

    //Remove movie from watchlist with confirmation alert
    const confirmRemove = (movieID, movieTitle) => {
        //Confirmation alert msg and btn
        Alert.alert(
            'Remove Movie',
            `Remove "${movieTitle}" from your watchlist?`,
            [
                {text: 'Cancel', style:'cancel'}, //Abort removal action
                {
                    text: 'Remove',
                    onPress: () => {
                        //Update watchlist state
                        try{
                            setError('');
                            setWatchlist((prev) => prev.filter((item) => item.id !== movieID)) //Create new array without removed item
                        } catch(error){
                            Alert.alert('Error', 'Unable to remove movie from watchlist.')
                        }
                    },   
                },
            ]
        );
    };

    return(
        
    )
}