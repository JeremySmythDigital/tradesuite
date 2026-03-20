'use client';

import { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { FadeIn, ScaleIn } from './Motion';

interface VideoTestimonial {
  id: string;
  customerName: string;
  customerCompany: string;
  trade: string;
  rating: number;
  quote: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  featured?: boolean;
}

interface VideoTestimonialsProps {
  testimonials: VideoTestimonial[];
  tradeFilter?: string;
}

export function VideoTestimonials({ testimonials, tradeFilter }: VideoTestimonialsProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredTestimonials = tradeFilter 
    ? testimonials.filter(t => t.trade === tradeFilter)
    : testimonials;

  const featuredTestimonials = filteredTestimonials.filter(t => t.featured);
  const otherTestimonials = filteredTestimonials.filter(t => !t.featured);

  const handlePrev = () => {
    if (selectedVideo) {
      const idx = filteredTestimonials.findIndex(t => t.id === selectedVideo.id);
      const prevIdx = idx > 0 ? idx - 1 : filteredTestimonials.length - 1;
      setSelectedVideo(filteredTestimonials[prevIdx]);
    }
  };

  const handleNext = () => {
    if (selectedVideo) {
      const idx = filteredTestimonials.findIndex(t => t.id === selectedVideo.id);
      const nextIdx = idx < filteredTestimonials.length - 1 ? idx + 1 : 0;
      setSelectedVideo(filteredTestimonials[nextIdx]);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              See What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from real trade professionals who transformed their business with Cypress Signal.
            </p>
          </div>
        </FadeIn>

        {/* Featured Video Grid */}
        {featuredTestimonials.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {featuredTestimonials.map((testimonial, index) => (
              <ScaleIn key={testimonial.id} delay={index * 0.1}>
                <div 
                  className="group cursor-pointer"
                  onClick={() => setSelectedVideo(testimonial)}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-gray-900">
                    <img 
                      src={testimonial.thumbnailUrl} 
                      alt={testimonial.customerName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-blue-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-bold">{testimonial.customerName}</p>
                      <p className="text-white/80 text-sm">{testimonial.customerCompany}</p>
                    </div>
                    <div className="absolute top-4 right-4 px-2 py-1 bg-white/90 rounded text-sm font-medium text-gray-700">
                      {testimonial.duration}
                    </div>
                  </div>
                </div>
              </ScaleIn>
            ))}
          </div>
        )}

        {/* Video Thumbnail Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {otherTestimonials.map((testimonial, index) => (
            <ScaleIn key={testimonial.id} delay={index * 0.05}>
              <div 
                className="group cursor-pointer"
                onClick={() => setSelectedVideo(testimonial)}
              >
                <div className="relative rounded-lg overflow-hidden shadow-md aspect-video bg-gray-900">
                  <img 
                    src={testimonial.thumbnailUrl} 
                    alt={testimonial.customerName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-5 h-5 text-blue-600 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-sm font-medium truncate">{testimonial.customerName}</p>
                  </div>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <button 
              onClick={handlePrev}
              className="absolute left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button 
              onClick={handleNext}
              className="absolute right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="max-w-4xl w-full">
              {/* Video Player Placeholder */}
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-20 h-20 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Video: {selectedVideo.videoUrl}</p>
                    <p className="text-sm opacity-70">In production, this would embed from YouTube/Vimeo</p>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="text-center text-white">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= selectedVideo.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`}
                    />
                  ))}
                </div>
                <p className="text-xl font-medium mb-2">"{selectedVideo.quote}"</p>
                <p className="text-gray-300">
                  <span className="font-medium text-white">{selectedVideo.customerName}</span>
                  {' • '}
                  {selectedVideo.customerCompany}
                </p>
                <p className="text-sm text-gray-400 mt-1 capitalize">{selectedVideo.trade}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Quote-only testimonials (for pages without video)
export function QuoteTestimonials({ testimonials, tradeFilter }: VideoTestimonialsProps) {
  const filteredTestimonials = tradeFilter 
    ? testimonials.filter(t => t.trade === tradeFilter)
    : testimonials;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {filteredTestimonials.slice(0, 3).map((testimonial, index) => (
            <ScaleIn key={testimonial.id} delay={index * 0.1}>
              <div className="bg-gray-50 rounded-xl p-6 relative">
                <Quote className="absolute top-4 left-4 w-8 h-8 text-blue-200" />
                <div className="pt-8">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.customerName}</p>
                    <p className="text-sm text-gray-500">{testimonial.customerCompany}</p>
                  </div>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sample testimonials data
export const sampleVideoTestimonials: VideoTestimonial[] = [
  {
    id: '1',
    customerName: 'Mike Roberts',
    customerCompany: 'Roberts Electric LLC',
    trade: 'electrician',
    rating: 5,
    quote: 'Panel upgrade quotes used to take me an hour. Now I crank them out in 10 minutes.',
    videoUrl: 'https://youtube.com/watch?v=example1',
    thumbnailUrl: 'https://picsum.photos/seed/electrician1/640/360',
    duration: '2:45',
    featured: true,
  },
  {
    id: '2',
    customerName: 'Sarah Chen',
    customerCompany: 'Bright Spark Electric',
    trade: 'electrician',
    rating: 5,
    quote: 'Finally, software that understands what electricians actually do.',
    videoUrl: 'https://youtube.com/watch?v=example2',
    thumbnailUrl: 'https://picsum.photos/seed/electrician2/640/360',
    duration: '1:30',
    featured: true,
  },
  {
    id: '3',
    customerName: 'Tom Williams',
    customerCompany: 'Quick Fix Plumbing',
    trade: 'plumber',
    rating: 5,
    quote: 'I used to lose track of callbacks. Not anymore. Everything in one place.',
    videoUrl: 'https://youtube.com/watch?v=example3',
    thumbnailUrl: 'https://picsum.photos/seed/plumber1/640/360',
    duration: '3:12',
  },
  {
    id: '4',
    customerName: 'Dave Martinez',
    customerCompany: 'DM HVAC Services',
    trade: 'hvac',
    rating: 4,
    quote: 'The scheduling alone saves me 5 hours a week during peak season.',
    videoUrl: 'https://youtube.com/watch?v=example4',
    thumbnailUrl: 'https://picsum.photos/seed/hvac1/640/360',
    duration: '2:18',
  },
  {
    id: '5',
    customerName: 'Emily Garcia',
    customerCompany: 'Green Thumb Landscaping',
    trade: 'landscaper',
    rating: 5,
    quote: 'My customers love the portal. They can see exactly what\'s happening.',
    videoUrl: 'https://youtube.com/watch?v=example5',
    thumbnailUrl: 'https://picsum.photos/seed/landscaper1/640/360',
    duration: '1:55',
  },
  {
    id: '6',
    customerName: 'James Wilson',
    customerCompany: 'Top Notch Roofing',
    trade: 'roofer',
    rating: 5,
    quote: 'From first call to final invoice, everything tracked automatically.',
    videoUrl: 'https://youtube.com/watch?v=example6',
    thumbnailUrl: 'https://picsum.photos/seed/roofer1/640/360',
    duration: '2:33',
  },
];