var request = require('request');
var cheerio = require('cheerio');
const DayData = require('../models/dayData');
const User = require('../models/user');

module.exports = app => {

  app.get('/:user', (req, res) => {

    console.log("searching for " + req.params.user)
    User.findOne({
      username: req.params.user
    }).then(user => {
      if (!user) {
        new_user = new User()
        new_user.username = req.params.user
        new_user.numberOfRequests = 1
        console.log(new_user)
        new_user.save()
      } else {
        console.log("found user")
        console.log(user)
        user.numberOfRequests += 1
        user.save()
      }
    })
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
        console.log(daysAvg)
        res.json(daysAvg)
      }
    })
  })

  app.get('/:user/monthly', (req, res) => {

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
          day = new Date(data[item].dataDate)
          months[day.getMonth()].push(data[item].contribution)
        }
        console.log(months)
        monthNames = ['January' , 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        monthAvg = []
        for (month in months){
          let sum = 0
          for (dayData in months[month]){
            sum += parseInt(months[month][dayData])
          }
          monthAvg.push({
            Month: monthNames[month],
            totalContributions: sum,
            averageContributions: sum/months[month].length
          })
        }
        console.log(monthAvg)
        res.json(monthAvg)
      }
    })
  })
}
