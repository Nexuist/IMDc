// Set up the searchbar
var root = new Vue({
    el: "#root",
    data: {
        query: null
    },
    methods: {
        submitQuery: function() {
            if (this.query == null || this.query.length < 1) return;
            window.location.assign(`${location.origin + location.pathname}/search?q=${encodeURIComponent(this.query)}`);
        }
    }
});