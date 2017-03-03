var Twitter = require('twitter');
var credentials = require('./creds');
var client = new Twitter(credentials);

const QUERY = 'pooping -filter:retweets';
const REGEX = /\bi('m| am).* pooping/i;
const WINDOW = 15*60;

function secondsSince(tweet) {
  var now = new Date();
  var then = new Date(Date.parse(tweet.created_at));
  return Math.floor((now - then) / 1000);
}

function findTweets(callback) {
  client.get('search/tweets', {q: QUERY}, function(err, tweets, response) {
    if (err || !tweets.statuses) {
      callback(err);
    } else {
      // console.log("JC count=" + tweets.statuses.length);
      // console.log(tweets);
      callback(err, tweets.statuses.filter(function(tweet) {
        return tweet.text.match(REGEX) && secondsSince(tweet) < WINDOW;
      }));
    }
  });
}

function ding(tweets) {
  var users = tweets.map((tweet) => "@" + tweet.user.screen_name);
  if (tweets.length == 2) {
    return "Ding! " + users[0] + " just tagged " + users[1];
  } else if (tweets.length > 2) {
    return "Ding! " + users[0] + " just tagged " + users.slice(1,-1).join(", ") + " and " + users.slice(-1);
  }
}

function tweet(message) {
  client.post('statuses/update', {status: message},  function(error, tweet, response) {
    if(error) throw error;
  });
}

function search(succeed, fail) {
  findTweets(function(err, tweets) {
    if (err) {
      fail(err);
    } else {
      tweets.forEach(function(tweet) {
        console.log(tweet.id + ": (" + secondsSince(tweet) + "s) @" + tweet.user.screen_name + " \"" + tweet.text + "\"");
      });
      var status = ding(tweets);
      if (status) {
        console.log(status);
        tweet(status);
      }
    }
    succeed("success");
  });
}

exports.handler = function(event, context) {
  search(context.succeed, context.fail);
};

// search(console.log, console.log);
