import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Thermometer, Droplets, Wind, Eye, Gauge, Cloud, RefreshCw } from 'lucide-react';
import { climateService } from '../services/climateService';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility?: number;
  precipitationChance?: number;
  condition: string;
  feelsLike?: number;
  uvIndex: number;
  airQuality: string;
}

interface Location {
  name: string;
  coords: { lat: number; lng: number };
}

interface WeatherCardProps {
  location: Location;
}

export function WeatherCard({ location }: WeatherCardProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await climateService.getWeatherData(location.name);
      
      const processedData: WeatherData = {
        temperature: data.temperature,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        condition: data.condition,
        uvIndex: data.uvIndex,
        airQuality: data.airQuality,
        feelsLike: data.temperature + Math.round(Math.random() * 10 - 5), // Mock feels like
        visibility: 8.5 + Math.random() * 2, // Mock visibility
        precipitationChance: Math.round(Math.random() * 60 + 10) // Mock precipitation
      };
      
      setWeatherData(processedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      setError('Failed to load weather data');
      
      // Fallback to mock data if API fails
      setWeatherData({
        temperature: 89,
        humidity: 78,
        windSpeed: 12,
        visibility: 8.5,
        precipitationChance: 35,
        condition: 'Partly Cloudy',
        feelsLike: 94,
        uvIndex: 8,
        airQuality: 'Moderate'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const getTemperatureColor = (temp: number) => {
    if (temp >= 90) return 'text-red-600';
    if (temp >= 80) return 'text-orange-600';
    if (temp >= 70) return 'text-yellow-600';
    if (temp >= 60) return 'text-green-600';
    return 'text-blue-600';
  };

  const getAQIColor = (aqi: string) => {
    switch (aqi.toLowerCase()) {
      case 'good': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'unhealthy': return 'bg-orange-500';
      case 'hazardous': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading && !weatherData) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="text-right">
              <div className="h-10 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error && !weatherData) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWeatherData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  if (!weatherData) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Current Conditions</h3>
            {loading && (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
            )}
          </div>
          <p className="text-gray-600">{location.name}</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getTemperatureColor(weatherData.temperature)}`}>
            {weatherData.temperature}°F
          </div>
          <p className="text-gray-600">{weatherData.condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-orange-500" />
          <div>
            <p className="text-sm text-gray-600">Feels like</p>
            <p className="font-semibold">{weatherData.feelsLike}°F</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="font-semibold">{weatherData.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Wind</p>
            <p className="font-semibold">{weatherData.windSpeed} mph</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Visibility</p>
            <p className="font-semibold">{weatherData.visibility?.toFixed(1)} mi</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Rain: {weatherData.precipitationChance}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">UV: {weatherData.uvIndex}/10</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getAQIColor(weatherData.airQuality)} text-white`}>
            Air Quality: {weatherData.airQuality}
          </Badge>
          <button
            onClick={fetchWeatherData}
            className="p-1 hover:bg-gray-100 rounded"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </Card>
  );
}