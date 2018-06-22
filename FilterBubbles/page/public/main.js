Vue.config.productionTip = false;
var twitterFeed = document.getElementById('listTwitterFeed');
const twitterRec = twitterReceiever();
const twitterUt = twitterUtils();
twitterUt.init();

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
                        <div class="autocomplete">
                        <input class="form-control mr-sm-2" id="userSearch"
                                type="search" placeholder="Search" aria-label="Search">
                        </div>
                      <button class="btn btn-outline-success my-2 my-sm-0" type="button" @click="$emit('search', search)">Search</button>
                    </form>
                  </div>
                </nav>`,
    mounted() {
        $( "#userSearch" ).autocomplete({
              source: ( request, response ) => {
                $.ajax( {
                  url: "/users/" + request.term,
                  dataType: "json",
                  success: function( data ) {
                    response( JSON.parse(data.body) )
                  }
                } );
              },
              minLength: 2,
              select: ( event, ui ) => {
                this.addBubble(ui.item)
              }
            }).autocomplete( "instance" )._renderItem = function( ul, item ) {
              return $( "<li class='list-group-item list-group-item-action flex-column align-items-start'>" )
                .append( `<div class="d-flex justify-content-between">
                              <span class="mb-1">` + item.name + `</span>
                              <small>@` + item.screen_name + `</small>
                           </div>`)
                .appendTo( ul );
            };
    },
    methods: {
        addBubble(screenName) {
            this.$emit('bubbleAdded', screenName)
        }
    }
});
var MainContent = Vue.component('main-content', {
    template: '<div class="h-100 bg-light nopadding"><div class="chart-example" id="chart"><svg class="h-100 w-100"></svg></div></div>',
    props: ['bubbles'],
    watch: {
        bubbles() {
            this.chart = bubbleChart().width(600).height(400)
            d3.select('#chart').datum(this.bubbles).call(this.chart)
        }
    },
    data: function() {
        return {
            data: [],
            chart: null,
        }
    },
    mounted() {
        this.chart = bubbleChart().width(600).height(400)
        d3.select('#chart').datum(this.bubbles).call(this.chart);
    },
    methods: {
    },
});

var App = Vue.component('app', {
    template: '<div id="app" class="h-100 container-fluid nopadding"><navbar v-on:bubbleAdded="bubbleAdded"></navbar><main-content :bubbles="bubbles"></main-content></div>',
    components: {
        MainContent, Navbar,
    },
    data: function() {
      return {
        bubbles: [],
    }
},
mounted() {
    $.getJSON("./data_bubbles.json", (json) => {
        this.bubbles = json.bubbles;
    });
},
methods: {
    bubbleAdded(val) {
        this.bubbles.push({'title': val.screen_name, 'value': val.followers_count})
    }
},
});

new Vue({
  render: h => h(App)
}).$mount('#app');
