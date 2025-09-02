import { Book, Code, Video, Download, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Docs = () => {
  const sections = [
    {
      icon: Book,
      title: "Getting Started",
      description:
        "Learn the basics of OpenNetwork and create your first neural network visualization.",
      items: ["Installation", "Quick Start", "Basic Concepts", "First Project"],
    },
    {
      icon: Code,
      title: "API Reference",
      description:
        "Complete reference for all OpenNetwork APIs, functions, and configurations.",
      items: ["Core API", "Visualization API", "Training API", "Export API"],
    },
    {
      icon: Video,
      title: "Tutorials",
      description:
        "Step-by-step video tutorials covering advanced features and use cases.",
      items: [
        "CNN Visualization",
        "Training Simulation",
        "3D Exploration",
        "Custom Models",
      ],
    },
    {
      icon: Download,
      title: "Examples",
      description:
        "Ready-to-use examples and templates for common neural network architectures.",
      items: [
        "MNIST Classifier",
        "Image Recognition",
        "Text Processing",
        "Generative Models",
      ],
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Everything you need to master OpenNetwork. From basic concepts to
            advanced techniques.
          </p>
          <Button
            variant="outline"
            className="neural-button-secondary"
            onClick={() =>
              window.open(
                "https://github.com/AnomitraSarkar/brain-flow-builder/",
                "_blank",
              )
            }
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {sections.map((section) => (
            <div
              key={section.title}
              className="neural-card group hover:scale-105 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center group-hover:shadow-[var(--shadow-neural)]">
                <section.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                {section.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {section.description}
              </p>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Complete Functionality Guide */}
        <div className="neural-card mb-12">
          <h2 className="text-3xl font-bold mb-8 gradient-text">
            Complete Feature Guide
          </h2>

          {/* Layer System */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-primary">
              🧠 Layer System
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="neural-card border border-primary/20">
                <h4 className="text-lg font-semibold mb-3 text-primary">
                  Core Layers (Trainable)
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Dense / Fully Connected</li>
                  <li>• Convolutional (1D, 2D, 3D)</li>
                  <li>• Embedding Layers</li>
                  <li>• Multi-Head Attention</li>
                  <li>• Transformer Blocks</li>
                  <li>• RNN, LSTM, GRU</li>
                </ul>
              </div>

              <div className="neural-card border border-secondary/20">
                <h4 className="text-lg font-semibold mb-3 text-secondary">
                  Operators (Stateless)
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pooling (Max, Avg, Global)</li>
                  <li>• Normalization (Batch, Layer)</li>
                  <li>• Dropout & Regularization</li>
                  <li>• Flatten / Reshape</li>
                  <li>• Concatenate / Split</li>
                </ul>
              </div>

              <div className="neural-card border border-accent/20">
                <h4 className="text-lg font-semibold mb-3 text-accent">
                  Activations
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Classic: ReLU, Tanh, Sigmoid</li>
                  <li>• Modern: GELU, Swish, Mish</li>
                  <li>• Variants: Leaky ReLU, ELU</li>
                  <li>• Specialized: Softmax, HardTanh</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Visualization Modes */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-secondary">
              🎨 Visualization Modes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="neural-card">
                <h4 className="text-lg font-semibold mb-3">2D Canvas View</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Drag & drop layer creation</li>
                  <li>• Visual connection mapping</li>
                  <li>• Real-time parameter editing</li>
                  <li>• Zoom & pan controls</li>
                  <li>• Layer inspection tooltips</li>
                </ul>
              </div>

              <div className="neural-card">
                <h4 className="text-lg font-semibold mb-3">
                  3D Interactive View
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Three.js powered visualization</li>
                  <li>• Orbital camera controls</li>
                  <li>• Layer depth representation</li>
                  <li>• Weight flow animations</li>
                  <li>• Immersive exploration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Analysis Tools */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-accent">
              📊 Analysis Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="neural-card">
                <h4 className="text-lg font-semibold mb-3">Layer Inspector</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Parameter configuration</li>
                  <li>• Input/output shapes</li>
                  <li>• Activation functions</li>
                  <li>• Real-time validation</li>
                </ul>
              </div>

              <div className="neural-card">
                <h4 className="text-lg font-semibold mb-3">Metrics Panel</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Weight histograms</li>
                  <li>• Activation visualizations</li>
                  <li>• Network statistics</li>
                  <li>• Performance metrics</li>
                </ul>
              </div>

              <div className="neural-card">
                <h4 className="text-lg font-semibold mb-3">
                  Training Simulation
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Start/stop controls</li>
                  <li>• Loss visualization</li>
                  <li>• Gradient flow</li>
                  <li>• Progress tracking</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Import/Export */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-6">
              💾 Import/Export System
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="neural-card">
                <h4 className="text-lg font-semibold mb-3">
                  Network Configuration
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• JSON export/import</li>
                  <li>• Save custom architectures</li>
                  <li>• Share network designs</li>
                  <li>• Version control friendly</li>
                </ul>
              </div>

              <div className="neural-card">
                <h4 className="text-lg font-semibold mb-3">
                  Integration Ready
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Export to TensorFlow</li>
                  <li>• PyTorch compatibility</li>
                  <li>• ONNX format support</li>
                  <li>• Code generation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="neural-card">
          <h2 className="text-2xl font-bold mb-6">Quick Start Guide</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">
                Getting Started
              </h3>
              <div className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">1. Choose Your View</h4>
                  <p className="text-sm text-muted-foreground">
                    Switch between 2D canvas and 3D visualization modes using
                    the toolbar.
                  </p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">2. Add Layers</h4>
                  <p className="text-sm text-muted-foreground">
                    Drag layers from the toolbox into your canvas. Choose from
                    Core, Operators, Activations, and more.
                  </p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">3. Configure & Connect</h4>
                  <p className="text-sm text-muted-foreground">
                    Click layers to edit parameters. Connect them by dragging
                    from output to input nodes.
                  </p>
                </div>
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">4. Analyze & Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the metrics panel to visualize weights and activations.
                    Export your network when ready.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-secondary">
                Pro Tips
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/10">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium">Layer Categories:</span>
                    <p className="text-sm text-muted-foreground">
                      Use the tab system to quickly find the right layer type
                      for your architecture.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/10">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium">3D Exploration:</span>
                    <p className="text-sm text-muted-foreground">
                      Use mouse controls to orbit, zoom, and explore your
                      network in 3D space.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/10">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium">Real-time Feedback:</span>
                    <p className="text-sm text-muted-foreground">
                      Watch activation functions and weight distributions update
                      as you modify layers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
