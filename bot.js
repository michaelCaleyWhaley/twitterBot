
// Twitter bot - when a tweet is received containing the word time
// the bot responds with the persons twitter handle and the current time

var twit = require('twit');
var config = require('./config');
var Twitter = new twit(config);

// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function() {  
    var params = {
        q: '#Grime4Corbyn',
        result_type: 'recent',
        lang: 'en'
    }
    Twitter.get('search/tweets', params, function(err, data) {
        if (!err) {
            var retweetId = data.statuses[0].id_str;

            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err, response) {
                if (response) {
                    console.log('Retweeted!!!');
                }
                // if there was an error while tweeting
                if (err) {
                    console.log(err);
                    console.log('Something went wrong while RETWEETING... Duplication maybe...');
                }
            });
        }

        else {
          console.log('Something went wrong while SEARCHING...');
        }
    });
    console.log('running');
}

// grab & retweet as soon as program is running...
retweet();  
// retweet in every 24 hours
setInterval(retweet, 86400000);


//Start of time reply function
var previousTweet = null;

var timeTweet = function() {  
    Twitter.get('statuses/mentions_timeline', function(err, data){
        var result = data[0];
        var tweet = result.text;
        var time = 'time';

        if(tweet.indexOf(time) !== -1 && previousTweet !== result.id){
            var currentTime = new Date().getHours() + ":" + new Date().getMinutes();
            Twitter.post('statuses/update', {
                in_reply_to_status_id: result.id,
                status: '@' + result.user.screen_name + ' the time is ' + currentTime
            });
        } else {
            console.log('Not asking for time');
        }
        previousTweet = result.id;
    });

    console.log('running');
}

timeTweet();
setInterval(timeTweet, 600000);
