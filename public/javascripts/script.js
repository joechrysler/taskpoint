var socket = io.connect('http://localhost');


$(document).ready(function() {
  registerSocketEvents();

  $('button.done').bind({
    click: function() {
      var text = $('.text', $(this).parent()).html();
      socket.emit('task-done', text);
    }
  });
});


function registerSocketEvents() {
  socket.on('task-done', function(text) {
    var li = $('li.todo .text:contains("' + text + '")').parent();
    var points = $('.points', li).html();
    li.slideUp();

    var base = $($('li.done')[0]).clone();
    $('.text', base).html(text);
    $('.points', base).html(points).removeClass().addClass('points points-' + points);
    $('ul.assigned-to', base).html($('ul.assigned-to', li).html());
    $('ul.done').delay(5000).append(base);
  });
};
