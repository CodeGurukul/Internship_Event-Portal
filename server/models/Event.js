var mongoose = require('mongoose'), 
Schema = mongoose.Schema, 
ObjectId = Schema.ObjectId;

//A mongoose Schema
var eventSchema = new mongoose.Schema({
   organizerId:String,
   organizerEmail:String,
   attendees:[String],
   status:Boolean,

profile:{
    title:String,
    location:String,
    startdate:Date,
    enddate:Date,
    time:String,
    duration:String,
    desc:String,
    category:String,
    privateEvent:Boolean,
    },
          img:{ 
              fieldname: String,
              originalname: String,
              name: String,
              encoding: String,
              mimetype: String,
              path: String,
              extension: String,
              size: Number,
              truncated: Boolean,
              buffer: Buffer
             }
});

// Compile Schema into a mongoose Model
var Event = mongoose.model('Event',eventSchema);
module.exports = Event;
