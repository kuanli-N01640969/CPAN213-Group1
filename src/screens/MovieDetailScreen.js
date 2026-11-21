import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const MovieDetailScreen = ({route, navigation}) => {
    //Retrieve movie obj passed from home screen
    const movie = route.params?.movie || null;

    //Local theater input state
    const [theaterName, setTheaterName] = useState('');
    const [localTheaters, setLocalTheaters] = useState([]);
    //Loading and error state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    //=====================================
    //M2 TODO: Connect to redux & firestore 
    //=====================================
    //Pass movie to Watchlist Screen 
    const handleAddToWatchlist = () => {
        try{
            setIsLoading(true);
            setError(''); //clear all previous errors

            if(!movie){
                Alert.alert('Invalid movie','No movie selected, please choose a movie from home screen.')
                return;
            }

            Alert.alert('Added to Watchlist', `"${movie.title}" has been added to your handleAddToWatchlist.`,
            [
                {
                    text: 'View Watchlist',
                    onPress: () => navigation.navigate('Watchlist', {addedMovie: movie}),
                },
                {text: 'Back to movie detail'},
            ]    
            )
        } catch(error){
            Alert.alert('Error', 'Could not add movie to your watchlist');
        } finally{
            setIsLoading(false); 
        }
    };

    //Local theater input validation
    const handleAddTheater = () => {
       try{
            setError('');
            const trimmedTheater = theaterName.trim(); //remove white spaces
            
            //Blank entry
            if(trimmedTheater === ''){
                Alert.alert('Invalid Input','Please enter a theater name.')
            }
            return;

            //Data format validation
            const theaterFormat = /^[a-zA-Z0-9\s'-]$/;
            if(!theaterFormat.test(trimmedTheater)){
                Alert.alert('Invalid Format', 'Theater name must be letters or numbers.')
            };
            return;

            //Duplication check
            const alreadyExists = localTheaters.some((theater) => t.toLowerCase === trimmedTheater.toLowerCase());
            if(alreadyExists){
                Alert.alert('Duplicate Entry', `"${trimmedTheater}" is already in your list!`);
                return;
            }

            //Successful validation, save theater to list
            setLocalTheaters([...localTheaters, trimmedTheater]); //add theater to array
            setTheaterName(''); //clear input
            Alert.alert('Theater Added', `"${trimmedTheater}" was added to your local theaters.`)
       } catch(error){
            Alert.alert('Error','Unable to add theater to list, please try again.')
       } 
    };

    return(
        <SafeAreaView>
            <ScrollView>
                {/*Conditional rendering loading, error, empty, success states */}
                {isLoading ? (
                    <View>
                        <ActivityIndicator size="large"/>
                        <Text>Loading movie details...</Text>
                    </View>
                ) : (
                    <View>
                        {error !=='' && (
                            <View>
                                <Text>Error: {error}</Text>
                                <Button title='Dismiss error' onPress={() => setError('')}/>
                            </View>
                        )}
                    </View>

                    //Empty and success movie data
                    {!movie ? (
                        <Text>No movie selected. Return to Home and select a movie to view details.</Text>       
                    ) : (
                        <View>
                            <Text>{movie.title}</Text>
                            <Text>Release Date: {movie.release_date || 'N/A'}</Text>
                            <Text>Synopsis:</Text>
                            <Text>{movie.overview || 'No synopsis available'}</Text>
                        </View>
                    )}

                )}
            </ScrollView>
        </SafeAreaView>
    )
}