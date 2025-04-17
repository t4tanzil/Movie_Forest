# Movie_Forest

Overview
Movie Finder is a web application that allows users to search for and stream movies and TV shows. It leverages multiple API integrations to provide a seamless viewing experience.
Features

Search functionality: Find movies and TV shows using Google Custom Search API
Movie/TV show browsing: Browse trending, latest, popular movies and top-rated TV shows
Streaming capability: Watch content directly through embedded video player
User-friendly interface: Easy navigation between search and browsing sections
Responsive design: Works across different devices and screen sizes

Technology Stack

Frontend: HTML, CSS, JavaScript
APIs:

TMDB (The Movie Database) API: Used to fetch movie/TV show metadata, posters, and details
Google Custom Search API: Implemented to search for IMDb/TMDb IDs
VidSrc API: Integrated for streaming video content



API Implementation

TMDB API: Retrieves trending, latest, and popular content with detailed information including release dates, posters, and popularity ratings
Google Custom Search API: Customized to specifically search for movie/TV show information and extract relevant IMDb/TMDb IDs
VidSrc: Generates embedded player links using extracted movie/TV show IDs for streaming

Functionality
The application extracts IMDb or TMDb IDs from search results and constructs video source URLs. For TV shows, it provides additional functionality to select specific seasons and episodes.
Usage

Search for a movie or TV show by title
Select from search results
For TV shows, select season and episode numbers
Click "Watch Now" to stream content
Alternatively, browse trending/latest content from the dedicated page

Optimization
The application includes recommendations for using Brave browser for an ad-free experience and implements efficient JavaScript for smooth user interaction.
Future Improvements

User authentication and favorites list
Enhanced mobile responsiveness
Additional filtering options
Watchlist functionality
