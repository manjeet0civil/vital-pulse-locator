
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, MapPin, User, Phone, Calendar, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const DonorRegistration = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodType: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    pincode: '',
    address: '',
    lastDonation: '',
    medicalConditions: '',
    emergencyContact: '',
    agreeTerms: false,
    availableForEmergency: false
  });
  const [loading, setLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location captured",
            description: "Your location has been captured for better donor matching",
          });
          // Store location in a way that can be used later
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          } as any));
        },
        (error) => {
          console.error('Location error:', error);
          toast({
            title: "Location error",
            description: "Could not get your location. You can still register without it.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.bloodType || !formData.phone || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First, register the user if not already logged in
      if (!user) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: `temp_${Date.now()}`, // Temporary password, user will reset
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: formData.name,
              phone: formData.phone,
              blood_group: formData.bloodType,
              address: formData.address,
              city: formData.city,
              state: formData.state,
            }
          }
        });

        if (authError) throw authError;

        toast({
          title: "Registration Successful! 🎉",
          description: "Please check your email to verify your account and set your password.",
        });
      } else {
        // If user is already logged in, just update/create their donor profile
        const donorData = {
          user_id: user.id,
          name: formData.name,
          blood_group: formData.bloodType,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          location_lat: (formData as any).latitude,
          location_lng: (formData as any).longitude,
          availability_status: true,
          last_donation_date: formData.lastDonation || null,
          emergency_contact: formData.emergencyContact || null,
          medical_conditions: formData.medicalConditions || null,
          available_for_emergency: formData.availableForEmergency
        };

        const { error: donorError } = await supabase
          .from('donors')
          .upsert([donorData], { onConflict: 'user_id' });

        if (donorError) throw donorError;

        toast({
          title: "Profile Updated! 🎉",
          description: "Your donor profile has been successfully updated.",
        });
      }

      // Reset form
      setFormData({
        name: '',
        age: '',
        bloodType: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        pincode: '',
        address: '',
        lastDonation: '',
        medicalConditions: '',
        emergencyContact: '',
        agreeTerms: false,
        availableForEmergency: false
      });

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-t-4 border-green-500">
      <CardHeader className="text-center pb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-gray-900">
          {user ? 'Update Donor Profile' : 'Become a Life Saver'}
        </CardTitle>
        <CardDescription className="text-lg text-gray-600">
          {user ? 'Update your donor information' : 'Join thousands of verified donors and help save lives in your community'}
        </CardDescription>
        <div className="flex justify-center mt-4">
          <Badge className="bg-green-100 text-green-800 text-sm px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Real-time Database Integration
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="18-65 years"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bloodType">Blood Type *</Label>
                <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
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
                <Label htmlFor="lastDonation">Last Donation Date</Label>
                <Input
                  id="lastDonation"
                  type="date"
                  value={formData.lastDonation}
                  onChange={(e) => handleInputChange('lastDonation', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-purple-600" />
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Mobile Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="mt-1"
                  disabled={!!user}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Location Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter your city"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
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
              type="button"
              variant="outline" 
              onClick={getCurrentLocation}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Capture Current Location (Recommended)
            </Button>
          </div>

          {/* Medical Information */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-red-600" />
              Medical Information
            </h3>
            <div>
              <Label htmlFor="medicalConditions">Medical Conditions (if any)</Label>
              <Input
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                placeholder="List any medical conditions, medications, or allergies"
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Note: This information helps ensure safe donation practices
              </p>
            </div>
          </div>

          {/* Preferences & Agreement */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availableForEmergency"
                checked={formData.availableForEmergency}
                onCheckedChange={(checked) => handleInputChange('availableForEmergency', checked as boolean)}
              />
              <Label htmlFor="availableForEmergency" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I'm available for emergency blood donation requests (Real-time notifications)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                required
              />
              <Label htmlFor="agreeTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the <span className="text-blue-600 underline cursor-pointer">Terms and Conditions</span> and <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span> *
              </Label>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6 mt-8"
            disabled={!formData.agreeTerms || loading}
          >
            <Heart className="h-5 w-5 mr-2" />
            {loading ? 'Processing...' : (user ? 'Update Donor Profile' : 'Register as Blood Donor')}
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Benefits of Registering:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time matching with recipients</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live donation tracking and history</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Automatic availability management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Emergency notification system</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonorRegistration;
