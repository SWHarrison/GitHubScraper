var request = require('request');
var cheerio = require('cheerio');

module.exports = app => {

  app.get('/:user', (req, res) => {

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
            sum += days[day][dayData]
          }
          daysAvg.push({
            Day: dayNames[day],
            averageContributions: sum/days[day].length
          })
        }
        console.log(daysAvg)
        res.json(daysAvg)
      }
    })
  })
}
