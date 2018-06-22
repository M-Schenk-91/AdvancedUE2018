Vue.config.productionTip = false;
var twitterFeed = document.getElementById('listTwitterFeed');

window.addEventListener('twittertemplatecreated', function (e) {
    while (twitterFeed.firstChild) {
        twitterFeed.removeChild(twitterFeed.firstChild);
    }

    for (i = 0; i < e.detail.length; i++) {
        twitterFeed.appendChild(e.detail[i]);
    }

});

var Navbar = Vue.component('navbar', {
    template:`<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <a class="navbar-brand" href="#">FilterBubbles</a>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                      <li class="nav-item active">
                        <a class="nav-link" href="#">Proto 1 <span class="sr-only">(current)</span></a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="#">Proto 2</a>
                      </li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                      <input v-model="search" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
                      <button class="btn btn-outline-success my-2 my-sm-0" type="button" @click="$emit('search', search)">Search</button>
                    </form>
                  </div>
                </nav>`,
    data() {
        return {
            search: null,
        }
    }
});
var MainContent = Vue.component('main-content', {
    template: '<div class="h-100 bg-light nopadding"><div class="chart-example" id="chart"><svg class="h-100 w-100"></svg></div></div>',
    props: ['bubbles', 'search'],
    watch: {
        bubbles() {
            this.data = this.bubbles
            this.chart = bubbleChart().width(600).height(400)
            d3.select('#chart').datum(this.data).call(this.chart)
        },
        search() {
            this.data.push({"title": this.search, "value": 99999999})
            this.chart = bubbleChart().width(600).height(400)
            d3.select('#chart').datum(this.data).call(this.chart)
        }
    },
    data: function() {
        return {
            data: [],
            chart: null,
        }
    },
    mounted() {
        console.log(this.bubbles)
        this.chart = bubbleChart().width(600).height(400)
        d3.select('#chart').datum(this.bubbles).call(this.chart);
    },
    methods: {

    },
});

var App = Vue.component('app', {
    template: '<div id="app" class="h-100 container-fluid nopadding"><navbar v-on:search="search"></navbar><main-content :search="searchVal" :bubbles="bubbles"></main-content></div>',
    components: {
        MainContent, Navbar,
    },
    data: function() {
      return {
        bubbles: [],
        searchVal: null,
    }
},
mounted() {
    $.getJSON("./data_bubbles.json", (json) => {
        this.bubbles = json.bubbles;
    });
},
methods: {
    search(val) {
        this.searchVal = val
    }
},
});

new Vue({
  render: h => h(App)
}).$mount('#app');
