
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Navigation, Clock, User, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Donor {
  id: string;
  name: string;
  blood_group: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  location_lat?: number;
  location_lng?: number;
  availability_status: boolean;
  last_donation_date?: string;
  created_at: string;
}

const DonorSearch = () => {
  const [searchData, setSearchData] = useState({
    bloodGroup: '',
    city: '',
    state: ''
  });
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'];

  // Set up real-time subscription for donors
  useEffect(() => {
    const channel = supabase
      .channel('donors-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donors'
        },
        (payload) => {
          console.log('Donor data changed:', payload);
          // Refetch donors when data changes
          if (searching) {
            handleSearch();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [searching]);

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async () => {
    if (!searchData.bloodGroup) {
      toast({
        title: "Error",
        description: "Please select a blood group",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearching(true);

    try {
      let query = supabase
        .from('donors')
        .select('*')
        .eq('blood_group', searchData.bloodGroup)
        .eq('availability_status', true)
        .order('created_at', { ascending: false });

      if (searchData.city) {
        query = query.ilike('city', `%${searchData.city}%`);
      }

      if (searchData.state) {
        query = query.eq('state', searchData.state);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      setDonors(data || []);
      
      if (data && data.length === 0) {
        toast({
          title: "No donors found",
          description: "No available donors found matching your criteria. Try expanding your search.",
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${data?.length || 0} available donors`,
        });
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to search for donors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (donor: Donor) => {
    if (donor.location_lat && donor.location_lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${donor.location_lat},${donor.location_lng}`;
      window.open(url, '_blank');
    } else if (donor.address) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(donor.address + ', ' + donor.city + ', ' + donor.state)}`;
      window.open(url, '_blank');
    } else {
      toast({
        title: "Location not available",
        description: "Location information is not available for this donor",
        variant: "destructive",
      });
    }
  };

  const handleContactDonor = (donor: Donor) => {
    if (donor.phone) {
      window.open(`tel:${donor.phone}`, '_self');
    } else {
      toast({
        title: "Contact not available",
        description: "Phone number is not available for this donor",
        variant: "destructive",
      });
    }
  };

  const calculateDaysSinceLastDonation = (lastDonationDate: string) => {
    const diffTime = Date.now() - new Date(lastDonationDate).getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <p className="text-gray-600">Please sign in to search for donors.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-t-4 border-blue-500">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">Find Blood Donors</CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Search for available donors in your area
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Form */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Droplets className="h-5 w-5 mr-2 text-blue-600" />
            Search Criteria
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bloodGroup">Blood Group Required *</Label>
              <Select value={searchData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
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
              <Label htmlFor="city">City (Optional)</Label>
              <Input
                id="city"
                value={searchData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State (Optional)</Label>
              <Select value={searchData.state} onValueChange={(value) => handleInputChange('state', value)}>
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
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Donors'}
          </Button>
        </div>

        {/* Search Results */}
        {donors.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Available Donors ({donors.length} found)
            </h3>
            <div className="grid gap-4">
              {donors.map((donor) => (
                <Card key={donor.id} className="border-l-4 border-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{donor.name}</h4>
                          <Badge className="bg-red-100 text-red-800">
                            <Droplets className="h-3 w-3 mr-1" />
                            {donor.blood_group}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{donor.address}, {donor.city}, {donor.state}</span>
                          </div>
                          {donor.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{donor.phone}</span>
                            </div>
                          )}
                          {donor.last_donation_date && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Last donated {calculateDaysSinceLastDonation(donor.last_donation_date)} days ago</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          onClick={() => handleGetDirections(donor)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Navigation className="h-4 w-4" />
                          Directions
                        </Button>
                        <Button
                          onClick={() => handleContactDonor(donor)}
                          size="sm"
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                        >
                          <Phone className="h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searching && donors.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">No donors found matching your criteria.</p>
            <p className="text-sm text-gray-500 mt-2">Try expanding your search by removing location filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DonorSearch;
