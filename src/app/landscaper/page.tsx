import { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Users, TreePine, Truck, FileText, DollarSign, Calendar, MapPin, Leaf, Gamepad2 } from 'lucide-react';

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
              <Link href="/electrician/game" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium">
                <Gamepad2 className="w-4 h-4" />
                Play Simulator
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup?trade=landscaper" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Game Promo Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-white">
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">NEW: Try the Trade Business Simulator</span>
            </div>
            <Link href="/electrician/game" className="px-4 py-1.5 bg-white text-purple-700 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors">
              Play Now - Takes 3 Minutes →
            </Link>
          </div>
        </div>
      </section>

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
                <Link href="/electrician/game" className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors font-medium text-lg flex items-center gap-2 justify-center">
                  <Gamepad2 className="w-5 h-5" />
                  Try the Simulator
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

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stop Losing Jobs to Chaos
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Every landscaper loses money to disorganization. Crews go to wrong properties. Contracts slip through cracks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="font-bold text-red-800 text-lg mb-4">❌ Without TradeSuite</h3>
              <ul className="space-y-2 text-red-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Crews show up at wrong properties
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Client info scattered across apps
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Forget contract renewals
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  Can't track which jobs are profitable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  No equipment tracking for trucks
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-green-800 text-lg mb-4">✓ With TradeSuite</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  GPS-tracked crew routes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  All client info in one dashboard
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Auto contract renewal reminders
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Profitability per property
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Equipment tracking built in
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link
              href="/electrician/game"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Gamepad2 className="w-5 h-5" />
              See the Difference - Play the Simulator
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">Features That Grow With You</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From solo operators to multi-crew businesses. Manage properties, crews, and schedules in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all bg-white">
                <feature.icon className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl mb-4">What Landscapers Say</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((item) => (
              <div key={item.name} className="bg-gray-50 p-8 rounded-xl">
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
            <p className="text-sm">© {new Date().getFullYear()} TradeSuite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}