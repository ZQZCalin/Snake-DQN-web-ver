function load_DOM() {

  if (VERBOSE) console.log('loading DOM');

  // 
  var main_div = document.createElement('div');
  main_div.setAttribute('id', 'main');
  main_div.style.width = MAIN_WIDTH+'px';
  main_div.style.height = MAIN_HEIGHT+'px';
  main_div.style.border = BORDER_LEN+'px dashed #737171';
  document.body.appendChild(main_div);

  var score_board = document.createElement('canvas');
  score_board.setAttribute('id', 'score_board');
  main_div.appendChild(score_board);

  var game_canvas = document.createElement('canvas');
  game_canvas.setAttribute('id', 'game');
  main_div.insertBefore(game_canvas, score_board);

  var game_div = document.createElement('div');
  game_div.setAttribute('id', 'game_div');
  main_div.appendChild(game_div);

  var score_div = document.createElement('div');
  score_div.setAttribute('id', 'score_div');
  score_div.style.width = SCORE_WIDTH+'px';
  score_div.style.height = SCORE_HEIGHT+'px';
  score_div.style.left = SCORE_LEFT+'px';
  score_div.style.top = SCORE_TOP+'px';
  main_div.appendChild(score_div);

  var pause_div = create_DOM(
    '<div>', 'pause_div', ['absolute'],
    0, 0, MAIN_WIDTH-SCORE_WIDTH, MAIN_HEIGHT
  );
  pause_div.css('display', 'none');
  pause_div.appendTo($('#main'));

  var start_div = create_DOM(
    '<div>', 'start_div', ['absolute'],
    0, 0, MAIN_WIDTH, MAIN_HEIGHT
  );
  start_div.appendTo($('#main'));

  // fix area: Score Board
  var BUTTON_WIDTH = 48;
  /*
  visual design 1 (horizontal)
  var RESTART_X = Math.floor((SCORE_WIDTH-2*BUTTON_WIDTH)/3);
  var RESTART_Y = 32;
  var PAUSE_X = 2*RESTART_X + BUTTON_WIDTH;
  var PAUSE_Y = RESTART_Y;

  var TIME_X = RESTART_X;
  var TIME_Y = 0 + BUTTON_WIDTH + RESTART_Y*2;
  var TIME_W = SCORE_WIDTH - RESTART_X*2;
  var TIME_H = 64;*/

  // desgin 2 (vertical)
  var RESTART_X = SCORE_WIDTH - BUTTON_WIDTH - 16;
  var RESTART_Y = 16;
  var PAUSE_X = RESTART_X;
  var PAUSE_Y = 0 + RESTART_Y + BUTTON_WIDTH;

  var restart_button = create_DOM(
    '<div>', 'restart_button', ['button'],
    RESTART_X, RESTART_Y, BUTTON_WIDTH, BUTTON_WIDTH
  );
  restart_button.appendTo($('#score_div'));

  var pause_button = create_DOM(
    '<div>', 'pause_button', ['button'],
    PAUSE_X, PAUSE_Y, BUTTON_WIDTH, BUTTON_WIDTH
  );
  pause_button.appendTo($('#score_div'));

  /*
  var timer_p = create_DOM(
    '<div>', 'timer', ['absolute'],
    TIME_X, TIME_Y, TIME_W, TIME_H
  );
  timer_p.appendTo($('#score_div'));
  */

  // start_div DOMs
  var SCW = 480;
  var SCH = 360;

  var start_center_div = create_DOM(
    '<div>', 'start_center_div', ['absolute'],
    (MAIN_WIDTH-SCW)/2, (MAIN_HEIGHT-SCH)/2, SCW, SCH
  );
  start_center_div.appendTo(start_div);

  var fontSize = 18;

  var p_1 = create_DOM('<p>', 'p_1', ['absolute', 'start_element']);
  p_1.text('Number of rows:');
  p_1.css('top', '30px');
  p_1.appendTo(start_center_div);

  var input_1 = create_DOM('<input>', 'input_1', ['absolute', 'start_element'],);
  input_1.css('top', '75px');
  input_1.attr('placeholder', '1 - 20');
  input_1.appendTo(start_center_div);

  var p_2 = create_DOM('<p>', 'p_2', ['absolute', 'start_element']);
  p_2.text('Number of columns:');
  p_2.css('top', '110px');
  p_2.appendTo(start_center_div);

  var input_2 = create_DOM('<input>', 'input_2', ['absolute', 'start_element']);
  input_2.css('top', '155px');
  input_2.attr('placeholder', '1 - 30');
  input_2.appendTo(start_center_div);

  var p_3 = create_DOM('<p>', 'p_3', ['absolute', 'start_element']);
  p_3.text('Number of bombs:');
  p_3.css('top', '190px');
  p_3.appendTo(start_center_div);

  var input_3 = create_DOM('<input>', 'input_3', ['absolute', 'start_element']);
  input_3.css('top', '235px');
  input_3.appendTo(start_center_div);

  var button = create_DOM('<button>', 'button_1', ['absolute']);
  button.text('Start');
  button.appendTo(start_center_div);

  var p_err1 = create_DOM('<p>', 'p_err1', ['absolute', 'p_error']);
  p_err1.css('top', '90px');
  p_err1.appendTo(start_center_div);
  input_1.data('pid', 'p_err1');

  var p_err2 = create_DOM('<p>', 'p_err2', ['absolute', 'p_error']);
  p_err2.css('top', '170px');
  p_err2.appendTo(start_center_div);
  input_2.data('pid', 'p_err2');

  var p_err3 = create_DOM('<p>', 'p_err3', ['absolute', 'p_error']);
  p_err3.css('top', '250px');
  p_err3.appendTo(start_center_div);
  input_3.data('pid', 'p_err3');

  var IW = 200; // input width
  $('p.start_element').css('font-size', '18px');
  $('.start_element, p.p_error').css('left', (SCW-IW)/2+'px');
  $('input.start_element').css('width', IW+'px');
  $('input.start_element').css('font-size', '18px');

  if (VERBOSE) console.log('DOM loaded');
}
