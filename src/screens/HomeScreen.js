import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Pressable, ActivityIndicator, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

export const HomeScreen = ({navigation}) => {
    //Local state for form and filter
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('now_playing');
    //Local state for data, loading, and error
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
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
        } catch (error){
            
        }
    };
}