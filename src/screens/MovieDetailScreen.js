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
    }

}