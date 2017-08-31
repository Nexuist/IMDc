let root = new Vue({
    el: "#root",
    methods: {
        submitQuery: function() {
            let query = document.getElementById("query").value;
            window.location.assign(`/search?q=${encodeURIComponent(query)}`);
        }
    }
});