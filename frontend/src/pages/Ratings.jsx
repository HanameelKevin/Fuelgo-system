import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [ratingType, setRatingType] = useState('mechanic');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { user } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOrders();
    fetchRatings();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      // Filter completed orders that haven't been rated yet
      const completedOrders = response.data.filter(order => 
        order.status === 'completed'
      );
      setOrders(completedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ratings`);
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!selectedOrder) {
      setMessage('Please select an order to rate');
      setLoading(false);
      return;
    }

    try {
      const ratingData = {
        orderId: selectedOrder,
        ratingType,
        rating,
        comment
      };

      await axios.post(`${API_BASE_URL}/ratings`, ratingData);
      
      setMessage('✅ Thank you for your feedback! Your rating has been submitted.');
      setSelectedOrder('');
      setRating(5);
      setComment('');
      
      // Refresh ratings
      fetchRatings();
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Failed to submit rating. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'fuel': return '⛽';
      case 'battery': return '🔋';
      case 'mechanic': return '🔧';
      case 'vehicle': return '🚗';
      default: return '📦';
    }
  };

  const getRatingTypeIcon = (type) => {
    return type === 'mechanic' ? '🔧' : '🚚';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-blue">Rate Our Services</h1>
          <p className="text-gray-600 mt-2">Your feedback helps us improve our services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-primary-blue mb-6">Submit Rating</h2>
            
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
                  Select Order to Rate *
                </label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                >
                  <option value="">Choose a completed order</option>
                  {orders.map(order => (
                    <option key={order._id} value={order._id}>
                      {getServiceIcon(order.serviceType)} {order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1)} - {new Date(order.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                {orders.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">No completed orders available for rating</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who are you rating? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRatingType('mechanic')}
                    className={`p-4 border rounded-lg text-center transition duration-200 ${
                      ratingType === 'mechanic'
                        ? 'bg-primary-blue text-white border-primary-blue'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-blue'
                    }`}
                  >
                    <div className="text-2xl mb-2">🔧</div>
                    <div>Mechanic</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatingType('delivery')}
                    className={`p-4 border rounded-lg text-center transition duration-200 ${
                      ratingType === 'delivery'
                        ? 'bg-primary-blue text-white border-primary-blue'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-blue'
                    }`}
                  >
                    <div className="text-2xl mb-2">🚚</div>
                    <div>Delivery</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-2 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-3xl focus:outline-none transition duration-200 transform hover:scale-110"
                    >
                      {star <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {rating === 5 ? 'Excellent' : 
                   rating === 4 ? 'Good' : 
                   rating === 3 ? 'Average' : 
                   rating === 2 ? 'Poor' : 'Very Poor'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition duration-200"
                  placeholder="Tell us about your experience..."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedOrder || orders.length === 0}
                className="w-full bg-primary-red text-white py-4 px-6 rounded-lg hover:bg-light-red focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2 disabled:opacity-50 transition duration-200 transform hover:scale-105 text-lg font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Rating'
                )}
              </button>
            </form>
          </div>

          {/* Previous Ratings */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-primary-blue mb-6">Your Previous Ratings</h2>
            
            {ratings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No ratings yet</h3>
                <p className="text-gray-500">Your ratings will appear here once you submit them</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ratings.map(ratingItem => (
                  <div
                    key={ratingItem._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getRatingTypeIcon(ratingItem.ratingType)}</span>
                        <span className="font-semibold text-primary-blue capitalize">
                          {ratingItem.ratingType} Service
                        </span>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            {i < ratingItem.rating ? '⭐' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                    {ratingItem.comment && (
                      <p className="text-gray-600 text-sm mt-2">"{ratingItem.comment}"</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(ratingItem.createdAt).toLocaleDateString()} at{' '}
                      {new Date(ratingItem.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {ratings.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-primary-blue mb-4">Your Rating Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-blue">{ratings.length}</div>
                <div className="text-gray-600">Total Ratings</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-blue">
                  {(ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)}
                </div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-blue">
                  {ratings.filter(r => r.ratingType === 'mechanic').length}
                </div>
                <div className="text-gray-600">Mechanic Ratings</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ratings;