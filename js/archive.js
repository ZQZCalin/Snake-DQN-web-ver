
function create_DOM(element, id, classList, x, y, w, h) {
    var temp = $(element);
    for (var i = 0; i < classList.length; i++) {
      temp.addClass(classList[i]);
    }
    temp.attr('id', id);
    if (x!=undefined && y!=undefined && w!=undefined && h!=undefined) {
      temp.attr('style', 'left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px;');
    }
    return temp;
  }
  
  function drawAtDOM(image, ctx, jquery_element) {
    var e = jquery_element;
    image.draw( ctx, parseInt(e.css('left')), parseInt(e.css('top')),parseInt(e.css('width')),parseInt(e.css('height')) );
  }
  
  
  function time_toString() {
    var timer;
    var second = Math.floor(time % 60);
    var minute = Math.floor(time/60);
    if (second < 10) second = '0' + second;
    if (minute < 10) minute = '0' + minute;
    timer = minute+':'+second;
    return timer;
  }
  
  function timer() {
    var context = Context_score;
    var fontSize1 = 32;
    var fontSize2 = 36;
    var x = 24;
    var y1 = 24 + fontSize1;
    var y2 = 72 + fontSize2;
  
    context.clearRect(0, 0, 128, 128);
    context.fillStyle = '#737171';
    context.textAlign = 'left';
    context.font = fontSize1+'px Arial';
    context.fillText('Timer:', x, y1);
    context.font = fontSize2+'px Arial';
    context.fillText(time_toString(), x, y2);
  }
  
  function start_timer() {
    timing = true;
  }
  
  function stop_timer() {
    timing = false;
  }
  
  function update_timer() {
    var timerA = new Date;
    var myTimer = setInterval(function() {
      var timerB = new Date;
      if (timing) {
        time += (timerB - timerA)/1000;
        timer();
      }
      timerA = timerB;
    }, 100);
  
  }
  
  function circle_progress(context, x, y, p, t, color) {
  
    context.beginPath();
    context.save();
    context.arc(x, y, PROGRESS_RADIUS+(PROGRESS_WIDTH+PROGRESS_BORDER)/2, -Math.PI/2, Math.PI*1.5);
    context.arc(x, y, PROGRESS_RADIUS-(PROGRESS_WIDTH+PROGRESS_BORDER)/2, -Math.PI/2, Math.PI*1.5);
    context.lineWidth = PROGRESS_BORDER;
    context.strokeStyle = '#737171';
    context.stroke();
    context.restore();
  
    load_circle(context, x, y, p/t, color);
    load_circle_num(context, x, y, p, t);
  }
  
  function load_circle(context, x, y, p, color) {
    var START_RADIAN = -Math.PI/2;
    var END_RADIAN = START_RADIAN + 2*Math.PI*p;
  
    context.save();
  
    context.beginPath();
    context.arc(x, y, PROGRESS_RADIUS, -Math.PI/2, Math.PI*1.5, false);
    context.lineWidth = PROGRESS_WIDTH;
    context.strokeStyle = '#E7E6E6';
    context.stroke();
  
    context.beginPath();
    context.arc(x, y, PROGRESS_RADIUS, START_RADIAN, END_RADIAN, false);
    context.lineWidth = PROGRESS_WIDTH;
    context.strokeStyle = color;
    context.stroke();
  
    context.restore();
  
  }
  
  function load_circle_num(context, x, y, p, t) {
    var fontSize = 24;
    var dx = 45;
    var dy = 20;
  
    context.save();
  
    context.beginPath();
    context.clearRect(x-dx, y-dy, 2*dx, 2*dy);
    context.fillStyle = '#737171';
    context.font = fontSize+'px Arial';
    context.textAlign = 'center';
    context.fillText(p+'/'+t, x, y+fontSize/3);
  
    context.restore();
  
  }
  
  function initialize_game(m, n, nbomb) {
    initialize_parameter(m, n, nbomb);
    initialize_canvas();
    initialize_tile();
    initialize_score_board();
  }
  
  function initialize_parameter(m, n, nbomb) {
    // fundamental
    if (m<=10 && n <= 15) {
      TILE_WIDTH = 40;
    } else if (m<=20 && n <= 30) {
      TILE_WIDTH = 20;
    } else {  // maximum: m<=36, n<=50
      TILE_WIDTH = 15;
    }
    BOARD_M = m;
    BOARD_N = n;
    NUM_BOMB = nbomb;
    NUM_TILE = BOARD_M * BOARD_N;
    BOARD = generate_board(BOARD_M, BOARD_N, NUM_BOMB);
    BOARD_MXN = generate_2dboard(BOARD_M, BOARD_N, BOARD);
    BOARD_NUM = generate_numboard(BOARD_MXN);
  
    // visual
    BOARD_WIDTH = BOARD_N*TILE_WIDTH;
    BOARD_HEIGHT = BOARD_M*TILE_WIDTH;
    BOARD_LEFT = (MAIN_WIDTH-SCORE_WIDTH-BOARD_WIDTH)/2;
    BOARD_TOP = (MAIN_HEIGHT-BOARD_HEIGHT)/2;
  
    // instance
    if_lose = false;
    num_covered = NUM_TILE;
    player_board = new Array(NUM_TILE).fill(0);
    uncover_index = new Array();
    time = 0;
    timing = false;
  }
  
  function initialize_canvas() {
  
    HTML_game = new HTML('game');
    HTML_game.setSize(BOARD_WIDTH, BOARD_HEIGHT);
    HTML_game.setPosition(BOARD_LEFT, BOARD_TOP);
    Context_game = HTML_game.getContext();
  
    HTML_score = new HTML('score_board');
    HTML_score.setSize(SCORE_WIDTH, SCORE_HEIGHT);
    HTML_score.setPosition(SCORE_LEFT, SCORE_TOP);
    Context_score = HTML_score.getContext();
  
    var game_div = document.getElementById('game_div');
    game_div.style.width = BOARD_WIDTH+'px';
    game_div.style.height = BOARD_HEIGHT+'px';
    game_div.style.left = BOARD_LEFT+'px';
    game_div.style.top = BOARD_TOP+'px';
  
  }
  
  function initialize_tile() {
    // first delete all sub divs in 'game_div'
    $('#game_div').empty();
  
    for (var i = 0; i < BOARD.length; i++) {
      var m = Math.floor(i/BOARD_N);
      var n = i % BOARD_N;
      // var div_id = 'r'+m+'c'+n;
      var div_id = i;
      var div_class = null;
      if (BOARD[i] == 0) {
        div_class = 'non-mine';
      } else {
        div_class = 'mine';
      }
      generate_tile(n*TILE_WIDTH, m*TILE_WIDTH, div_id, div_class);
    }
    if (VERBOSE) console.log('tile initialized');
  }
  
  function initialize_score_board() {
    //
    drawAtDOM(replay, Context_score, $('#restart_button'));
    drawAtDOM(pause, Context_score, $('#pause_button'));
    $('#pause_button').data('pausing', false);
  
    timer();
  
    // update progress
    var num_flag = player_board.reduce((a,b)=>a+b, 0);
    var total_flag = NUM_BOMB;
    var num_uncovered = NUM_TILE - num_covered;
    var total_uncovered = NUM_TILE-NUM_BOMB;
    var y1 = SCORE_HEIGHT - 300 + 16;
    var y2 = SCORE_HEIGHT - 100;
    circle_progress(Context_score, SCORE_WIDTH/2, y1, num_flag, total_flag, COLOR_FLAG);
    circle_progress(Context_score, SCORE_WIDTH/2, y2, num_uncovered, total_uncovered, COLOR_TILE);
  }
  
  function win() {
    if (num_covered == NUM_BOMB) {
      // reveal all tiles
      return true;
    } else if (NUM_BOMB == player_board.reduce((a,b)=>a+b, 0)) {
      // reveal all flags
      for (var i = 0; i < BOARD.length; i++) {
        if (BOARD[i] != player_board[i] && BOARD[i] == 1) {
          return false;
        }
      }
      return true;
    }
  }
  
  function check_game_end() {
    // console.log('checking game state', num_covered, NUM_BOMB);
    if (if_lose) {
      alert('you lose!');
    } else if (win()) {
      alert('you win!');
    } else {
      return;
    }
    stop_timer();
    alert('you use '+time_toString());
    alert('press \'ok\' to start a new game');
    restart_game();
  }
  
  function restart_game() {
    $('#start_div').css('display', 'block');
  }
  
  // tile click events
  
  function tile_events() {
    // hide context menu
    $('body').on('contextmenu', '.tile', function() {
      return false;
    });
  
    // any click, triggered after all clicks (setTimeout: 10ms)
    $('body').on('mouseup', '.tile', function() {
      setTimeout(function() {check_game_end();}, 10);
    });
  
    // left click
    $('body').on('click', '.tile', function() {
    // $('.tile').click(function() {
      var classList = $(this).attr('class').split(/\s+/);
      var i = parseInt($(this).attr('id'));
      var x = $(this).data('x');
      var y = $(this).data('y');
  
      if (if_hover($(this))) {
        $(this).addClass('clicked');
        if (classList.includes('mine')) {
          // mine events
          tile_plain.draw(Context_game, x, y, TILE_WIDTH, TILE_WIDTH);
          bomb.draw(Context_game, x, y, TILE_WIDTH, TILE_WIDTH);
          if_lose = true;
        } else {
          // non-mine events
          // --- visual level ---
          var m = Math.floor(i/BOARD_N);
          var n = i % BOARD_N;
          var nbomb = BOARD_NUM[m][n];
          uncover_tile(x, y, nbomb);
          // --- logic level ---
          $(this).addClass('dblclick');
          num_covered--;
  
        }
      }
    });
  
    // right click
    $('body').on('mousedown', '.tile', function(e) {
      if (e.button == 2) {
        var classList = $(this).attr('class').split(/\s+/);
        var index = parseInt($(this).attr('id'));
        var x = $(this).data('x');
        var y = $(this).data('y');
  
        if (! classList.includes('clicked')) {
          if (! classList.includes('flag')) { // non-flag
            $(this).addClass('flag');
            player_board[index] = 1;
            flag.draw(Context_game, x, y, TILE_WIDTH, TILE_WIDTH);
  
          } else {        // flag
            $(this).removeClass('flag');
            player_board[index] = 0;
            tile_hover.draw(Context_game, x, y, TILE_WIDTH, TILE_WIDTH);
          }
        }
      }
    });
  
    // double click
    $('body').on('dblclick', '.tile', function() {
    // $('.tile').dblclick(function () {
      var classList = $(this).attr('class').split(/\s+/);
      var i = parseInt($(this).attr('id'));
      var m = Math.floor(i/BOARD_N);
      var n = i % BOARD_N;
  
      if (classList.includes('dblclick')) {
        if (AcontainsB(uncover_index, [m, n])) return;
        if (BOARD_NUM[m][n] != 0) return;
        var uncovArr = dblclick_uncover([], [[m, n]]);
  
        for (var i = 0; i < uncovArr.length; i++) {
          var index = uncovArr[i];
          var tm = parseInt(index[0]);
          var tn = parseInt(index[1]);
          var ti = tm*BOARD_N + tn;
  
          var classList = $('#'+ti).attr('class').split(/\s+/);
          if (classList.includes('dblclick')) continue;
  
          var x = tn * TILE_WIDTH;
          var y = tm * TILE_WIDTH;
          uncover_tile(x, y, BOARD_NUM[tm][tn]);  // visual
  
          $('#'+ti).addClass('clicked');
          $('#'+ti).addClass('dblclick');
          uncover_index.push(index);
          num_covered--;                          // logical
        }
      }
    });
  
    // hover
    $('body').on('mouseenter', '.tile', function() {
    // $('.tile').hover(function () {
      if (if_hover($(this))) {
        var x = $(this).data('x');
        var y = $(this).data('y');
        tile_hover.draw(Context_game, x, y, TILE_WIDTH, TILE_WIDTH);
      }
    });
  
    $('body').on('mouseleave', '.tile', function() {
      if (if_hover($(this))) {
        var x = $(this).data('x');
        var y = $(this).data('y');
        tile.draw(Context_game, x, y, TILE_WIDTH, TILE_WIDTH);
      }
    });
  
  }
  
  function if_hover(element) {
    var classList = element.attr('class').split(/\s+/);
    return !classList.includes('clicked') && !classList.includes('flag');
  }
  
  function uncover_tile(x, y, nbomb) {
    var w = TILE_WIDTH;
    var temp_img;
    tile_plain.draw(Context_game, x, y, w, w);
    if (nbomb == 1) {
      temp_img = one;
    } else if (nbomb == 2) {
      temp_img = two;
    } else if (nbomb == 3) {
      temp_img = three;
    } else if (nbomb == 4) {
      temp_img = four;
    } else if (nbomb == 5) {
      temp_img = five;
    } else if (nbomb == 6) {
      temp_img = six;
    } else if (nbomb == 7) {
      temp_img = seven;
    } else if (nbomb == 8) {
      temp_img = eight;
    } else {
      return;
    }
    temp_img.draw(Context_game, x, y, w, w);
  }
  
  function AcontainsB(arrA, arrB) {
    for (var i = 0; i < arrA.length; i++) {
      if (AeqB(arrA[i], arrB)) return true;
    }
    return false;
  }
  
  function AeqB(arrA, arrB) {
    if (arrA.length != arrB.length) return false;
    for (var i = 0; i < arrA.length; i++) {
      if (arrA[i] != arrB[i]) return false;
    }
    return true;
  }
  
  function dblclick_uncover(uncovArr, tempArr) {
    if (tempArr.length == 0) return uncovArr;
  
    var m = parseInt(tempArr[0][0]);
    var n = parseInt(tempArr[0][1]);
    tempArr.splice(0, 1);
  
    for (var i = -1; i < 2; i++) {
      if (m+i < 0 || m+i >= BOARD_M) continue;
      for (var j = -1; j < 2; j++) {
        if (Math.abs(i) == Math.abs(j)) continue;
        if (n+j < 0 || n+j >= BOARD_N) continue;
  
        var ti = [m+i, n+j];
        if (AcontainsB(uncovArr, ti)) continue;
        if (BOARD_MXN[m+i][n+j] == 1) continue;
        uncovArr.push(ti);
        if (BOARD_NUM[m+i][n+j] != 0) continue;
        tempArr.push(ti);
      }
    }
    return dblclick_uncover(uncovArr, tempArr);
  }
  
  function dblclick_uncover_whole_board(uncovArr, tempArr) {
    if (tempArr.length == 0) return uncovArr;
  
    var m = parseInt(tempArr[0][0]);
    var n = parseInt(tempArr[0][1]);
    tempArr.splice(0, 1);
  
    for (var i = -1; i < 2; i++) {
      if (m+i < 0 || m+i >= BOARD_M) continue;
      for (var j = -1; j < 2; j++) {
        if (n+j < 0 || n+j >= BOARD_N) continue;
        var ti = [m+i, n+j];
        if (!AcontainsB(uncovArr, ti) && BOARD_MXN[m+i][n+j]!=1) {
          uncovArr.push(ti);
          tempArr.push(ti);
        }
      }
    }
    return dblclick_uncover(uncovArr, tempArr);
  }
  
  // button click events
  
  function button_events() {
    $('.button').mousedown(function(e) {
      if (e.button == 0) {
        var id = $(this).attr('id');
        var button_click;
        if (id == 'restart_button') {
          button_click = replay_click;
        } else if (id == 'pause_button') {
          if ($(this).data('pausing')) {
            button_click = resume_click;
          } else {
            button_click = pause_click;
          }
        }
        drawAtDOM(button_click, Context_score, $(this));
      }
    });
  
    $('div.button').mouseup(function(e) {
      if (e.button == 0) {
        var id = $(this).attr('id');
        var button_unclick;
        if (id == 'restart_button') {
          button_unclick = replay;
        } else if (id == 'pause_button') {
          if ($(this).data('pausing')) {
            button_unclick = pause;
          } else {
            button_unclick = resume;
          }
        }
        drawAtDOM(button_unclick, Context_score, $(this));
  
        if ($(this).attr('id') == 'pause_button') {
          if ($(this).data('pausing')) {
            // resume game
            $(this).data('pausing', false);
            drawAtDOM(pause, Context_score, $(this));
            start_timer();
            $('#pause_div').css('display', 'none');
  
          } else {
            // pause game
            $(this).data('pausing', true);
            drawAtDOM(resume, Context_score, $(this));
            stop_timer();
            $('#pause_div').css('display', 'block');
  
          }
        } else if ($(this).attr('id') == 'restart_button') {
          restart_game();
        }
  
      }
    });
  }
  
  function start_div_events() {
    $('body').on('click', '#button_1', function() {
      var m = $('#input_1').val();
      var n = $('#input_2').val();
      var nbomb = $('#input_3').val();
  
      var v1 = test_input($('#input_1'), 1, 36);
      var v2 = test_input($('#input_2'), 1, 50);
      var v3 = test_input($('#input_3'), 0, m*n);
  
      if (v1 && v2 && v3) {
        initialize_game(m, n, nbomb);
        $('#start_div').css('display', 'none');
        start_timer();
      }
    });
  }
  
  function test_input(input, min, max) {
    var x = input.val();
    var pid = input.data('pid');
    var valid = false;
  
    $('#'+pid).text('');
  
    try {
      if (x == "") throw "empty";
      if (isNaN(x)) throw "not a number";
      x = Number(x);
      if (x < min) throw "too low";
      if (x > max) throw "too high";
      valid = true;
    }
    catch(err) {
      $('#'+pid).text(input.attr('id')+" is " + err);
    }
    return valid;
  }
  
  function update_progress() {
    var FRAME_PER_SEC = 50;
    var REFRESH_TIME = 1000/FRAME_PER_SEC;
    var TIME_PER_REV = 5;
    var ANGLE_SPEED = 1/FRAME_PER_SEC/TIME_PER_REV;
    var p1b = 0;
    var p2b = 0;
    var p1, p2, t1, t2, p1a, p2a;
    var y1 = SCORE_HEIGHT - 300 + 16;
    var y2 = SCORE_HEIGHT - 100;
  
    var progress_timer = setInterval(function() {
      p1 = player_board.reduce((a,b)=>a+b, 0);
      p2 = NUM_TILE - num_covered;
      t1 = NUM_BOMB;
      t2 = NUM_TILE-NUM_BOMB;
      p1a = p1/t1;
      p2a = p2/t2;
  
      load_circle_num(Context_score, SCORE_WIDTH/2, y1, p1, t1);
      load_circle_num(Context_score, SCORE_WIDTH/2, y2, p2, t2);
  
      p1b = update_by_step(y1, COLOR_FLAG, p1b, p1a, ANGLE_SPEED);
      p2b = update_by_step(y2, COLOR_TILE, p2b, p2a, ANGLE_SPEED);
  
    }, REFRESH_TIME);
  }
  
  function update_by_step(y, color, pb, pa, step) {
    if (pb < pa) {
      pb = Math.min(pa, pb+step);
    } else if (pb > pa) {
      pb = Math.max(pa, pb-step);
    }
    load_circle(Context_score, SCORE_WIDTH/2, y, pb, color);
    return pb;
  }
  
  // generate board
  
  function generate_board(m, n, nbomb) {
    var len = m*n;
    var board = new Array(len).fill(0);
    var tempArr = [];
    for (var i = 0; i < len; i++) {
      tempArr[i] = i;
    }
  
    for (var i = 0; i < nbomb; i++) {
      var temp = tempArr[randInt(tempArr.length)];
      board[temp] = 1;
      // remove by value
      var index = tempArr.indexOf(temp);
      if (index > -1) {
        tempArr.splice(index, 1);
      }
    }
    return board;
  }
  
  function generate_2dboard(m, n, arr) {
    var temp = arr.slice(0);
    var newArr = [];
    while(temp.length>0) {
      newArr.push(temp.splice(0, n));
    }
    return newArr;
  }
  
  function generate_numboard(arr) {
    var numBoard = arr.slice(0);
    var filter = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ];
    var numBoard = convolute(numBoard, filter, false);
    return numBoard;
  }
  
  function randInt(max) {
    return Math.floor(Math.random()*max);
  }
  
  function generate_tile(x, y, div_id, div_class) {
    // id: nth iteration
    // class: either non_mine or mine
    var game_div = document.getElementById('game_div');
  
    var temp_div = document.createElement('div');
    temp_div.setAttribute('id', div_id);
    temp_div.setAttribute('class', 'tile '+div_class);
    temp_div.style.position = 'absolute';
    temp_div.style.width = TILE_WIDTH+'px';
    temp_div.style.height = TILE_WIDTH+'px';
    temp_div.style.left = x+'px';
    temp_div.style.top = y+'px';
    temp_div.dataset.x = x;
    temp_div.dataset.y = y;
    game_div.appendChild(temp_div);
  
    tile.draw(Context_game, x, y, TILE_WIDTH, TILE_WIDTH);
  
    // console.log('tile drawn');
    // console.log(Context, x, y, TILE_WIDTH, TILE_WIDTH);
  }
  