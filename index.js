var express = require("express");
var bodyParser = require("body-parser")
var app = express();

app.set("view engine", "hbs");

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var bottles = require("./public/js/controllers/bottles.js");

app.get("/", (req, res) => {
  res.render("welcome");
});

app.get("/:numberOfBottles?", bottles.index )

app.post("/", (req, res) => {
  res.render("index", {
    player_name: req.body.player_name,
    bottles: 99,
    next: 98
  });
});

app.post("/", (req, res) => {
  res.send(`hello ${req.body.player_name}`)
})

app.listen(4000, () => {
  console.log("app listening on port 4000");
});
