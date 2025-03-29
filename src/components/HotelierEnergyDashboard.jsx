import React, { useState } from 'react';
import { 
  Battery, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Zap, 
  Award,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp
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

const HotelierEnergyDashboard = () => {
  // Mock data for dashboard
  const dashboardData = {
    hotelInfo: {
      name: "Hotel Luise",
      location: "Erlangen, Germany",
      chargingStations: 4
    },
    historicalData: [
      { month: 'Jan', energy: 182.5, revenue: 248.2, renewable: 68, sessions: 12, co2Saved: 60.8 },
      { month: 'Feb', energy: 175.6, revenue: 238.8, renewable: 70, sessions: 11, co2Saved: 58.5 },
      { month: 'Mar', energy: 204.5, revenue: 278.4, renewable: 75, sessions: 14, co2Saved: 68.2 }
    ],
    currentStats: {
      energyDelivered: 204.5,
      revenue: 278.45,
      avgSessionDuration: 4.2
    },
    hourlyUsage: Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      // Higher usage during business hours
      const usage = i >= 8 && i <= 19 
        ? 5 + Math.sin((i - 8) * Math.PI / 11) * 6 
        : 2 + Math.random() * 3;
      return {
        hour: `${hour}:00`,
        usage: parseFloat(usage.toFixed(1)),
        renewable: Math.round(50 + Math.random() * 40),
        price: i >= 16 && i <= 21 ? 0.18 : i >= 6 && i <= 15 ? 0.14 : 0.11
      };
    }),
    stationUsage: [
      { id: 1, name: 'Station 1', utilization: 65 },
      { id: 2, name: 'Station 2', utilization: 58 },
      { id: 3, name: 'Station 3', utilization: 62 },
      { id: 4, name: 'Station 4', utilization: 0, status: 'maintenance' }
    ],
    timeOfDayUsage: [
      { period: 'Morning (6AM-12PM)', percentage: 22, energy: 405.1, revenue: 567.3 },
      { period: 'Afternoon (12PM-6PM)', percentage: 28, energy: 515.3, revenue: 722.0 },
      { period: 'Evening (6PM-12AM)', percentage: 35, energy: 644.2, revenue: 902.5 },
      { period: 'Night (12AM-6AM)', percentage: 15, energy: 276.1, revenue: 386.7 }
    ],
    popularTimeSlots: [
      { slot: '6-8 PM', sessions: 24, percentage: 19.2 },
      { slot: '5-6 PM', sessions: 18, percentage: 14.4 },
      { slot: '7-9 AM', sessions: 15, percentage: 12.0 }
    ],
    profitabilityData: [
      { month: 'Jan', energy_cost: 91.3, revenue: 248.2, profit: 156.9 },
      { month: 'Feb', energy_cost: 87.8, revenue: 238.8, profit: 151.0 },
      { month: 'Mar', energy_cost: 102.3, revenue: 278.4, profit: 176.1 }
    ]
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2)}`;
  };
  
  // Calculate previous month data for comparison
  const previousMonth = dashboardData.historicalData[dashboardData.historicalData.length - 2];
  
  // Color constants
  const COLORS = {
    blue: '#3B82F6',
    green: '#10B981',
    red: '#EF4444',
    yellow: '#F59E0B',
    purple: '#8B5CF6',
    gray: '#6B7280',
  };
  
  // Collapsed sections state
  const [expandedSections, setExpandedSections] = useState({
    energyConsumed: true,
    stationUsage: true,
    revenue: true,
    sessionDuration: true,
    profitability: true,
    timeOfDay: true,
    popularTimeSlots: true
  });
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="container mx-auto px-4 py-6 bg-black text-white">
      {/* Header section */}
      <div className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <Zap className="h-6 w-6 text-red-500 mr-2" />
                <h1 className="text-xl font-bold text-white">EV Charging Energy Analytics</h1>
              </div>
              <p className="text-sm text-gray-400 mt-1">{dashboardData.hotelInfo.name}, {dashboardData.hotelInfo.location}</p>
            </div>
            <div className="flex items-center mt-2 md:mt-0 space-x-3">
              <button className="flex items-center text-xs bg-gray-800 p-2 rounded-md">
                <Download className="h-3 w-3 mr-1" />
                <span>Export</span>
              </button>
              <button className="flex items-center text-xs bg-gray-800 p-2 rounded-md">
                <RefreshCw className="h-3 w-3 mr-1" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <Battery className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-md font-semibold text-white">Energy Delivered</h3>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{dashboardData.currentStats.energyDelivered} kWh</div>
          <div className="flex items-center text-xs text-gray-400">
            <span>vs {previousMonth.energy} kWh last month</span>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-md font-semibold text-white">Revenue</h3>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatCurrency(dashboardData.currentStats.revenue)}</div>
          <div className="flex items-center text-xs text-gray-400">
            <span>vs {formatCurrency(previousMonth.revenue)} last month</span>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-md font-semibold text-white">Avg Session Duration</h3>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{dashboardData.currentStats.avgSessionDuration} hrs</div>
          <div className="flex items-center text-xs text-gray-400">
            <span>Optimal for revenue generation</span>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="space-y-6">
        {/* Total Energy Consumed Section */}
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
          <div 
            className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('energyConsumed')}
          >
            <div className="flex items-center">
              <Battery className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Total Energy Consumed</h2>
            </div>
            <div>
              {expandedSections.energyConsumed ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
          </div>
          
          <div className={expandedSections.energyConsumed ? 'block' : 'hidden'}>
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-4">
                Tracks total kWh delivered per month. Useful for budgeting and tracking energy usage trends.
              </div>
              
              <div className="h-64 bg-gray-800 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardData.historicalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      formatter={(value) => [`${value} kWh`, 'Energy']}
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="energy" name="Energy (kWh)" stroke="#3B82F6" strokeWidth={2} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charging Station Usage Rate */}
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
          <div 
            className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('stationUsage')}
          >
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Charging Station Usage Rate</h2>
            </div>
            <div>
              {expandedSections.stationUsage ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
          </div>
          
          <div className={expandedSections.stationUsage ? 'block' : 'hidden'}>
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-4">
                Shows the percentage of total time each station was actively charging. Helps identify underused or overused chargers.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Usage Rate by Station</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData.stationUsage}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Utilization']}
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                          labelStyle={{ color: '#F9FAFB' }}
                        />
                        <Bar dataKey="utilization" name="Usage Rate (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Usage Heatmap (Hours)</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {dashboardData.hourlyUsage.map((hour) => {
                      const intensity = (hour.usage / 12) * 100;
                      return (
                        <div 
                          key={hour.hour} 
                          className="p-2 rounded flex flex-col items-center justify-center"
                          style={{ 
                            backgroundColor: `rgba(16, 185, 129, ${intensity / 100})`,
                            border: '1px solid #374151' 
                          }}
                        >
                          <div className="text-xs font-medium text-white">{hour.hour}</div>
                          <div className="text-xs text-gray-300">{hour.usage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Revenue from Charging */}
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
          <div 
            className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('revenue')}
          >
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Revenue from Charging</h2>
            </div>
            <div>
              {expandedSections.revenue ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
          </div>
          
          <div className={expandedSections.revenue ? 'block' : 'hidden'}>
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-4">
                Displays monthly revenue from EV charging. Simple ROI metric to justify the investment.
              </div>
              
              <div className="h-64 bg-gray-800 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardData.historicalData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      formatter={(value) => [`€${value.toFixed(2)}`, 'Revenue']}
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="Revenue (€)" stroke="#F59E0B" strokeWidth={2} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Energy Cost vs. Revenue (Profitability) */}
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
          <div 
            className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('profitability')}
          >
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Energy Cost vs. Revenue (Profitability)</h2>
            </div>
            <div>
              {expandedSections.profitability ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
          </div>
          
          <div className={expandedSections.profitability ? 'block' : 'hidden'}>
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-4">
                Shows total energy cost compared to charging revenue. Gives a clear picture of profitability per month.
              </div>
              
              <div className="h-64 bg-gray-800 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.profitabilityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      formatter={(value) => [`€${value.toFixed(2)}`, '']}
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend />
                    <Bar dataKey="energy_cost" name="Energy Cost" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" name="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="profit" name="Profit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Time-of-Day Usage Pattern */}
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
          <div 
            className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('timeOfDay')}
          >
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Time-of-Day Usage Pattern</h2>
            </div>
            <div>
              {expandedSections.timeOfDay ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
          </div>
          
          <div className={expandedSections.timeOfDay ? 'block' : 'hidden'}>
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-4">
                Shows charging activity during MORNING/AFTERNOON/EVENING/NIGHT. Helps shift users to cheaper time slots.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Usage by Time Period</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dashboardData.timeOfDayUsage}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="period" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Usage']}
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                          labelStyle={{ color: '#F9FAFB' }}
                        />
                        <Bar dataKey="percentage" name="Usage (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Revenue by Time Period</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={dashboardData.timeOfDayUsage}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="revenue"
                          nameKey="period"
                          label={({name, percent}) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell key="morning" fill="#3B82F6" />
                          <Cell key="afternoon" fill="#F59E0B" />
                          <Cell key="evening" fill="#8B5CF6" />
                          <Cell key="night" fill="#6B7280" />
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`€${value.toFixed(2)}`, 'Revenue']}
                          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '6px' }}
                          labelStyle={{ color: '#F9FAFB' }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Most Popular Charging Time Slots */}
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
          <div 
            className="p-4 border-b border-gray-800 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('popularTimeSlots')}
          >
            <div className="flex items-center">
              <Award className="h-5 w-5 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-white">Most Popular Charging Time Slots</h2>
            </div>
            <div>
              {expandedSections.popularTimeSlots ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
          </div>
          
          <div className={expandedSections.popularTimeSlots ? 'block' : 'hidden'}>
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-4">
                Shows top 3 busiest time slots. Simple congestion indicator; helps with staffing and scheduling.
              </div>
              
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-300 mb-4">Top 3 Busy Periods</h3>
                <div className="space-y-4">
                  {dashboardData.popularTimeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-yellow-300 font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white">{slot.slot}</span>
                          <span className="text-sm text-white">{slot.percentage}% of sessions</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${slot.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {slot.sessions} sessions this month
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-6 bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-gray-500">
            © 2025 EV Charging Analytics Dashboard • Last updated: March 29, 2025
          </div>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <button className="text-xs text-gray-400 hover:text-white">Help</button>
            <button className="text-xs text-gray-400 hover:text-white">Support</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelierEnergyDashboard;