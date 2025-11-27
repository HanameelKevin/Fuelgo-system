import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const openWhatsApp = () => {
    window.open('https://wa.me/254792045455', '_blank');
  };

  const services = [
    {
      icon: '⛽',
      title: 'Fuel Delivery',
      description: 'Get fuel delivered to your location at Ksh 185 per liter',
      link: '/order-fuel',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🔋',
      title: 'Battery Delivery',
      description: 'Electric vehicle batteries delivered to you',
      link: '/order-battery',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🔧',
      title: 'Mechanic Service',
      description: 'Professional mechanics for your vehicle repairs',
      link: '/order-mechanic',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🚗',
      title: 'Vehicle Rental',
      description: 'Rent a vehicle when yours breaks down',
      link: '/order-vehicle',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary-blue via-accent-blue to-primary-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-primary-red">FUELGO</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-light-blue max-w-3xl mx-auto">
              Your reliable on-demand fuel, battery, and mechanic service. We bring the solution to your location!
            </p>
            {!user ? (
              <div className="space-x-4 animate-slide-up">
                <Link
                  to="/register"
                  className="bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-light-red transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-blue transition duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="bg-primary-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-light-red transition duration-300 transform hover:scale-105 shadow-lg animate-slide-up"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-blue mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Fast, reliable, and convenient services delivered right to your location
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                <div className={`h-2 bg-linear-to-r ${service.color}`}></div>
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary-blue mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  {user && (
                    <Link
                      to={service.link}
                      className="inline-block bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-light-red transition duration-200 transform hover:scale-105"
                    >
                      Order Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-primary-blue mb-2">Sign Up & Login</h3>
              <p className="text-gray-600">Create your account and verify your details</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-accent-blue rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-primary-blue mb-2">Place Order</h3>
              <p className="text-gray-600">Choose your service and provide location details</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-red rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-primary-blue mb-2">Get Served</h3>
              <p className="text-gray-600">We deliver to your location within minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-primary-blue mb-12">
            Payment Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-8 text-center shadow-lg border border-green-200">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-blue mb-4">M-Pesa</h3>
              <p className="text-gray-700 mb-4 text-lg">Pay via M-Pesa to:</p>
              <p className="text-xl font-semibold text-primary-red bg-white py-3 px-6 rounded-lg shadow-inner">0792045455</p>
              <p className="text-sm text-gray-600 mt-3">Instant confirmation</p>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-8 text-center shadow-lg border border-blue-200">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white text-2xl font-bold">P</span>
              </div>
              <h3 className="text-2xl font-bold text-primary-blue mb-4">PayPal</h3>
              <p className="text-gray-700 mb-4 text-lg">Pay via PayPal to:</p>
              <div className="space-y-2 bg-white py-3 px-6 rounded-lg shadow-inner">
                <p className="text-lg font-semibold text-primary-red">hanameelk21@gmail.com</p>
                <p className="text-lg font-semibold text-primary-red">samuelojimaidakwo@gmail.com</p>
              </div>
              <p className="text-sm text-gray-600 mt-3">Secure international payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-linear-to-r from-primary-blue to-accent-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help? Contact Us</h2>
          <p className="text-xl mb-8 text-light-blue max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you with any questions or issues.
          </p>
          <button
            onClick={openWhatsApp}
            className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto mb-4"
          >
            <span className="mr-3 text-2xl">💬</span>
            Chat on WhatsApp - 0792045455
          </button>
          <p className="text-light-blue text-lg">
            Also available: +2348107513032
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;