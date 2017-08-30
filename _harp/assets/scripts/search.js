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
            <i class = 'fa fa-star' v-for='x in fullStars'></i><i class = 'fa fa-star-half-o' v-if='halfStar'></i>
        </span>`
});

let root = new Vue({
    el: "#root",
    data: {
        imdb: null,
        tmdb: null,
        genres: null,
        query: null
    },
    computed: {
        encodedQuery: function() {
            return encodeURIComponent(this.query)
        }
    },
    methods: {
        populateData: function() {
            let tmdbURI =  `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&query=${this.encodedQuery}&page=1&include_adult=false`;            
            let imdbURI = `https://theimdbapi.org/api/find/movie?title=${this.encodedQuery}`;
            fetchJSON(tmdbURI)
                .then((json) => root.tmdb = json.results.filter((x) => x.poster_path !== null))
                .catch(alert);
            //fetchJSON(imdbURI).then((json) => root.imdb = json);
        },

        applicableGenres: function(genre_ids) {
            return root.genres
                .filter(genre => genre_ids.includes(genre.id))
                .map(genre => genre.name)
        }
    },
    created: function() {
        let params = new URLSearchParams(window.location.search);
        if (params.has("q")) this.query = params.get("q");
        let genresURI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbKey}&language=en-US`;
        fetchJSON(genresURI)
            .then((json) => root.genres = json.genres)
            .then(() => {
                if (this.query) this.populateData(this.encodedQuery);
            });   
    }
});