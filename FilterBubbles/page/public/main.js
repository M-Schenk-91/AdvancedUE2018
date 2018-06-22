Vue.config.productionTip = false;
var twitterFeed = document.getElementById('listTwitterFeed');
<<<<<<< HEAD
var profileDataList = document.getElementById('accordionExample');

var userProfile = [];


=======
const twitterRec = twitterReceiever();
const twitterUt = twitterUtils();
twitterUt.init();
>>>>>>> proto

window.addEventListener('twittertemplatecreated', function (e) {
    while (twitterFeed.firstChild) {
        twitterFeed.removeChild(twitterFeed.firstChild);
    }
    for (i = 0; i < e.detail.length; i++) {
        twitterFeed.appendChild(e.detail[i]);
    }
});
<<<<<<< HEAD

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



    


/*
    //image
    if(user.status.entities != null){
      if(user.status.entities.media != null){
        tmpl.querySelector('.timeline-Tweet-img').src = user.status.entities.media[0].media_url_https;
      }
    }

    //profile pic
    if(user != null){
      tmpl.querySelector('.Avatar').src = user.profile_image_url_https;
    }

    //profile name
    tmpl.querySelector('.TweetAuthor-name').innerText = user.name;

    //profile screen_name
    tmpl.querySelector('.TweetAuthor-screenName').innerText = "@" + user.screen_name;

    //profile screen_name
    tmpl.querySelector('.timeline-Tweet-timestamp').innerText = createTwitterTimestamp(user.status.created_at);

    templates.push(tmpl)
    */
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
=======
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
>>>>>>> proto
        }
    }, 
    methods: {
        profile() {

            $.getJSON("./data_navbar.json", (json) => {

                for (var i = 0; i < json.categories.length; i++) {
                    createProfileEntry(i, json.categories[i]);
                }

                $('#userInterestsForm').modal('show');

            });



        }
    },
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
