import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderMechanic = () => {
  const [formData, setFormData] = useState({
    vehicleBrand: '',
    vehicleModel: '',
    problemDescription: '',
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

  const commonProblems = [
    'Engine won\'t start',
    'Battery issues',
    'Brake problems',
    'Transmission issues',
    'Electrical problems',
    'Overheating',
    'Flat tire',
    'Oil leak',
    'Strange noises',
    'Warning lights on dashboard',
    'AC not working',
    'Suspension issues',
    'Other'
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const orderData = {
        serviceType: 'mechanic',
        details: {
          vehicleBrand: formData.vehicleBrand,
          vehicleModel: formData.vehicleModel,
          problemDescription: formData.problemDescription
        },
        location: formData.location,
        paymentMethod: formData.paymentMethod
      };

      await axios.post(`${API_BASE_URL}/orders`, orderData);
      
      setMessage('✅ Mechanic service requested successfully! A certified mechanic will contact you within 20 minutes.');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to request mechanic. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl">
              🔧
            </div>
            <h1 className="text-3xl font-bold text-primary-blue">Request Mechanic</h1>
            <p className="text-gray-600 mt-2">Professional mechanics ready to fix your vehicle at your location</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Brand *
                </label>
                <input
                  type="text"
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                  placeholder="e.g., Toyota, Honda, BMW"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Model *
                </label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                  placeholder="e.g., Corolla, Civic, X5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Description *
              </label>
              <select
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200 mb-3"
              >
                <option value="">Select Problem Type</option>
                {commonProblems.map(problem => (
                  <option key={problem} value={problem}>{problem}</option>
                ))}
              </select>
              <textarea
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                placeholder="Please describe the problem in detail... When did it start? Any warning lights? Strange sounds?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Location *
              </label>
              <textarea
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                placeholder="Where is the vehicle located? Include landmarks if possible"
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-blue mb-3">Service Information</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Certified mechanics with proper tools</p>
                <p>• On-site diagnostics and repairs</p>
                <p>• Genuine parts available</p>
                <p>• 24/7 emergency service</p>
                <p>• Free initial diagnosis</p>
                <p className="font-semibold text-primary-red mt-2">Service Fee: Ksh 2,000 (diagnosis included)</p>
                <p className="text-xs text-gray-600">Additional parts and labor costs will be discussed before repair</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-red text-white py-4 px-6 rounded-lg hover:bg-light-red focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2 disabled:opacity-50 transition duration-200 transform hover:scale-105 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Requesting Mechanic...
                </div>
              ) : (
                'Request Mechanic Service'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderMechanic;