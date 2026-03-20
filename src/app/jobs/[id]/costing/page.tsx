'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';

interface Material {
  id: string;
  name: string;
  cost: number;
  quantity: number;
}

interface Labor {
  hours: number;
  rate: number;
}

export default function JobCostingPage() {
  const params = useParams();
  const jobId = params.id;
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [labor, setLabor] = useState<Labor>({ hours: 0, rate: 75 });
  const [quotedPrice, setQuotedPrice] = useState(0);
  
  // Add material
  const [newMaterial, setNewMaterial] = useState({ name: '', cost: 0, quantity: 1 });
  
  // Calculate totals
  const materialCost = useMemo(() => 
    materials.reduce((sum, m) => sum + (m.cost * m.quantity), 0),
    [materials]
  );
  
  const laborCost = useMemo(() => 
    labor.hours * labor.rate,
    [labor]
  );
  
  const totalCost = materialCost + laborCost;
  const profit = quotedPrice - totalCost;
  const margin = quotedPrice > 0 ? (profit / quotedPrice * 100).toFixed(1) : '0';
  
  // Add material handler
  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.cost > 0) {
      setMaterials([...materials, {
        id: Date.now().toString(),
        ...newMaterial
      }]);
      setNewMaterial({ name: '', cost: 0, quantity: 1 });
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Job Costing</h1>
      <p className="text-gray-600 mb-6">Job ID: {jobId}</p>
      
      {/* Quoted Price */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quoted Price to Customer
        </label>
        <div className="flex items-center">
          <span className="text-gray-500 mr-2">$</span>
          <input
            type="number"
            value={quotedPrice}
            onChange={(e) => setQuotedPrice(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-2xl font-bold"
            placeholder="0.00"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materials */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Materials</h2>
          
          {/* Add Material Form */}
          <div className="border-b pb-4 mb-4">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Material name"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Cost"
                value={newMaterial.cost}
                onChange={(e) => setNewMaterial({ ...newMaterial, cost: Number(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Qty"
                value={newMaterial.quantity}
                onChange={(e) => setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleAddMaterial}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Add Material
            </button>
          </div>
          
          {/* Materials List */}
          <div className="space-y-2">
            {materials.length === 0 ? (
              <p className="text-gray-500 text-sm">No materials added yet</p>
            ) : (
              materials.map((material) => (
                <div key={material.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">{material.name}</div>
                    <div className="text-sm text-gray-500">
                      ${material.cost.toFixed(2)} × {material.quantity}
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(material.cost * material.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Materials Total */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-semibold">
              <span>Materials Total</span>
              <span>${materialCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {/* Labor */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Labor</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours Worked
              </label>
              <input
                type="number"
                step="0.5"
                value={labor.hours}
                onChange={(e) => setLabor({ ...labor, hours: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">$</span>
                <input
                  type="number"
                  value={labor.rate}
                  onChange={(e) => setLabor({ ...labor, rate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          {/* Labor Total */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between font-semibold">
              <span>Labor Total</span>
              <span>${laborCost.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {labor.hours} hours × ${labor.rate}/hr
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Profit Summary</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Quoted Price</div>
            <div className="text-xl font-bold text-blue-600">${quotedPrice.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Material Cost</div>
            <div className="text-xl font-bold text-orange-600">${materialCost.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Labor Cost</div>
            <div className="text-xl font-bold text-orange-600">${laborCost.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Total Profit</div>
            <div className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.toFixed(2)}
            </div>
          </div>
        </div>
        
        {/* Margin Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Profit Margin</span>
            <span className={`font-bold ${parseFloat(margin) >= 30 ? 'text-green-600' : 'text-red-600'}`}>
              {margin}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${parseFloat(margin) >= 30 ? 'bg-green-500' : parseFloat(margin) >= 15 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(parseFloat(margin), 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>30% (Good)</span>
            <span>50% (Excellent)</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save Costing
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
