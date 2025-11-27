import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderBattery = () => {
  const [formData, setFormData] = useState({
    batteryType: '',
    vehicleBrand: '',
    vehicleModel: '',
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

  const batteryTypes = [
    'Lithium-ion (Li-ion)',
    'Lead-Acid',
    'Nickel-Metal Hydride (NiMH)',
    'AGM Battery',
    'Gel Cell Battery'
  ];

  const vehicleBrands = [
    'Tesla', 'Nissan', 'BMW', 'Chevrolet', 'Toyota',
    'Hyundai', 'Kia', 'Ford', 'Audi', 'Mercedes-Benz',
    'Volkswagen', 'Honda', 'Other'
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
        serviceType: 'battery',
        details: {
          batteryType: formData.batteryType,
          vehicleBrand: formData.vehicleBrand,
          vehicleModel: formData.vehicleModel
        },
        location: formData.location,
        paymentMethod: formData.paymentMethod
      };

      await axios.post(`${API_BASE_URL}/orders`, orderData);
      
      setMessage('✅ Battery order placed successfully! Our team will contact you for installation.');
      
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
            <div className="w-20 h-20 bg-linear-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl">
              🔋
            </div>
            <h1 className="text-3xl font-bold text-primary-blue">Order Battery</h1>
            <p className="text-gray-600 mt-2">Get the right battery for your electric vehicle delivered and installed</p>
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
                Battery Type *
              </label>
              <select
                name="batteryType"
                value={formData.batteryType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
              >
                <option value="">Select Battery Type</option>
                {batteryTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Brand *
                </label>
                <select
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                >
                  <option value="">Select Brand</option>
                  {vehicleBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
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
                  placeholder="e.g., Model 3, Leaf, i3"
                />
              </div>
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
                placeholder="Enter your complete delivery address"
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

            {formData.paymentMethod === 'paypal' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>PayPal Payment Instructions:</strong><br />
                  Send payment to: hanameelk21@gmail.com or samuelojimaidakwo@gmail.com
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-blue mb-3">Service Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Professional battery installation included</p>
                <p>• 1-year warranty on all batteries</p>
                <p>• Certified electric vehicle technicians</p>
                <p>• Emergency service available 24/7</p>
                <p className="font-semibold text-primary-red mt-2">Starting from Ksh 15,000</p>
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
                  Placing Order...
                </div>
              ) : (
                'Order Battery Service'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderBattery;