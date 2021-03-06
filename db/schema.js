var mongoose = require("mongoose");

var options = { server: {socketOptions: {keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb://heroku_b2tgwfj2:'+ process.env.pass + '@ds159978.mlab.com:59978/heroku_b2tgwfj2'

mongoose.Promise = global.Promise
mongoose.connect(mongodbUri, options)

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

mongoose.connection.once('open', err => {
  if (err) {
    console.log(err)
  }
  else {
    console.log("open")
  }
})

var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId


var ConnectionSchema = new Schema({
  users:[ObjectId],
  messages: [{content:String, sent_at: Date, user_id: ObjectId}],
})

var UserSchema = new Schema({
  email: {
      type: String,
      match: /.+\@.+\..+/
    },
  hash: {
      type: String,
      minlength: [6, "Password must be 6 or more characters"]
    },
  salt: String,
  username: {
      type: String,
      unique: true,
      required: true
    },
  age: {
    type: Number,
    min: [14, "Too young! You must be age 14 or older to use this app"],
    max: [99, "Too old! Please enter an age between 14 and 99"],
  },
  weight: Number,
  workout_freq: {
    type: Number,
    min: 1,
    max: 14,
  },
  workout_time: {
    type: Number,
    min: 1,
    max: 24,
  },
  first_name: String,
  last_name: String,
  img_url: String,
  city: String,
  state: {
      type: String,
      maxlength: [2, "Two-letter state abbreviations only"],
      enum: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"]
    },
  zip: {
      type: Number,
      validate: [
      function(zip) {
        return zip.toString().length === 5;
      },
      'Please enter a valid ZIP code'
    ]
  },
  street_address1: String,
  street_address2: String,
  bench: Number,
  squat: Number,
  deadlift: Number,
  gym: String,
  connections: ["Connection"]
})

var Connection = mongoose.model("Connection", ConnectionSchema)
var User = mongoose.model("User", UserSchema)



module.exports = mongoose
