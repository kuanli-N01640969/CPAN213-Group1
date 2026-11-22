import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, Pressable, Button, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import watchlistStyles from '../styling/watchlistStyles';

//========================================
// M2 TODO: Data load from firestore/redux 
//========================================
export const WatchlistScreen = ({route, navigation}) => {
    //Temporary List and planner state until firestore implementation
    const [watchlist, setWatchlist] = useState([]);
    const [plannedEvents, setPlannedEvents] = useState([]);
    //Loading and error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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
        <SafeAreaView style={watchlistStyles.container}>
            <ScrollView
                contentContainerStyle={{ padding: 20 }}
                keyboardShouldPersistTaps="handled"
            >

                <Text style={watchlistStyles.heading}>
                    Saved Watchlist ({watchlist.length})
                </Text>

                {/*Conditional rendering loading, error, empty, success states */}
                {isLoading ? (
                    <View style={watchlistStyles.loadingContainer}>
                        <ActivityIndicator
                            size="large"
                            color="#B71C1C"
                        />
                        <Text style={watchlistStyles.messageText}>
                            Updating watchlist...
                        </Text>
                    </View>
               
                ) : (

                    <View>
                        

                        {error !== '' && (
                            <View>
                                <Text style={watchlistStyles.errorText}>
                                    Error: {error}
                                </Text>

                                <Button
                                    title="Dismiss Error"
                                    onPress={() => setError('')}
                                />
                            </View>
                    )}

                        {/*Display User Watchlist*/}
                        
                         <FlatList
                            style={watchlistStyles.movieList}
                            data={watchlist}
                            keyExtractor={(item) => item.id.toString()} //keeps track array and convert id to string
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <Text style={watchlistStyles.messageText}>
                                    Your watchlist is empty.
                                    Browse Home to add movies.
                                </Text>
                            } 
                            //Extracts current movie from flatlist
                            renderItem={({item}) => (
                                <Pressable
                                    style={watchlistStyles.movieCard}
                                    onPress={()=>navigation.navigate('MovieDetail', {movie: item})}> {/*Passing selected movie from detail screen*/}
                                       
                                        {/*Movie info*/}
                                        <Text style={watchlistStyles.movieTitle}>
                                            {item.title}
                                        </Text>
                                        <Text style={watchlistStyles.releaseDate}>
                                            Release: {item.release_date || 'N/A'}
                                        </Text>
                                        
                                        <View style={watchlistStyles.buttonContainer}>

                                            {/*Send selected movie to Planner screen*/}
                                            <Pressable
                                                style={watchlistStyles.button}
                                                onPress={() => navigation.navigate('Planner', {movie: item})}
                                            >
                                                <Text style={watchlistStyles.buttonText}>
                                                    Plan Movie Night
                                                </Text>
                                            </Pressable>

                                            {/*Remove movie*/}

                                            <Pressable
                                                style={watchlistStyles.removeButton}
                                                onPress={() => confirmRemove(
                                                    item.id,
                                                    item.title
                                                )}
                                            >

                                                <Text style={watchlistStyles.buttonText}>
                                                    Remove
                                                </Text>
                                            </Pressable>

                                        </View>
                                    
                                    </Pressable>
                            )}
                        />
                           
                        {/*Display scheduled movie nights*/}
                        <View style={watchlistStyles.plannerContainer}>

                            <Text style={watchlistStyles.sectionHeading}>
                                Scheduled Movie Nights ({plannedEvents.length})
                            </Text>

                            {plannedEvents.length === 0 ? (

                                <Text style={watchlistStyles.messageText}>
                                    No movie nights scheduled yet.
                                </Text>

                            ) : (

                                //Creates individual UI for each movie plan
                                plannedEvents.map((plan) => (
                                    //Display movie plan info 
                                     <View
                                        key={plan.id}
                                        style={watchlistStyles.planCard}
                                    >

                                        <Text style={watchlistStyles.planTitle}>
                                            {plan.eventTitle}
                                        </Text>

                                        <Text style={watchlistStyles.planText}>
                                            {plan.date} | {plan.venue} | {plan.attendees} attendee(s)
                                        </Text>

                                        {Boolean(plan.notes) && (
                                            <Text style={watchlistStyles.planText}>
                                                Notes: {plan.notes}
                                            </Text>
                                        )}

                                    </View>
                                ))
                            )} 
                        </View>
                    </View>   
                )}

                {/*Page navigation buttons*/}
                <View style={watchlistStyles.navigationContainer}>

                    <Pressable
                        style={watchlistStyles.navigationButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={watchlistStyles.buttonText}>
                            Go to Home
                        </Text>
                    </Pressable>

                    <Pressable
                        style={watchlistStyles.navigationButton}
                        onPress={() => navigation.navigate('MovieDetail')}
                    >
                        <Text style={watchlistStyles.buttonText}>
                            Go to Movie Detail
                        </Text>
                    </Pressable>

                    <Pressable
                        style={watchlistStyles.navigationButton}
                        onPress={() => navigation.navigate('Planner')}
                    >
                        <Text style={watchlistStyles.buttonText}>
                            Go to Planner
                        </Text>
                    </Pressable>

                     {navigation.canGoBack() && (
                        <Pressable
                            style={watchlistStyles.navigationButton}
                            onPress={() => navigation.goBack()}
                    >
                        <Text style={watchlistStyles.buttonText}>
                            Go Back
                        </Text>
                    </Pressable>
                     )}
                </View>

            </ScrollView>
        </SafeAreaView>
    )
};