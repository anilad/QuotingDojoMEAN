// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
//Require Mongoose
var mongoose = require('mongoose');
// Use native promises
mongoose.Promise = global.Promise;
// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/quotingDojo');
var QuoteSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 2},
    quote: { type: String, required: false, minlength: 4},
    
}, {timestamps: true });
mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'Quote'
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'Quote'
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');


// Routes
// Root Request
app.get('/', function (req, res) {
    //
    res.render('index')
});
// Add User Request 
app.post('/process', function(req, res) {
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var quote = new Quote({name: req.body.name, quote: req.body.quote});
    // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    quote.save(function(err) {
      // if there is an error console.log that something went wrong!
      if(err){
        res.render('index', {errors: quote.errors, quote:[]})
      } else { // else console.log that we did well and then redirect to the root route
        console.log('successfully added a quote!');
        res.redirect('/quotes');
      }
    })
  })

  app.get('/quotes', function (req, res) {
    var quotes = Quote.find({}, function(err, quotes){
    if(err){
        res.render('quotes', {quotes: []})
    }
    else{
        res.render('quotes', {quotes:quotes});
    }
    }).sort({createdAt:-1});
})
  
// Setting our Server to Listen on Port: 8000
app.listen(8000, function () {
    console.log("listening on port 8000");
})
