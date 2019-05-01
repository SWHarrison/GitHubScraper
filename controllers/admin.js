const User = require('../models/user');
const Key = require('../models/key');

module.exports = app => {

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
}
