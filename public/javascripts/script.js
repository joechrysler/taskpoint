$(document).ready(function() {
  registerWidgetEvents();
  registerSocketEvents();
});


function registerWidgetEvents() {
  $('button.add-task-form').bind({
    click: function() {
      $('div.add-task div.form').slideDown();
      $('button.cancel').slideDown();
      $('button.add-task-form').hide();
      $('button.add-task').show();
    }
  });

  $('button.add-task').bind({
    click: addTask
  });

  $('input.assignee').bind({
    keyup: function(event) {
      if (event.keyCode == 13) {
        addTask();
      };
    }
  });

  $('button.cancel').bind({
    click: resetAddForm
  });

  $('button.add-assignee').bind({
    click: function() {
      $('<input class="assignee" placeholder="Assigned To" />').insertBefore($('button.add-assignee'));
      $('input.assignee:last').focus();
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

  $('input[max="99"]').bind({
    keypress: function(event) {
      if (parseInt($(this).val()) > 9) {
        event.preventDefault();
      }
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
      $('.points', li).html(Math.round(score.score));
      $('ol.scores').append(li);
      li.show();
    });
  });

  socket.on('new-task', function(task) {
    var item = cloneBase('li.todo.base', true);
    $('.text', item).html(task.text);
    $('.points', item).html(task.points).addClass('points-' + task.points);
    $('.due', item).html('Due ' + task.due);

    $(task.assigned).each(function(index, name) {
      $('ul.assigned-to', item).append('<li>' + name + '</li>');
    });

    $('ul.todos').append(item);
    item.slideDown();
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

function resetAddForm() {
  $('div.add-task div.form').slideUp(function() {
    $('textarea[name="text"]').val('');
    $('input[name="due"]').val('');
    $('input[name="points"]').val('0');
    $('input.assignee:first').val('');
    $('input.assignee:not(:first)').remove();
  });
  $('div.add-task button.cancel').slideUp();
  $('button.add-task').hide();
  $('button.add-task-form').show();
};

function addTask() {
  var assignees = [];
  $('input.assignee').each(function(index, assignee) {
    if ($(assignee).val().trim() != '') {
      assignees.push($(assignee).val());
    };
  });

  socket.emit('new-task', {
    text: $('textarea[name="text"]').val(),
    due: $('input[name="due"]').val(),
    points: $('input[name="points"]').val(),
    assigned: assignees
  });

  resetAddForm();
};
