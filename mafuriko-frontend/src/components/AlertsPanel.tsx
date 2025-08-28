import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, Bell, Clock, MapPin, X, ExternalLink } from 'lucide-react';

interface Alert {
  id: number;
  type: string;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  title: string;
  description: string;
  timestamp: Date | string;
  location: string;
  expiresAt?: Date | string;
  actionUrl?: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  showAll?: boolean;
}

export function AlertsPanel({ alerts, showAll = false }: AlertsPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'heat': return '🌡️';
      case 'storm': return '⛈️';
      case 'flood': return '🌊';
      case 'wind': return '💨';
      case 'snow': return '❄️';
      case 'fire': return '🔥';
      default: return '⚠️';
    }
  };

  const formatTime = (dateInput: Date | string) => {
    try {
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      
      // Check if date is valid
      if (!date || isNaN(date.getTime())) {
        return 'Unknown time';
      }
      
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days}d ago`;
      if (hours > 0) return `${hours}h ago`;
      if (minutes > 0) return `${minutes}m ago`;
      return 'Just now';
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Unknown time';
    }
  };

  const formatExpiryDate = (dateInput?: Date | string) => {
    if (!dateInput) return null;
    
    try {
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      
      // Check if date is valid
      if (!date || isNaN(date.getTime())) {
        return null;
      }
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting expiry date:', error);
      return null;
    }
  };

  const displayAlerts = showAll ? alerts : alerts.slice(0, 3);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            <p className="text-gray-600">{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {!showAll && alerts.length > 3 && (
          <Button variant="outline" size="sm">
            View All ({alerts.length})
          </Button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No active alerts</p>
          <p className="text-sm text-gray-500 mt-1">You'll be notified when new alerts are issued</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayAlerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge className={`${getSeverityColor(alert.severity)} text-white text-xs`}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                      {alert.expiresAt && formatExpiryDate(alert.expiresAt) && (
                        <div className="flex items-center gap-1">
                          <span>Expires: {formatExpiryDate(alert.expiresAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {alert.actionUrl && (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {alert.severity === 'high' || alert.severity === 'extreme' ? (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Immediate Action Required</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    This is a high-priority alert. Please take recommended precautions immediately.
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {showAll && alerts.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Manage Alert Settings
            </Button>
            <Button variant="outline" size="sm">
              Clear All Read
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}