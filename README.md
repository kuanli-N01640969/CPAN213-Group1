# Cinema Geek – Movie Watchlist & Theater Marathon Planner

**Course:** CPAN213 – Cross-Platform Mobile App Development  
**Group 1 Members:**
- Kuan Yi Li (N01640969)
- Owen Fedchenko (N10004708)
- Abeer Rashid (N01781320)

---

## Application Description
**Cinema Geek** is a cross-platform mobile application built with React Native and Expo Go (Entertainment & Productivity). It helps film enthusiasts discover current theatrical and upcoming releases, curate a personalized watchlist, track local theaters, receive in-app alerts when saved movies are screening in theaters, and schedule movie marathons or cinema outings.

---

## Application Features

### Milestone 1 Implementation(Core UI, Validation, API & Navigation)
- **Multi-Screen React Navigation:** Stack navigation connecting four distinct screens (`HomeScreen`, `MovieDetailScreen`, `WatchlistScreen`, `PlannerScreen`) with custom headers and parameter passing via `route.params`.
- **Responsive Flexbox UI & Core Components:** Modular React Native components styled with `StyleSheet` and Flexbox, including loading (`ActivityIndicator`), success, empty, and error states.
- **Validated User Inputs:**
  - Movie search bar validation (required text and format check) on `HomeScreen`.
  - Local theater entry validation on `MovieDetailScreen`.
  - Movie Night / Marathon Planner form validation on `PlannerScreen` (required title, strict `YYYY-MM-DD` date format check, numeric attendee count check, venue `Picker`, and notes length check) with inline error messages and `Alert` dialogues.
- **TMDB Web API Integration:** Asynchronous `fetch()` requests using `async/await` and `try-catch` error handling to retrieve and render live movie listings in a `FlatList`.
- **In-App Notifications & Modals:** Cross-platform `Alert` dialogues, `Modal` previews, and Android `ToastAndroid` confirmations.

---

## Screen Overview
1. **HomeScreen (`Home`)**: Search bar, category filter (`Now Playing`, `Upcoming`, `Popular`), and movie `FlatList`.
2. **MovieDetailScreen (`MovieDetail`)**: Displays selected movie metadata via `route.params`, local theater list form, and navigation to the planner.
3. **WatchlistScreen (`Watchlist`)**: Displays saved movies, theatrical status modal alerts, and scheduled movie night plans.
4. **PlannerScreen (`Planner`)**: Validated form to schedule a theater outing or home movie marathon.

---

## Data Source / API Used
- **The Movie Database (TMDB) REST API** (`https://api.themoviedb.org/3`)
  - `/movie/now_playing` – Current theatrical releases
  - `/movie/upcoming` – Upcoming releases
  - `/movie/popular` – Popular films
  - `/search/movie` – Movie title search

---
