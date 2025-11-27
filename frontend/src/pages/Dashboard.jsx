import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'fuel':
        return '⛽';
      case 'battery':
        return '🔋';
      case 'mechanic':
        return '🔧';
      case 'vehicle':
        return '🚗';
      default:
        return '📦';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-primary-blue mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mb-6">
            Here's your service history and quick access to order new services.
          </p>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Link
              to="/order-fuel"
              className="bg-linear-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg text-center hover:shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div className="text-2xl mb-2">⛽</div>
              <div className="font-semibold">Order Fuel</div>
            </Link>
            <Link
              to="/order-battery"
              className="bg-linear-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg text-center hover:shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div className="text-2xl mb-2">🔋</div>
              <div className="font-semibold">Order Battery</div>
            </Link>
            <Link
              to="/order-mechanic"
              className="bg-linear-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg text-center hover:shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div className="text-2xl mb-2">🔧</div>
              <div className="font-semibold">Mechanic</div>
            </Link>
            <Link
              to="/order-vehicle"
              className="bg-linear-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-lg text-center hover:shadow-lg transition duration-200 transform hover:scale-105"
            >
              <div className="text-2xl mb-2">🚗</div>
              <div className="font-semibold">Rent Vehicle</div>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary-blue">Recent Orders</h2>
            <Link
              to="/ratings"
              className="bg-accent-blue text-white px-4 py-2 rounded-lg hover:bg-primary-blue transition duration-200"
            >
              Rate Services
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Get started by ordering your first service!</p>
              <Link
                to="/order-fuel"
                className="bg-primary-red text-white px-6 py-3 rounded-lg hover:bg-light-red transition duration-200"
              >
                Order Your First Service
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getServiceIcon(order.serviceType)}</div>
                      <div>
                        <h3 className="font-semibold text-primary-blue capitalize">
                          {order.serviceType} Service
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()} • 
                          Ksh {order.payment.amount.toLocaleString()}
                        </p>
                        {order.details.liters && (
                          <p className="text-sm text-gray-600">
                            {order.details.liters} liters of fuel
                          </p>
                        )}
                        {order.details.problemDescription && (
                          <p className="text-sm text-gray-600">
                            Issue: {order.details.problemDescription}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ')}
                      </span>
                      {order.status === 'completed' && !order.rating && (
                        <Link
                          to="/ratings"
                          className="bg-primary-red text-white px-3 py-1 rounded text-sm hover:bg-light-red transition duration-200"
                        >
                          Rate
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orders.length > 5 && (
            <div className="mt-6 text-center">
              <button className="text-accent-blue hover:text-primary-blue transition duration-200">
                View All Orders ({orders.length})
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <div className="text-2xl font-bold text-primary-blue mb-2">
              {orders.filter(order => order.status === 'completed').length}
            </div>
            <div className="text-gray-600">Completed Services</div>
          </div>
          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="text-2xl font-bold text-primary-blue mb-2">
              {orders.filter(order => order.status === 'in-progress').length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
            <div className="text-2xl font-bold text-primary-blue mb-2">
              Ksh {orders.reduce((total, order) => total + order.payment.amount, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;