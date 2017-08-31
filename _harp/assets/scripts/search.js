
function fetchJSON(fromURL) {
    return fetch(new Request(fromURL))
        .then((res) => {
            // Fetches don't fail if the status code indicates a problem, so we have to check ourselves
            if (res.status >= 200 && res.status < 300) return res;
            var error = new Error(res.statusText);
            error.res = res;
            throw error;
        })
        .then((res) => res.json());
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

// https://stackoverflow.com/a/14428340
Number.prototype.format = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

let root = new Vue({
    el: "#root",
    data: {
        imdb: null,
        tmdb: null,
        genres: null,
        query: null,
        selectedMovie: null
    },
    computed: {
        encodedQuery: function() {
            return encodeURIComponent(this.query)
        }
    },
    methods: {
        submitQuery: function() {
            this.populateData();
        },
        populateData: function() {
            let tmdbURI =  `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${this.encodedQuery}&page=1&include_adult=false`;            
            fetchJSON(tmdbURI)
                .then((json) => root.tmdb = json.results)
                .catch(alert);
        },
        applicableGenres: function(genre_ids) {
            return root.genres
                .filter(genre => genre_ids.includes(genre.id))
                .map(genre => genre.name)
        },
        truncateReviewText: function(fullText) {
            return fullText.length > 500 ? fullText.substring(0, 500) + "..." : fullText;
        },
        markdown: function(text) {
            return marked(text, {sanitize: true});
        }
    },
    watch: {
        selectedMovie: function(newMovie) {
            if (newMovie === null) return;
            let movieURI = `https://api.themoviedb.org/3/movie/${newMovie.id}?api_key=${tmdbKey}&append_to_response=reviews`;
            // Cache?
            fetchJSON(movieURI)
                .then((json) => {
                    Object.assign(root.selectedMovie, json); // Merge the two JSON results together
                    root.$forceUpdate();
                });
        },
        query: function(newQuery) {
            if (history) {
                history.replaceState({}, newQuery, `/search?q=${encodeURIComponent(newQuery)}`);
            }         
        }
    },
    created: function() {
        let params = new URLSearchParams(window.location.search);
        if (params.has("q")) this.query = params.get("q");
        let genresURI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbKey}`;
        fetchJSON(genresURI)
            .then((json) => root.genres = json.genres)
            .then(() => {
                if (this.query) this.populateData(this.encodedQuery);
            });   
    }
});