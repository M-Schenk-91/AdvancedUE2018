function twitterUtils () {
  console.log("start");

  var twitter = twitterReceiever();
  var tmpl = document.getElementById('twitter-template');


  var addTweet = function(tweet){
    var twitterFeed = document.getElementById('listTwitterFeed');

    var tmpl = document.getElementById('twitter-template').content.cloneNode(true);

    //text
    tmpl.querySelector('.timeline-Tweet-text').innerText = tweet.text;

    //image
    if(tweet.entities != null){
      if(tweet.entities.media != null){
        tmpl.querySelector('.timeline-Tweet-img').src = tweet.entities.media[0].media_url_https;
      }
    }

    //profile pic
    if(tweet.user != null){
      tmpl.querySelector('.Avatar').src = tweet.user.profile_image_url_https;
    }

    //profile name
    tmpl.querySelector('.TweetAuthor-name').innerText = tweet.user.name;

    //profile screen_name
    tmpl.querySelector('.TweetAuthor-screenName').innerText = "@" + tweet.user.screen_name;

    //profile screen_name
    tmpl.querySelector('.timeline-Tweet-timestamp').innerText = createTwitterTimestamp(tweet.created_at);

      twitterFeed.appendChild(tmpl);
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

      feed.sort(compareTweets);

      for (i = 0; i < feed.length; i++) { 
        addTweet(feed[i]);
      }
    };

    window.addEventListener('twitterfeedreceived', function (e) {
      console.log('Feed received', e.detail);
      updateTwitterUI(e.detail);
    });

    twitter.loadFeeds("tagesschau&zeitonline");
  }

  twitterUtils();

