import React, { useState } from 'react';
import { Zap, Hotel, BarChart2, ArrowRight, Home, Battery, Lightbulb, Calendar, User, Users } from 'lucide-react';

// Import your page components here
import BookingUI from '../components/BookingUI';
import GuestEnergyDashboard from '../components/GuestEnergyDashboard';
import HotelierEnergyDashboard from '../components/HotelierEnergyDashboard';

const MainPage = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  
  const navigateTo = (component) => {
    setSelectedComponent(component);
  };
  
  const navigateHome = () => {
    setSelectedComponent(null);
  };
  
  // Render the selected component
  const renderComponent = () => {
    if (selectedComponent === 'booking') {
      return <BookingUI />;
    } else if (selectedComponent === 'hotelier-analytics') {
      return <HotelierEnergyDashboard />;
    } else if (selectedComponent === 'guest-analytics') {
      return <GuestEnergyDashboard />;
    }
    return null;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={navigateHome}>
              <Zap className="h-8 w-8 text-white mr-2" />
              <h1 className="text-2xl font-bold text-white">ELECTRISTAY</h1>
            </div>
            {selectedComponent && (
              <button 
                onClick={navigateHome}
                className="flex items-center text-white hover:text-gray-300"
              >
                <Home className="h-5 w-5 mr-1" />
                <span>Home</span>
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {selectedComponent ? (
          // Show the selected component
          renderComponent()
        ) : (
          // Show the main menu
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to ElectriStay
              </h2>
              <p className="text-xl text-gray-300">
                AI-Powered Dynamic Pricing & Smart Booking for Hotel EV Charging
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Booking UI Card */}
              <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-800">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Hotel className="h-8 w-8 text-red-600 mr-3" />
                    <h3 className="text-2xl font-semibold text-white">Booking System</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Make a reservation for EV charging during your hotel stay. Our AI will recommend the best charging slots based on your schedule and energy prices.
                  </p>
                  <div className="mt-auto">
                    <button 
                      onClick={() => navigateTo('booking')} 
                      className="flex items-center justify-between w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <span>Go to Booking</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Analytics Dashboard Section */}
            <h3 className="text-2xl font-bold text-white mb-6">
              Energy Analytics Dashboards
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Hotelier Dashboard Card */}
              <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-800">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Users className="h-8 w-8 text-purple-500 mr-3" />
                    <h3 className="text-2xl font-semibold text-white">Hotelier Dashboard</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    For hotel managers: Monitor charging station performance, analyze dynamic pricing effectiveness, and optimize revenue with AI-powered recommendations.
                  </p>
                  <div className="mt-auto">
                    <button 
                      onClick={() => navigateTo('hotelier-analytics')} 
                      className="flex items-center justify-between w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <span>View Hotelier Analytics</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Guest Dashboard Card */}
              <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-800">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <User className="h-8 w-8 text-blue-500 mr-3" />
                    <h3 className="text-2xl font-semibold text-white">Guest Dashboard</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    For hotel guests: Track your charging sessions, monitor energy usage and costs, and view your environmental impact with detailed analytics.
                  </p>
                  <div className="mt-auto">
                    <button 
                      onClick={() => navigateTo('guest-analytics')} 
                      className="flex items-center justify-between w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <span>View Guest Analytics</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features Section */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-center text-white mb-8">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-800">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <Lightbulb className="h-5 w-5 text-red-500" />
                    </div>
                    <h4 className="font-semibold text-lg text-white">Dynamic Pricing</h4>
                  </div>
                  <p className="text-gray-300">
                    Get the best rates based on real-time demand, hotel occupancy, and energy rates.
                  </p>
                </div>
                <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-800">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <h4 className="font-semibold text-lg text-white">Smart Scheduling</h4>
                  </div>
                  <p className="text-gray-300">
                    AI recommends the most convenient charging slots to minimize wait times.
                  </p>
                </div>
                <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-800">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                      <Battery className="h-5 w-5 text-green-500" />
                    </div>
                    <h4 className="font-semibold text-lg text-white">Detailed Analytics</h4>
                  </div>
                  <p className="text-gray-300">
                    Track your energy usage, costs, and environmental impact over time.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-auto border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Zap className="h-6 w-6 text-white mr-2" />
              <span className="font-bold">ELECTRISTAY</span>
            </div>
            <div className="text-sm text-gray-400">
              Smart EV Charging for Hotel Guests &copy; 2025
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;