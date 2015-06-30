var mongoose= require('mongoose');

//A mongoose Schema
var eventSchema = new mongoose.Schema({
   organizerId:String,
   organizerEmail:String,
   attendees:[{id:String}],

profile:{
    tilte:String,
    location:String,
    startdate:Date,
    enddate:Date,
    time:String,
    duration:String,
    desc:String,
    category:String
       }

});

// Compile Schema into a mongoose Model
var Event = mongoose.model('Event',eventSchema);
module.exports = Event;