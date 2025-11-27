import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderVehicle = () => {
  const [formData, setFormData] = useState({
    requestedVehicle: '',
    rentalDuration: '',
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

  const vehicleOptions = [
    'Toyota Corolla - Sedan',
    'Toyota RAV4 - SUV',
    'Honda Civic - Sedan',
    'Mazda CX-5 - SUV',
    'Nissan X-Trail - SUV',
    'Subaru Outback - SUV',
    'Toyota Hilux - Pickup Truck',
    'Mitsubishi L200 - Pickup Truck',
    'Toyota Hiace - Van',
    'Nissan NV350 - Van',
    'Yamaha MT-07 - Motorcycle',
    'Honda CB500F - Motorcycle',
    'SUV (Any Available)',
    'Sedan (Any Available)',
    'Motorcycle (Any Available)'
  ];

  const durationOptions = [
    '4 hours',
    '8 hours',
    '12 hours',
    '24 hours',
    '2 days',
    '3 days',
    '1 week'
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
        serviceType: 'vehicle',
        details: {
          requestedVehicle: formData.requestedVehicle
        },
        location: formData.location,
        paymentMethod: formData.paymentMethod
      };

      await axios.post(`${API_BASE_URL}/orders`, orderData);
      
      setMessage('✅ Vehicle rental request submitted! Our team will contact you within 15 minutes to confirm availability.');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to submit request. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const getVehiclePrice = (vehicle) => {
    if (vehicle.includes('Motorcycle')) return '3,000';
    if (vehicle.includes('Sedan')) return '5,000';
    if (vehicle.includes('SUV')) return '7,000';
    if (vehicle.includes('Pickup')) return '8,000';
    if (vehicle.includes('Van')) return '9,000';
    return '5,000';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl">
              🚗
            </div>
            <h1 className="text-3xl font-bold text-primary-blue">Rent a Vehicle</h1>
            <p className="text-gray-600 mt-2">Get a reliable vehicle delivered to you when yours breaks down</p>
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
                Preferred Vehicle *
              </label>
              <select
                name="requestedVehicle"
                value={formData.requestedVehicle}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
              >
                <option value="">Select Vehicle Type</option>
                {vehicleOptions.map(vehicle => (
                  <option key={vehicle} value={vehicle}>
                    {vehicle} - Ksh {getVehiclePrice(vehicle)}/day
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rental Duration *
              </label>
              <select
                name="rentalDuration"
                value={formData.rentalDuration}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
              >
                <option value="">Select Duration</option>
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery/Pickup Location *
              </label>
              <textarea
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                placeholder="Where should we deliver the vehicle?"
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

            {formData.requestedVehicle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary-blue mb-3">Rental Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-semibold">{formData.requestedVehicle.split(' - ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">{formData.requestedVehicle.split(' - ')[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Rate:</span>
                    <span className="font-semibold">Ksh {getVehiclePrice(formData.requestedVehicle)}</span>
                  </div>
                  {formData.rentalDuration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{formData.rentalDuration}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm text-gray-600">
                      * Insurance and fuel included<br/>
                      * 24/7 roadside assistance<br/>
                      * Free delivery within city limits
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-red text-white py-4 px-6 rounded-lg hover:bg-light-red focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2 disabled:opacity-50 transition duration-200 transform hover:scale-105 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Submitting Request...
                </div>
              ) : (
                'Request Vehicle Rental'
              )}
            </button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Requirements:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Valid driver's license</li>
                <li>• National ID/Passport</li>
                <li>• Security deposit required (refundable)</li>
                <li>• Minimum age: 23 years</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderVehicle;