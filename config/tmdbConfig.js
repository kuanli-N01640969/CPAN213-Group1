// Read Expo public environment variables
const TMDB_BASE_URL =
  process.env.EXPO_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Base URL used to construct full poster image URLs from TMDB's poster_path
const TMDB_IMAGE_BASE_URL =
  process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

// TMDB API key loaded from .env
const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;

// Throws a clear error early if the API key is missing or still set to the placeholder value
export function assertTmdbConfig() {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'replace_with_your_tmdb_api_key') {
    throw new Error(
      'Missing EXPO_PUBLIC_TMDB_API_KEY. Add your TMDB API key to the .env file and restart Expo.'
    );
  }
}

// Shared configuration object imported by API service modules
export const tmdbConfig = {
  baseUrl: TMDB_BASE_URL,
  imageBaseUrl: TMDB_IMAGE_BASE_URL,
  apiKey: TMDB_API_KEY,
  defaultRegion: 'CA', // Target region for theatrical releases (Canada)
};