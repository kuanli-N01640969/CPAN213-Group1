import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

import homeStyles from '../styling/homeStyles'; 

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
            setError('');
        } catch (error){
             Alert.alert('Search Error', 'Unable to retrieve movie, please try again.')
        } finally{
            setIsLoading(false);
        }
    };

    //Clear search and reset error state
    const handleResetSearch = () => {
        setSearchQuery('');
        setError('');
    };

    //Movie selction handler to detail page
    const onMoviePressed = (selectedMovie) => {
        navigation.navigate('MovieDetail', {movie: selectedMovie});
    };

    return(
        <SafeAreaView style={homeStyles.container}>
            <View style={homeStyles.content}>

                <Text style={homeStyles.heading}>
                    Discover Movies
                </Text>

                {/*Navigation options and GoBack*/}
                <View style={homeStyles.navigationContainer}>
                    
                    <Pressable
                        style={homeStyles.navigationButton}
                        onPress={() => navigation.navigate('Watchlist')}
                    >
                        <Text style={homeStyles.buttonText}>
                            Go to Watchlist
                        </Text>
                    </Pressable>

                    <Pressable
                        style={homeStyles.navigationButton}
                        onPress={() => navigation.navigate('Planner')}
                    >
                        <Text style={homeStyles.buttonText}>
                            Go to Planner
                        </Text>
                    </Pressable>

                    {/*Check if there's previous page to return then render*/}
                    {navigation.canGoBack() && (
                        <Pressable
                            style={homeStyles.navigationButton} 
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={homeStyles.buttonText}>
                                Go Back
                            </Text>
                        </Pressable>
                    )}
                </View>

                {/*Search bar validation and reset*/}
                <View style={homeStyles.searchContainer}>

                    <TextInput
                        style={homeStyles.searchInput}
                        placeholder='Search by movie title...'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        maxLength={60}
                    />
                    <Pressable
                        style={homeStyles.searchButton}
                        onPress={handleSearch}
                    >
                        <Text style={homeStyles.buttonText}>
                            Search
                        </Text>
                    </Pressable>

                    {/*Check if there's input to reset then render*/}
                    {searchQuery.length > 0 && (
                        <Pressable
                            style={homeStyles.clearButton} 
                            onPress={handleResetSearch}
                        >
                            <Text style={homeStyles.clearText}>
                                Clear Search
                            </Text>                            
                        </Pressable>
                    )}

                </View>

                {/*Category dropdown filter*/}
                <View style={homeStyles.categoryContainer}>

                    <Text style={homeStyles.categoryLabel}>
                        Browse Category:
                    </Text>
                    
                    <View style={homeStyles.pickerContainer}>

                        <Picker
                            style={homeStyles.picker}
                            dropdownIconColor="#FFFFFF"
                            selectedValue={category}
                            onValueChange={(itemValue) => {
                                setCategory(itemValue);
                                setError('');
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
                </View>
                
                {/*Conditional rendering for loading, error, empty, and success*/}
                {isLoading ? (
                    <View style={homeStyles.loadingContainer}>
                        <ActivityIndicator size="large" color="871C1C1"/>
                        <Text style={homeStyles.messageText}>Loading movies...</Text>
                    </View>
                ) : error ? (
                    <View>
                        <Text style={homeStyles.errorText}>Error: {error}</Text>
                        <Button title='Dismiss error' onPress={() => setError('')}/>
                    </View>
                ) : (
                    <FlatList
                        data={movies}
                        keyExtractor={(item) => item.id.toString()}
                        keyboardShouldPersistTaps="handled" 
                        ListEmptyComponent={
                            <Text style={homeStyles.messageText}>
                                No movies available. Search for a title or load a category.
                            </Text>
                        }
                        renderItem={({item}) => (
                            <Pressable
                                style={homeStyles.movieCard}
                                onPress={() => onMoviePressed(item)}
                            >
                                <Text style={homeStyles.movieTitle}>
                                    {item.title}
                                </Text>

                                <Text style={homeStyles.movieRelease}>
                                    Release: {item.release_date}
                                </Text>
                            </Pressable>
                        )}
                    />
                )}

            </View>
        </SafeAreaView>
    );
};