
import { StyleSheet } from 'react-native';

const plannerStyles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#141414',
    },

    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
        color: '#FFFFFF',
    },

    movieContainer: {
        backgroundColor: '#252525',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        gap: 15
    },

    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    button: {
        backgroundColor: '#B71C1C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },

    sectionHeading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#FFFFFF',
    },

    planCard: {
        backgroundColor: '#252525',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },

    dateText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 10,
    },

});

export default plannerStyles;
