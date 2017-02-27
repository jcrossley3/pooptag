
First, create a file called `creds.js` in this directory that contains
your Twitter credentials like so...

    module.exports = {
        consumer_key: "...",
        consumer_secret: "...",
        access_token_key: "...",
        access_token_secret: "..."
    };

Then run the app from this directory...

    $ npm install
    $ node index.js
