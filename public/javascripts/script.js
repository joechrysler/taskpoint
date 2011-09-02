$(document).ready(function() {
  $('button.done').bind({
    click: function() {
      $(this).parent().slideUp();
    }
  });
});
