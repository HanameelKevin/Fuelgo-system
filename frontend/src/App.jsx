import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrderFuel from './pages/OrderFuel';
import OrderBattery from './pages/OrderBattery';
import OrderMechanic from './pages/OrderMechanic';
import OrderVehicle from './pages/OrderVehicle';
import Ratings from './pages/Ratings';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-fuel" 
              element={
                <ProtectedRoute>
                  <OrderFuel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-battery" 
              element={
                <ProtectedRoute>
                  <OrderBattery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-mechanic" 
              element={
                <ProtectedRoute>
                  <OrderMechanic />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/order-vehicle" 
              element={
                <ProtectedRoute>
                  <OrderVehicle />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ratings" 
              element={
                <ProtectedRoute>
                  <Ratings />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;