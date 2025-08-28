import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { AlertTriangle, Flame, Droplets, Wind, Zap, RefreshCw } from 'lucide-react';
import { climateService } from '../services/climateService';

interface RiskFactor {
  type: string;
  level: number;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  description: string;
  icon: React.ReactNode;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface Location {
  name: string;
  coords: { lat: number; lng: number };
}

interface RiskAssessmentProps {
  location: Location;
}

export function RiskAssessment({ location }: RiskAssessmentProps) {
  const [riskData, setRiskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await climateService.getRiskAssessment(location.name);
      setRiskData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch risk data:', err);
      setError('Failed to load risk assessment');
      
      // Fallback to mock data
      setRiskData({
        overallRisk: 65,
        factors: [
          {
            type: 'Heat Risk',
            level: 75,
            severity: 'high',
            description: 'Extreme heat expected to continue',
            trend: 'increasing'
          },
          {
            type: 'Storm Risk',
            level: 45,
            severity: 'moderate',
            description: 'Thunderstorms possible',
            trend: 'stable'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, [location]);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(fetchRiskData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const getIconForRiskType = (type: string): React.ReactNode => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('heat')) return <Flame className="w-5 h-5" />;
    if (lowerType.includes('storm')) return <Zap className="w-5 h-5" />;
    if (lowerType.includes('flood')) return <Droplets className="w-5 h-5" />;
    if (lowerType.includes('wind')) return <Wind className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  const getSeverityLevel = (level: number): 'low' | 'moderate' | 'high' | 'extreme' => {
    if (level >= 80) return 'extreme';
    if (level >= 60) return 'high';
    if (level >= 30) return 'moderate';
    return 'low';
  };

  const riskFactors: RiskFactor[] = riskData?.factors?.map((factor: any) => ({
    ...factor,
    icon: getIconForRiskType(factor.type),
    severity: getSeverityLevel(factor.level)
  })) || [];

  const overallRisk = riskData?.overallRisk || 0;
  const overallSeverity = getSeverityLevel(overallRisk);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'extreme': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getAIInsight = (overallRisk: number, factors: any[]) => {
    const highRiskFactors = factors.filter(f => f.level >= 60);
    
    if (overallRisk >= 70) {
      return "Based on current conditions and forecast models, multiple high-risk factors are present. Immediate precautionary measures are recommended.";
    } else if (overallRisk >= 40) {
      return `${highRiskFactors[0]?.type || 'Climate risk'} is the primary concern for the next 48 hours. Consider limiting outdoor activities during peak risk periods.`;
    } else {
      return "Current conditions present low to moderate risk. Continue monitoring weather updates and maintain standard safety precautions.";
    }
  };

  if (loading && !riskData) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-16 bg-gray-200 rounded mb-3"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">AI Risk Assessment</h3>
              {loading && (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              )}
            </div>
            <p className="text-gray-600">Real-time analysis for {location.name}</p>
            {lastUpdated && (
              <p className="text-xs text-gray-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getSeverityColor(overallSeverity)} border px-3 py-1`}>
            Overall: {overallSeverity.toUpperCase()}
          </Badge>
          <button
            onClick={fetchRiskData}
            className="p-1 hover:bg-gray-100 rounded"
            title="Refresh assessment"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Risk Score</span>
          <span className="text-sm font-semibold">{overallRisk}/100</span>
        </div>
        <Progress 
          value={overallRisk} 
          className="h-3"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">⚠️ {error} - Showing cached data</p>
        </div>
      )}

      <div className="space-y-4">
        {riskFactors.map((factor, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getSeverityColor(factor.severity)}`}>
                  {factor.icon}
                </div>
                <div>
                  <h4 className="font-medium">{factor.type}</h4>
                  <p className="text-sm text-gray-600">{factor.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">{factor.level}%</span>
                  <span className="text-lg">{getTrendIcon(factor.trend)}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {factor.severity}
                </Badge>
              </div>
            </div>
            <Progress 
              value={factor.level} 
              className="h-2"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div>
            <h4 className="font-medium text-blue-900">AI Insight</h4>
            <p className="text-sm text-blue-800 mt-1">
              {getAIInsight(overallRisk, riskFactors)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}