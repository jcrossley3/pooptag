var Twitter = require('twitter');
var credentials = require('./creds');
var client = new Twitter(credentials);

var query = 'pooping -filter:retweets';
var regex = /pooping/i;

function search(succeed, fail) {
  console.log("searching");
  client.get('search/tweets', {q: query, count: 15}, function(err, tweets, response) {
    if (err || !tweets.statuses) {
      fail(err);
    } else {
      tweets.statuses.forEach(function(tweet) {
        var match = tweet.text.match(regex);
        if (match) {
          console.log(tweet.user.screen_name + " " + tweet.text);
        }
      });
    }
    succeed("success");
  });
}

// search(console.log, console.log);

exports.handler = function(event, context) {
  search(context.succeed, context.fail);
};
