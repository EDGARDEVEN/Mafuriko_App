import React, { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts/es6';

interface Location {
  name: string;
  coords: { lat: number; lng: number };
}

interface ClimateChartProps {
  location: Location;
}

export function ClimateChart({ location }: ClimateChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Mock historical data
  const temperatureData = [
    { date: '2024-01-01', temperature: 78, avgTemp: 75, maxTemp: 85, minTemp: 65 },
    { date: '2024-01-02', temperature: 82, avgTemp: 76, maxTemp: 87, minTemp: 67 },
    { date: '2024-01-03', temperature: 85, avgTemp: 77, maxTemp: 89, minTemp: 68 },
    { date: '2024-01-04', temperature: 89, avgTemp: 78, maxTemp: 92, minTemp: 70 },
    { date: '2024-01-05', temperature: 92, avgTemp: 79, maxTemp: 95, minTemp: 72 },
    { date: '2024-01-06', temperature: 87, avgTemp: 80, maxTemp: 90, minTemp: 71 },
    { date: '2024-01-07', temperature: 84, avgTemp: 78, maxTemp: 88, minTemp: 69 },
  ];

  const precipitationData = [
    { date: '2024-01-01', precipitation: 0.1, humidity: 65 },
    { date: '2024-01-02', precipitation: 0.3, humidity: 70 },
    { date: '2024-01-03', precipitation: 0.0, humidity: 68 },
    { date: '2024-01-04', precipitation: 0.8, humidity: 75 },
    { date: '2024-01-05', precipitation: 0.2, humidity: 72 },
    { date: '2024-01-06', precipitation: 0.0, humidity: 69 },
    { date: '2024-01-07', precipitation: 0.4, humidity: 73 },
  ];

  const riskTrendData = [
    { date: '2024-01-01', heatRisk: 45, stormRisk: 20, floodRisk: 15, overall: 27 },
    { date: '2024-01-02', heatRisk: 55, stormRisk: 30, floodRisk: 25, overall: 37 },
    { date: '2024-01-03', heatRisk: 65, stormRisk: 25, floodRisk: 20, overall: 37 },
    { date: '2024-01-04', heatRisk: 75, stormRisk: 45, floodRisk: 35, overall: 52 },
    { date: '2024-01-05', heatRisk: 80, stormRisk: 40, floodRisk: 30, overall: 50 },
    { date: '2024-01-06', heatRisk: 70, stormRisk: 35, floodRisk: 25, overall: 43 },
    { date: '2024-01-07', heatRisk: 60, stormRisk: 25, floodRisk: 20, overall: 35 },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}{entry.dataKey.includes('Risk') ? '%' : entry.dataKey === 'precipitation' ? ' in' : '°F'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Climate Trends</h3>
            <p className="text-gray-600">Historical data and forecasts for {location.name}</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '1y'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="temperature" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
            <TabsTrigger value="risks">Risk Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="temperature">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="maxTemp"
                    stackId="1"
                    stroke="#ff6b6b"
                    fill="#ff6b6b"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="minTemp"
                    stackId="1"
                    stroke="#4ecdc4"
                    fill="#4ecdc4"
                    fillOpacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Current Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-300 rounded"></div>
                <span>Max Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-300 rounded"></div>
                <span>Min Temperature</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="precipitation">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={precipitationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="precipitation" fill="#3b82f6" />
                  <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#10b981" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Precipitation (inches)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Humidity (%)</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risks">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="heatRisk"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stormRisk"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="floodRisk"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="overall"
                    stroke="#6b7280"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Heat Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Storm Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Flood Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Overall Risk</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}