function getRandInt(min=0, max, step=1) {
    // return an random integer from min to max
    // range is [min, max), inclusive in min but not max
    var min = Math.ceil(min);
    var max = Math.floor(max);
    var rand = min + step*Math.floor(Math.random()*(max-min)/step);
    return rand;
}

function arrayEqual(a, b, compare=(x,y)=>x==y) {
    /*
    checks whether two array of "=="-comparable elements are equal
    NOT intended for comparing elements that are NOT "==" comparable
    extension: now you can use "compare" function; default is "=="
    */
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; i++) {
        if (!(compare(a[i], b[i]))) return false;
    }
    return true;
}

function arrayContains(arr, obj, compare) {
    /* check if obj equals to an element of arr with "compare"*/
    if (arr == null) return false;
    var boo = false;
    arr.forEach((item, i) => {
        if (compare(item, obj)) boo = true;
    });
    return boo;
}

String.prototype.format = function () {
    // string formatter
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

function to_csv(array2d) {
    // convert 2d array to csv
    csvContent = "data:text/csv;charset=utf-8," 
    + array2d.map(e => e.join(",")).join("\n");
    return csvContent;
}

function download(content, fileName) {
    var encodedUri = encodeURI(content);
    var link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
}

function generateExtraWalls(array2d, size, pix) {
    if (array2d == null) return null;
    var walls = [];
    array2d.forEach(([x,y], i) => {
        if (pix) {
            x *= size; 
            y *= size;
        }
        walls.push(new Rect(x, y, size, size));
    });
    return walls;
}

function euclidean(p1, p2) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}