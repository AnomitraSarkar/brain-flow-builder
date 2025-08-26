import { 
  Layers3, 
  Eye, 
  Settings, 
  Save, 
  BarChart3, 
  Zap,
  FileJson,
  Monitor
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Layers3,
      title: "CRUD on Layers",
      description: "Create, read, update, and delete neural network layers with intuitive visual controls."
    },
    {
      icon: Settings,
      title: "CNN Parameters",
      description: "Fine-tune convolutional neural network parameters including filters, kernels, and pooling."
    },
    {
      icon: Monitor,
      title: "2D/3D Toggle",
      description: "Switch seamlessly between 2D and 3D visualization modes for better understanding."
    },
    {
      icon: Save,
      title: "Save/Load Models",
      description: "Export and import your neural network architectures in JSON format."
    },
    {
      icon: Eye,
      title: "Weights Visualization",
      description: "Real-time visualization of weights and biases across all network layers."
    },
    {
      icon: Zap,
      title: "Training Simulator",
      description: "Watch your neural network learn in real-time with interactive training simulation."
    },
    {
      icon: BarChart3,
      title: "Performance Metrics",
      description: "Track loss, accuracy, and other metrics with beautiful real-time charts."
    },
    {
      icon: FileJson,
      title: "Export & Share",
      description: "Export models, visualizations, and training data for collaboration and research."
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Powerful Features for
            <br />
            <span className="gradient-text">Neural Network Exploration</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to visualize, understand, and experiment with neural networks. 
            From basic perceptrons to complex CNN architectures.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="neural-card group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg mb-4 group-hover:shadow-[var(--shadow-neural)]">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">All features are open source and free to use</span>
          </div>
        </div>
      </div>
    </section>
  );
};