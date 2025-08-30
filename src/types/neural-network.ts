export interface LayerConfig {
  id: string;
  type:
    | 'dense'
    | 'conv2d'
    | 'maxpool'
    | 'avgpool'
    | 'flatten'
    | 'batchnorm'
    | 'softmax'
    | 'input'
    | 'relu'
    | 'tanh'
    | 'sigmoid';
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