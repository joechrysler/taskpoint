var socket = io.connect('http://localhost');


$(document).ready(function() {
  registerWidgetEvents();
  registerSocketEvents();
});


function registerWidgetEvents() {
  $('button.add-task').bind({
    click: function() {
      $('div.add-task div.form').slideDown();
      $('button.cancel').slideDown();
      $('button.add-task').removeClass('faded');
    }
  });

  $('button.cancel').bind({
    click: function() {
      $('div.add-task div.form').slideUp(function() {
        $('textarea[name="name"]').val('');
        $('input[name="due"]').val('');
        $('input[name="points"]').val('0');
        $('input.assignee:first-child').val('');
        $('input.assignee:not(:first-child)').remove();
      });
      $('div.add-task button.cancel').slideUp();
    }
  });

  $('button.add-assignee').bind({
    click: function() {
      $('<input class="assignee" placeholder="Assigned To" />').insertBefore($('button.add-assignee'));
    }
  });

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
