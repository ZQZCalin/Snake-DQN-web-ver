function convolute(arr, filter, take_average=true) {
  // filter size: 2m+1 * 2n+1
  var convArr = new Array();
  var h = arr.length;
  var w = arr[0].length;
  var m = Math.floor(filter.length/2);
  var n = Math.floor(filter[0].length/2);

  for (var i = 0; i < h; i++) {
    var tempArr = new Array();
    for (var j = 0; j < w; j++) {
      var temp = 0;
      var num = 0;
      for (var fi = -m; fi < m+1; fi++) {
        if (i+fi <0 || i+fi >= h) continue;
        for (var fj = -n; fj < n+1; fj++) {
          if (j+fj <0 || j+fj >= w) continue;
          /*
          if (i == 0 && j ==0) {
            console.log(i, j, fi, fj);
            console.log(filter[fi+m][fj+n]);
          }*/
          temp += arr[i+fi][j+fj] * filter[fi+m][fj+n];
          num++;
        }
      }
      if (take_average) temp /= num;
      tempArr.push(temp);
    }
    convArr.push(tempArr);
  }
  return convArr;
}
