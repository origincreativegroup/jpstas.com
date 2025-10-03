
export default function About() {
  return (
    <section className="relative min-h-screen bg-brand text-white">
      <div className="diagonal-stripes absolute inset-0 opacity-5"></div>
      <div className="relative max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Me
          </h1>
          <p className="text-xl text-brand-light max-w-2xl mx-auto">
            This is where I'll share more about myself, my journey, and what drives me as a creative technologist.
          </p>
        </div>

        <div className="prose prose-lg prose-invert max-w-none">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-accent mb-4">Coming Soon</h2>
            <p className="text-brand-light leading-relaxed">
              I'm working on crafting the perfect about section that captures my story, 
              my passion for creative technology, and what makes me unique. Check back soon 
              for a deeper look into my background, interests, and what drives me to create 
              innovative solutions at the intersection of design and technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-accent mb-4">My Approach</h3>
              <p className="text-brand-light">
                I believe in the power of combining creative thinking with technical execution 
                to solve real-world problems and create meaningful experiences.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-accent mb-4">What I Do</h3>
              <p className="text-brand-light">
                I bridge the gap between design and development, creating systems that are 
                both beautiful and functional, scalable and user-friendly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
