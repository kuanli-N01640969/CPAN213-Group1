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
        <SafeAreaView>
            <View>
                <Text>Saved Watchlist ({watchlist.length})</Text>

                {/*Conditional rendering loading, error, empty, success states */}
                {isLoading ? (
                    <View>
                        <ActivityIndicator size="large"/>
                        <Text>Updating watchlist...</Text>
                    </View>
                ) : (
                    <View>
                        {error !== '' && (
                            <View>
                                <Text>Error: {error}</Text>
                                <Button title='Dismiss error' onPress={()=> setError('')}/>
                            </View>
                        )}

                        {/*Display User Watchlist*/}
                        <FlatList
                            data={watchlist}
                            keyExtractor={(item) => item.id.toString()} //keeps track array and convert id to string
                            ListEmptyComponent={
                                <Text>Your watchlist is empty, browse home to add movies.</Text>
                            } 
                            //Extracts current movie from flatlist
                            renderItem={({item}) => (
                                <Pressable onPress={()=>navigation.navigate('MovieDetail', {movie: item})}> {/*Passing selected movie from detail screen*/}
                                    <View>
                                        {/*Movie info*/}
                                        <Text>{item.title}</Text>
                                        <Text>Release: {item.release_date || 'N/A'}</Text>
                                        
                                        {/*Send selected movie to Planner screen*/}
                                        <Button
                                            title='Plan Movie Night'
                                            onPress={() => navigation.navigate('Planner', {movie: item})}
                                        />

                                        {/*Remove movie*/}
                                        <Button
                                            title='Remove'
                                            onPress={() => confirmRemove(item.id, item.title)}
                                        />
                                    </View>
                                </Pressable>
                            )}
                        />
                        
                        {/*Display scheduled movie nights*/}
                        <View>
                            <Text>Scheduled Movie Nights ({plannedEvents.length})</Text>
                            
                            {plannedEvents.length === 0 ? (
                                <Text>No movie nights scheduled yet.</Text>
                            ) : (
                                //Creates individual UI for each movie plan
                                plannedEvents.map((plan) => (
                                    //Display movie plan info 
                                    <View key={plan.id}>
                                        <Text>{plan.eventTitle}</Text>
                                        <Text>
                                            {plan.date} | {plan.venue} | {plan.attendees} attendee(s)
                                        </Text>
                                        {plan.notes !== '' && <Text>Notes: {plan.notes}</Text>}
                                    </View>
                                ))
                            )} 
                        </View>
                    </View>   
                )}

                {/*Page navigation buttons*/}  
                <View>
                    <Button title='Go to Home' onPress={() => navigation.navigate('Home')}/>
                    <Button title='Go to Movie Detail' onPress={() => navigation.navigate('MovieDetail')}/>
                    <Button title='Go to Planner' onPress={() => navigation.navigate('Planner')}/>
                    <Button title='Go back' onPress={() => navigation.goBack()}/>
                </View>    
            </View>
        </SafeAreaView>
    );
};