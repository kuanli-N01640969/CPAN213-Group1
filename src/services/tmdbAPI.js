import { assertTmdbConfig, tmdbConfig } from '../../config/tmdbConfig';

// Allowed category filter values matching the Picker in HomeScreen
const VALID_CATEGORIES = ['now_playing', 'upcoming', 'popular'];

// Converts a TMDB poster_path (e.g., "/abc.jpg") into a full image URL, or null if unavailable
function buildPosterUrl(posterPath) {
  if (!posterPath) {
    return null;
  }
  return `${tmdbConfig.imageBaseUrl}${posterPath}`;
}

// Extracts a 4-digit release year from a "YYYY-MM-DD" string, falling back to "N/A"
function extractReleaseYear(releaseDate) {
  if (!releaseDate || typeof releaseDate !== 'string') {
    return 'N/A';
  }
  const year = releaseDate.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : 'N/A';
}

// Normalizes raw TMDB movie objects into a consistent shape for UI screens and Redux/Firestore
export function normalizeMovie(rawMovie, nowPlayingIds = null) {
  const id = rawMovie?.id;
  const posterUrl = buildPosterUrl(rawMovie?.poster_path);

  return {
    id,
    title: rawMovie?.title || 'Untitled',
    release_date: rawMovie?.release_date || '', // Preserved for existing screen compatibility
    releaseYear: extractReleaseYear(rawMovie?.release_date),
    overview: rawMovie?.overview || 'No synopsis available.',
    poster_path: rawMovie?.poster_path || null,
    posterUrl,
    voteAverage:
      typeof rawMovie?.vote_average === 'number'
        ? Number(rawMovie.vote_average.toFixed(1))
        : null,
    // runtime, genres, and status are populated by the /movie/{movie_id} details endpoint
    runtime: typeof rawMovie?.runtime === 'number' ? rawMovie.runtime : null,
    genres: Array.isArray(rawMovie?.genres)
      ? rawMovie.genres.map((g) => g.name).filter(Boolean)
      : [],
    status: rawMovie?.status || null,
    // Flags whether this movie ID appears in the current "Now Playing" theatrical set
    isNowPlaying: nowPlayingIds ? nowPlayingIds.has(id) : false,
  };
}

// Shared helper that builds the URL with query params, executes fetch(), and validates HTTP status
async function fetchFromTmdb(endpoint, params = {}) {
  // Ensure API key exists before attempting a network request
  assertTmdbConfig();

  const url = new URL(`${tmdbConfig.baseUrl}${endpoint}`);
  url.searchParams.set('api_key', tmdbConfig.apiKey);

  // Append only non-empty query parameters to avoid sending "undefined" or "null" strings
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  // fetch() does not reject on HTTP 4xx/5xx responses, so check response.ok explicitly
  if (!response.ok) {
    let errorMessage = `TMDB request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.status_message) {
        errorMessage = errorBody.status_message;
      }
    } catch {
      // Ignore JSON parsing errors if the error response body is plain text or empty
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Fetches movies for a given category ("now_playing", "upcoming", or "popular")
export async function fetchMoviesByCategory(
  category = 'now_playing',
  page = 1,
  nowPlayingIds = null
) {
  const safeCategory = VALID_CATEGORIES.includes(category) ? category : 'now_playing';
  const queryParams = { page };

  // Apply region filtering for theatrical/upcoming endpoints
  if (safeCategory === 'now_playing' || safeCategory === 'upcoming') {
    queryParams.region = tmdbConfig.defaultRegion;
  }

  const data = await fetchFromTmdb(`/movie/${safeCategory}`, queryParams);
  const results = Array.isArray(data?.results) ? data.results : [];

  return {
    movies: results.map((movie) => normalizeMovie(movie, nowPlayingIds)),
    page: data?.page || page,
    totalPages: data?.total_pages || 1,
  };
}

// Returns a Set of movie IDs currently playing in theaters for watchlist match checks
export async function fetchNowPlayingIds(page = 1) {
  const { movies } = await fetchMoviesByCategory('now_playing', page);
  return new Set(movies.map((movie) => movie.id));
}

// Searches TMDB by movie title query
export async function searchMovies(query, page = 1, nowPlayingIds = null) {
  const trimmedQuery = typeof query === 'string' ? query.trim() : '';

  // Avoid unnecessary API calls on blank or whitespace-only queries
  if (!trimmedQuery) {
    return { movies: [], page: 1, totalPages: 1 };
  }

  const data = await fetchFromTmdb('/search/movie', {
    query: trimmedQuery,
    page,
    include_adult: false,
  });
  const results = Array.isArray(data?.results) ? data.results : [];

  return {
    movies: results.map((movie) => normalizeMovie(movie, nowPlayingIds)),
    page: data?.page || page,
    totalPages: data?.total_pages || 1,
  };
}

// Fetches full metadata (such as runtime, genres, and release status) for a single movie
export async function fetchMovieDetails(movieId, nowPlayingIds = null) {
  if (!movieId) {
    throw new Error('A valid movie ID is required to load movie details.');
  }

  const data = await fetchFromTmdb(`/movie/${movieId}`);
  return normalizeMovie(data, nowPlayingIds);
}