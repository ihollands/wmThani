var express = require("express");
var hbs = require("express-handlebars")
var bodyParser = require("body-parser")
var mongoose = require("./db/schema")

var app = express();

var User = mongoose.model("User")
var Connection = mongoose.model("Connection")

app.set("port", process.env.PORT || 3001)
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname:        ".hbs",
  partialsDir:    "views/",
  layoutsDir:     "views/",
  defaultLayout:  "layout"
}));

app.use("/assets", express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.render("welcome");
});

app.get("/users", function(req, res){
  User.find({}).then(function(users){
    res.render("users-index", {
      users: users
    });
  });
});

app.get("/users/:username", function(req, res){
  User.findOne({username: req.params.username}).then(function(user){
    res.render("users-show", {
      user: user
    });
  });
});

app.post("/users", function(req, res){
  User.create(req.body.user).then(function(user){
    res.redirect("/users/" + user.username);
  });
});

app.post("/users/:username/delete", function(req, res){
  User.findOneAndRemove({username: req.params.username}).then(function(){
    res.redirect("/users")
  });
});

app.post("/users/:username", function(req, res){
  User.findOneAndUpdate({username: req.params.username}, req.body.user, {new: true}).then(function(user){
    res.redirect("/users/" + user.username);
  });
});

app.listen(app.get("port"), function(){
  console.log("It's aliiive!");
});
