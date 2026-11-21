import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

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
            const trimmedQuery = searchQuery.trim(); //remove empty spaces
            //Blank entry
            if (trimmedQuery === ''){
                Alert.alert('Invalid input', 'Please enter a movie title.')
                return;
            }

            //Data format
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
                    <Button
                        title='Search'
                        onPress={() => {handleSearch}}
                    />
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
                            setError('');
                        }}
                        
                        //=============
                        // API endpoint
                        //=============
                    >
                        <Picker.item label ="Now Playing in Theaters" value="now_playing"/>
                        <Picker.item label ="Upcoming Releases" value="upcoming"/>
                        <Picker.item label ="Popular Movies" value="popular"/>    
                    </Picker>
                </View>
                
                {/*Conditional rendering for loading, eorror, empty, and success*/}
                {isLoading ? (
                    <View>
                        <ActivityIndicator size="large"/>
                        <Text>Loading movies...</Text>
                    </View>
                ) : error !== '' ? (
                    <View>
                        <Text>Error: {error}</Text>
                        <Button title='Dismiss error' onPress={() => setError('')}/>
                    </View>
                ) : (
                    <FlatList
                        data={movies}
                        keyExtractor={(item) => item.id.tostring()} 
                        ListEmptyComponent={
                            <Text>No movies availble. Search for a title or load a category.</Text>
                        }
                        renderItem={({item}) => (
                            <Pressable onPress={() => onMoviePressed(item)}>
                                <View>
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