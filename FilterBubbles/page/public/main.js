Vue.config.productionTip = false;
var twitterFeed = document.getElementById('listTwitterFeed');
var profileDataList = document.getElementById('accordionExample');

var elBtnShowOppositeFeed = null;
var elChart = null;

var userProfile = [];

const twitterRec = twitterReceiever();
const twitterUt = twitterUtils();
twitterUt.init();

var chartGraph = null;
var bubbleData = null;
var bubbleMatchID = -1;

var type = 1;

window.addEventListener('twittertemplatecreated', function (e) {
    while (twitterFeed.firstChild) {
        twitterFeed.removeChild(twitterFeed.firstChild);
    }
    for (i = 0; i < e.detail.length; i++) {
        twitterFeed.appendChild(e.detail[i]);
    }
});

document.getElementById('btnShowOppositeFeed').addEventListener("click", function(event){
    // TODOOOOOOOOOOOOOOOOOO
    $('#exampleModalCenter').modal('show');
});

document.getElementById('btnProfileCreated').addEventListener("click", function(event){
    $('#userInterestsForm').modal('hide');

    var chartGraph = document.getElementById('chart');

    for (var i = 0; i < chartGraph.childNodes[0].childNodes.length; i++) {
        chartGraph.childNodes[0].childNodes[i].style.fill = "#00BFFF";
        chartGraph.childNodes[0].childNodes[i].style.color = "#00BFFF";

    }

    bubbleMatchID = matchProfileToCategory();

    if(bubbleMatchID > -1){
        var elem = chartGraph.childNodes[0].childNodes[bubbleMatchID];
        animationHighlight(elem);
    }else{
        alert("Dein Profil konnte leider keiner Filterblase zugeordnet werden :(");
    }
});

function animationHighlight(elem) {
    elem.style.fill = "#ff0000"
/*
    var pos = 0;
    var id = setInterval(frame, 5);
    function frame() {
        elem.style.fill = "#ff0000"

    }
    */
}

var matchProfileToCategory = function() {

    var matchID = -1;
    var numMatches = 0;

    for (var i = 0; i < bubbleData.length; i++) {

        var numTempMatches = 0;

        for (var j = 0; j < bubbleData[i].subcategories.length; j++) {
            if(userProfile.includes(bubbleData[i].subcategories[j])){
                numTempMatches++;
            }
        }

        if(numTempMatches > numMatches) matchID = i;
    }

    console.log(matchID);
    return matchID;
};

var createProfileEntry = function(id, category){
    var tmplCategory = document.getElementById('profile-template').content.cloneNode(true);

    // collapse functionality
    var idDiv = "prof" + id;
    tmplCategory.querySelector('.collapse').id = idDiv;
    tmplCategory.querySelector('.btn-link').setAttribute("data-target", '#' + idDiv);

    //content text
    tmplCategory.querySelector('.btn-link').innerHTML = category.categoryName;

    //content

    var content = tmplCategory.querySelector('.card-body');

    for (var i = 0; i < category.subcategories.length; i++) {

        var tmplSubCategory = document.getElementById('profile-subcatrgory-template').content.cloneNode(true);
        var button = tmplSubCategory.querySelector('.btn-primary');
        button.innerHTML = category.subcategories[i].subcategory;

        button.addEventListener("click", function(event){
            if(userProfile.includes(event.target.innerHTML)){
                var index = userProfile.indexOf(event.target.innerHTML);
                if (index > -1) {
                    userProfile.splice(index, 1);
                }
            }else{
                userProfile.push(event.target.innerHTML);
            }

            console.log(userProfile);
        });


        content.appendChild(tmplSubCategory);
    }
    profileDataList.appendChild(tmplCategory);


};


var Navbar = Vue.component('navbar', {
    template:`<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">FilterBubbles</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
    <li class="nav-item" v-on:click="profile"">
    <a class="nav-link" href="#">Profil erstellen</a>
    </li>
    <li id="protoType1" class="nav-item active" v-on:click="type1">
    <a class="nav-link" href="#">Proto 1 <span class="sr-only">(current)</span></a>
    </li>
    <li id="protoType2" class="nav-item" v-on:click="type2">
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
}, 
methods: {
    type1() {
        if(type == 1) return; 
        type = 1;

        $('#protoType1').addClass("active");
        $('#protoType2').removeClass("active");

        elBtnShowOppositeFeed = $('#btnShowOppositeFeed');
        elBtnShowOppositeFeed.detach();

        if(elChart == null) elChart = $('#chart');

        $('#contentHolder').append(elChart);
    },

    type2(){
        if(type == 2) return; 
        type = 2;

        $('#protoType2').addClass("active");
        $('#protoType1').removeClass("active");

        elChart = $('#chart');
        elChart.detach();

        if(elBtnShowOppositeFeed == null) elBtnShowOppositeFeed = $('#btnShowOppositeFeed');

        $('#contentHolder').append(elBtnShowOppositeFeed);
    },

    profile() {

        $.getJSON("./data_navbar.json", (json) => {

            userProfile.length = 0;
            $('#accordionExample').empty();


            for (var i = 0; i < json.categories.length; i++) {
                createProfileEntry(i, json.categories[i]);
            }

            $('#userInterestsForm').modal('show');

        });



    }
},
});
var MainContent = Vue.component('main-content', {
    template: '<div id="contentHolder" class="h-100 bg-light nopadding"><div class="chart-example" id="chart"><svg class="h-100 w-100"></svg></div></div>',
    props: ['bubbles'],
    watch: {
        bubbles() {

            chartGraph = bubbleChart().width(600).height(400)
            this.chart = chartGraph;
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
        bubbleData = json.bubbles;
        this.bubbles = bubbleData;


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
