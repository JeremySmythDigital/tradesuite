'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MapPin, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, Wrench } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  duration: number; // in hours
  price: number | null; // null means "get quote"
  description: string;
  trade: string;
}

const services: Service[] = [
  { id: '1', name: 'Electrical Panel Upgrade', duration: 4, price: 2400, description: 'Upgrade to 200A panel with new breakers', trade: 'electrician' },
  { id: '2', name: 'Outlet Installation', duration: 2, price: 350, description: 'Install new outlets or replace existing', trade: 'electrician' },
  { id: '3', name: 'Ceiling Fan Installation', duration: 1.5, price: 200, description: 'Install ceiling fan including mounting', trade: 'electrician' },
  { id: '4', name: 'Water Heater Installation', duration: 3, price: 1200, description: 'Install new water heater', trade: 'plumber' },
  { id: '5', name: 'Drain Cleaning', duration: 1, price: 150, description: 'Clear clogged drains', trade: 'plumber' },
  { id: '6', name: 'Faucet Repair/Replace', duration: 1, price: 200, description: 'Fix or replace faucet', trade: 'plumber' },
  { id: '7', name: 'AC Tune-Up', duration: 1, price: 99, description: 'Annual maintenance check', trade: 'hvac' },
  { id: '8', name: 'AC Repair', duration: 2, price: null, description: 'Diagnose and repair AC issues', trade: 'hvac' },
  { id: '9', name: 'Furnace Inspection', duration: 1, price: 75, description: 'Inspection and safety check', trade: 'hvac' },
  { id: '10', name: 'Lawn Maintenance', duration: 2, price: 100, description: 'Mowing, edging, blowing', trade: 'landscaper' },
  { id: '11', name: 'Landscape Design', duration: 3, price: null, description: 'Custom landscape design consultation', trade: 'landscaper' },
  { id: '12', name: 'Roof Inspection', duration: 1, price: 150, description: 'Full roof inspection and report', trade: 'roofer' },
  { id: '13', name: 'Shingle Repair', duration: 2, price: 400, description: 'Repair damaged shingles', trade: 'roofer' },
];

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const availableDates = (() => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Skip weekends for demo
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push(date.toISOString().split('T')[0]);
    }
  }
  return dates;
})();

export default function BookingWidget() {
  const [step, setStep] = useState(1);
  const [trade, setTrade] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const trades = [
    { id: 'electrician', name: 'Electrician', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'plumber', name: 'Plumber', icon: '🔧', color: 'bg-blue-100 text-blue-800' },
    { id: 'hvac', name: 'HVAC', icon: '🌡️', color: 'bg-orange-100 text-orange-800' },
    { id: 'landscaper', name: 'Landscaper', icon: '🌳', color: 'bg-green-100 text-green-800' },
    { id: 'roofer', name: 'Roofer', icon: '🏠', color: 'bg-slate-100 text-slate-800' },
  ];

  const filteredServices = selectedService?.trade 
    ? services.filter(s => s.trade === selectedService.trade) 
    : trade 
      ? services.filter(s => s.trade === trade) 
      : services;

  const handleSubmit = () => {
    // In production, this would submit to an API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            We've sent a confirmation email to {customerInfo.email}
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            You'll receive a reminder 24 hours before your appointment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-lg">TradeSuite Booking</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`w-8 h-1 rounded ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Select Trade & Service */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What service do you need?</h2>
            
            {/* Trade Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select your trade</h3>
              <div className="flex flex-wrap gap-3">
                {trades.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTrade(t.id);
                      setSelectedService(null);
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      trade === t.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="mr-2">{t.icon}</span>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Service Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select a service</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedService?.id === service.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900">{service.name}</h4>
                      {service.price ? (
                        <span className="font-bold text-blue-600">${service.price}</span>
                      ) : (
                        <span className="text-gray-500 text-sm">Get Quote</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}h</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => selectedService && setStep(2)}
                disabled={!selectedService}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedService
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ChevronRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">When works for you?</h2>
            
            {/* Date Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Select a date</h3>
              <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
                {availableDates.map((date) => {
                  const d = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-xs font-medium">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-lg font-bold">{d.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select a time</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg transition-all ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-all"
              >
                <ChevronLeft className="inline-block mr-2 w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => selectedDate && selectedTime && setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedDate && selectedTime
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ChevronRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Customer Info */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your information</h2>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(916) 555-0101"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St, Sacramento, CA 95814"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special instructions or gate codes..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-all"
              >
                <ChevronLeft className="inline-block mr-2 w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  customerInfo.name && customerInfo.email && customerInfo.phone && customerInfo.address
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ChevronRight className="inline-block ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm your booking</h2>
            
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-gray-200">
                <h3 className="font-bold text-blue-900">{selectedService?.name}</h3>
                <p className="text-sm text-blue-700">{selectedService?.description}</p>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{selectedService?.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="font-medium">{customerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{customerInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">{customerInfo.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address</span>
                  <span className="font-medium text-right max-w-[200px]">{customerInfo.address}</span>
                </div>
                {customerInfo.notes && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-gray-600 block mb-1">Notes</span>
                    <p className="text-gray-900">{customerInfo.notes}</p>
                  </div>
                )}
              </div>
              
              {selectedService?.price && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Estimated Total</span>
                    <span className="font-bold text-xl text-blue-600">${selectedService.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Final price may vary based on job complexity
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-all"
              >
                <ChevronLeft className="inline-block mr-2 w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl font-medium bg-green-600 text-white hover:bg-green-700 transition-all"
              >
                Confirm Booking
                <CheckCircle className="inline-block ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}