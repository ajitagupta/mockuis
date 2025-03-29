import React, { useState, useEffect } from 'react';
import { Calendar, Battery, DollarSign, Clock, TrendingUp, Sun, Cloud, CloudRain, Thermometer, Users, ChevronUp, ChevronDown, Award, Zap } from 'lucide-react';

const BookingUI = () => {
  // Hotel info
  const hotelInfo = {
    name: "Hotel Luise",
    location: "Erlangen, Germany",
    checkIn: "2025-03-30",
    checkOut: "2025-04-01",
    guests: 2,
    roomRate: 117,
    sustainable: true,
    season: "Peak" // Can be "Off-Peak", "Shoulder", or "Peak"
  };
  
  // State for booking information
  const [bookingInfo, setBookingInfo] = useState({
    vehicleType: 'Tesla Model 3',
    membershipTier: 'Standard',
    estimatedArrivalTime: '15:00'
  });
  
  // State for available charging slots
  const [chargingSlots, setChargingSlots] = useState([]);
  
  // State for selected slot
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // State for energy rates
  const [energyRates, setEnergyRates] = useState({
    current: 0.14,
    peak: 0.22,
    offPeak: 0.08
  });
  
  // State for hotel occupancy
  const [hotelOccupancy, setHotelOccupancy] = useState(78);
  
  // State for weather data
  const [weatherData, setWeatherData] = useState({
    temperature: 15,
    condition: 'sunny',
    forecast: [
      { day: 'Mon', temp: 15, condition: 'sunny' },
      { day: 'Tue', temp: 12, condition: 'cloudy' },
      { day: 'Wed', temp: 14, condition: 'partly-cloudy' },
      { day: 'Thu', temp: 11, condition: 'rainy' }
    ]
  });

  // Function to determine membership discount
  const getMembershipDiscount = (tier) => {
    switch(tier) {
      case 'Platinum': return 0.15;  // 15% discount
      case 'Gold': return 0.10;      // 10% discount
      case 'Silver': return 0.05;    // 5% discount
      default: return 0;             // No discount for Standard
    }
  };

  // Function to determine time of day factor
  const getTimeOfDayFactor = (startTime) => {
    const hour = parseInt(startTime.split(':')[0], 10);
    
    if (hour >= 22 || hour < 6) {
      return -0.25; // Off-peak: 25% discount
    } else if (hour >= 16 && hour < 22) {
      return 0.25; // Peak: 25% premium
    } else {
      return 0; // Standard: Base price
    }
  };

  // Function to determine day of week factor
  const getDayOfWeekFactor = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    
    // Weekend (Saturday = 6, Sunday = 0)
    if (day === 0 || day === 6) {
      return 0.10; // Weekend: 10% premium
    }
    
    return 0; // Weekday: Base price
  };

  // Function to determine occupancy factor
  const getOccupancyFactor = (occupancy) => {
    if (occupancy > 75) {
      return 0.15; // High occupancy: 15% premium
    } else if (occupancy < 50) {
      return -0.10; // Low occupancy: 10% discount
    }
    
    return 0; // Medium occupancy: Base price
  };

  // Function to determine weather factor
  const getWeatherFactor = (condition, temperature) => {
    let priceFactor = 0;
    let efficiencyFactor = 1;
    let availability = 'High';
    let availabilityPeak = 'Medium';
    let impact = '';
    let carbonReduction = 1; // Base carbon factor
    
    // Temperature impact
    if (temperature < 5) {
      priceFactor += 0.10; // Extreme cold: 10% premium
      efficiencyFactor = 0.85;
      carbonReduction = 1.15;
      impact = 'Cold temperatures reduce battery efficiency by 15%';
    } else if (temperature > 30) {
      priceFactor += 0.10; // Extreme heat: 10% premium
      efficiencyFactor = 0.92;
      carbonReduction = 1.05;
      impact = 'High temperatures slightly reduce battery efficiency';
    } else if (temperature >= 15 && temperature <= 25) {
      priceFactor -= 0.05; // Optimal temperature: 5% discount
      efficiencyFactor = 1.05;
      carbonReduction = 0.95;
      impact = 'Optimal temperature increases charging efficiency by 5%';
    }
    
    // Weather condition impact
    switch (condition) {
      case 'rainy':
        priceFactor += 0.05; // Rainy: 5% premium
        availability = 'Medium';
        availabilityPeak = 'Low';
        carbonReduction *= 1.1;
        impact += impact ? ' • ' : '';
        impact += 'Rain may affect outdoor charging equipment';
        break;
      case 'cloudy':
        priceFactor += 0; // Cloudy: Base price
        carbonReduction *= 1.05;
        break;
      case 'sunny':
        priceFactor -= 0.05; // Sunny: 5% discount
        carbonReduction *= 0.9;
        impact += impact ? ' • ' : '';
        impact += 'Sunny conditions increase solar energy production';
        break;
      default:
        break;
    }
    
    return { 
      priceFactor, 
      efficiencyFactor, 
      availability, 
      availabilityPeak, 
      impact,
      carbonReduction
    };
  };

  // Function to determine seasonal factor
  const getSeasonalFactor = (season) => {
    switch(season) {
      case 'Peak':
        return 0.20; // Peak season: 20% premium
      case 'Off-Peak':
        return -0.15; // Off-peak season: 15% discount
      case 'Holiday':
        return 0.25; // Holiday period: 25% premium
      default: // Shoulder season
        return 0; // Base price
    }
  };

  // Load charging slots with all pricing factors
  useEffect(() => {
    // In a real app, this would be an API call that combines data from various sources
    const generateSlots = () => {
      const slots = [];
      
      // Generate slots for each day between check-in and check-out
      const startDate = new Date(hotelInfo.checkIn);
      const endDate = new Date(hotelInfo.checkOut);
      let currentDate = new Date(startDate);
      
      // Get membership discount
      const membershipDiscount = getMembershipDiscount(bookingInfo.membershipTier);
      
      // Get seasonal factor
      const seasonalFactor = getSeasonalFactor(hotelInfo.season);
      
      let slotIndex = 0;
      while (currentDate < endDate) {
        const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Get day of week factor
        const dayOfWeekFactor = getDayOfWeekFactor(currentDate);
        
        // Get weather data for this day
        const dayWeather = weatherData.forecast.find(d => d.day === dayOfWeek) || weatherData.forecast[0];
        
        // Weather impact on pricing
        const weatherFactor = getWeatherFactor(dayWeather.condition, dayWeather.temp);
        
        // Occupancy factor
        const occupancyFactor = getOccupancyFactor(hotelOccupancy);
        
        // Create slots for each time period
        const timeSlots = [
          { id: 'morning', name: 'Morning', startTime: '06:00', endTime: '10:00', basePrice: 14 },
          { id: 'afternoon', name: 'Afternoon', startTime: '12:00', endTime: '16:00', basePrice: 18 },
          { id: 'evening', name: 'Evening', startTime: '17:00', endTime: '21:00', basePrice: 16 },
          { id: 'night', name: 'Overnight', startTime: '22:00', endTime: '06:00', basePrice: 10, extended: true }
        ];
        
        timeSlots.forEach(timeSlot => {
          // Time of day factor
          const timeOfDayFactor = getTimeOfDayFactor(timeSlot.startTime);
          
          // Calculate total price factor
          const pricingFactors = [
            { 
              name: "Time of Day", 
              value: timeOfDayFactor, 
              description: timeOfDayFactor < 0 ? "Off-peak hours discount" : 
                           timeOfDayFactor > 0 ? "Peak hours premium" : "Standard hours"
            },
            { 
              name: "Hotel Occupancy", 
              value: occupancyFactor, 
              description: `${hotelOccupancy}% occupancy - ${
                occupancyFactor > 0 ? "High demand" : 
                occupancyFactor < 0 ? "Low demand" : "Normal demand"
              }`
            },
            { 
              name: "Day of Week", 
              value: dayOfWeekFactor, 
              description: dayOfWeekFactor > 0 ? "Weekend rates" : "Weekday rates"
            },
            { 
              name: "Weather", 
              value: weatherFactor.priceFactor, 
              description: `${dayWeather.condition}, ${dayWeather.temp}°C`
            },
            { 
              name: "Season", 
              value: seasonalFactor, 
              description: `${hotelInfo.season} season`
            },
            { 
              name: "Membership", 
              value: -membershipDiscount, 
              description: `${bookingInfo.membershipTier} tier`
            }
          ];
          
          // Calculate total factor
          const totalFactor = pricingFactors.reduce((sum, factor) => sum + factor.value, 1);
          
          // If this is the night slot, we need to get the next day's date for display
          let nextDate = null;
          if (timeSlot.extended) {
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() + 1);
            nextDate = nextDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          }
          
          // Calculate carbon intensity based on time and weather
          const carbonBaseline = timeSlot.id === 'night' ? 0.7 : 
                               timeSlot.id === 'morning' ? 0.9 :
                               timeSlot.id === 'afternoon' ? 1.5 : 1.2;
          const carbonIntensity = (carbonBaseline * weatherFactor.carbonReduction).toFixed(2);
          
          // Calculate renewable percentage based on time of day
          const renewablePercentage = timeSlot.id === 'night' ? 75 : 
                                     timeSlot.id === 'morning' ? 60 :
                                     timeSlot.id === 'afternoon' ? 40 : 45;
          
          // Push the slot with all calculated factors
          slots.push({
            id: `${timeSlot.id}-${slotIndex}`,
            name: timeSlot.name,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            date: formattedDate,
            nextDate: nextDate,
            basePrice: timeSlot.basePrice,
            dynamicPrice: (timeSlot.basePrice * totalFactor).toFixed(2),
            originalPrice: (timeSlot.basePrice * (totalFactor + membershipDiscount)).toFixed(2),
            pricingFactors: pricingFactors,
            totalFactor: totalFactor,
            membershipTier: bookingInfo.membershipTier,
            membershipDiscountPercent: Math.round(membershipDiscount * 100),
            discountAmount: (timeSlot.basePrice * membershipDiscount * (totalFactor + membershipDiscount)).toFixed(2),
            recommended: timeSlot.id === 'night',
            chargingSpeed: timeSlot.id === 'night' ? '7.2 kW' : '11 kW',
            estimatedCost: timeSlot.id === 'night' ? 
              (timeSlot.basePrice * totalFactor * 8).toFixed(2) : 
              (timeSlot.basePrice * totalFactor * 4).toFixed(2),
            originalCost: timeSlot.id === 'night' ? 
              (timeSlot.basePrice * (totalFactor + membershipDiscount) * 8).toFixed(2) : 
              (timeSlot.basePrice * (totalFactor + membershipDiscount) * 4).toFixed(2),
            gridLoad: timeSlot.id === 'night' ? 'Low' : 
                     timeSlot.id === 'morning' ? 'Medium' : 'High',
            weatherImpact: weatherFactor.impact,
            temperature: dayWeather.temp,
            weatherCondition: dayWeather.condition,
            estimatedFullCharge: timeSlot.id === 'night' ? '100%' : 
              `${Math.round(80 * weatherFactor.efficiencyFactor)}%`,
            renewablePercentage: renewablePercentage,
            carbonIntensity: carbonIntensity,
            hotelOccupancy: hotelOccupancy,
            seasonName: hotelInfo.season
          });
        });
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
        slotIndex++;
      }
      
      return slots;
    };
    
    setChargingSlots(generateSlots());
  }, [hotelInfo, weatherData, hotelOccupancy, bookingInfo.membershipTier]);
  
  // Handle booking confirmation
  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
  };
  
  // Weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'cloudy':
      case 'partly-cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };
  
  // Calculate nights
  const getNightCount = () => {
    const checkIn = new Date(hotelInfo.checkIn);
    const checkOut = new Date(hotelInfo.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Dynamic Pricing Factor Component
  const PricingFactorBreakdown = ({ factors, basePrice }) => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <div className="mt-2">
        <div 
          className="flex items-center justify-between cursor-pointer px-2 py-1 rounded hover:bg-gray-800"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-sm font-medium text-gray-300">Dynamic Pricing Breakdown</span>
          {expanded ? 
            <ChevronUp className="h-4 w-4 text-gray-400" /> : 
            <ChevronDown className="h-4 w-4 text-gray-400" />
          }
        </div>
        
        {expanded && (
          <div className="mt-2 p-3 bg-gray-800 rounded-md">
            <div className="text-sm mb-2">
              <span className="text-gray-400">Base Price:</span>
              <span className="float-right text-white">€{basePrice.toFixed(2)}</span>
            </div>
            
            {factors.map((factor, index) => (
              <div key={index} className="text-sm mb-1 flex justify-between">
                <div className="flex items-center">
                  <span className={`text-${
                    factor.value > 0 ? 'red-400' : 
                    factor.value < 0 ? 'green-400' : 'gray-400'
                  }`}>
                    {factor.name}:
                  </span>
                  <span className="text-gray-500 text-xs ml-2">({factor.description})</span>
                </div>
                <span className={`text-${
                  factor.value > 0 ? 'red-400' : 
                  factor.value < 0 ? 'green-400' : 'gray-400'
                }`}>
                  {factor.value > 0 ? '+' : ''}{(factor.value * 100).toFixed(0)}%
                  <span className="text-xs text-gray-500 ml-1">
                    (€{(basePrice * factor.value).toFixed(2)})
                  </span>
                </span>
              </div>
            ))}
            
            <div className="mt-2 pt-2 border-t border-gray-700 text-sm font-semibold">
              <span className="text-gray-300">Final Price:</span>
              <span className="float-right text-white">
                €{(basePrice * (1 + factors.reduce((sum, factor) => sum + factor.value, 0))).toFixed(2)}/kWh
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-6 bg-black text-white">
      {/* Header with hotel info */}
      <div className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white">{hotelInfo.name}</h1>
              </div>
              <p className="text-sm text-gray-400 mt-1">{hotelInfo.location}</p>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <div className="text-xs text-gray-400 flex">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{hotelInfo.checkIn} - {hotelInfo.checkOut}</span>
                <span className="mx-2">·</span>
                <span>{getNightCount()} {getNightCount() === 1 ? 'Night' : 'Nights'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current status indicators: Weather, Season, Occupancy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getWeatherIcon(weatherData.condition)}
              <div className="ml-3">
                <h3 className="text-lg font-medium text-white">Current Weather</h3>
                <p className="text-sm text-gray-400">{weatherData.temperature}°C, {weatherData.condition}</p>
              </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded ${
              weatherData.condition === 'sunny' ? 'bg-green-900 text-green-300' :
              weatherData.condition === 'rainy' ? 'bg-red-900 text-red-300' :
              'bg-yellow-900 text-yellow-300'
            }`}>
              {weatherData.condition === 'sunny' ? '-5% Price' :
               weatherData.condition === 'rainy' ? '+5% Price' :
               'Base Price'}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-purple-400" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-white">Current Season</h3>
                <p className="text-sm text-gray-400">{hotelInfo.season} Travel Season</p>
              </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded ${
              hotelInfo.season === 'Off-Peak' ? 'bg-green-900 text-green-300' :
              hotelInfo.season === 'Peak' ? 'bg-red-900 text-red-300' :
              hotelInfo.season === 'Holiday' ? 'bg-red-900 text-red-300' :
              'bg-yellow-900 text-yellow-300'
            }`}>
              {hotelInfo.season === 'Off-Peak' ? '-15% Price' :
               hotelInfo.season === 'Peak' ? '+20% Price' :
               hotelInfo.season === 'Holiday' ? '+25% Price' :
               'Base Price'}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-white">Hotel Occupancy</h3>
                <div className="flex items-center mt-1">
                  <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                    <div
                      className={`h-2 rounded-full ${
                        hotelOccupancy > 85 ? 'bg-red-500' : 
                        hotelOccupancy > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${hotelOccupancy}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400">{hotelOccupancy}%</span>
                </div>
              </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded ${
              hotelOccupancy > 75 ? 'bg-red-900 text-red-300' :
              hotelOccupancy < 50 ? 'bg-green-900 text-green-300' :
              'bg-yellow-900 text-yellow-300'
            }`}>
              {hotelOccupancy > 75 ? '+15% Price' :
               hotelOccupancy < 50 ? '-10% Price' :
               'Base Price'}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <div className="p-5 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">Your EV Details</h3>
          <p className="text-sm text-gray-400 mt-1">
            Add your vehicle information to find the best charging options during your stay
          </p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Vehicle Type</label>
              <select 
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                value={bookingInfo.vehicleType}
                onChange={(e) => setBookingInfo({...bookingInfo, vehicleType: e.target.value})}
              >
                <option value="Tesla Model 3">Tesla Model 3</option>
                <option value="Tesla Model Y">Tesla Model Y</option>
                <option value="VW ID.4">VW ID.4</option>
                <option value="BMW i4">BMW i4</option>
                <option value="Mercedes EQE">Mercedes EQE</option>
                <option value="Audi e-tron">Audi e-tron</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Estimated Arrival Time</label>
              <select 
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                value={bookingInfo.estimatedArrivalTime}
                onChange={(e) => setBookingInfo({...bookingInfo, estimatedArrivalTime: e.target.value})}
              >
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM (Standard Check-in)</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="19:00">7:00 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="21:00">9:00 PM</option>
                <option value="22:00">10:00 PM</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">ElectriStay Membership</label>
              <select 
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                value={bookingInfo.membershipTier}
                onChange={(e) => setBookingInfo({...bookingInfo, membershipTier: e.target.value})}
              >
                <option value="Standard">Standard</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
              <div className={`flex items-center text-xs mt-1 ${
                bookingInfo.membershipTier === 'Standard' ? 'text-gray-400' :
                bookingInfo.membershipTier === 'Silver' ? 'text-blue-400' :
                bookingInfo.membershipTier === 'Gold' ? 'text-yellow-400' :
                'text-purple-400'
              }`}>
                <Award className="h-3 w-3 mr-1" />
                {bookingInfo.membershipTier === 'Standard' ? 'No discount' :
                 bookingInfo.membershipTier === 'Silver' ? '5% discount applied' :
                 bookingInfo.membershipTier === 'Gold' ? '10% discount applied' :
                 '15% discount applied'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Charging Slots */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          AI-Recommended Charging Slots During Your Stay
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {chargingSlots.map((slot) => (
            <div 
              key={slot.id} 
              className={`bg-gray-900 rounded-lg shadow-md border ${
                slot.recommended ? 'border-green-500' : 'border-gray-800'
              } hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="p-5 pb-2 border-b border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {slot.name} ({slot.startTime} - {slot.endTime})
                    </h3>
                    <p className="text-sm text-gray-400">
                      {slot.date}
                      {slot.nextDate && ` - ${slot.nextDate}`}
                    </p>
                  </div>
                  {slot.recommended && (
                    <div className="bg-green-900 text-green-300 text-xs font-medium px-2 py-1 rounded">
                      AI Recommended
                    </div>
                  )}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Dynamic Price:</span>
                  <div className="text-right">
                    {slot.membershipDiscountPercent > 0 && (
                      <span className="text-xs text-gray-500 line-through block">€{slot.originalPrice}/kWh</span>
                    )}
                    <span className="font-bold text-lg text-white">€{slot.dynamicPrice}/kWh</span>
                  </div>
                </div>
                
                <PricingFactorBreakdown 
                  factors={slot.pricingFactors} 
                  basePrice={slot.basePrice} 
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Estimated Cost:</span>
                  <span className="font-medium text-white">€{slot.estimatedCost}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Charging Speed:</span>
                  <span className="font-medium text-white">{slot.chargingSpeed}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Grid Load:</span>
                  <span className={`font-medium ${
                    slot.gridLoad === 'Low' ? 'text-green-400' :
                    slot.gridLoad === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {slot.gridLoad}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Weather:</span>
                  <div className="flex items-center">
                    {getWeatherIcon(slot.weatherCondition)}
                    <span className="ml-1 font-medium text-white">{slot.temperature}°C</span>
                  </div>
                </div>
                
                <div className={
                  slot.renewablePercentage > 70 
                    ? "bg-green-900 text-green-300 text-xs p-2 rounded" 
                    : slot.renewablePercentage > 50 
                      ? "bg-blue-900 text-blue-300 text-xs p-2 rounded"
                      : "bg-yellow-900 text-yellow-300 text-xs p-2 rounded"
                }>
                  {slot.renewablePercentage > 70 
                    ? `Off-Peak Energy - Lower Carbon Intensity (${slot.carbonIntensity} kg CO₂/kWh)` 
                    : slot.renewablePercentage > 50
                      ? `Mixed Energy Sources - Medium Carbon Intensity (${slot.carbonIntensity} kg CO₂/kWh)`
                      : `Peak Demand - Higher Carbon Intensity (${slot.carbonIntensity} kg CO₂/kWh)`}
                </div>
                
                <button 
                  className={`w-full py-2 px-4 rounded-md ${
                    selectedSlot?.id === slot.id
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                  onClick={() => handleBookSlot(slot)}
                >
                  {selectedSlot?.id === slot.id ? 'Selected' : 'Book This Slot'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Booking Summary */}
      {selectedSlot && (
        <div className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-xl font-semibold text-white">Add to Your {hotelInfo.name} Reservation</h3>
            <p className="text-sm text-gray-400 mt-1">
              EV charging will be seamlessly integrated with your hotel stay
            </p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Selected Time Slot</h4>
                  <p className="text-lg font-bold text-white">
                    {selectedSlot.date}, {selectedSlot.startTime} - {selectedSlot.endTime}
                    {selectedSlot.nextDate && ` (${selectedSlot.nextDate})`}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Hotel</h4>
                  <p className="font-medium text-white">{hotelInfo.name}, {hotelInfo.location}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Vehicle</h4>
                  <p className="font-medium text-white">{bookingInfo.vehicleType}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Weather Conditions</h4>
                  <div className="flex items-center">
                    {getWeatherIcon(selectedSlot.weatherCondition)}
                    <p className="font-medium ml-2 text-white">{selectedSlot.temperature}°C, {selectedSlot.weatherCondition}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Dynamic Pricing Breakdown</h4>
                  <div className="bg-gray-800 p-3 rounded-md mt-2">
                    <div className="text-sm mb-2">
                      <span className="text-gray-400">Base Price:</span>
                      <span className="float-right text-white">€{selectedSlot.basePrice.toFixed(2)}</span>
                    </div>
                    
                    {selectedSlot.pricingFactors.map((factor, index) => (
                      <div key={index} className="text-sm mb-1 flex justify-between">
                        <span className={factor.value > 0 ? 'text-red-400' : 
                                          factor.value < 0 ? 'text-green-400' : 'text-gray-400'}>
                          {factor.name}:
                        </span>
                        <span className={factor.value > 0 ? 'text-red-400' : 
                                         factor.value < 0 ? 'text-green-400' : 'text-gray-400'}>
                          {factor.value > 0 ? '+' : ''}{(factor.value * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                    
                    <div className="mt-2 pt-2 border-t border-gray-700 text-sm font-semibold">
                      <span className="text-gray-300">Final Price:</span>
                      <span className="float-right text-white">
                        €{selectedSlot.dynamicPrice}/kWh
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Estimated Total</h4>
                  <div>
                    <p className="text-lg font-bold text-white">€{selectedSlot.estimatedCost}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Total Stay Cost</h4>
                  <p className="font-medium text-white">
                    €{hotelInfo.roomRate * getNightCount()} (room) + €{Math.round(parseFloat(selectedSlot.estimatedCost))} (charging)
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Energy Source</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${selectedSlot.renewablePercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-white">{selectedSlot.renewablePercentage}% Clean Energy Mix</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Carbon intensity: {selectedSlot.carbonIntensity} kg CO₂/kWh
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md">
                Add Charging to Room Reservation
              </button>
              <p className="text-xs text-center mt-2 text-gray-400">
                Charging will be added to your hotel bill at checkout
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Pricing Factors Explanation */}
      <div className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">Dynamic Pricing Factors</h3>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            These factors affect the price of your charging session
          </p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                <h4 className="font-medium text-white">Time of Day</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Off-peak (10PM-6AM):</span>
                  <span className="text-green-400">25% discount</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Standard (6AM-4PM):</span>
                  <span className="text-gray-300">Base price</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Peak (4PM-10PM):</span>
                  <span className="text-red-400">25% premium</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Users className="h-5 w-5 text-yellow-400 mr-2" />
                <h4 className="font-medium text-white">Hotel Occupancy</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Low (&lt; 50%):</span>
                  <span className="text-green-400">10% discount</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Medium (50-75%):</span>
                  <span className="text-gray-300">Base price</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">High (&gt; 75%):</span>
                  <span className="text-red-400">15% premium</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-purple-400 mr-2" />
                <h4 className="font-medium text-white">Day of Week</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Weekdays:</span>
                  <span className="text-gray-300">Base price</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Weekends:</span>
                  <span className="text-red-400">10% premium</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Sun className="h-5 w-5 text-yellow-400 mr-2" />
                <h4 className="font-medium text-white">Weather Conditions</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Sunny:</span>
                  <span className="text-green-400">5% discount</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cloudy:</span>
                  <span className="text-gray-300">Base price</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Rainy/Snowy:</span>
                  <span className="text-red-400">5% premium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Extreme temps (&lt; 5°C or &gt; 30°C):</span>
                  <span className="text-red-400">10% premium</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                <h4 className="font-medium text-white">Seasonal Factors</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Off-peak season:</span>
                  <span className="text-green-400">15% discount</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Shoulder season:</span>
                  <span className="text-gray-300">Base price</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Peak tourist season:</span>
                  <span className="text-red-400">20% premium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Holiday periods:</span>
                  <span className="text-red-400">25% premium</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Award className="h-5 w-5 text-blue-400 mr-2" />
                <h4 className="font-medium text-white">Membership Status</h4>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Standard:</span>
                  <span className="text-gray-300">Base price</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Silver:</span>
                  <span className="text-blue-400">5% discount</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Gold:</span>
                  <span className="text-yellow-400">10% discount</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Platinum:</span>
                  <span className="text-purple-400">15% discount</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Membership Benefits */}
      <div className="bg-gray-900 rounded-lg shadow-md mb-6 border border-gray-800">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-yellow-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">ElectriStay Membership Benefits</h3>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-700 rounded-lg bg-gray-800">
              <h4 className="font-medium text-lg mb-2 text-white">Standard</h4>
              <p className="text-sm text-gray-300 mb-2">Base rates with no additional discount</p>
              <p className="text-sm text-gray-400">Free to join</p>
              <ul className="mt-3 text-xs text-gray-400 space-y-1">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Basic charging access</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Standard reservation window</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border border-blue-900 rounded-lg bg-blue-900 bg-opacity-30">
              <h4 className="font-medium text-lg text-blue-300 mb-2">Silver</h4>
              <p className="text-sm text-blue-300 mb-2">5% discount on all charging sessions</p>
              <p className="text-sm text-gray-300">€9.99/month</p>
              <ul className="mt-3 text-xs text-blue-300 space-y-1">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Priority charging access</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>24-hour reservation window</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Basic charging statistics</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border border-yellow-900 rounded-lg bg-yellow-900 bg-opacity-30">
              <h4 className="font-medium text-lg text-yellow-300 mb-2">Gold</h4>
              <p className="text-sm text-yellow-300 mb-2">10% discount on all charging sessions</p>
              <p className="text-sm text-gray-300">€19.99/month</p>
              <ul className="mt-3 text-xs text-yellow-300 space-y-1">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Premium charging access</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>48-hour reservation window</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Detailed charging analytics</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Charging history export</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border border-purple-900 rounded-lg bg-purple-900 bg-opacity-30">
              <h4 className="font-medium text-lg text-purple-300 mb-2">Platinum</h4>
              <p className="text-sm text-purple-300 mb-2">15% discount on all charging sessions</p>
              <p className="text-sm text-gray-300">€29.99/month</p>
              <ul className="mt-3 text-xs text-purple-300 space-y-1">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>VIP guaranteed charging access</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>72-hour reservation window</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Premium data analytics dashboard</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Carbon offset certificates</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  <span>Dedicated customer support</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium">
              Upgrade Your Membership
            </button>
            <p className="text-xs mt-2 text-gray-400">Higher membership tiers provide additional benefits and greater savings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingUI;
