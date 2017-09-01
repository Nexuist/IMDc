var moviesKey = "a487dd6689557f40c93be7ad06f3024f"; // The API key really shouldn't be public but I don't have a backend so ¯\_(ツ)_/¯
var basePath = "https://image.tmdb.org/t/p/w500"; // Base path for posters
var fallbackPath = "http://via.placeholder.com/500x700?text=No+Poster"; // Fallback poster art

function fetchJSON(fromURL) {
    return fetch(new Request(fromURL))
        .then((res) => {
            // Fetches don't fail if the status code indicates a problem, so we have to check ourselves
            if (res.status >= 200 && res.status < 300) return res;
            var error = new Error(res.statusText);
            error.res = res;
            throw error;
        })
        .then((res) => res.json())
        .catch(console.error);
}

Vue.component("rating-stars", {
    props: ['rating'],
    data: function() {
        return {
            "fullStars": Math.floor(this.rating),
            "halfStar": Math.round(this.rating) > Math.floor(this.rating)
        };
    },
    template: `
        <span>
            <i class="fa fa-star" v-for="x in fullStars"></i><i class ="fa fa-star-half-o" v-if="halfStar"></i><i class = 'fa fa-star-o' v-for="x in 10 - (fullStars + halfStar)"></i>
        </span>
    `
});

// Taken from https://stackoverflow.com/a/14428340 - just converts a number into a dollar amount w/ proper commas and decimals
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

var root = new Vue({
    el: "#root",
    data: {
        pages: null, // Total amount of pages for the search query
        page: 1, // Which page you're on
        movies: null, // Will hold an array of movies        
        genres: null, // Will hold an array of genres 
        query: null, // Bound to the searchbar
        selectedMovie: null // Set when a movie card is clicked, used by the modal
    },
    computed: {
        encodedQuery: function() {
            return encodeURIComponent(this.query)
        },
        results: function() {
            return this.movies ? this.movies.length : 0;
        },
        resultsText: function() {
            if (!this.movies || this.movies.length == 0) return "results";
            return this.movies.length > 1 ? "results" : "result";
        }
    },
    methods: {
        submitQuery: function(page) {
            this.page = page;
            //- Future improvement: Switch to pushState and detect when the URL changes to re-populate data as needed
            if (history) history.replaceState({}, this.query, `${location.origin + location.pathname}?q=${encodeURIComponent(this.query)}&page=${this.page}`);
            this.populateData();
        },
        populateData: function() {
            var moviesURI =  `https://api.themoviedb.org/3/search/movie?api_key=${moviesKey}&query=${this.encodedQuery}&page=${this.page}&include_adult=false`;            
            fetchJSON(moviesURI)
                .then((json) => {
                    root.pages = json.total_pages;
                    root.movies = json.results;
                })
                .catch(console.error);
        },
        truncateReviewText: function(fullText) {
            return fullText.length > 500 ? fullText.substring(0, 500) + "..." : fullText;
        },
        markdownToHTML: function(text) {
            return marked(text, {sanitize: true});
        },
        // The rest of these methods just manipulate movie properties for easy insertion into Vue templates
        getGenres: function(movie) {
            if (!movie.genre_ids) return;
            // Compare the movie genres to the genres grabbed from movies
            return root.genres
                .filter(genre => movie.genre_ids.includes(genre.id))
                .map(genre => genre.name)
        },
        getPosterURL: function(movie) {
            return movie.poster_path ? basePath + movie.poster_path : fallbackPath;
        },
        getTitle: function(movie) {
            return movie.title ? movie.title : "No Title Available";
        },
        getReleaseYear: function(movie) {
            return movie.release_date ? movie.release_date.substring(0, movie.release_date.indexOf("-")) : null;
        }
    },
    watch: {
        // When a movie is selected, asynchronously retrieve more data for it and display it once it's there
        selectedMovie: function(newMovie) {
            if (newMovie === null) return;
            var movieURI = `https://api.themoviedb.org/3/movie/${newMovie.id}?api_key=${moviesKey}&append_to_response=reviews`;
            // Future improvement: Add caching to this
            // Future improvement: Some kind of loading spinner in the modal while this data is being retrieved?
            fetchJSON(movieURI)
                .then((json) => {
                    Object.assign(root.selectedMovie, json); // Merge the two JSON results together
                    root.$forceUpdate(); // This will get Vue to recognize all the new properties now
                })
                .catch(console.error);
        }
    },
    created: function() {
        // If there's a query parameter (which there should be), use it
        var params = new URLSearchParams(window.location.search);
        if (params.has("q")) this.query = params.get("q");
        if (params.has("page")) this.page = +params.get("page"); // + in front converts the result into a number
        var genresURI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${moviesKey}`;
        fetchJSON(genresURI)
            .then((json) => root.genres = json.genres)
            .then(() => {
                if (this.query) this.populateData();
            })
            .catch(console.error);   
    }
});