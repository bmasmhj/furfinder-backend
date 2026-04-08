import { Metadata } from 'next';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'About Us - Pet Reunite AI',
  description: 'Learn about our mission to reunite lost pets with their families using artificial intelligence.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">Our Mission</h1>
            <p className="text-xl text-neutral-600">
              Using technology to reunite lost pets with their families and build a compassionate community of pet lovers.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8">Our Story</h2>
            <div className="space-y-6 text-neutral-600 leading-relaxed">
              <p>
                Pet Reunite AI was born from personal experience. When our co-founder&apos;s beloved golden retriever went missing, the family faced the heartbreaking reality that there was no efficient way to find him. Social media posts got lost in the feed, and local animal shelters lacked comprehensive databases.
              </p>
              <p>
                Fortunately, they found their dog through sheer luck. But this experience sparked an idea: what if technology could bridge this gap? What if artificial intelligence could help reunite lost pets faster and more reliably?
              </p>
              <p>
                Today, Pet Reunite AI has helped over 10,000 pets return home to their families. We&apos;ve built a platform that combines advanced computer vision, machine learning, and community power to solve one of pet owners&apos; greatest fears.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl border border-brand-200">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Compassion</h3>
                <p className="text-neutral-600">We understand the emotional bond between pets and their owners. Every reunion is a victory we celebrate.</p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-brand-200">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Innovation</h3>
                <p className="text-neutral-600">We push the boundaries of what&apos;s possible with AI and machine learning to solve real-world problems.</p>
              </div>
              <div className="bg-white p-8 rounded-xl border border-brand-200">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">Community</h3>
                <p className="text-neutral-600">Pet owners are stronger together. We foster connections that help bring lost pets home.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Our Team</h2>
            <p className="text-neutral-600 text-center mb-12 text-lg">
              Our team combines expertise in machine learning, veterinary science, product design, and community building to create a platform that truly reunites families.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'Sarah Johnson', role: 'Co-Founder & CEO', image: '👩‍💼' },
                { name: 'Dr. Alex Chen', role: 'Co-Founder & CTO', image: '👨‍💻' },
                { name: 'Maria Rodriguez', role: 'Head of Operations', image: '👩‍💼' },
                { name: 'James Wilson', role: 'Lead ML Engineer', image: '👨‍💻' },
              ].map((member, idx) => (
                <div key={idx} className="text-center p-6 border border-neutral-200 rounded-xl">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-neutral-900">{member.name}</h3>
                  <p className="text-neutral-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
