async function wait(i) {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(i + " sec passed");
            resolve(i**2);
        }, 1000);
    });
}

async function load(i) {
    const x = await wait(i) * 2;
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(i + " sec passed");
            resolve(x);
        }, 1000);
    });
}

async function call_wait() {
    for (let i = 0; i < 10; i++) {
        // let x = await wait(i);
        let x = await load(i);
        console.log(x);
    }
}

// console.log(wait());
call_wait();

function getRandInt(min=0, max, step=1) {
    // return an random integer from min to max
    // range is [min, max), inclusive in min but not max
    var min = Math.ceil(min);
    var max = Math.floor(max);
    var rand = min + step*Math.floor(Math.random()*(max-min)/step);
    return rand;
}

function random_sample(array, batch_size) {
    if (array.length < batch_size) return array;

    var array_copy = array.map((item, i) => item);
    var sample = [];
    for (var i = 0; i < batch_size; i++) {
        var rand_idx = getRandInt(0, array_copy.length);
        sample.push(
            array_copy.splice(rand_idx, 1)[0]
        );
    }
    return sample;
}

console.log(random_sample([1,2,3,4,5,6],3));

