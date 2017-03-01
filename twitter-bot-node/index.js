var Twitter = require('twitter');
var credentials = require('./creds');
var client = new Twitter(credentials);

var query = 'pooping -filter:retweets';
var regex = /\bi\W.* pooping/i;

/**
 * Returns elapsed seconds until now
 */
function since(when) {
  var now = new Date();
  var then = new Date(Date.parse(when));
  return Math.floor((now - then) / 1000);
}

function search(succeed, fail) {
  console.log("searching");
  client.get('search/tweets', {q: query}, function(err, tweets, response) {
    if (err || !tweets.statuses) {
      fail(err);
    } else {
      // console.log(tweets)
      console.log("JC: count=" + tweets['statuses'].length)
      tweets.statuses.forEach(function(tweet) {
        var match = tweet.text.match(regex);
        var t = since(tweet.created_at);
        if (match && t < 10 * 60) {
          console.log(tweet.id + ": (" + t + "s) @" + tweet.user.screen_name + " \"" + tweet.text + "\"");
        }
      });
    }
    succeed("success");
  });
}

exports.handler = function(event, context) {
  search(context.succeed, context.fail);
};

// search(console.log, console.log);
