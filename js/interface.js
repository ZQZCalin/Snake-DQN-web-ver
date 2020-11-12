function game_start() {
  alert('pressed');
}

function load_interface() {
  var start_button = document.getElementById('start_button');
  start_button.onclick = function() {
    game_start();
  };
}
