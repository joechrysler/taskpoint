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
    var li = $('li.todo .text:contains("' + doneItem.text + '")').parent();
    li.slideUp();

    var done = $($('li.done.base')[0]).clone();
    done.removeClass('base');
    $('.text', done).html(doneItem.text);
    $('.points', done).html(doneItem.points).addClass('points-' + doneItem.points);
    $('ul.assigned-to', done).html($('ul.assigned-to', li).html());
    $('ul.done').append(done)
    done.delay(400).slideDown();
  });

  socket.on('points-update', function(scores) {
    $('ol.scores').html('');
    $(scores).each(function(index, score) {
      var li = $('li.score.base').clone();
      li.removeClass('base');
      $('.name', li).html(score.name);
      $('.points', li).html(score.score);
      $('ol.scores').append(li);
      li.show();
    });
  });
};
