module.exports = function (app, passport) {
	// Include controllers
    var treasures = require('../app/controllers/treasures');
    var users = require('../app/controllers/users');

    // Treasure routes
    app.get('/treasures/:lat/:lng', treasures.getTreasures);
    app.get('/treasure/:id/:lat/:lng', treasures.getTreasureById);
    app.get('/treasures/:id', treasures.getTreasuresByUser);
    app.post('/treasure', treasures.postTreasure);
    app.put('/treasure/:id', treasures.postComment);
    app.delete('/treasure/:id', treasures.deleteTreasure);

    // User routes
    app.get('/users', users.getUsers);
    app.post('/user', users.postUser);

    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                return res.send({ success : false, message : 'Authentication failed', token: null });
            }
            return res.send({ success : true, message : 'Authentication succeeded', token: user.id });
      })(req, res, next);
    });

    app.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err); }
            if (!user) {
                return res.send({ success : false, message : 'Registration failed' });
            }
            return res.send({ success : true, message : 'Registration succeeded' });
        })(req, res, next); 
    });

    app.get('/logout', function(req, res) { 
        req.logout();
        res.send({ success : true, message : 'User logged out' });
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    //res.redirect('/login');
}