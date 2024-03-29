var fs = require('fs');

var express = require('express');
var socketio = require('socket.io');

var app = module.exports = express.createServer();
var io = socketio.listen(app);

// Configuration

global.settings = JSON.parse(fs.readFileSync(process.argv[2]));
global.settings.host = global.settings.host || 'localhost';
global.settings.port = global.settings.port || 3000;
global.settings.title = global.settings.title || 'TaskPoint';
global.settings.allowAdding = (global.settings.allowAdding == undefined) ? true : global.settings.allowAdding;

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
    settings: global.settings,
    title: global.settings.title,
    todos: global.todos,
    done: global.done,
    scores: getPoints()
  });
});

// socket.io

io.sockets.on('connection', function(socket) {
  socket.on('task-done', function(text) {
    findTask(global.todos, global.done, text, 'task-done', socket, 1);
  });

  socket.on('task-not-done', function(text) {
    findTask(global.done, global.todos, text, 'task-not-done', socket, -1);
  });

  socket.on('new-task', function(task) {
    global.todos.push(task);
    socket.emit('new-task', task);
    socket.broadcast.emit('new-task', task);
  });
});

// Run

app.listen(global.settings.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// Read in data.

fs.readFile(process.argv[3], function(err, data) {
  var data = JSON.parse(data);
  global.todos = data.todos || [];
  global.done = data.done || [];
  global.scores = data.scores || {};

  setInterval(function() {
    fs.writeFile(process.argv[3], JSON.stringify({
      todos: global.todos,
      done: global.done,
      scores: global.scores
    }, null, 2));
  }, 5000);
});

// Functions

function findTask(seqFrom, seqTo, text, eventName, socket, pointMultiplier) {
  for (var i = 0; i < seqFrom.length; i++) {
    if (seqFrom[i].text == text) {
      var item = seqFrom.splice(i, 1)[0];
      seqTo.push(item);
      socket.emit(eventName, item);
      socket.broadcast.emit(eventName, item);
      updatePoints(item.assigned, item.points * pointMultiplier, socket);
      break;
    };
  };
};

function updatePoints(names, points, socket) {
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    if (!global.scores[name]) {
      global.scores[name] = 0;
    };
    global.scores[name] += points / (i + 1);
  };

  var points = getPoints();
  socket.emit('points-update', points);
  socket.broadcast.emit('points-update', points);
};

function getPoints() {
  var scores = (function() {
    var scores = [];
    for (var key in global.scores) {
      if (global.scores.hasOwnProperty(key)) {
        scores.push({
          name: key,
          score: global.scores[key]
        });
      };
    };
    return scores;
  })();

  return scores.sort(function(a, b) {
    return b.score - a.score;
  });
};
