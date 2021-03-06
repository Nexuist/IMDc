# Introduction

IMDc is a pure frontend movie ratings/reviews browser. Its data is sourced from [The Movie Database (TMDb)](http://themoviedb.org). There are over 345,000 movies available to search for. You can use it [directly](http://duro.me/IMDc) or set it up for yourself (see Getting Started).

This website was made with the following technologies/frameworks:

* [Harp](http://harpjs.com/) for live testing/compilation
* [Vue.js](https://vuejs.org/) for SPA functionality
* [Bulma](https://bulma.io) for CSS
* [Jade](https://pugjs.org/api/getting-started.html) as an HTML prepocessor
    * Harp hasn't update to support the latest version of Jade: Pug (they rebranded)

You can and should use this project to learn how all of these concepts interact together to make a full frontend. It's [open source!](http://github.com/nexuist/IMDc)

# Getting Started

You need `harp` installed. If you don't already have it, run `npm install -g harp`. Once you have it, you can start harp:

```sh
$ cd IMDc/_harp
$ harp server .
```

Nagivate to http://localhost:9000 to view the site locally.

To compile, run `./_build.sh` (which is really just `harp compile . ../`) from inside `_harp`.

You should also replace the API key at the top of `search.js` with your own. You can get one [here](https://www.themoviedb.org/documentation/api).

# Assumptions
* I only tested this in Chrome so your mileage in other browsers may vary...most things _should_ work, though, I tried to use [polyfills](https://en.wikipedia.org/wiki/Polyfill) as much as I could. Thanks to [polyfill.io](https://polyfill.io/v2/docs/) this is actually super easy.

# License
```
Copyright (c) 2017 Andi Andreas

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```