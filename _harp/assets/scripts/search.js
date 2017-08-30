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
        "imdb": null,
        "tmdb": null,
        "genres": null
    },
    methods: {
        applicableGenres: function(genre_ids) {
            return root.genres.filter((genre) => genre_ids.includes(genre.id));
        }
    },
    mounted: function() {
        let params = new URLSearchParams(window.location.search);
        if (params.has("q")) {
            let movie = encodeURIComponent(params.get("q"));
            let tmdbURI =  `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&query=${movie}&page=1&include_adult=false`;            
            let imdbURI = `https://theimdbapi.org/api/find/movie?title=${movie}`;
            let genresURI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbKey}&language=en-US`;
            fetchJSON(genresURI).then((json) => root.genres = json.genres).then(() => {
                fetchJSON(tmdbURI).then((json) => root.tmdb = json.results.filter((x) => x.poster_path !== null));
                fetchJSON(imdbURI).then((json) => root.imdb = json);
            });            
        }
    }
});