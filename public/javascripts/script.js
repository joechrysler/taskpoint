var socket = io.connect('http://localhost');


$(document).ready(function() {
  registerSocketEvents();
  registerWidgetEvents();
});


function registerWidgetEvents() {
  $('button.done').bind({
    click: function() {
      var text = $('.text', $(this).parent()).html();
      socket.emit('task-done', text);
    }
  });

  $('button.not-done').bind({
    click: function() {
      var text = $('.text', $(this).parent()).html();
      socket.emit('task-not-done', text);
    }
  });
};

function registerSocketEvents() {
  socket.on('task-done', function(doneItem) {
    addTo('li.done.base', 'li.todo', 'ul.done', doneItem);
  });

  socket.on('task-not-done', function(undoneItem) {
    addTo('li.todo.base', 'li.done', 'ul.todos', undoneItem, function(undone) {
      $('.due', undone).html('Due ' + undoneItem.due);
    });
  });

  socket.on('points-update', function(scores) {
    $('ol.scores').html('');
    $(scores).each(function(index, score) {
      var li = cloneBase('li.score.base');
      $('.name', li).html(score.name);
      $('.points', li).html(score.score);
      $('ol.scores').append(li);
      li.show();
    });
  });
};

function cloneBase(selector, cloneBehavior) {
  var cloned = $($(selector)[0]).clone(cloneBehavior || false);
  cloned.removeClass('base');
  return cloned;
};

function addTo(baseSelector, liSelector, newList, data, additionalActions) {
  var previousContext = $(liSelector + ' .text:contains("' + data.text + '")').parent();
  previousContext.slideUp();

  var item = cloneBase(baseSelector, true);
  $('.text', item).html(data.text);
  $('.points', item).html(data.points).addClass('points-' + data.points);
  $('ul.assigned-to', item).html($('ul.assigned-to', previousContext).html());
  $(newList).append(item);
  if (additionalActions) additionalActions(item);
  item.delay(400).slideDown();
};
