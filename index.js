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
app.use(bodyParser.json());


app.get("/api/users", function(req, res){
  User.find({}).then(function(users){
    res.json(users)
    });
  });

app.get("/api/users/:_id", function(req, res){
  User.findOne({_id: req.params._id}).then(function(user){
    res.json(user)
  });
});

app.post("/api/users", function(req, res){
  User.create(req.body).then(function(user){
    res.json(user);
  });
});

app.delete("/api/users/:_id", function(req, res){
  User.findOneAndRemove({_id: req.params._id}).then(function(){
    res.json({success: true})
  });
});

app.put("/api/users/:_id", function(req, res){
  User.findOneAndUpdate({_id: req.params._id}, req.body, {new: true}).then(function(user){
    res.json(user)
  });
});

app.get("/api/connections", function(req, res){
  Connection.find({}).then(function(connections){
    res.json(connections)
    });
  });

app.get("/api/connections/:_id", function(req, res){
  Connection.findOne({_id: req.params._id}).then(function(connection){
    res.json(connection)
  });
});

app.post("/api/connections", function(req, res){
  Connection.create(req.body).then(function(connection){
    res.json(connection);
  });
});

app.delete("/api/connections/:_id", function(req, res){
  Connection.findOneAndRemove({_id: req.params._id}).then(function(){
    res.json({success: true})
  });
});

app.put("/api/connections/:_id", function(req, res){
  Connection.findOneAndUpdate({_id: req.params._id}, req.body, {new: true}).then(function(connection){
    res.json(connection)
  });
});

app.get("/*", function(req, res){
  res.render("primary")
})

app.listen(app.get("port"), function(){
  console.log("It's aliiive!");
});
