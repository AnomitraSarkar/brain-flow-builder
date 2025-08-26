import { Play, Code, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Playground = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Playground</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive neural network builder and visualizer. Coming soon to revolutionize how you learn AI.
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="neural-card mb-12">
          <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-lg flex items-center justify-center mb-8 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-4 left-4 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-8 w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-8 left-12 w-4 h-4 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
            
            <div className="text-center z-10">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Play className="w-10 h-10 text-primary ml-1" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Interactive Playground</h3>
              <p className="text-muted-foreground">Build, visualize, and train neural networks in real-time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Code className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold mb-2">Visual Builder</h4>
              <p className="text-sm text-muted-foreground">Drag-and-drop interface for creating neural networks</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold mb-2">Real-time Training</h4>
              <p className="text-sm text-muted-foreground">Watch your network learn with live visualization</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
                <ExternalLink className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold mb-2">Export & Share</h4>
              <p className="text-sm text-muted-foreground">Save and share your neural network creations</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="neural-button-hero">
              Get Early Access
            </Button>
            <Button variant="outline" className="neural-button-secondary">
              View Demo Video
            </Button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neural-card text-left">
            <h3 className="text-lg font-semibold mb-3">What's Coming</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Interactive layer manipulation</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>3D visualization modes</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Real-time weight updates</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Export to popular frameworks</span>
              </li>
            </ul>
          </div>
          
          <div className="neural-card text-left">
            <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to know when the playground launches. Join our community for exclusive updates.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm"
              />
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Notify Me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;