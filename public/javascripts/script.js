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

    var done = $($('li.done.base')[0]).clone();
    done.removeClass('base');
    $('.text', done).html(text);
    $('.points', done).html(points).addClass('points-' + points);
    $('ul.assigned-to', done).html($('ul.assigned-to', li).html());
    $('ul.done').append(done)
    done.delay(400).slideDown();
  });

  socket.on('points-update', function(scores) {
    $('ol.scores').slideUp(function() {
      $('ol.scores').html('');
      $(scores).each(function(index, score) {
        var li = $('li.score.base').clone();
        li.removeClass('base');
        $('.name', li).html(score.name);
        $('.points', li).html(score.score);
        $('ol.scores').append(li);
        li.show();
      });
      $('ol.scores').slideDown();
      console.log($('ol.scores'));
    });
  });
};
