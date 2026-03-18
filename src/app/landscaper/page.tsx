import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, TreePine, Truck, FileText, DollarSign, Calendar, MapPin, Leaf } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Landscaper CRM - TradeSuite',
  description: 'The CRM built specifically for landscapers. Manage maintenance contracts, design projects, installations, and more.',
  keywords: 'landscaper CRM, landscaping contractor software, lawn care scheduling, landscape design tracking',
};

const features = [
  { icon: Leaf, title: 'Maintenance Routes', description: 'Schedule weekly/bi-weekly visits and track crew locations.' },
  { icon: TreePine, title: 'Design Projects', description: 'Manage design consultations, plant lists, and project timelines.' },
  { icon: Truck, title: 'Equipment Tracking', description: 'Know which trucks have which tools and equipment.' },
  { icon: Calendar, title: 'Seasonal Services', description: 'Track snow removal, spring cleanups, and fall prep.' },
  { icon: DollarSign, title: 'Invoicing', description: 'Bill maintenance contracts and one-time projects separately.' },
  { icon: MapPin, title: 'Site Mapping', description: 'Save property layouts, irrigation zones, and notes per site.' },
];

const stats = [
  { value: '47%', label: 'Faster invoicing' },
  { value: '3.5x', label: 'Contract renewals' },
  { value: '8hrs', label: 'Saved per week' },
  { value: '97%', label: 'Customer satisfaction' },
];

const testimonials = [
  { name: 'Carlos Rivera', company: 'Green Acres Landscaping', quote: 'My crews used to show up at the wrong houses. Now every property has photos and notes attached.' },
  { name: 'Amy Johnson', company: 'Blooms & Gardens', quote: 'Contract renewals went from headaches to automatic. My revenue is predictable for the first time.' },
];

export default function LandscaperPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-2xl">TradeSuite</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=landscaper" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-green-600 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                The CRM Built for <span className="text-yellow-300">Landscapers</span>
              </h1>
              <p className="text-xl text-green-100 mb-8">
                Maintenance contracts. Design installs. Seasonal services. Snow removal.
                <br />Every property organized, every crew on schedule.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?trade=landscaper" className="px-8 py-4 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-colors font-bold text-lg shadow-lg">
                  Start Free Trial
                </Link>
                <Link href="#features" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors font-medium text-lg">
                  See Features
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                  <p className="text-3xl font-bold text-yellow-300">{stat.value}</p>
                  <p className="text-green-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">Features That Grow With You</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From solo operators to multi-crew businesses. Manage properties, crews, and schedules in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all bg-gray-50">
                <feature.icon className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">What Landscapers Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((item) => (
              <div key={item.name} className="bg-white p-8 rounded-xl shadow-sm">
                <p className="text-gray-700 mb-4 italic">"{item.quote}"</p>
                <p className="font-bold">{item.name}</p>
                <p className="text-gray-500 text-sm">{item.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-bold text-4xl text-white mb-6">Ready to Grow Your Landscaping Business?</h2>
          <p className="text-green-100 text-xl mb-8">Join 350+ landscapers who stay organized year-round.</p>
          <Link href="/signup?trade=landscaper" className="inline-block px-8 py-4 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-colors font-bold text-lg shadow-lg">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-white">TradeSuite</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}