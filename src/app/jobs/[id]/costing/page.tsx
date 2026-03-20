'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getJobCosting, saveJobCosting, updateJobCosting, type JobCosting } from '@/lib/directus-extensions';

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
  const jobId = params.id as string;
  
  const [materials, setMaterials] = useState<Material[]>([]);
  const [labor, setLabor] = useState<Labor>({ hours: 0, rate: 75 });
  const [quotedPrice, setQuotedPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedCostingId, setSavedCostingId] = useState<string | null>(null);
  
  const [newMaterial, setNewMaterial] = useState({ name: '', cost: 0, quantity: 1 });

  useEffect(() => {
    loadJobCosting();
  }, [jobId]);

  const loadJobCosting = async () => {
    setLoading(true);
    const result = await getJobCosting(jobId);
    
    if (result.success && result.data) {
      const data = result.data;
      setMaterials((data.materials || []).map(m => ({ ...m, id: m.id || Date.now().toString() })));
      setLabor({ hours: data.labor_hours || 0, rate: data.labor_rate || 75 });
      setQuotedPrice(data.quoted_price || 0);
      setSavedCostingId(data.id);
    }
    
    setLoading(false);
  };

  const materialCost = useMemo(() => 
    materials.reduce((sum, m) => sum + (m.cost * m.quantity), 0),
    [materials]
  );
  
  const laborCost = useMemo(() => labor.hours * labor.rate, [labor]);
  const totalCost = materialCost + laborCost;
  const profit = quotedPrice - totalCost;
  const margin = quotedPrice > 0 ? (profit / quotedPrice * 100).toFixed(1) : '0';

  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.cost > 0) {
      setMaterials([...materials, { id: Date.now().toString(), ...newMaterial }]);
      setNewMaterial({ name: '', cost: 0, quantity: 1 });
    }
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    
    const data = {
      job_id: jobId,
      quoted_price: quotedPrice,
      materials,
      labor_hours: labor.hours,
      labor_rate: labor.rate,
    };
    
    let result;
    if (savedCostingId) {
      result = await updateJobCosting(savedCostingId, data);
    } else {
      result = await saveJobCosting(data);
    }
    
    if (result.success && result.data) {
      setSavedCostingId(result.data.id);
    }
    
    alert('Job costing saved successfully!');
    setSaving(false);
  };

  const marginNum = parseFloat(margin);
  const marginColor = marginNum >= 50 ? 'bg-green-100 text-green-800' : marginNum >= 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
  const marginBarColor = marginNum >= 50 ? 'bg-green-500' : marginNum >= 30 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Job Costing</h1>
      <p className="text-gray-600 mb-6">Job ID: {jobId}</p>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Quoted Price */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quoted Price to Customer</label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2 text-xl">$</span>
              <input
                type="number"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Materials */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Materials</h2>
              
              <div className="space-y-2 mb-4">
                {materials.map((material) => (
                  <div key={material.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div>
                      <div className="font-medium">{material.name}</div>
                      <div className="text-sm text-gray-500">
                        ${material.cost.toFixed(2)} × {material.quantity} = ${(material.cost * material.quantity).toFixed(2)}
                      </div>
                    </div>
                    <button onClick={() => handleRemoveMaterial(material.id)} className="text-red-600 hover:text-red-800">✕</button>
                  </div>
                ))}
                {materials.length === 0 && <div className="text-gray-500 text-sm">No materials added</div>}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Add Material</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Material name"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Cost"
                      step="0.01"
                      value={newMaterial.cost || ''}
                      onChange={(e) => setNewMaterial({ ...newMaterial, cost: parseFloat(e.target.value) || 0 })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={newMaterial.quantity || ''}
                      onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) || 1 })}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleAddMaterial} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add</button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Material Cost:</span>
                  <span className="font-bold">${materialCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Labor */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Labor</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                  <input
                    type="number"
                    step="0.25"
                    value={labor.hours || ''}
                    onChange={(e) => setLabor({ ...labor, hours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={labor.rate || ''}
                    onChange={(e) => setLabor({ ...labor, rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Labor Cost:</span>
                  <span className="font-bold">${laborCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Profit Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Material Cost:</span>
                <span className="font-medium">${materialCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Labor Cost:</span>
                <span className="font-medium">${laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold">Total Cost:</span>
                <span className="font-bold">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quoted Price:</span>
                <span className="font-medium">${quotedPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold">Profit:</span>
                <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Profit Margin:</span>
                <span className={`px-3 py-1 rounded-full text-lg font-bold ${marginColor}`}>{margin}%</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${marginBarColor}`} style={{ width: `${Math.min(marginNum, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>30% (break-even)</span>
                <span>50%+ (healthy)</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} disabled={saving} className={`flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium ${saving ? 'opacity-50' : 'hover:bg-blue-700'}`}>
                {saving ? 'Saving...' : 'Save Costing'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-blue-800 mb-2">💡 Profit Margin Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>50%+ margin</strong>: Healthy profit for most trades</li>
              <li>• <strong>30-50% margin</strong>: Acceptable, but look for efficiency gains</li>
              <li>• <strong>Under 30% margin</strong>: Review pricing or find cheaper materials</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}