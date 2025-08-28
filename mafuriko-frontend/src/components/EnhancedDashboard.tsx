import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertTriangle, Cloud, Droplets, Wind, Thermometer, MapPin, Bell, Settings, User, LogOut } from 'lucide-react';
import { WeatherCard } from './WeatherCard';
import { RiskAssessment } from './RiskAssessment';
import { ActionRecommendations } from './ActionRecommendations';
import { ClimateChart } from './ClimateChart';
import { AlertsPanel } from './AlertsPanel';
import { LocationSelector } from './LocationSelector';
import { AuthModal } from './AuthModal';
import { useAuth } from './AuthProvider';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function EnhancedDashboard() {
  const { user, signOut, getAccessToken } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'Garissa, Kenya',
    coords: { lat: -0.4535, lng: 39.6594 }
  });
  
  const [currentRiskLevel, setCurrentRiskLevel] = useState('moderate');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  type Alert = {
    id: number;
    type: string;
    severity: 'moderate' | 'low' | 'high' | 'extreme';
    title: string;
    description: string;
    timestamp: Date;
    location: string;
    expiresAt?: Date;
  };

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch real-time data from backend
  const fetchWeatherData = async (location: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-351b8522/weather/${encodeURIComponent(location)}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRiskAssessment = async (location: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-351b8522/risk-assessment/${encodeURIComponent(location)}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRiskData(data);
        
        // Update current risk level based on overall risk
        if (data.overallRisk >= 70) setCurrentRiskLevel('extreme');
        else if (data.overallRisk >= 50) setCurrentRiskLevel('high');
        else if (data.overallRisk >= 25) setCurrentRiskLevel('moderate');
        else setCurrentRiskLevel('low');
        
        // Check for automatic alerts
        if (data.triggers?.heatWarning) {
          await createAlert({
            type: 'heat',
            severity: 'high',
            title: 'Extreme Heat Warning',
            description: `Temperature exceeding 95°F detected in ${location}`,
            location: location
          });
        }
      }
    } catch (error) {
      console.error('Error fetching risk assessment:', error);
    }
  };

  const fetchAlerts = async (location: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-351b8522/alerts/${encodeURIComponent(location)}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Ensure timestamps are properly converted to Date objects
        const processedAlerts = data.map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp),
          expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined
        }));
        setAlerts(processedAlerts);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Fallback to mock data with proper Date objects
      setAlerts([
        {
          id: 1,
          type: 'heat',
          severity: 'high',
          title: 'Extreme Heat Warning',
          description: 'Temperatures expected to reach 98°F with high humidity',
          timestamp: new Date(),
          location: location,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          type: 'storm',
          severity: 'moderate',
          title: 'Thunderstorm Watch',
          description: 'Severe thunderstorms possible this afternoon',
          timestamp: new Date(Date.now() - 3600000),
          location: location
        }
      ]);
    }
  };

  const createAlert = async (alertData: any) => {
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-351b8522/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || publicAnonKey}`
        },
        body: JSON.stringify(alertData)
      });
      
      if (response.ok) {
        // Refresh alerts
        await fetchAlerts(selectedLocation.name);
      }
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  // Fetch data when location changes
  useEffect(() => {
    const loadLocationData = async () => {
      await fetchWeatherData(selectedLocation.name);
      await fetchRiskAssessment(selectedLocation.name);
      await fetchAlerts(selectedLocation.name);
    };

    loadLocationData();
    
    // Set up periodic refresh every 5 minutes
    const interval = setInterval(loadLocationData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mafuriko-App Dashboard</h1>
            <p className="text-gray-600 mt-1">AI-powered early warning system for climate risks</p>
            {loading && <p className="text-sm text-blue-600">Updating data...</p>}
          </div>
          <div className="flex items-center gap-4">
            <LocationSelector 
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Risk Level Banner */}
        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <h2 className="text-xl font-semibold">Current Risk Level</h2>
                <p className="text-gray-600">Based on AI analysis of current conditions</p>
                {loading && <p className="text-sm text-blue-600">Updating data...</p>}
              </div>
            </div>
            <Badge className={`${getRiskBadgeColor(currentRiskLevel)} text-white px-4 py-2 text-lg`}>
              {currentRiskLevel.toUpperCase()}
            </Badge>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Active Alerts ({alerts.length})</TabsTrigger>
            <TabsTrigger value="trends">Climate Trends</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="map">Risk Map</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <WeatherCard location={selectedLocation} />
                <RiskAssessment location={selectedLocation} />
              </div>
              <div className="space-y-6">
                <ActionRecommendations riskLevel={currentRiskLevel} />
                <AlertsPanel alerts={alerts.slice(0, 3)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel alerts={alerts} showAll={true} />
          </TabsContent>

          <TabsContent value="trends">
            <ClimateChart location={selectedLocation} />
          </TabsContent>

          <TabsContent value="actions">
            <ActionRecommendations riskLevel={currentRiskLevel} detailed={true} />
          </TabsContent>

          <TabsContent value="map">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Interactive Risk Map</h3>
              <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive map showing climate risks across regions</p>
                  <p className="text-sm text-gray-500 mt-2">Integration with mapping services available</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}