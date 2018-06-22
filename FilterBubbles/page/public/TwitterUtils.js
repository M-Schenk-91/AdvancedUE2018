function twitterUtils () {
  var twitter = twitterReceiever();
  //var tmpl = document.getElementById('twitter-template');
  var templates = null;

  var addTweet = function(user){
    var tmpl = document.getElementById('twitter-template').content.cloneNode(true);

    //text
    tmpl.querySelector('.timeline-Tweet-text').innerText = user.status.text;

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

  };

  var createTwitterTimestamp = function(dateString){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var dateCreated = new Date(dateString);
    var elapsedMillis = Date.now() - dateCreated.getTime();
    var elapsedHours = parseInt((elapsedMillis / (1000 * 60 * 60)));

    if(elapsedHours <= 24) return elapsedHours + "h";
    return new Date(dateCreated).getDate() + " " + (monthNames[new Date(dateCreated).getMonth() + 1]);
  };

  var compareTweets = function(a, b){
    return Date.parse(b.created_at) - Date.parse(a.created_at);
  };

  var updateTwitterUI = function(feed){
    let users = JSON.parse(feed).users
    templates = [];
    for (var i = 0; i < users.length; i++) {
      addTweet(users[i])
    }

    var evt = new CustomEvent('twittertemplatecreated', { detail: templates });
    window.dispatchEvent(evt);
  };

  var init = function(){
    window.addEventListener('twitterfeedreceived', function (e) {
      console.log('Feed received', e.detail);
      updateTwitterUI(e.detail.body);
    });
  };


  var loadTwitter = function(feedsToLoad){
    twitter.loadFeeds(feedsToLoad);
  };

  this.init = init;
  this.loadTwitter = loadTwitter;
  return this;
}



