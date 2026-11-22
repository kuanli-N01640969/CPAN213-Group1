
import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

import plannerStyles from '../styling/plannerStyles';

export const PlannerScreen = ({ route, navigation }) => {

    // Movie passed from Movie Detail screen
    const movie = route.params?.movie;

    // Planner states
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [plannedMovies, setPlannedMovies] = useState([]);

    // Format date for display
    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    // Save movie to planner
    const addToPlanner = () => {

        if (!movie) {
            Alert.alert('Error', 'Please select a movie first.');
            return;
        }

        const newPlan = {
            id: Date.now().toString(),
            movieId: movie.id,
            title: movie.title,
            date: formatDate(selectedDate)
        };

        setPlannedMovies((prev) => [...prev, newPlan]);

        Alert.alert('Success', 'Movie added to planner!');
    };

    return (
        <SafeAreaView style={plannerStyles.container}>

            <Text style={plannerStyles.heading}>
                Movie Planner
            </Text>

            {/* Selected movie */}
            {movie && (
                <View style={plannerStyles.movieContainer}>
                    <Text style={plannerStyles.movieTitle}>
                        {movie.title}
                    </Text>

                    <Text style={plannerStyles.dateText}>
                        Selected Date: {formatDate(selectedDate)}
                    </Text>

                    <Pressable
                        style={plannerStyles.button}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={plannerStyles.buttonText}>
                            Select Date
                        </Text>
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            minimumDate={new Date()}
                            onChange={(event, date) => {
                                setShowDatePicker(false);

                                if (date) {
                                    setSelectedDate(date);
                                }
                            }}
                        />
                    )}

                    <Pressable
                        style={plannerStyles.button}
                        onPress={addToPlanner}
                    >
                        <Text style={plannerStyles.buttonText}>
                            Save to Planner
                        </Text>
                    </Pressable>
                </View>
            )}

            {/* Planned movies */}
            <Text style={plannerStyles.sectionHeading}>
                Upcoming Movies
            </Text>

            <FlatList
                data={plannedMovies}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={plannerStyles.dateText}>
                        No movies planned yet.
                    </Text>
                }
                renderItem={({ item }) => (
                    <View style={plannerStyles.planCard}>
                        <Text style={plannerStyles.movieTitle}>
                            {item.title}
                        </Text>

                        <Text style={plannerStyles.dateText}>
                            Date: {item.date}
                        </Text>
                    </View>
                )}
            />

        </SafeAreaView>
    );
};
