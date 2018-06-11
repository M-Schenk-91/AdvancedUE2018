Vue.config.productionTip = false;

var Sidebar = Vue.component('sidebar', {
    template: '<div class="col-2 bg-dark h-100"><ul class="nav flex-column pt-5"><template v-for="category in categories"><li class="nav-item"><a class="nav-link active" data-toggle="collapse" :href="[\'#collapseCategory\' + category.categoryName]" role="button" aria-expanded="false" aria-controls="collapseCategory">{{category.categoryName}}</a></li><li class="nav-item collapse ml-2" :id="[\'collapseCategory\' + category.categoryName]"><form class="text-white ml-4"><div v-for="subCat in category.subcategories" v-bind:key="subCat.subcategoryName" class="form-group form-check"><input type="checkbox" class="form-check-input" :value="subCat.subcategoryName" @change="onChange" v-model="checkedCats" :id="[\'subCat\' + subCat.subcategoryName]"><label class="form-check-label" :for="[\'subCat\' + subCat.subcategoryName]">{{subCat.subcategoryName}}</label></div></form></li></template></ul></div>',
    props: ['categories'],
    data: function() {
        return {
            checkedCats: [],
        }
    },
    methods: {
        onChange: function() {
            this.$emit('catsChanged', this.checkedCats)
        }
    }
});

var MainContent = Vue.component('main-content', {
    template: '<div class="col-10 h-100 bg-light"><div class="chart-example" id="chart"><svg></svg></div></div>',
    props: ['categories', 'checkedCategories'],
    watch: {
        categories: function() {
            this.data = this.mapCategoriesToBubbles(this.categories, this.checkedCategories);
            var chart = bubbleChart().width(600).height(400);
            d3.select('#chart').datum(this.data).call(chart);
            return;
        },
        checkedCategories: function () {
            this.data = this.mapCategoriesToBubbles(this.categories, this.checkedCategories);
            var chart = bubbleChart().width(600).height(400);
            d3.select('#chart').datum(this.data).call(chart);
            return;
        }
    },
    data: function() {
        return {
            data: null,
        }
    },
    mounted() {
        this.data = this.mapCategoriesToBubbles(this.categories, this.checkedCategories);
        var chart = bubbleChart().width(600).height(400);
        d3.select('#chart').datum(this.data).call(chart);
    },
    methods: {
        mapCategoriesToBubbles: function(cats, checkedCats) {
            let data = [];
            data.push(this.getMyBubble(cats, checkedCats))
            data = data.concat(this.getOtherBubbles(cats, checkedCats))
            return data
        },
        getMyBubble: function(cats, checkedCats) {
            let sites = []
            for (var c = 0; c < cats.length; c++) {
                for (var s = 0; s < cats[c].subcategories.length; s++) {
                    for (var i = 0; i < checkedCats.length; i++) {
                        if(checkedCats[i] == cats[c].subcategories[s].subcategoryName) {
                            sites = sites.concat(cats[c].subcategories[s].sites)
                        }
                    }
                }
            }
            return {
                title: 'Meine Bubble',
                value: sites.length,
                category: 'sites'
            }
        },
        getOtherBubbles: function(cats, checkedCats) {
            let bubbles = [];
            let hasSubcatChecked = false;
            for (var c = 0; c < cats.length; c++) {
                for (var s = 0; s < cats[c].subcategories.length; s++) {
                    for (var i = 0; i < checkedCats.length; i++) {
                        if(checkedCats[i] == cats[c].subcategories[s].subcategoryName) {
                            hasSubcatChecked = true;
                            break
                        }
                    }
                    if(hasSubcatChecked) break
                }
                if (!hasSubcatChecked) {
                    let sites = [];
                    for (var s = 0; s < cats[c].subcategories.length; s++) {
                        sites = sites.concat(cats[c].subcategories[s].sites)
                    }
                    let bubble = {
                        title: cats[c].categoryName,
                        value: sites.length,
                        category: 'sites'
                    };
                    bubbles.push(bubble)
                }
                hasSubcatChecked = false;
            }
            return bubbles
        },
    },
});

var App = Vue.component('app', {
  template: '<div id="app" class="row container-fluid h-100"><sidebar v-on:catsChanged="onCatsChanged" :categories="categories"></sidebar><main-content :categories="categories" :checkedCategories="checkedCats"></main-content></div>',
  components: {
    MainContent, Sidebar,
  },
  data: function() {
      return {
        categories: [],
        checkedCats: [],
      }
    },
    mounted() {
        $.getJSON("./data.json", (json) => {
            this.categories = json.categories;
        });
    },
    methods: {
      onCatsChanged: function(checkedCats) {
        this.checkedCats = checkedCats;
      },
    },
});

new Vue({
  render: h => h(App)
}).$mount('#app');
