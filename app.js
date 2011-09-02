var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({src: __dirname + '/public'}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({dumpExceptions: true, showStack: true})); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'TaskPoint',
    todos: [
      {
        text: 'Find the toriadors!',
        points: 12,
        assigned: ['Dan', 'Tony the Terrible Gladiator'],
        due: 'June 3, 2012'
      },
      {
        text: 'Move the cat.',
        points: 15,
        assigned: ['Wanda, King of the Fish People', 'Arnie', 'Alonzo', 'Rosencrantz & Guildenstern'],
        due: 'Monday'
      },
      {
        text: 'Figure of if Irene is really a goat or if that\'s just a title.',
        points: 3,
        assigned: ['Merv Dole', 'Irene the Goat', 'Walter'],
        due: 'day after tomorrow'
      }
    ]
  });
});

// Run

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
