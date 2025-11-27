import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderFuel = () => {
  const [formData, setFormData] = useState({
    liters: '',
    location: {
      address: '',
      coordinates: ''
    },
    paymentMethod: 'mpesa'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const FUEL_PRICE = 185;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const calculateTotal = () => {
    const liters = parseFloat(formData.liters) || 0;
    return liters * FUEL_PRICE;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const orderData = {
        serviceType: 'fuel',
        details: {
          liters: parseFloat(formData.liters)
        },
        location: formData.location,
        paymentMethod: formData.paymentMethod
      };

      await axios.post(`${API_BASE_URL}/orders`, orderData);
      
      setMessage('✅ Fuel order placed successfully! You will receive a confirmation call shortly.');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to place order. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl">
              ⛽
            </div>
            <h1 className="text-3xl font-bold text-primary-blue">Order Fuel</h1>
            <p className="text-gray-600 mt-2">Get fuel delivered to your location at Ksh 185 per liter</p>
          </div>
          
          {message && (
            <div className={`p-4 rounded-lg mb-6 animate-fade-in ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Liters of Fuel Needed *
              </label>
              <input
                type="number"
                name="liters"
                value={formData.liters}
                onChange={handleChange}
                min="1"
                step="0.1"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                placeholder="Enter liters (e.g., 10.5)"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum order: 1 liter</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address *
              </label>
              <textarea
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                placeholder="Enter your complete delivery address (street, building, landmark)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPS Coordinates (Optional)
              </label>
              <input
                type="text"
                name="location.coordinates"
                value={formData.location.coordinates}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                placeholder="e.g., -1.2921, 36.8219"
              />
              <p className="text-sm text-gray-500 mt-1">Help us find you faster with GPS coordinates</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
              >
                <option value="mpesa">M-Pesa (0792045455)</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {formData.paymentMethod === 'paypal' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>PayPal Payment Instructions:</strong><br />
                  Please send your payment to one of these emails:<br />
                  • hanameelk21@gmail.com<br />
                  • samuelojimaidakwo@gmail.com<br />
                  Include your order details in the payment note.
                </p>
              </div>
            )}

            {formData.paymentMethod === 'mpesa' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>M-Pesa Payment Instructions:</strong><br />
                  You will receive a payment request to your phone number.<br />
                  Please pay to: <strong>0792045455</strong>
                </p>
              </div>
            )}

            {formData.liters && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary-blue mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Quantity:</span>
                    <span className="font-semibold">{formData.liters} liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Liter:</span>
                    <span className="font-semibold">Ksh {FUEL_PRICE}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span className="text-primary-blue">Total Amount:</span>
                    <span className="text-primary-red">Ksh {calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Delivery to: {formData.location.address || 'Not specified'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.liters || !formData.location.address}
              className="w-full bg-primary-red text-white py-4 px-6 rounded-lg hover:bg-light-red focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2 disabled:opacity-50 transition duration-200 transform hover:scale-105 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Placing Order...
                </div>
              ) : (
                'Place Fuel Order'
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              By placing this order, you agree to our terms of service. Our delivery team will contact you within 15 minutes.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderFuel;