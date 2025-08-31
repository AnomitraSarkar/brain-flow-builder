export interface LayerConfig {
  id: string;
  type:
    // Core Layers (Trainable)
    | 'dense'
    | 'conv1d'
    | 'conv2d'
    | 'conv3d'
    | 'depthwise'
    | 'transposed'
    | 'embedding'
    | 'attention'
    | 'multihead_attention'
    | 'transformer_encoder'
    | 'transformer_decoder'
    | 'rnn'
    | 'lstm'
    | 'gru'
    // Operators (Stateless)
    | 'maxpool'
    | 'avgpool'
    | 'globalmax'
    | 'globalavg'
    | 'softmax'
    | 'batchnorm'
    | 'layernorm'
    | 'groupnorm'
    | 'instancenorm'
    | 'dropout'
    | 'flatten'
    | 'reshape'
    | 'concatenate'
    | 'split'
    | 'padding'
    | 'cropping'
    // Activations
    | 'sigmoid'
    | 'tanh'
    | 'relu'
    | 'leaky_relu'
    | 'prelu'
    | 'elu'
    | 'relu6'
    | 'gelu'
    | 'swish'
    | 'mish'
    | 'softsign'
    | 'hard_sigmoid'
    | 'hard_tanh'
    | 'maxout'
    // Sequential (Memory)
    | 'bidirectional_rnn'
    | 'bidirectional_lstm'
    | 'bidirectional_gru'
    | 'attention_seq'
    | 'transformer_seq'
    // Structural
    | 'residual'
    | 'highway'
    | 'gcn'
    | 'gat'
    | 'graphsage'
    | 'capsule'
    // Output Layers
    | 'linear_output'
    | 'softmax_output'
    | 'sigmoid_output'
    | 'input';
  name: string;
  position: { x: number; y: number };
  params: {
    // Dense layer params
    units?: number;
    activation?: string;
    dropout?: number;
    l1_regularization?: number;
    l2_regularization?: number;

    // Conv2D params
    filters?: number;
    kernel_size?: [number, number];
    strides?: [number, number];
    padding?: 'valid' | 'same';

    // Pooling params
    pool_size?: [number, number];

    // Input params
    input_shape?: number[];

    // RNN params
    hidden_size?: number;
    num_layers?: number;
    bidirectional?: boolean;
    return_sequences?: boolean;
  };
  weights?: number[][];
  biases?: number[];
  connections?: string[];
}

export interface NetworkArchitecture {
  id: string;
  name: string;
  layers: LayerConfig[];
  created_at: string;
  modified_at: string;
}

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  val_loss?: number;
  val_accuracy?: number;
}