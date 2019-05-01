var request = require('request');
var cheerio = require('cheerio');
const User = require('../models/user');

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

// Returns raw data scrapped from a user's github page
function webScrape(username){

  return new Promise(resolve => {
    let data = []
    request('https://github.com/' + username, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        //Grabs information on user's contributions from their github page
        $('div.js-calendar-graph > svg > g > g > rect').each(function(i, element){
            const contributions = $(this).attr('data-count');
            const dataDate = $(this).attr('data-date');
            let object = {
              contribution: contributions,
              dataDate: dataDate
            };
            data.push(object)
        })
        resolve(data)
      }
    })
  })
}

module.exports = app => {

  app.get('/', (req,res) =>{
    res.redirect('/SWHarrison');
  });

  // Catches favicon.ico requests
  app.get('/favicon.ico', (req, res) => {res.status(204)});

  //Returns data for past year of github contributions
  app.get('/:user', async (req, res, next) => {
    try{
      userCheck(req.params.user);
      const data = await webScrape(req.params.user)
      console.log('returning data')
      res.json(data)
    } catch (err){
      next(err)
    }
  })

  //Returns data for past year of github contributions by day of week
  app.get('/:user/daily', async (req, res) => {
    try{
      userCheck(req.params.user);
      const data = await webScrape(req.params.user)

      let days = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      }

      // Gets day of each data point's date and adds it to appropriate index
      for (item in data){
        day = new Date(data[item].dataDate)
        days[day.getDay()].push(data[item].contribution)
      }
      dayNames = ['Sunday' , 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      daysAvg = []

      // Averages total contributions for each day of week
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
      res.json(daysAvg);
      console.log('returning data')
    } catch (err){
      next(err)
    }
  })

  //Returns data for past year of github contributions by month of year
  app.get('/:user/monthly', async (req, res) => {
    try{
      userCheck(req.params.user);
      const data = await webScrape(req.params.user)

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

      // Gets day of each data point's date and adds it to appropriate index
      for (item in data){
        day = new Date(data[item].dataDate);
        months[day.getMonth()].push(data[item].contribution);
      }

      // Averages total contributions for each day of week
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
      console.log('returning data')
      res.json(monthAvg);
    } catch (err){
      next(err)
    }
  })
}
