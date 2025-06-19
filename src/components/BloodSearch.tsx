
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, MapPin, Phone, Heart, Clock, Star, Shield, Navigation } from "lucide-react";

const BloodSearch = () => {
  const { toast } = useToast();
  const [searchData, setSearchData] = useState({
    bloodType: '',
    city: '',
    state: '',
    urgency: 'normal'
  });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'];

  // Mock donor data - in real app this would come from database
  const mockDonors = [
    {
      id: 1,
      name: "Rahul Sharma",
      bloodType: "O+",
      city: "Mumbai",
      distance: "2.3 km",
      phone: "+91 98765-43210",
      lastDonation: "3 months ago",
      donationCount: 12,
      rating: 4.9,
      verified: true,
      available: true,
      responseTime: "Usually responds in 10 mins"
    },
    {
      id: 2,
      name: "Priya Patel",
      bloodType: "O+",
      city: "Mumbai",
      distance: "4.1 km",
      phone: "+91 87654-32109",
      lastDonation: "2 months ago",
      donationCount: 8,
      rating: 4.8,
      verified: true,
      available: true,
      responseTime: "Usually responds in 15 mins"
    },
    {
      id: 3,
      name: "Amit Kumar",
      bloodType: "O+",
      city: "Mumbai",
      distance: "6.7 km",
      phone: "+91 76543-21098",
      lastDonation: "4 months ago",
      donationCount: 15,
      rating: 4.7,
      verified: true,
      available: false,
      responseTime: "Usually responds in 30 mins"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    console.log('Search parameters:', searchData);

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockDonors);
      setIsSearching(false);
      toast({
        title: "Search Completed!",
        description: `Found ${mockDonors.length} donors in your area.`,
      });
    }, 1500);
  };

  const handleContactDonor = (donor: any) => {
    toast({
      title: "Contact Request Sent!",
      description: `Your request has been sent to ${donor.name}. They will contact you shortly.`,
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <Card className="shadow-xl border-t-4 border-blue-500">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
            <Search className="h-6 w-6 mr-2 text-blue-600" />
            Find Blood Donors
          </CardTitle>
          <CardDescription className="text-lg">
            Search for verified blood donors in your area
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="searchBloodType">Blood Type Needed *</Label>
                <Select 
                  value={searchData.bloodType} 
                  onValueChange={(value) => handleInputChange('bloodType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="font-semibold text-red-600">{type}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="searchCity">City *</Label>
                <Input
                  id="searchCity"
                  value={searchData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="searchState">State</Label>
                <Select 
                  value={searchData.state} 
                  onValueChange={(value) => handleInputChange('state', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select 
                  value={searchData.urgency} 
                  onValueChange={(value) => handleInputChange('urgency', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              className={`w-full text-lg py-6 ${getUrgencyColor(searchData.urgency)}`}
              disabled={isSearching || !searchData.bloodType || !searchData.city}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching for Donors...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search Donors
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">
              Available Donors ({searchResults.length})
            </h3>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <MapPin className="h-4 w-4 mr-1" />
              Sorted by Distance
            </Badge>
          </div>

          <div className="grid gap-6">
            {searchResults.map((donor) => (
              <Card 
                key={donor.id} 
                className={`hover:shadow-lg transition-all duration-300 border-l-4 ${
                  donor.available ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Donor Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <Heart className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 flex items-center">
                            {donor.name}
                            {donor.verified && (
                              <Shield className="h-5 w-5 ml-2 text-green-600" />
                            )}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-semibold text-red-600 text-lg">{donor.bloodType}</span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {donor.distance} away
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              {donor.rating}/5.0
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Total Donations</p>
                          <p className="font-semibold text-gray-900">{donor.donationCount} times</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Donation</p>
                          <p className="font-semibold text-gray-900">{donor.lastDonation}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Response Time</p>
                          <p className="font-semibold text-gray-900">{donor.responseTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <Badge 
                            className={donor.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {donor.available ? 'Available' : 'Recently Donated'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3 lg:ml-6">
                      <Button
                        onClick={() => handleContactDonor(donor)}
                        disabled={!donor.available}
                        className={`${
                          donor.available 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Donor
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </div>

                  {!donor.available && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        This donor recently donated and will be available again in 2 months
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Help */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Can't find compatible donors?
              </h4>
              <p className="text-gray-600 mb-4">
                Our AI can suggest alternative compatible blood types or help you create an emergency request
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  Check Blood Compatibility
                </Button>
                <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                  Create Emergency Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BloodSearch;
