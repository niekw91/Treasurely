module.exports = function (app, passport, sse, fs) {
	// Include controllers
    var treasures = require('../app/controllers/treasures');
    var users = require('../app/controllers/users');
    var comments = require('../app/controllers/comments');

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

    // File get route
    app.get('/treasure/image/:id', treasures.getTreasureImage);

    // File upload route
    app.post('/upload', function (req, res) {
        setTimeout(
            function () {
                res.setHeader('Content-Type', 'text/html');
                if (req.files.length == 0 || req.files.file.size == 0)
                    res.send({ msg: 'No file uploaded at ' + new Date().toString() });
                else {
                    var file = req.files.file;
                    var treasureId = req.body.id;
                    fs.readFile(file.path, function (err, data) {
                        if (err) throw err;
                        var newPath = __dirname + "/../img/" + new Date().getTime() + '-' + file.name;
                        fs.writeFile(newPath, data, function (err) {
                            if (err) throw err;

                            treasures.updateTreasureImagePath(treasureId, newPath, function() {
                                res.send(true);
                            })
                        });
                    });
                }
            },
            (req.param('delay', 'yes') == 'yes') ? 2000 : -1
        );
    });

    // Server sent events
    app.get('/stream/dropcount', function(req, res) {
  
        var event = 'date';
  
        sse.writeSSEHead(req, res, function(req, res) {
            sse.writeSSEData(req, res, event, 0, function(req, res) {
                intervalx = setInterval(function() {
                    treasures.getTreasureCount(function(count) {
                        sse.writeSSEData(req, res, event, count);
                    })
                }, 5000);
  
                req.connection.addListener("close", function() {
                    clearInterval(intervalx);
                });
            });
        });
    });

    // Comment routes
    app.get('/comments/:id', comments.getComments);

    // Authentication routes
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

// // route middleware to make sure a user is logged in
// function isLoggedIn(req, res, next) {
//     console.log('user logged in: ' + req.isAuthenticated());
//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     //res.redirect('/login');
// }