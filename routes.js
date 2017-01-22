var uu = require('underscore')
    , OAuth = require('OAuth');

var sess = '';

var user = '';

var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    'gwaqD0iaPdx1g2XtoFJmu034j',
    'LGLmjpXlAcf5iO6ZNYt0h6iZ3zameCTnLpcb0DVlLEp3RULRP5',
    '1.0A',
    "http:localhost:8080/authorize/twitter/callback",
    'HMAC-SHA1'
);

var indexfn = function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
}

var homefn = function(request, response) {
    response.sendFile(__dirname + '/views/home.html');
}

var oauth_twitter = function(request, response) {
    console.log("hello from twitter");
	
  	oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log(error);
      		  response.send("Authentication Failed!");
          }
        else {
            sess = request.session
            sess.oauth = {
        		token: oauth_token,
        		token_secret: oauth_token_secret
      		};
      		console.log(sess.oauth);
      		response.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    	}
    });
}

var oauth_twitter_callback = function(request, response) {
	console.log("got back from twitter");
  	if (sess.oauth) {
    	sess.oauth.verifier = request.query.oauth_verifier;
    	var oauth_data = sess.oauth;
 
    	oauth.getOAuthAccessToken(
      		oauth_data.token,
      		oauth_data.token_secret,
      		oauth_data.verifier,
      		function(error, oauth_access_token, oauth_access_token_secret, results) {
        		if (error) {
          			console.log(error);
          			response.send("Authentication Failure!");
        		}
        		else {
          			sess.oauth.access_token = oauth_access_token;
          			sess.oauth.access_token_secret = oauth_access_token_secret;
          			console.log(results, sess.oauth);
          			response.redirect('/home');         		}
     		}
    	);
  	}
  	else {
    	response.redirect('/');
  	}
}

var logoutfn = function(request, response) {
    response.redirect('/')
}

var define_routes = function(dict) {
	var toroute = function(item) {
		return uu.object(uu.zip(['path', 'fn'], [item[0], item[1]]));
	};
	return uu.map(uu.pairs(dict), toroute);
}

var ROUTES = define_routes({
	'/': indexfn,
  '/home': homefn,
  '/logout': logoutfn,
	'/authorize/twitter': oauth_twitter,
	'/authorize/twitter/callback': oauth_twitter_callback,
});

module.exports = ROUTES;