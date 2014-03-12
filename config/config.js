var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  

module.exports = {
  development: {
    db: 'mongodb://localhost/mydb',
    root: rootPath,
    app: {
      name: 'App DEV'
    }
  }
}

