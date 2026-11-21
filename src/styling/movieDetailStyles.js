
import { StyleSheet } from 'react-native';

const movieDetailStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#141414',
    },

    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },

    content: {
        flex: 1,
    },

    movieContainer: {
        backgroundColor: '#252525',
        padding: 20,
        borderRadius: 12,
        marginBottom: 25,
    },

    movieTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
    },

    releaseDate: {
        fontSize: 15,
        color: '#BBBBBB',
        marginBottom: 20,
    },

    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
    },

    synopsis: {
        fontSize: 16,
        color: '#DDDDDD',
        lineHeight: 24,
        marginBottom: 20,
    },

    buttonContainer: {
        gap: 10,
        marginTop: 10,
    },

    button: {
        backgroundColor: '#B71C1C',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    theaterContainer: {
        backgroundColor: '#252525',
        padding: 20,
        borderRadius: 12,
        marginBottom: 25,
    },

    theaterText: {
        fontSize: 16,
        color: '#DDDDDD',
        marginBottom: 10,
    },

    theaterInput: {
        backgroundColor: '#353535',
        color: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 15,
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
        marginTop: 40,
    },

});

export default movieDetailStyles;
