var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, mongoose) {

    var User = mongoose.model('User');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            if(err) done(err);
            done(null, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) {

        User.findOne({ 'email': email }, function(err, user) {
            if (err)
                return done(err);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });

    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {

            User.findOne({ 'email' :  email }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, false, { message: 'That email is already taken.' });
                } else {
                    var newUser = new User();

                    newUser.email    = email;
                    newUser.password = password;

                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });    
        });
    }));
}