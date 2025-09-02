import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DemoSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              See OpenNetwork
              <br />
              <span className="gradient-text">In Action</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Watch how easy it is to build, visualize, and train neural networks with our intuitive interface. 
              From simple perceptrons to complex CNNs, everything is visual and interactive.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Interactive layer manipulation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-muted-foreground">Real-time weight visualization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">3D network exploration</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="neural-button-hero group">
                <Link to="/playground">
                  <Play className="mr-2 h-4 w-4" />
                  Launch Playground
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="neural-button-secondary">
                <Link to="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Demo Placeholder */}
          <div className="relative">
            <div className="neural-card relative overflow-hidden group">
              {/* Demo Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/30 transition-colors">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <p className="text-muted-foreground font-medium">Demo Video Coming Soon</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Interactive Neural Network Builder</p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};