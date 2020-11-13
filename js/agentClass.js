// import * as tf from '@tensorflow/tfjs-node';

class Deque extends Array {
    constructor(maxlen) {
        super();
        this.maxlen = maxlen;
    }

    pushDeque(item) {
        if (this.length >= this.maxlen) this.shift();
        this.push(item);
    }
}

class Agent {

    gamma = 0.95;
    epsilon = 1.0;
    epsilon_decay = 0.995;
    epsilon_min = 0.01;
    learning_rate = 0.00025;

    constructor(
        state_size, action_size,
        gamma, epsilon, epsilon_decay, epsilon_min, learning_rate
    ) {
        this.state_size = state_size;
        this.action_size = action_size;

        // Define Hyper-parameters in config.py
        this.gamma = gamma;
        this.epsilon = epsilon;
        this.epsilon_decay = epsilon_decay;
        this.epsilon_min = epsilon_min;
        this.learning_rate = learning_rate;

        this.model = this.build_model();

        const maxlen = 2000;
        this.memory = new Deque(maxlen);
    }

    /*
    Note:
    - the format of inputs is an (inputShape, N) matrix
      N: number of batches/data
    - for a 1D input, specify it as a tenser2d and its shape
      e.g. var input = tf.tensor2d([1,2,3,4],[1,4])
      shape [1,4]: 1 is the number of instances; 4 is the shape of input
    */
    build_model() {
        const model = tf.sequential();
        model.add(tf.layers.dense({
            units: 128, inputShape: [this.state_size], activation: "relu"
        }));
        model.add(tf.layers.dense({
            units: 128, activation: "relu"
        }));
        model.add(tf.layers.dense({
            units: 128, activation: "relu"
        }));
        model.add(tf.layers.dense({
            units: this.action_size, action: "linear"
        }));
        model.compile({
            optimizer: tf.train.adam({learningRate: this.learning_rate}),
            loss: 'meanSquaredError'
        });
        return model;
    }

    remember(state, action, reward, next_state, done){
        this.memory.pushDeque([state, action, reward, next_state, done]);
    }

    async act(state) {
        // state: tenser2d of size [1,state_size]
        if (Math.random() <= this.epsilon) {
            return getRandInt(0, this.action_size);
        } else {
            const action = await this.exploit(state);
            return action;
        }
            // return np.argmax(act_value[0])
    }

    async exploit(state) {
        const pred = await this.model.predict(state).reshape([this.action_size]);
        const action = await pred.argMax().data();
        // action is an array of size 1 -- [act]
        return action[0];
    }

    //
    // def replay(self, batch_size):
    //     """
    //     Train the DQN network using memory
    //         - input X: current state s^t
    //         - target y:
    //     """
    //     if len(this.memory) < batch_size:
    //         return
    //
    //     mini_batch = random.sample(this.memory, batch_size) \
    //         + random.sample(this.rare_memory, min(round(batch_size/4), len(this.rare_memory)))
    //
    //     for state, action, reward, next_state, done in mini_batch:
    //         target = reward
    //         if not done:
    //             """
    //             # predict the reward of the next state
    //             future_value = this.model.predict(next_state)
    //             # add maximum future reward
    //             target += this.gamma * np.amax(future_value[0])
    //             """
    //             target = reward + this.gamma * np.amax(this.model.predict(next_state)[0])
    //         # target / y: max future reward mapped to the currect state
    //         target_state = this.model.predict(state)
    //         target_state[0][action] = target
    //
    //         this.model.fit(state, target_state, epochs=1, verbose=0)
    //         # To Do: explain why train in this way?
    //
    //     # decrease epsilon
    //     if this.epsilon > this.epsilon_min:
    //         this.epsilon *= this.epsilon_decay
    //
    // def load(self, name):
    //     """
    //     load model weights
    //     """
    //     this.model.load_weights(name)
    //

    async save_model(fname) {
        await this.model.save("downloads://" + fname);
    }

    async load_model(fname) {
        this.model = await tf.loadLayersModel("localstorage://" + fname);
    }



}
