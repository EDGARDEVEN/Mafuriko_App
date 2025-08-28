import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { MapPin, Search, Star, Clock } from 'lucide-react';

interface Location {
  name: string;
  coords: { lat: number; lng: number };
}

interface LocationSelectorProps {
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
}

export function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Mock location data - would be replaced with real geocoding API
  const recentLocations: Location[] = [
    { name: 'Garissa, GA', coords: { lat: 0.4569, lng: 39.6583 } },
    { name: 'Wajir, WJ', coords: { lat: 1.7500, lng: 40.0500 } },
    { name: 'Mandera, MD', coords: { lat: 3.9373, lng: 41.8569 } },
  ];

  const favoriteLocations: Location[] = [
    { name: 'El Wak, EL', coords: { lat: 2.8000, lng: 40.9200 } },
    { name: 'Lafey, Lf', coords: { lat: 3.15000, lng: 41.2000 } },
    { name: 'Takaba, TA', coords: { lat: 3.4700, lng: 40.2167 } },
  ];

  const searchResults: Location[] = [
    { name: 'Habaswein, HB', coords: { lat: 1.5167, lng: 39.5167 } },
    { name: 'Ijaara, IJ', coords: { lat: -1.2000, lng: 40.0000 } },
    { name: 'Dadaab, DB', coords: { lat: 0.0500, lng: 40.3000 } },
  ].filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: Location) => {
    onLocationChange(location);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd reverse geocode these coordinates
          const currentLocation: Location = {
            name: 'Current Location',
            coords: { lat: latitude, lng: longitude }
          };
          handleLocationSelect(currentLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-64 justify-start">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="truncate">{selectedLocation.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {/* Current Location Option */}
          <div className="p-2 border-b">
            <Button
              variant="ghost"
              onClick={getCurrentLocation}
              className="w-full justify-start"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Use Current Location
            </Button>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="p-2 border-b">
              <div className="px-2 py-1 text-sm text-gray-600 font-medium">Search Results</div>
              {searchResults.length > 0 ? (
                searchResults.map((location, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleLocationSelect(location)}
                    className="w-full justify-start"
                  >
                    <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                    {location.name}
                  </Button>
                ))
              ) : (
                <div className="px-2 py-4 text-sm text-gray-500 text-center">
                  No locations found
                </div>
              )}
            </div>
          )}

          {/* Favorite Locations */}
          {!searchQuery && favoriteLocations.length > 0 && (
            <div className="p-2 border-b">
              <div className="px-2 py-1 text-sm text-gray-600 font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                Favorites
              </div>
              {favoriteLocations.map((location, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full justify-start"
                >
                  <Star className="w-4 h-4 mr-3 text-yellow-500" />
                  {location.name}
                </Button>
              ))}
            </div>
          )}

          {/* Recent Locations */}
          {!searchQuery && recentLocations.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-sm text-gray-600 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Recent
              </div>
              {recentLocations.map((location, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full justify-start"
                >
                  <Clock className="w-4 h-4 mr-3 text-gray-400" />
                  {location.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}