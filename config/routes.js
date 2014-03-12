module.exports = function (app) {
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
}