import { Heart, Code, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            About <span className="gradient-text">OpenNetwork</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Making neural network education accessible, visual, and interactive for everyone.
          </p>
        </div>

        {/* Mission */}
        <div className="neural-card mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            We believe that understanding AI shouldn't require a PhD. OpenNetwork democratizes neural network 
            education by providing intuitive, visual tools that make complex concepts accessible to students, 
            educators, and researchers worldwide.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center neural-card">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Open Source</h3>
            <p className="text-muted-foreground">
              Built by the community, for the community. Every line of code is open and free.
            </p>
          </div>
          
          <div className="text-center neural-card">
            <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Innovation</h3>
            <p className="text-muted-foreground">
              Pushing the boundaries of educational technology with cutting-edge visualization.
            </p>
          </div>
          
          <div className="text-center neural-card">
            <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <p className="text-muted-foreground">
              Fostering collaboration between educators, students, and researchers globally.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="neural-card">
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-lg text-muted-foreground">
            <p className="mb-4">
              OpenNetwork started as a simple idea: what if learning neural networks could be as intuitive 
              as playing with building blocks? Our founders, frustrated by the abstract nature of traditional 
              AI education, set out to create something different.
            </p>
            <p className="mb-4">
              After countless hours of research, prototyping, and feedback from educators worldwide, 
              OpenNetwork was born. Today, it serves thousands of students and researchers, making 
              complex AI concepts accessible through interactive visualization.
            </p>
            <p>
              We're just getting started. Join us in revolutionizing how the world learns about 
              artificial intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;