import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App';

const Settings = ({ token }) => {
  const [settings, setSettings] = useState({
    deliveryFee: 500,
    currency: 'NGN',
    freeDeliveryEnabled: false,
    freeDeliveryThreshold: 10000
  });
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/settings/get', {
        headers: { token }
      });
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      toast.error('Failed to fetch settings');
    }
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + '/api/settings/update', settings, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success('Settings updated successfully!');
        setSettings(response.data.settings);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'deliveryFee' || name === 'freeDeliveryThreshold' ? Number(value) : value)
    }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>

      <form onSubmit={updateSettings} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Delivery Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee (₦)
              </label>
              <input
                type="number"
                name="deliveryFee"
                value={settings.deliveryFee}
                onChange={handleChange}
                min="0"
                step="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="500"
              />
              <p className="text-xs text-gray-500 mt-1">Amount charged for delivery (in Naira)</p>
            </div>

            <div className="flex items-center gap-3 py-3 border-t border-b">
              <input
                type="checkbox"
                name="freeDeliveryEnabled"
                id="freeDeliveryEnabled"
                checked={settings.freeDeliveryEnabled}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="freeDeliveryEnabled" className="text-sm font-medium text-gray-700">
                Enable Free Delivery (for orders above threshold)
              </label>
            </div>

            {settings.freeDeliveryEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Delivery Threshold (₦)
                </label>
                <input
                  type="number"
                  name="freeDeliveryThreshold"
                  value={settings.freeDeliveryThreshold}
                  onChange={handleChange}
                  min="0"
                  step="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="10000"
                />
                <p className="text-xs text-gray-500 mt-1">Orders above this amount get free delivery</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Currency Settings</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Code
            </label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;