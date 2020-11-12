const model = tf.sequential();
model.add(tf.layers.dense({units: 2, inputShape: [4]}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

// 生成一些用于训练的数据.
const xs = tf.tensor2d([1,2,3,4], [1, 4]);
const ys = tf.tensor2d([1,1], [1, 2]);

// 用 fit() 训练模型.
model.fit(xs, ys, {epochs: 1000});
