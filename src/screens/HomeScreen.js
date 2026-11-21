import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
// Abeer added this here - Import TMDB API service functions for category feeds and title search
import { useEffect, useCallback, Image } from 'react-native';
import { fetchMoviesByCategory, searchMovies } from '../services/tmdbAPI';
// ended here

export const HomeScreen = ({navigation}) => {
    //Local state for form and filter
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('now_playing');
    //Local state for data, loading, and error
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    //=========
    // API
    //=========

    // Abeer added this here - Fetch live movies by category (/movie/now_playing, /upcoming, /popular) on mount and Picker change
    const loadCategoryMovies = useCallback(async (selectedCategory) => {
        try {
            setIsLoading(true);
            setError(null);
            const { movies: fetchedMovies } = await fetchMoviesByCategory(selectedCategory);
            setMovies(fetchedMovies);
        } catch (err) {
            setError(err.message || 'Unable to load movies from TMDB.');
            setMovies([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategoryMovies(category);
    }, [category, loadCategoryMovies]);
    // ended here

    //Search input validation
    const handleSearch = async() => {
        try{
            const trimmedQuery = searchQuery.trim(); //remove white spaces
            //Blank entry
            if (trimmedQuery === ''){
                Alert.alert('Invalid input', 'Please enter a movie title.')
                return;
            }

            //Data format validation
            const validTextPattern = /[a-zA-Z0-9]/;
            if (!validTextPattern.test(trimmedQuery)){
                Alert.alert('Invalid data format.', 'Please enter letters or numbers.')
                return;
            }

            //Start loading and clear previous error
            setIsLoading(true);
            setError(null);

            // Abeer added this here - Execute live TMDB /search/movie request and update FlatList data
            const { movies: searchResults } = await searchMovies(trimmedQuery);
            setMovies(searchResults);
            // ended here
        } catch (error){
            // Abeer added this here - Surface API error message while keeping existing error alert
            setError(error.message || 'Unable to retrieve movie, please try again.');
            // ended here
            Alert.alert('Search Error', 'Unable to retrieve movie, please try again.')
        } finally{
            setIsLoading(false);
        }
    };

    //Clear search and reset error state
    const handleResetSearch = () => {
        setSearchQuery('');
        setError(null);
        // Abeer added this here - Reload active category feed when search is cleared
        loadCategoryMovies(category);
        // ended here
    };

    //Movie selction handler to detail page
    const onMoviePressed = (selectedMovie) => {
        navigation.navigate('MovieDetail', {movie: selectedMovie});
    };

    return(
        <SafeAreaView>
            <View>
                <Text>Discover Movies</Text>

                {/*Navigation options and GoBack*/}
                <View>
                    <Button
                        title='Go to Watchlist'
                        onPress={() => navigation.navigate('Watchlist')}
                    />
                    <Button
                        title='Go to Planner'
                        onPress={() => navigation.navigate('Planner')}
                    />
                    {/*Check if there's previous page to return then render*/}
                    {navigation.canGoBack() && (
                        <Button title='Go Back' onPress={() => navigation.goBack()}/>
                    )}
                </View>

                {/*Search bar validation and reset*/}
                <View>
                    <TextInput
                        placeholder='Search by movie title...'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        maxLength={60}
                    />
                    {/* Abeer added this here - Invoke handleSearch on button press so search executes */}
                    <Button
                        title='Search'
                        onPress={handleSearch}
                    />
                    {/* ended here */}
                    {/*Check if there's input to reset then render*/}
                    {searchQuery.length > 0 && (
                        <Button title='Clear Search' onPress={handleResetSearch}/>
                    )}
                </View>

                {/*Category dropdown filter*/}
                <View>
                    <Text>Browse Category:</Text>
                    <Picker
                        selectedValue={category}
                        onValueChange={(itemValue) => {
                            setCategory(itemValue);
                            setError(null);
                        }}
                        //=============
                        // API endpoint
                        //=============
                    >
                        <Picker.Item label ="Now Playing in Theaters" value="now_playing"/>
                        <Picker.Item label ="Upcoming Releases" value="upcoming"/>
                        <Picker.Item label ="Popular Movies" value="popular"/>
                    </Picker>
                </View>
                
                {/*Conditional rendering for loading, eorror, empty, and success*/}
                {isLoading ? (
                    <View>
                        <ActivityIndicator size="large"/>
                        <Text>Loading movies...</Text>
                    </View>
                ) : error ? (
                    <View>
                        <Text>Error: {error}</Text>
                        <Button title='Dismiss error' onPress={() => setError(null)}/>
                    </View>
                ) : (
                    <FlatList
                        data={movies}
                        // Abeer added this here - Fix toString() casing so FlatList renders API items
                        keyExtractor={(item) => item.id.toString()}
                        // ended here
                        ListEmptyComponent={
                            <Text>No movies availble. Search for a title or load a category.</Text>
                        }
                        renderItem={({item}) => (
                            <Pressable onPress={() => onMoviePressed(item)}>
                                <View>
                                    {/* Abeer added this here - Render movie poster from TMDB */}
                                    {item.posterUrl ? (
                                        <Image
                                            source={{ uri: item.posterUrl }}
                                            style={{ width: 60, height: 90 }}
                                        />
                                    ) : null}
                                    {/* ended here */}
                                    <Text>{item.title}</Text>
                                    <Text>Release: {item.release_date}</Text>
                                </View>
                            </Pressable>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};