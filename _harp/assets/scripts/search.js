function fetchJSON(fromURL) {
    return fetch(new Request(fromURL))
        .then((res) => {
            // Fetches don't fail if the status code indicates a problem, so we have to check ourselves
            if (res.status >= 200 && res.status < 300) return res;
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        })
        .then((res) => res.json());
}

let root = new Vue({
    el: "#root",
    data: {
        "imdb": "null",
        "tmdb": "null"
    },
    mounted: function() {
        let params = new URLSearchParams(window.location.search);
        if (params.has("q")) {
            let movie = encodeURIComponent(params.get("q"));
            let tmdbURI =  `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&query=${movie}&page=1&include_adult=false`;            
            let imdbURI = `https://theimdbapi.org/api/find/movie?title=${movie}`;
            fetchJSON(tmdbURI).then((json) => root.tmdb = json);
            fetchJSON(imdbURI).then((json) => root.imdb = json);
            
        }
    }
});