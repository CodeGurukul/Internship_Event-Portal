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
    img: String
    
    }

});

// Compile Schema into a mongoose Model
var Event = mongoose.model('Event',eventSchema);
module.exports = Event;
