import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/neural-network-hero.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></span>
            Open Source Neural Network Platform
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Visualize & Build
            <br />
            <span className="gradient-text">Neural Networks</span>
            <br />
            Like Never Before
          </h1>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Open-source platform to visualize, build, and understand neural networks in 2D & 3D. 
            Perfect for students, researchers, and AI enthusiasts.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button asChild className="neural-button-hero group">
              <Link to="/playground">
                Try Demo
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="neural-button-secondary group">
              <Link to="/docs">
                <Play className="mr-2 h-4 w-4" />
                View Documentation
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">2D & 3D</div>
              <div className="text-muted-foreground">Visualization Modes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">Real-time</div>
              <div className="text-muted-foreground">Training Simulation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">Open Source</div>
              <div className="text-muted-foreground">MIT Licensed</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-primary rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-32 right-16 w-2 h-2 bg-secondary rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/3 right-10 w-4 h-4 bg-accent rounded-full animate-pulse opacity-50"></div>
    </section>
  );
};