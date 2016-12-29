var Schema = require("../db/schema.js");
var User = Schema.User;
var Connection = Schema.Connection;

var usersController = {
  index(){
    User.find({}, (err, users) => {
      console.log(users)
    })
  },
  show(req){
    User.findOne({username: req.username}, (err, user) => {
      console.log(user)
    })
  },
  update(req, update){
    User.findOneAndUpdate({username: req.username}, {username: update.username}, {new: true},  (err, user) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(user)
      }
    })
  },
  destroy(req){
    User.findOneAndRemove({username: req.username}, (err, docs) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(docs)
      }
    })
  }
}

usersController.destroy({username: "khoiFishOrNoFish"});
