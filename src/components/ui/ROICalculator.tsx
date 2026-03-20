'use client';

import { useState } from 'react';
import { FadeIn } from './Motion';
import { Calculator, TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

interface ROIInputs {
  jobsPerWeek: number;
  avgJobValue: number;
  hoursAdminPerWeek: number;
  hourlyRate: number;
  missedCallsPerWeek: number;
  avgMissedJobValue: number;
}

const defaultInputs: ROIInputs = {
  jobsPerWeek: 12,
  avgJobValue: 450,
  hoursAdminPerWeek: 10,
  hourlyRate: 75,
  missedCallsPerWeek: 3,
  avgMissedJobValue: 350,
};

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>(defaultInputs);
  const [calculated, setCalculated] = useState(false);

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateROI = () => {
    setCalculated(true);
  };

  // Calculate savings
  const adminTimeSavings = inputs.hoursAdminPerWeek * 0.5 * inputs.hourlyRate * 52; // 50% time savings
  const missedJobsRevenue = inputs.missedCallsPerWeek * inputs.avgMissedJobValue * 0.3 * 52; // 30% recovery rate
  const fasterInvoicing = inputs.jobsPerWeek * inputs.avgJobValue * 0.05 * 52; // 5% faster payment
  
  const totalAnnualSavings = adminTimeSavings + missedJobsRevenue + fasterInvoicing;
  const monthlySavings = totalAnnualSavings / 12;
  const planCost = 79; // Team plan
  const roi = totalAnnualSavings / (planCost * 12);

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
              Calculate Your Time & Money Savings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how much time and money you&apos;re losing each week to disorganization. Cypress Signal helps you get it back.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Side */}
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Business</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jobs completed per week
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={inputs.jobsPerWeek}
                    onChange={(e) => handleInputChange('jobsPerWeek', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-bold text-blue-600">{inputs.jobsPerWeek} jobs</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average job value ($)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={inputs.avgJobValue}
                    onChange={(e) => handleInputChange('avgJobValue', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$100</span>
                    <span className="font-bold text-blue-600">${inputs.avgJobValue.toLocaleString()}</span>
                    <span>$2,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours spent on admin per week
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={inputs.hoursAdminPerWeek}
                    onChange={(e) => handleInputChange('hoursAdminPerWeek', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1hr</span>
                    <span className="font-bold text-blue-600">{inputs.hoursAdminPerWeek} hours</span>
                    <span>30hrs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Missed calls/leads per week
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={inputs.missedCallsPerWeek}
                    onChange={(e) => handleInputChange('missedCallsPerWeek', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span>
                    <span className="font-bold text-blue-600">{inputs.missedCallsPerWeek} missed</span>
                    <span>10</span>
                  </div>
                </div>

                <button
                  onClick={calculateROI}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
                >
                  Calculate My Savings
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Results Side */}
          <FadeIn delay={0.2}>
            <div className={`rounded-2xl shadow-xl p-8 border h-full ${
              calculated 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400' 
                : 'bg-white border-gray-100'
            }`}>
              {!calculated ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">
                    Adjust the sliders and click calculate to see your potential savings
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-2 opacity-80">Your Potential Annual Savings</h3>
                  <p className="text-5xl md:text-6xl font-bold mb-8">
                    ${totalAnnualSavings.toLocaleString()}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <Clock className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="font-medium">Admin Time Saved</p>
                        <p className="text-2xl font-bold">${adminTimeSavings.toLocaleString()}/year</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <Users className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="font-medium">Recovered Leads</p>
                        <p className="text-2xl font-bold">${missedJobsRevenue.toLocaleString()}/year</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <DollarSign className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="font-medium">Faster Payments</p>
                        <p className="text-2xl font-bold">${fasterInvoicing.toLocaleString()}/year</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-xl p-4 text-center">
                    <p className="text-sm opacity-80">Your ROI with Cypress Signal</p>
                    <p className="text-4xl font-bold">{roi.toFixed(1)}x</p>
                    <p className="text-sm opacity-80 mt-1">
                      Every $1 spent returns ${roi.toFixed(0)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}