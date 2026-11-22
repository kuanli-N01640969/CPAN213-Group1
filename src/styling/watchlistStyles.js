
import { StyleSheet } from 'react-native';

const watchlistStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#141414',
    },

    content: {
        flex: 1,
        padding: 20,
    },

    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },

    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },

    movieList: {
        flexGrow: 0,
        maxHeight: 350,
        marginBottom: 25,
    },

    movieCard: {
        backgroundColor: '#252525',
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
    },

    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },

    releaseDate: {
        fontSize: 14,
        color: '#BBBBBB',
        marginBottom: 15,
    },

    buttonContainer: {
        gap: 10,
    },

    button: {
        backgroundColor: '#B71C1C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    removeButton: {
        backgroundColor: '#444444',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },

    plannerContainer: {
        backgroundColor: '#252525',
        padding: 20,
        borderRadius: 12,
        marginBottom: 25,
    },

    planCard: {
        backgroundColor: '#353535',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },

    planTitle: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    planText: {
        color: '#BBBBBB',
        fontSize: 14,
        marginBottom: 5,
    },

    navigationContainer: {
        gap: 10,
        marginBottom: 20,
    },

    navigationButton: {
        backgroundColor: '#353535',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    messageText: {
        color: '#BBBBBB',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },

    errorText: {
        color: '#FF5252',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },

    loadingContainer: {
        alignItems: 'center',
        marginTop: 30,
    },

});

export default watchlistStyles;
