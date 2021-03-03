var dialog = document.querySelector('dialog');
var btn_show = document.getElementById('show');
var btn_close = document.getElementById('close');


btn_show.addEventListener('click', function() {
    dialog.showModal();
  }, false);
  
  btn_close.addEventListener('click', function() {
    dialog.close();
  }, false);