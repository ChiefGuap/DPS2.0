export default function AboutPage() {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <p className="text-muted-foreground mb-4">
            We are a cutting-edge learning platform dedicated to providing high-quality educational content and fostering
            collaboration among learners.
          </p>
          <p className="text-muted-foreground mb-4">
            Our mission is to make education accessible, engaging, and interactive. We believe in the power of
            collaborative learning and real-time feedback to enhance the learning experience.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Features</h2>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>Real-time collaborative text editor</li>
            <li>Comprehensive course library</li>
            <li>Interactive learning modules</li>
            <li>Progress tracking and achievements</li>
            <li>Community-driven content and discussions</li>
          </ul>
          <p className="text-muted-foreground mt-8">
            Join us on this exciting journey of knowledge and growth. Together, we can shape the future of education.
          </p>
        </div>
      </div>
    )
  }
  
  