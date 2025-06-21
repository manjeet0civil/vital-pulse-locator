
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Phone, Droplets, Calendar, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DonorProfile {
  id?: string;
  user_id: string;
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
}

const DonorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profile, setProfile] = useState<DonorProfile>({
    user_id: user?.id || '',
    name: '',
    blood_group: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    availability_status: true
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'];

  useEffect(() => {
    if (user) {
      fetchDonorProfile();
    }
  }, [user]);

  const fetchDonorProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setProfileExists(true);
      } else {
        // Initialize with user metadata if available
        const userMetadata = user.user_metadata;
        if (userMetadata) {
          setProfile(prev => ({
            ...prev,
            name: userMetadata.name || '',
            blood_group: userMetadata.blood_group || '',
            phone: userMetadata.phone || '',
            address: userMetadata.address || '',
            city: userMetadata.city || '',
            state: userMetadata.state || ''
          }));
        }
        setProfileExists(false);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load donor profile",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfile(prev => ({
            ...prev,
            location_lat: position.coords.latitude,
            location_lng: position.coords.longitude
          }));
          toast({
            title: "Location updated",
            description: "Your location has been captured successfully",
          });
        },
        (error) => {
          console.error('Location error:', error);
          toast({
            title: "Location error",
            description: "Could not get your location. Please enable location services.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!profile.name || !profile.blood_group || !profile.phone) {
      toast({
        title: "Error",
        description: "Name, blood group, and phone number are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        user_id: user.id,
        name: profile.name,
        blood_group: profile.blood_group,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        location_lat: profile.location_lat,
        location_lng: profile.location_lng,
        availability_status: profile.availability_status
      };

      if (profileExists) {
        const { error } = await supabase
          .from('donors')
          .update(profileData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('donors')
          .insert([profileData]);

        if (error) throw error;
        setProfileExists(true);
      }

      toast({
        title: "Profile saved!",
        description: "Your donor profile has been updated successfully",
      });

    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const recordDonation = async () => {
    if (!user || !profileExists) return;

    try {
      const { error } = await supabase
        .from('donors')
        .update({
          last_donation_date: new Date().toISOString(),
          availability_status: false
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        last_donation_date: new Date().toISOString(),
        availability_status: false
      }));

      toast({
        title: "Donation recorded!",
        description: "Thank you for donating! You'll be available again after 30 days.",
      });

    } catch (error: any) {
      console.error('Record donation error:', error);
      toast({
        title: "Error",
        description: "Failed to record donation",
        variant: "destructive",
      });
    }
  };

  const getDaysUntilAvailable = () => {
    if (!profile.last_donation_date) return 0;
    
    const lastDonation = new Date(profile.last_donation_date);
    const daysSince = Math.floor((Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSince);
  };

  if (!user) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <p className="text-gray-600">Please sign in to manage your donor profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-t-4 border-green-500">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <User className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">Donor Profile</CardTitle>
        <CardDescription className="text-lg text-gray-600">
          Manage your donor information and availability
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Availability Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {profile.availability_status ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  {profile.availability_status ? 'Available for Donation' : 'Not Available'}
                </span>
              </div>
              {!profile.availability_status && getDaysUntilAvailable() > 0 && (
                <Badge variant="outline">
                  Available in {getDaysUntilAvailable()} days
                </Badge>
              )}
            </div>
            <Switch
              checked={profile.availability_status}
              onCheckedChange={(checked) => handleInputChange('availability_status', checked)}
              disabled={getDaysUntilAvailable() > 0}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Select value={profile.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your blood type" />
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
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 9876543210"
                className="mt-1"
              />
            </div>
            {profile.last_donation_date && (
              <div>
                <Label>Last Donation</Label>
                <div className="flex items-center gap-2 mt-1 p-2 bg-white rounded border">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {new Date(profile.last_donation_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            Location Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your address"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter your city"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={profile.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your state" />
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
            variant="outline" 
            onClick={getCurrentLocation}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Get Current Location
          </Button>
          
          {profile.location_lat && profile.location_lng && (
            <div className="mt-2 text-sm text-green-600">
              Location captured: {profile.location_lat.toFixed(6)}, {profile.location_lng.toFixed(6)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
          
          {profileExists && profile.availability_status && (
            <Button 
              onClick={recordDonation}
              variant="outline"
              className="flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50"
            >
              <Droplets className="h-4 w-4" />
              Record Donation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DonorProfile;
