
import { StyleSheet } from 'react-native';

const homeStyles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#141414',
    },

    content: {
        flex: 1,
        padding: 20,
    },

    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 25,
    },

    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        gap: 10,
    },

    navigationButton: {
        backgroundColor: '#B71C1C',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },

    searchContainer: {
        marginBottom: 25,
    },

    searchInput: {
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 10,
    },

    searchButton: {
        backgroundColor: '#B71C1C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },

    clearButton: {
        alignItems: 'center',
        padding: 8,
    },

    clearText: {
        color: '#BBBBBB',
        fontSize: 14,
    },

    categoryContainer: {
        marginBottom: 20,
    },

    categoryLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    pickerContainer: {
        backgroundColor: '#292929',
        borderRadius: 10,
        overflow: 'hidden',
    },

    picker: {
        color: '#FFFFFF',
    },

    movieCard: {
        backgroundColor: '#252525',
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
    },

    movieTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },

    movieRelease: {
        color: '#BBBBBB',
        fontSize: 14,
    },

    messageText: {
        color: '#BBBBBB',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 25,
    },

    errorText: {
        color: '#FF5252',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },

    loadingContainer: {
        alignItems: 'center',
        marginTop: 30,
    },

});

export default homeStyles;
