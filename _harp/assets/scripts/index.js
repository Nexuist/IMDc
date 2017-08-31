// Set up the searchbar
var root = new Vue({
    el: "#root",
    data: {
        query: null
    },
    methods: {
        submitQuery: function() {
            if (query == null || query.length < 1) return;
            window.location.assign(`/search?q=${encodeURIComponent(this.query)}`);
        }
    }
});