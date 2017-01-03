var mongoose = require("./schema");

var User = mongoose.model("User")
var Connection = mongoose.model("Connection")

//clear the database
User.remove({}, err => {
  if(err){
    console.log(err)
  }
});

Connection.remove({}, err => {
  if(err){
    console.log(err)
  }
});

// generate instances of User and Connection.
var diana = new User({username: 'dvanvleezy', age: 29, email: "dvanvleet88@gmail.com", state: "VA", hash: "dianaPass"})
var ian = new User({username: 'ihollands', age: 28, email: "ianchollands@gmail.com", state: "DC", hash: "ianPass"})
var alex = new User({username: 'athemanno', age: 26, email: "amanno@gmail.com", state: "NY", hash: "alexPass"})
var liza = new User({username: 'lizabuff', age: 24, email: "lfloyd@gmail.com", state: "MD", hash: "lizaPass"})
var khoi = new User({username: 'khoidafish', age: 24, email: "kfish@gmail.com", state: "MD", hash: "khoiPass"})
var kevin = new User({username: 'tokevinornottokevin', age: 25, email: "kmonahan@gmail.com", state: "TX", hash: "kevinPass"})

var connection1 = new Connection({
  messages: [
              {
                content:"Hey Diana, it's Ian!",
                sent_at: new Date().getTime(),
                user_id: ian._id,
              },
              {
                content: "Hey Ian, it's Diana - this app is awesome!",
                sent_at: new Date().getTime(),
                user_id: diana._id,
              }
            ],
})

var connection2 = new Connection({
  messages: [
              {
                content:"Hey Kevin, it's Khoi!",
                sent_at: new Date().getTime(),
                user_id: khoi._id,
              },
              {
                content: "Hey Khoi, I can't wait to try Ian's new app",
                sent_at: new Date().getTime(),
                user_id: kevin._id,
              }
            ],
})

var connection3 = new Connection({
  messages: [
              {
                content:"Ian, I hate you for making such an awesome app",
                sent_at: new Date().getTime(),
                user_id: alex._id,
              },
              {
                content: "Don't hate the player, hate the game",
                sent_at: new Date().getTime(),
                user_id: ian._id,
              }
            ],
})

var connection4 = new Connection({
  messages: [
              {
                content:"Hey Liza, Ian's told me so much about you",
                sent_at: new Date().getTime(),
                user_id: diana._id,
              },
              {
                content: "It's great to finally meet you",
                sent_at: new Date().getTime(),
                user_id: liza._id,
              }
            ],
})

var connection5 = new Connection({
  messages: [
              {
                content:"You ready to lift some weight, L-sauce?",
                sent_at: new Date().getTime(),
                user_id: kevin._id,
              },
              {
                content: "You know it, K-Hound",
                sent_at: new Date().getTime(),
                user_id: liza._id,
              }
            ],
})

var users = [diana, ian, alex, liza, khoi, kevin]

// assign some connections to each student.

diana.connections.push(connection1, connection4)
ian.connections.push(connection1, connection3)
alex.connections.push(connection3)
liza.connections.push(connection4, connection5)
khoi.connections.push(connection2, connection5)
kevin.connections.push(connection2, connection5)

for(var i = 0; i < users.length; i++){
  users[i].save((err, user) => {
    if (err){
      console.log(err)
    } else {
      console.log(user);
    }
  })
};
