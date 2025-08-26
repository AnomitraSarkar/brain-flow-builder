import { GraduationCap, Users, FlaskConical, Rocket } from "lucide-react";

export const TestimonialsSection = () => {
  const audiences = [
    {
      icon: GraduationCap,
      title: "Students",
      description: "Learn neural networks through interactive visualization. Understand complex concepts with hands-on exploration.",
      color: "from-primary to-primary-glow"
    },
    {
      icon: Users,
      title: "Teachers",
      description: "Enhance your AI curriculum with engaging visual tools. Make abstract concepts tangible for your students.",
      color: "from-accent to-accent-glow"
    },
    {
      icon: FlaskConical,
      title: "Researchers",
      description: "Prototype and visualize your neural network architectures. Validate concepts before implementation.",
      color: "from-secondary to-secondary-glow"
    },
    {
      icon: Rocket,
      title: "Startups",
      description: "Rapidly prototype AI solutions. Communicate complex architectures to investors and team members.",
      color: "from-primary to-secondary"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-card/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Perfect for
            <br />
            <span className="gradient-text">Everyone Learning AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're just starting with neural networks or building the next AI breakthrough, 
            OpenNetwork adapts to your needs.
          </p>
        </div>

        {/* Audience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {audiences.map((audience, index) => (
            <div 
              key={audience.title}
              className="neural-card group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex items-start space-x-4">
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${audience.color} rounded-lg group-hover:shadow-[var(--shadow-neural)] transition-all duration-300`}>
                  <audience.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {audience.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {audience.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-12 p-8 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 border border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">10k+</div>
              <div className="text-sm text-muted-foreground">Educators</div>
            </div>
            <div className="w-px h-8 bg-border/50"></div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">50k+</div>
              <div className="text-sm text-muted-foreground">Students</div>
            </div>
            <div className="w-px h-8 bg-border/50"></div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Research Labs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};