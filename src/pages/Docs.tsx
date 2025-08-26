import { Book, Code, Video, Download } from "lucide-react";

const Docs = () => {
  const sections = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of OpenNetwork and create your first neural network visualization.",
      items: ["Installation", "Quick Start", "Basic Concepts", "First Project"]
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Complete reference for all OpenNetwork APIs, functions, and configurations.",
      items: ["Core API", "Visualization API", "Training API", "Export API"]
    },
    {
      icon: Video,
      title: "Tutorials",
      description: "Step-by-step video tutorials covering advanced features and use cases.",
      items: ["CNN Visualization", "Training Simulation", "3D Exploration", "Custom Models"]
    },
    {
      icon: Download,
      title: "Examples",
      description: "Ready-to-use examples and templates for common neural network architectures.",
      items: ["MNIST Classifier", "Image Recognition", "Text Processing", "Generative Models"]
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to master OpenNetwork. From basic concepts to advanced techniques.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {sections.map((section) => (
            <div key={section.title} className="neural-card group hover:scale-105 transition-all duration-300">
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
                  <li key={item} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Featured Documentation */}
        <div className="neural-card">
          <h2 className="text-2xl font-bold mb-6">Featured Documentation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-primary">Quick Start Guide</h3>
              <p className="text-muted-foreground mb-4">
                Get up and running with OpenNetwork in under 5 minutes. Perfect for newcomers.
              </p>
              <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm">
                <div className="text-primary"># Install OpenNetwork</div>
                <div className="text-muted-foreground">npm install @opennetwork/core</div>
                <div className="text-primary mt-2"># Create your first network</div>
                <div className="text-muted-foreground">import {"{ Network }"} from '@opennetwork/core'</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-secondary">Popular Tutorials</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Building Your First CNN</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span className="text-muted-foreground">Real-time Training Visualization</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-muted-foreground">3D Network Exploration</span>
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