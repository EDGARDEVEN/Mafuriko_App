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
import { authService } from '../services/authService';
import { climateService } from '../services/climateService';

export function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'New York, NY',
    coords: { lat: 40.7128, lng: -74.0060 }
  });
  
  const [currentRiskLevel, setCurrentRiskLevel] = useState('moderate');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((authState) => {
      setUser(authState.user);
      setAccessToken(authState.accessToken);
      setLoading(authState.loading);
    });

    return unsubscribe;
  }, []);

  // Fetch alerts when location or user changes
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alertsData = await climateService.getAlerts(
          selectedLocation.name,
          user?.id
        );
        setAlerts(alertsData);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        // Fallback to mock data
        setAlerts([
          {
            id: 1,
            type: 'heat',
            severity: 'high',
            title: 'Extreme Heat Warning',
            description: 'Temperatures expected to reach 98°F with high humidity',
            timestamp: new Date().toISOString(),
            location: selectedLocation.name
          },
          {
            id: 2,
            type: 'storm',
            severity: 'moderate',
            title: 'Thunderstorm Watch',
            description: 'Severe thunderstorms possible this afternoon',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            location: selectedLocation.name
          }
        ]);
      }
    };

    fetchAlerts();
  }, [selectedLocation, user]);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
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

  const convertAlertsToExpectedFormat = (alerts: any[]) => {
    return alerts.map(alert => ({
      ...alert,
      timestamp: new Date(alert.timestamp),
      expiresAt: alert.expiresAt ? new Date(alert.expiresAt) : undefined
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Climate Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mafuriko-App Dashboard</h1>
            <p className="text-gray-600 mt-1">AI-powered early warning system for climate risks</p>
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
              <Button variant="outline" size="sm" onClick={() => setAuthModalOpen(true)}>
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

        {/* User Benefits Banner */}
        {!user && (
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Get Personalized Climate Alerts</p>
                  <p className="text-sm text-blue-700">Sign up to receive custom notifications and save your preferred locations</p>
                </div>
              </div>
              <Button size="sm" onClick={() => setAuthModalOpen(true)}>
                Get Started
              </Button>
            </div>
          </Card>
        )}

        {/* Risk Level Banner */}
        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <h2 className="text-xl font-semibold">Current Risk Level</h2>
                <p className="text-gray-600">Based on AI analysis of current conditions</p>
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
            <TabsTrigger value="alerts">
              Active Alerts
              {alerts.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {alerts.length}
                </Badge>
              )}
            </TabsTrigger>
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
                <AlertsPanel alerts={convertAlertsToExpectedFormat(alerts.slice(0, 3))} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel alerts={convertAlertsToExpectedFormat(alerts)} showAll={true} />
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

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}