var request = require('request');
var cheerio = require('cheerio');
// const DayData = require('../models/dayData');
const User = require('../models/user');
const Key = require('../models/key');

function userCheck (username){
  console.log("searching for " + username)
  User.findOne({
    username: username
  }).then(user => {
    if (!user) {
      new_user = new User()
      new_user.firstRequest = new Date();
      new_user.mostRecentRequest = new Date();
      new_user.username = username;
      new_user.numberOfRequests = 1
      console.log(new_user)
      new_user.save()
    } else {
      console.log("found user")
      console.log(user)
      now = new Date();
      console.log(now.getTime());
      console.log(user.mostRecentRequest.getTime());
      console.log(now.getTime() - user.mostRecentRequest.getTime());
      if(now.getTime() - user.mostRecentRequest.getTime() > 5000){
        user.mostRecentRequest = now;
        user.numberOfRequests += 1
        console.log("updated requests")
      }
      console.log(user)
      user.save()
    }
  })
}

module.exports = app => {

  app.get('/'), (req,res) =>{
    res.redirect('/SWHarrison');
  });
  
  app.get('/favicon.ico', (req, res) => {res.status(204)});

  app.get('/admin/request/:anything', (req, res) => {
    return res.status(401).send({
      message: "Admin requests requires key"
    });
  });

  app.get('/admin/request/all/:key', (req, res) => {
    key = req.params.key;
    Key.findOne({
      key: key
    }).then(key => {
      if(!key){
        return res.status(401).send({
          message: "Invalid Key"
        });
      } else {
        console.log("found key");
        now = new Date();
        if(now.getTime() - key.mostRecentRequest.getTime() > 5000){
          key.mostRecentRequest = now;
          key.requests.push("All users");
          console.log("updated requests")
          key.save()
        }
        User.find().then(users => {
          res.json(users);
        });
      }
    });
  });

  app.get('/admin/request/:user/:key', (req, res) => {
    key = req.params.key;
    Key.findOne({
      key: key
    }).then(key => {
      if(!key){
        return res.status(401).send({
          message: "Invalid Key"
        });
      } else {
        console.log("found key");
        now = new Date();
        if(now.getTime() - key.mostRecentRequest.getTime() > 5000){
          key.mostRecentRequest = now;
          key.requests.push("user:" + req.params.user);
          console.log("updated requests")
          key.save()
        }
        User.findOne({
          username: req.params.user
        }).then(user => {
          res.json(user);
        });
      }
    });
  })

  app.get('/admin/keyRequest', (req, res) => {
    new_key = new Key();
    now = new Date();
    new_key.createdAt = now;
    new_key.mostRecentRequest = now;
    new_key.requests = [];
    let apiKey = "";
    for (let i = 0; i < 15; i += 1){
      let num = Math.floor(Math.random() * 62)
      if (num < 10){
        const digit = String.fromCharCode(num + 48)
        apiKey = apiKey + digit;
      } else if(num < 36){
        const letter = String.fromCharCode(num + 55)
        apiKey = apiKey + letter;
      } else{
        const letter = String.fromCharCode(num + 61);
        apiKey = apiKey + letter;
      }
    }
    new_key.key = apiKey;
    new_key.save();
    res.json(new_key);
  })

  app.get('/:user', (req, res) => {

    userCheck(req.params.user);
    let data = [];

    request('https://github.com/' + req.params.user, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        //Grabs information from given page, goes to item with id #Current_officeholders
        $('div.js-calendar-graph > svg > g > g > rect').each(function(i, element){
            //console.log(raw)
            const contributions = $(this).attr('data-count');
            // console.log(contributions)
            const dataDate = $(this).attr('data-date');
            // console.log(dataDate)
            let object = {
              contribution: contributions,
              dataDate: dataDate
            };
            data.push(object)
            // console.log('added obj')
        })
        console.log('returning data')
        res.json(data)
      }
    })
  })

  app.get('/:user/daily', (req, res) => {

    userCheck(req.params.user);
    let data = [];

    request('https://github.com/' + req.params.user, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        //Grabs information from given page, goes to item with id #Current_officeholders
        $('div.js-calendar-graph > svg > g > g > rect').each(function(i, element){
            //console.log(raw)
            const contributions = $(this).attr('data-count');
            // console.log(contributions)
            const dataDate = $(this).attr('data-date');
            // console.log(dataDate)
            let object = {
              contribution: contributions,
              dataDate: dataDate
            };
            data.push(object)
            // console.log('added obj')
        })
        console.log('returning data')
        let days = {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: []
        }
        for (item in data){
          day = new Date(data[item].dataDate)
          days[day.getDay()].push(data[item].contribution)
        }
        console.log(days)
        dayNames = ['Sunday' , 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        daysAvg = []
        for (day in days){
          let sum = 0
          for (dayData in days[day]){
            sum += parseInt(days[day][dayData])
          }
          daysAvg.push({
            Day: dayNames[day],
            totalContributions: sum,
            averageContributions: sum/days[day].length
          })
        }
        console.log(daysAvg);
        res.json(daysAvg);
      }
    })
  })

  app.get('/:user/monthly', (req, res) => {

    userCheck(req.params.user);
    let data = [];

    request('https://github.com/' + req.params.user, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        //Grabs information from given page, goes to item with id #Current_officeholders
        $('div.js-calendar-graph > svg > g > g > rect').each(function(i, element){
            //console.log(raw)
            const contributions = $(this).attr('data-count');
            // console.log(contributions)
            const dataDate = $(this).attr('data-date');
            // console.log(dataDate)
            let object = {
              contribution: contributions,
              dataDate: dataDate
            };
            data.push(object)
            // console.log('added obj')
        })
        console.log('returning data')
        let months = {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: [],
          9: [],
          10: [],
          11: []
        }
        for (item in data){
          day = new Date(data[item].dataDate);
          months[day.getMonth()].push(data[item].contribution);
        }
        console.log(months);
        monthNames = ['January' , 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        monthAvg = []
        for (month in months){
          let sum = 0
          for (dayData in months[month]){
            sum += parseInt(months[month][dayData]);
          }
          monthAvg.push({
            Month: monthNames[month],
            totalContributions: sum,
            averageContributions: sum/months[month].length
          });
        }
        console.log(monthAvg);
        res.json(monthAvg);
      }
    })
  })
}
