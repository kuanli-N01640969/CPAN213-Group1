import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Button, ActivityIndicator, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Abeer added this here - Import fetchMovieDetails to load runtime, genres, and theatrical status
import { fetchMovieDetails } from '../services/tmdbAPI';
// ended here

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

            Alert.alert('Added to Watchlist', `"${movie.title}" has been added to your handleAddToWatchlist.`,
            [
                {
                    text: 'View Watchlist',
                    onPress: () => navigation.navigate('Watchlist', {addedMovie: movie}), //move to watchlist screen
                },
                {text: 'Back to movie detail'}, //remain in movie detail screen 
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

                        {/*Empty and success movie data*/}
                        {!movie ? (
                            <Text>No movie selected. Return to Home and select a movie to view details.</Text>
                        ) : (
                            <View>
                                {/* Abeer added this here - Render movie poster image from normalized TMDB posterUrl */}
                                {movie.posterUrl ? (
                                    <Image
                                        source={{ uri: movie.posterUrl }}
                                        style={{ width: 160, height: 240, marginBottom: 12 }}
                                    />
                                ) : null}
                                {/* ended here */}
                                <Text>{movie.title}</Text>
                                <Text>Release Date: {movie.release_date || 'N/A'}</Text>
                                {/* Abeer added this here - Display runtime, theatrical status, and genres from /movie/{id} */}
                                <Text>Runtime: {movie.runtime ? `${movie.runtime} mins` : 'N/A'}</Text>
                                <Text>Status: {movie.status || 'N/A'}</Text>
                                {movie.genres && movie.genres.length > 0 && (
                                    <Text>Genres: {movie.genres.join(', ')}</Text>
                                )}
                                {/* ended here */}
                                <Text>Synopsis:</Text>
                                <Text>{movie.overview || 'No synopsis available'}</Text>
                            
                                {/*Add movie to watchlist and move to planner screen*/}
                                <View>
                                    <Button title='Add to Watchlist' onPress={handleAddToWatchlist}/>
                                    <Button
                                        title="Plan Movie Night"
                                        onPress={() => navigation.navigate('Planner', {movie: movie})}
                                    />
                                </View>
                            </View>
                        )}
                        
                        {/*Display saved theater list*/}
                        <View>
                            <Text>My Local Theaters:</Text>
                            {localTheaters.length === 0 ? (
                                <Text>No local theaters added yet.</Text>
                            ) : (
                                //Creates text component of theater array
                                localTheaters.map((theater, index) => (
                                    <Text key={index}>• {theater}</Text>
                                )) 
                            )}

                            {/*Theater input*/}
                            <Text>Add a Local Theater:</Text>
                            <TextInput
                                placeholder="e.g., Carlton Cinema"
                                value={theaterName}
                                onChangeText={setTheaterName}
                                maxLength={30}
                            />
                            <Button title='Add Theater' onPress={handleAddTheater}/>
                        </View>

                        {/*Page navigation buttons*/}
                        <View>
                            <Button title='Go to Home' onPress={() => navigation.navigate('Home')}/>
                            <Button title='Go to Watchlist' onPress={() => navigation.navigate('Watchlist')}/>
                            <Button title='Go to Planner' onPress={() => navigation.navigate('Planner')}/>
                            <Button title='Go back' onPress={() => navigation.goBack()}/>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};