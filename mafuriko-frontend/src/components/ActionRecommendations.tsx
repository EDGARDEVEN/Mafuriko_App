import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Clock, AlertCircle, Users, Home, Car, Briefcase } from 'lucide-react';

interface Action {
  id: string;
  priority: 'immediate' | 'today' | 'this-week';
  category: 'personal' | 'home' | 'travel' | 'work';
  title: string;
  description: string;
  completed?: boolean;
  timeEstimate?: string;
}

interface ActionRecommendationsProps {
  riskLevel: string;
  detailed?: boolean;
}

export function ActionRecommendations({ riskLevel, detailed = false }: ActionRecommendationsProps) {
  const getActionsForRiskLevel = (level: string): Action[] => {
    const baseActions: Action[] = [
      {
        id: '1',
        priority: 'immediate',
        category: 'personal',
        title: 'Stay Hydrated',
        description: 'Drink water regularly, avoid alcohol and caffeine',
        timeEstimate: 'Ongoing'
      },
      {
        id: '2',
        priority: 'immediate',
        category: 'personal',
        title: 'Limit Outdoor Activities',
        description: 'Avoid strenuous outdoor exercise between 12-4 PM',
        timeEstimate: '2-3 days'
      },
      {
        id: '3',
        priority: 'today',
        category: 'home',
        title: 'Prepare Cooling Systems',
        description: 'Check AC functionality, close curtains during peak heat',
        timeEstimate: '30 minutes'
      },
      {
        id: '4',
        priority: 'today',
        category: 'travel',
        title: 'Plan Indoor Routes',
        description: 'Use air-conditioned transportation, avoid long walks',
        timeEstimate: '15 minutes'
      },
      {
        id: '5',
        priority: 'this-week',
        category: 'home',
        title: 'Emergency Kit Check',
        description: 'Ensure you have flashlights, batteries, and first aid supplies',
        timeEstimate: '45 minutes'
      },
      {
        id: '6',
        priority: 'today',
        category: 'work',
        title: 'Adjust Work Schedule',
        description: 'Consider working during cooler morning hours if possible',
        timeEstimate: '5 minutes'
      }
    ];

    if (level === 'high' || level === 'extreme') {
      return baseActions.concat([
        {
          id: '7',
          priority: 'immediate',
          category: 'personal',
          title: 'Check on Vulnerable Neighbors',
          description: 'Elderly and children are at higher risk during extreme heat',
          timeEstimate: '15 minutes'
        },
        {
          id: '8',
          priority: 'immediate',
          category: 'home',
          title: 'Identify Cooling Centers',
          description: 'Know locations of air-conditioned public spaces nearby',
          timeEstimate: '10 minutes'
        }
      ]);
    }

    return baseActions;
  };

  const actions = getActionsForRiskLevel(riskLevel);
  const displayActions = detailed ? actions : actions.slice(0, 4);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return 'bg-red-500 text-white';
      case 'today': return 'bg-orange-500 text-white';
      case 'this-week': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return <Users className="w-4 h-4" />;
      case 'home': return <Home className="w-4 h-4" />;
      case 'travel': return <Car className="w-4 h-4" />;
      case 'work': return <Briefcase className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'immediate': return <AlertCircle className="w-4 h-4" />;
      case 'today': return <Clock className="w-4 h-4" />;
      case 'this-week': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const immediateActions = displayActions.filter(a => a.priority === 'immediate');
  const todayActions = displayActions.filter(a => a.priority === 'today');
  const weekActions = displayActions.filter(a => a.priority === 'this-week');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Recommended Actions</h3>
          <p className="text-gray-600">Personalized steps based on current risk level</p>
        </div>
        {!detailed && (
          <Button variant="outline" size="sm">
            View All
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {immediateActions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h4 className="font-medium text-red-700">Immediate Actions</h4>
            </div>
            <div className="space-y-3">
              {immediateActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex-shrink-0 mt-1">
                    {getCategoryIcon(action.category)}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{action.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    {action.timeEstimate && (
                      <p className="text-xs text-gray-500 mt-2">⏱️ {action.timeEstimate}</p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {todayActions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <h4 className="font-medium text-orange-700">Today</h4>
            </div>
            <div className="space-y-3">
              {todayActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getCategoryIcon(action.category)}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{action.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    {action.timeEstimate && (
                      <p className="text-xs text-gray-500 mt-2">⏱️ {action.timeEstimate}</p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {detailed && weekActions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-blue-700">This Week</h4>
            </div>
            <div className="space-y-3">
              {weekActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getCategoryIcon(action.category)}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{action.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    {action.timeEstimate && (
                      <p className="text-xs text-gray-500 mt-2">⏱️ {action.timeEstimate}</p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {detailed && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <h4 className="font-medium mb-2">💡 Smart Suggestions</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Set up weather alerts on your phone for real-time updates</li>
            <li>• Consider creating a family emergency communication plan</li>
            <li>• Download offline maps in case of power outages</li>
          </ul>
        </div>
      )}
    </Card>
  );
}