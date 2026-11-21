import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const MovieDetailScreen = ({route, navigation}) => {
    //Retrieve movie obj passed from home screen
    const movie = route.params?.movvie || null;

    //Local theater input state
    const [theaterName, setTheaterName] = useState('');
    const [localTheaters, setLocalTheaters] = useState([]);
    //Loading and error state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    
}