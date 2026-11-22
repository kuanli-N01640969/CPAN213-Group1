import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Button, Pressable, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Abeer added this here - Import fetchMovieDetails to load runtime, genres, and theatrical status
import { fetchMovieDetails } from '../services/tmdbAPI';
// ended here

import movieDetailStyles from '../styling/movieDetailStyles';

export const MovieDetailScreen = ({route, navigation}) => {
    //Retrieve movie obj passed from home screen
    // Abeer added this here - Store passed movie in state so it can be enriched with /movie/{id} details
    const initialMovie = route.params?.movie || null;
    const [movie, setMovie] = useState(initialMovie);
    // ended here

    //Local theater input state
    const [theaterName, setTheaterName] = useState('');
    const [localTheaters, setLocalTheaters] = useState([]);
    //Loading and error state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Abeer added this here - Fetch full movie metadata (/movie/{movie_id}) when screen opens
    useEffect(() => {
        let isMounted = true;

        const loadFullDetails = async () => {
            if (!initialMovie?.id) {
                setMovie(null);
                return;
            }

            try {
                setIsLoading(true);
                setError('');
                const detailedMovie = await fetchMovieDetails(initialMovie.id);
                if (isMounted) {
                    setMovie(detailedMovie);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Unable to load full movie details.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadFullDetails();

        return () => {
            isMounted = false;
        };
    }, [initialMovie]);
    // ended here

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

           Alert.alert(
                'Added to Watchlist',
                `"${movie.title}" has been added to your handleAddToWatchlist.`,
                [
                    {
                        text: 'View Watchlist',
                        onPress: () => navigation.navigate('Watchlist', {addedMovie: movie}),
                    },
                    {text: 'Back to movie detail'},
                ]
            );
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
                Alert.alert('Invalid Input','Please enter a theater name.');
            return;
            }

            //Data format validation
            const theaterFormat = /^[a-zA-Z0-9\s'-]+$/;
            if(!theaterFormat.test(trimmedTheater)){
                Alert.alert('Invalid Format', 'Theater name must be letters or numbers.')
            return;
            }

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
        <SafeAreaView style={movieDetailStyles.container}>
            <ScrollView
                contentContainerStyle={movieDetailStyles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/*Conditional rendering loading, error, empty, success states */}
                {isLoading ? (
                    <View style={movieDetailStyles.loadingContainer}>
                        <ActivityIndicator size="large" color="#871C1C"/>
                        <Text style={movieDetailStyles.messageText}>
                            Loading movie details...
                        </Text>
                    </View>

                ) : (

                    <View style={movieDetailStyles.content}>
                        {error !=='' && (
                            <View>
                                <Text style={movieDetailStyles.errorText}>
                                    Error: {error}
                                </Text>

                                <Button 
                                    title='Dismiss error' 
                                    onPress={() => setError('')}/>
                            </View>
                        )}

                        {/*Empty and success movie data*/}
                        {!movie ? (
                            <Text style={movieDetailStyles.messageText}>
                                No movie selected. Return to Home and select a movie to view details.
                            </Text>       
                        
                    ) : (
                            
                            <View style={movieDetailStyles.movieContainer}>
                                {/* Abeer added this here - Render movie poster image from normalized TMDB posterUrl */}
                                {movie.posterUrl ? (
                                    <Image
                                        source={{ uri: movie.posterUrl }}
                                        style={{ width: 160, height: 240, marginBottom: 12 }}
                                    />
                                ) : null}
                                {/* ended here */}

                                <Text style={movieDetailStyles.movieTitle}>
                                    {movie.title}
                                </Text>

                                <Text style={movieDetailStyles.releaseDate}>
                                    Release Date: {movie.release_date || 'N/A'}
                                </Text>
                                {/* Abeer added this here - Display runtime, theatrical status, and genres from /movie/{id} */}
                                <Text style={movieDetailStyles.infoText}>
                                    Runtime: {movie.runtime ? `${movie.runtime} mins` : 'N/A'}
                                    </Text>
                                <Text style={movieDetailStyles.infoText}>
                                    Status: {movie.status || 'N/A'}
                                    </Text>
                                {movie.genres && movie.genres.length > 0 && (
                                    <Text style={movieDetailStyles.infoText}>
                                        Genres: {movie.genres.join(', ')}
                                    </Text>
                                )}
                                {/* ended here */}

                                <Text style={movieDetailStyles.sectionHeading}>
                                    Synopsis:
                                </Text>

                                <Text style={movieDetailStyles.synopsis}>
                                    {movie.overview || 'No synopsis available'}
                                </Text>
                            
                                {/*Add movie to watchlist and move to planner screen*/}
                                <View style={movieDetailStyles.buttonContainer}>

                                    <Pressable
                                        style={movieDetailStyles.button}
                                        onPress={handleAddToWatchlist}
                                    >
                                        <Text style={movieDetailStyles.buttonText}>
                                            Add to Watchlist
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        style={movieDetailStyles.button}
                                        onPress={() => navigation.navigate('Planner', { movie: movie })}
                                    >
                                        <Text style={movieDetailStyles.buttonText}>
                                            Add to Planner
                                        </Text>
                                    </Pressable>

                                    

                                   
                                    
                                </View>
                            </View>
                        )}
                        
                        {/*Display saved theater list*/} 
                        <View style={movieDetailStyles.theaterContainer}>

                            <Text style={movieDetailStyles.sectionHeading}>
                                My Local Theaters:
                            </Text>

                            {localTheaters.length === 0 ? (

                                <Text style={movieDetailStyles.theaterText}>
                                    No local theaters added yet.
                                </Text>

                            ) : (

                                //Creates text component of theater array 
                                localTheaters.map((theater, index) => (
                                    <Text
                                        key={index}
                                        style={movieDetailStyles.theaterText}
                                    >
                                        • {theater}
                                    </Text>
                                )) 
                            )}

                            {/*Theater input*/}    
                            <Text style={movieDetailStyles.sectionHeading}>
                                Add a Local Theater:
                            </Text>

                            <TextInput
                                style={movieDetailStyles.theaterInput}
                                placeholder="e.g., Carlton Cinema"
                                placeholderTextColor="#999999"
                                value={theaterName}
                                onChangeText={setTheaterName}
                                maxLength={30}
                            />

                            <Pressable
                                style={movieDetailStyles.button}
                                onPress={handleAddTheater}
                            >
                                <Text style={movieDetailStyles.buttonText}>
                                    Add Theater
                                </Text>
                            </Pressable>

                        </View>

                        {/*Page navigation buttons*/}        
                        <View style={movieDetailStyles.navigationContainer}>
                            
                            <Pressable
                                style={movieDetailStyles.navigationButton}
                                onPress={() => navigation.navigate('Watchlist')}
                            >
                                <Text style={movieDetailStyles.buttonText}>
                                    Go to Watchlist
                                </Text>
                            </Pressable>

                            <Pressable
                                style={movieDetailStyles.navigationButton}
                                onPress={() => navigation.navigate('Planner')}
                            >
                                <Text style={movieDetailStyles.buttonText}>
                                    Go to Planner
                                </Text>
                            </Pressable>

                            {navigation.canGoBack() && (
                                <Pressable
                                    style={movieDetailStyles.navigationButton}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Text style={movieDetailStyles.buttonText}>
                                        Go Back
                                    </Text>
                                </Pressable>
                            )}
                            
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};