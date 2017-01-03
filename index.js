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
  defaultLayout:  "layout-main"
}));

//serves favicon from public/favicon.ico (uncomment when present)
//designates "public" directory as "assets"
//tells body parser to parse JSON
// app.use(favicon(__dirname + '/public/favicon.ico'))
app.use("/assets", express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));


app.get("/api/users", function(req, res){
  User.find({}).then(function(users){
    res.json(users)
    });
  });

app.get("/api/users/:username", function(req, res){
  User.findOne({username: req.params.username}).then(function(user){
    res.json(user)
  });
});

app.post("/api/users", function(req, res){
  User.create(req.body.user).then(function(user){
    res.redirect("/users/" + user.username);
  });
});

app.post("/api/users/:username", function(req, res){
  User.findOneAndRemove({username: req.params.username}).then(function(){
    res.json({success: true})
  });
});

app.post("/api/users/:username", function(req, res){
  User.findOneAndUpdate({username: req.params.username}, req.body.user, {new: true}).then(function(user){
    res.json(user);
  });
});

app.get("/*", function(req, res){
  res.render("primary")
})

app.listen(app.get("port"), function(){
  console.log("It's aliiive!");
});
