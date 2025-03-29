import React, { useState, useEffect } from 'react';
import { 
  Battery, 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Sun, 
  Cloud, 
  CloudRain, 
  Thermometer, 
  Zap, 
  Leaf, 
  BarChart2, 
  PieChart, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Award,
  Users,
  Car
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const GuestEnergyDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('usage');
  
  // State for time period filter
  const [timePeriod, setTimePeriod] = useState('current');
  
  // State for showing more metrics
  const [expandedSections, setExpandedSections] = useState({
    savings: false,
    trips: false
  });
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Mock data for user's charging history
  const userData = {
    userInfo: {
      name: "Alex Johnson",
      vehicleModel: "Tesla Model 3",
      membershipTier: "Gold",
      totalSessions: 18,
      totalEnergy: 324.6, // kWh
      totalSavings: 62.80, // €
      averageRenewable: 68 // %
    },
    currentStay: {
      hotel: "Hotel Luise",
      location: "Erlangen, Germany",
      checkIn: "2025-03-28",
      checkOut: "2025-03-31",
      totalEnergy: 42.8, // kWh
      sessionCount: 3,
      peakTimeUsage: 15, // %
      offPeakUsage: 85, // %
      renewablePercentage: 72, // %
      co2Saved: 14.2 // kg
    },
    historicalData: [
      { month: 'Jan', energy: 45.2, renewable: 65, co2Saved: 16.1, cost: 38.4 },
      { month: 'Feb', energy: 38.6, renewable: 62, co2Saved: 12.8, cost: 32.8 },
      { month: 'Mar', energy: 42.8, renewable: 72, co2Saved: 14.2, cost: 36.4 }
    ],
    sessions: [
      { 
        id: 1, 
        date: '2025-03-29', 
        startTime: '22:30', 
        duration: '7h 15m', 
        energy: 16.2, 
        cost: 13.45, 
        renewable: 76, 
        peakTime: false,
        location: 'Hotel Luise, Erlangen'
      },
      { 
        id: 2, 
        date: '2025-03-28', 
        startTime: '14:15', 
        duration: '3h 45m', 
        energy: 14.8, 
        cost: 18.65, 
        renewable: 58, 
        peakTime: true,
        location: 'Hotel Luise, Erlangen'
      },
      { 
        id: 3, 
        date: '2025-03-26', 
        startTime: '23:00', 
        duration: '6h 30m', 
        energy: 11.8, 
        cost: 9.85, 
        renewable: 82, 
        peakTime: false,
        location: 'Mountain View Lodge, Aspen'
      }
    ],
    achievements: [
      { id: 1, name: "Green Pioneer", description: "Used more than 70% renewable energy", icon: "Leaf", unlocked: true },
      { id: 2, name: "Smart Saver", description: "Saved over €50 with off-peak charging", icon: "DollarSign", unlocked: true },
      { id: 3, name: "Road Warrior", description: "Charged at 5 different ElectriStay locations", icon: "Car", unlocked: false },
      { id: 4, name: "Night Owl", description: "Completed 10 overnight charging sessions", icon: "Clock", unlocked: true }
    ]
  };
  
  // Environmental impact calculations
  const environmentalImpact = {
    co2Saved: userData.currentStay.co2Saved,
    equivalentTrees: Math.round(userData.currentStay.co2Saved / 21),
    gasolineAvoided: (userData.currentStay.energy * 0.22).toFixed(1), // liters
    totalGreenEnergy: (userData.currentStay.energy * userData.currentStay.renewablePercentage / 100).toFixed(1) // kWh
  };
  
  // Format to currency
  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2)}`;
  };
  
  // Color constants
  const COLORS = {
    blue: '#3B82F6', // Primary blue
    green: '#10B981', // Success/renewable green
    red: '#EF4444',   // Error/alert red
    yellow: '#F59E0B', // Warning/attention yellow
    purple: '#8B5CF6', // Alternative accent
    gray: '#6B7280',   // Neutral
  };
  
  // Get appropriate icon component
  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'Leaf': return <Leaf className="h-6 w-6 text-green-500" />;
      case 'DollarSign': return <DollarSign className="h-6 w-6 text-blue-500" />;
      case 'Car': return <Car className="h-6 w-6 text-purple-500" />;
      case 'Clock': return <Clock className="h-6 w-6 text-yellow-500" />;
      default: return <Award className="h-6 w-6 text-yellow-500" />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 bg-black text-white">
      {/* Header section */}
      <div className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <Battery className="h-6 w-6 text-green-500 mr-2" />
                <h1 className="text-xl font-bold text-white">Your Energy Dashboard</h1>
              </div>
              <p className="text-sm text-gray-400 mt-1">Personal charging insights and environmental impact</p>
            </div>
            <div className="flex items-center mt-2 md:mt-0 space-x-3">
              <div className="bg-gray-800 p-1 rounded-md flex text-xs">
                <button 
                  className={`px-3 py-1 rounded-md ${timePeriod === 'current' ? 'bg-red-600 text-white' : 'text-gray-300'}`}
                  onClick={() => setTimePeriod('current')}
                >
                  Current Stay
                </button>
                <button 
                  className={`px-3 py-1 rounded-md ${timePeriod === 'all' ? 'bg-red-600 text-white' : 'text-gray-300'}`}
                  onClick={() => setTimePeriod('all')}
                >
                  All History
                </button>
              </div>
              <button className="flex items-center text-xs bg-gray-800 p-2 rounded-md">
                <RefreshCw className="h-3 w-3 mr-1" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User profile summary */}
      <div className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <div className="p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="mb-4 md:mb-0 mr-0 md:mr-6">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                <Car className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-white">{userData.userInfo.name}</h2>
              <p className="text-gray-400">{userData.userInfo.vehicleModel}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-yellow-900 text-yellow-300 text-xs font-medium rounded-full">
                  {userData.userInfo.membershipTier} Member
                </span>
                <span className="px-2 py-1 bg-green-900 text-green-300 text-xs font-medium rounded-full">
                  {userData.userInfo.totalSessions} Sessions
                </span>
                <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs font-medium rounded-full">
                  {userData.userInfo.totalEnergy.toFixed(1)} kWh Total
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Current Stay</div>
                <div className="font-medium text-white">{userData.currentStay.hotel}</div>
                <div className="text-xs text-gray-500">{userData.currentStay.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="mb-6">
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <div className="flex border-b border-gray-800">
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'usage' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('usage')}
            >
              Energy Usage
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'impact' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('impact')}
            >
              Environmental Impact
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'achievements' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
          </div>
        </div>
      </div>

      {/* Energy Usage Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-6">
          {/* Energy stats summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
              <div className="flex items-center mb-2">
                <Battery className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Energy Used</h3>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{userData.currentStay.totalEnergy} kWh</div>
              <div className="flex items-center text-sm text-gray-400">
                <span>across {userData.currentStay.sessionCount} charging sessions</span>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
              <div className="flex items-center mb-2">
                <Leaf className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Green Energy</h3>
              </div>
              <div className="text-3xl font-bold text-green-500 mb-1">{userData.currentStay.renewablePercentage}%</div>
              <div className="flex items-center text-sm text-gray-400">
                <span>from renewable sources</span>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Smart Savings</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-500 mb-1">{userData.currentStay.offPeakUsage}%</div>
              <div className="flex items-center text-sm text-gray-400">
                <span>charging during off-peak hours</span>
              </div>
            </div>
          </div>
          
          {/* Charging sessions */}
          <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-white">Recent Charging Sessions</h2>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Energy</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cost</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Renewable %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {userData.sessions.map(session => (
                      <tr key={session.id}>
                        <td className="px-4 py-3 text-sm text-white">
                          <div>{session.date}</div>
                          <div className="text-xs text-gray-400">{session.startTime}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white">{session.duration}</td>
                        <td className="px-4 py-3 text-sm text-white">{session.energy} kWh</td>
                        <td className="px-4 py-3 text-sm text-white">{formatCurrency(session.cost)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  session.renewable > 70 ? 'bg-green-500' :
                                  session.renewable > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${session.renewable}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-white">{session.renewable}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-md ${
                            session.peakTime ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                          }`}>
                            {session.peakTime ? 'Peak' : 'Off-Peak'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Savings breakdown */}
          <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
            <div 
              className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('savings')}
            >
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-lg font-semibold text-white">Savings Breakdown</h2>
              </div>
              <div>
                {expandedSections.savings ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </div>
            </div>
            
            <div className={expandedSections.savings ? 'block' : 'hidden'}>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-300 mb-4">Membership Savings</h3>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-4">
                        <Award className="h-8 w-8 text-yellow-400" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">{userData.userInfo.membershipTier} Membership</div>
                        <div className="text-sm text-gray-400">10% discount on all charging</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Current stay savings</span>
                          <span className="text-green-400">€{(userData.currentStay.totalEnergy * 0.1 * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">All-time savings</span>
                          <span className="text-green-400">{formatCurrency(userData.userInfo.totalSavings)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-300 mb-4">Time-of-Use Savings</h3>
                    <div className="space-y-4">
                      {/* Off-peak vs Peak usage pie chart */}
                      <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { name: 'Off-Peak Usage', value: userData.currentStay.offPeakUsage },
                                { name: 'Peak Usage', value: userData.currentStay.peakTimeUsage }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              <Cell key="off-peak" fill={COLORS.green} />
                              <Cell key="peak" fill={COLORS.red} />
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value}%`, 'Percentage']}
                              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                              labelStyle={{ color: '#F9FAFB' }}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-2 p-3 bg-gray-900 rounded-lg">
                        <div className="text-sm font-medium text-white mb-2">Your Smart Charging Impact</div>
                        <p className="text-xs text-gray-300">
                          By charging {userData.currentStay.offPeakUsage}% of your energy during off-peak hours, you've saved approximately €{(userData.currentStay.totalEnergy * userData.currentStay.offPeakUsage/100 * 0.12).toFixed(2)} compared to peak rates.
                        </p>
                        
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                            <span className="text-gray-300">Off-Peak (€0.10/kWh)</span>
                          </div>
                          <div>
                            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                            <span className="text-gray-300">Peak (€0.22/kWh)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environmental Impact Tab */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          {/* Impact cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
              <div className="text-sm text-gray-400 mb-1">CO₂ Reduced</div>
              <div className="text-2xl font-bold text-green-500 mb-1">{environmentalImpact.co2Saved} kg</div>
              <div className="text-xs text-gray-400">vs. conventional vehicle</div>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
              <div className="text-sm text-gray-400 mb-1">Equivalent To</div>
              <div className="text-2xl font-bold text-green-500 mb-1">{environmentalImpact.equivalentTrees} trees</div>
              <div className="text-xs text-gray-400">planted for one year</div>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
              <div className="text-sm text-gray-400 mb-1">Gasoline Saved</div>
              <div className="text-2xl font-bold text-green-500 mb-1">{environmentalImpact.gasolineAvoided} L</div>
              <div className="text-xs text-gray-400">not consumed</div>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
              <div className="text-sm text-gray-400 mb-1">Clean Energy Used</div>
              <div className="text-2xl font-bold text-green-500 mb-1">{environmentalImpact.totalGreenEnergy} kWh</div>
              <div className="text-xs text-gray-400">from renewable sources</div>
            </div>
          </div>
          
          {/* Impact visualizations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 text-green-500 mr-2" />
                  <h2 className="text-lg font-semibold text-white">Carbon Footprint Comparison</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Conventional Vehicle</span>
                      <span className="text-red-400">35.6 kg CO₂</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Average EV</span>
                      <span className="text-yellow-400">21.4 kg CO₂</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Your EV at ElectriStay</span>
                      <span className="text-green-400">{environmentalImpact.co2Saved.toFixed(1)} kg CO₂</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-green-900 bg-opacity-20 p-3 rounded-lg border border-green-900">
                  <h3 className="text-sm font-medium text-green-400 mb-2">Your Green Impact</h3>
                  <p className="text-xs text-gray-300">
                    By charging at ElectriStay with {userData.currentStay.renewablePercentage}% renewable energy, your carbon footprint is {Math.round((1 - environmentalImpact.co2Saved/35.6) * 100)}% lower than a conventional vehicle for the same distance traveled.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center">
                  <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                  <h2 className="text-lg font-semibold text-white">Energy Sources</h2>
                </div>
              </div>
              <div className="p-4">
                <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Solar', value: 38 },
                          { name: 'Wind', value: 25 },
                          { name: 'Hydro', value: 9 },
                          { name: 'Nuclear', value: 8 },
                          { name: 'Natural Gas', value: 15 },
                          { name: 'Coal', value: 5 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        <Cell key="solar" fill="#F59E0B" /> {/* Yellow for solar */}
                        <Cell key="wind" fill="#60A5FA" /> {/* Light blue for wind */}
                        <Cell key="hydro" fill="#3B82F6" /> {/* Blue for hydro */}
                        <Cell key="nuclear" fill="#8B5CF6" /> {/* Purple for nuclear */}
                        <Cell key="natural-gas" fill="#6B7280" /> {/* Gray for natural gas */}
                        <Cell key="coal" fill="#374151" /> {/* Dark gray for coal */}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                        labelStyle={{ color: '#F9FAFB' }}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 bg-blue-900 bg-opacity-20 p-3 rounded-lg border border-blue-900">
                  <h3 className="text-sm font-medium text-blue-400 mb-2">Your Energy Mix</h3>
                  <p className="text-xs text-gray-300">
                    During your stay, {userData.currentStay.renewablePercentage}% of your charging energy came from renewable sources, primarily solar and wind power.
                  </p>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-2 mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${userData.currentStay.renewablePercentage}%` }}></div>
                    </div>
                    <span className="text-xs text-white">{userData.currentStay.renewablePercentage}% Green</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Historical impact chart */}
          <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <h2 className="text-lg font-semibold text-white">Your Environmental Impact Over Time</h2>
              </div>
            </div>
            <div className="p-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userData.historicalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis yAxisId="left" stroke="#9CA3AF" />
                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="energy" name="Energy Used (kWh)" fill={COLORS.blue} />
                    <Bar yAxisId="left" dataKey="co2Saved" name="CO₂ Saved (kg)" fill={COLORS.green} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Total CO₂ Saved</div>
                  <div className="text-xl font-bold text-green-500">
                    {userData.historicalData.reduce((sum, item) => sum + item.co2Saved, 0).toFixed(1)} kg
                  </div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Total Clean Energy</div>
                  <div className="text-xl font-bold text-blue-500">
                    {userData.historicalData.reduce((sum, item) => sum + (item.energy * item.renewable / 100), 0).toFixed(1)} kWh
                  </div>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Average Renewable %</div>
                  <div className="text-xl font-bold text-yellow-500">
                    {Math.round(userData.historicalData.reduce((sum, item) => sum + item.renewable, 0) / userData.historicalData.length)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-lg font-semibold text-white">Your ElectriStay Achievements</h2>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-gray-900 border-gray-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        {getIconComponent(achievement.icon)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          {achievement.name}
                          {!achievement.unlocked && " (Locked)"}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                        {achievement.unlocked && (
                          <div className="mt-2 px-2 py-1 bg-green-900 text-green-300 text-xs rounded-md inline-block">
                            Unlocked
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-900 bg-opacity-20 border border-yellow-900 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-400 mb-2">ElectriStay Rewards</h3>
                <p className="text-sm text-gray-300">
                  Unlock achievements to earn ElectriStay reward points. You currently have 250 points, which can be redeemed for free charging sessions or hotel amenities.
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress to next reward</span>
                    <span className="text-yellow-400">250/500 points</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trip stats */}
          <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
            <div 
              className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('trips')}
            >
              <div className="flex items-center">
                <Car className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-white">Your Travel Stats</h2>
              </div>
              <div>
                {expandedSections.trips ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </div>
            </div>
            
            <div className={expandedSections.trips ? 'block' : 'hidden'}>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Total Distance</div>
                    <div className="text-xl font-bold text-white">1,240 km</div>
                    <div className="text-xs text-gray-500">Powered by ElectriStay</div>
                  </div>
                  
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Locations Visited</div>
                    <div className="text-xl font-bold text-white">3</div>
                    <div className="text-xs text-gray-500">ElectriStay properties</div>
                  </div>
                  
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Charging Sessions</div>
                    <div className="text-xl font-bold text-white">{userData.userInfo.totalSessions}</div>
                    <div className="text-xs text-gray-500">Since becoming a member</div>
                  </div>
                </div>
                
                <div className="mt-4 bg-blue-900 bg-opacity-20 p-3 rounded-lg border border-blue-900">
                  <h3 className="text-sm font-medium text-blue-400 mb-2">Travel Recommendation</h3>
                  <p className="text-xs text-gray-300">
                    We've noticed you frequently travel between Erlangen and Munich. Consider trying our Oceanside EV Resort for your next trip, which offers premium charging services with a scenic ocean view.
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium">
                      View Property
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestEnergyDashboard;