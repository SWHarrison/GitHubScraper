var request = require('request');
var cheerio = require('cheerio');
//const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const express = require('express')
const app = express()

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());

app.use(expressValidator());

require('./data/githubContributions-db.js');

const users = require('./controllers/users.js');
const admin = require('./controllers/admin.js');

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

module.exports = app
users(app)
admin(app)

app.listen(process.env.PORT || '4000', () => {
    console.log(`App listening on port 4000!`)
})
