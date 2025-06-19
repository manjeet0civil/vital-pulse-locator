
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Users, Clock, Shield, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DonorRegistration from "@/components/DonorRegistration";
import BloodSearch from "@/components/BloodSearch";
import EmergencyRequest from "@/components/EmergencyRequest";
import BloodCompatibilityChecker from "@/components/BloodCompatibilityChecker";

const Index = () => {
  const [activeTab, setActiveTab] = useState('search');
  const { toast } = useToast();

  const stats = [
    { label: "Active Donors", value: "2,847", icon: Users, color: "text-blue-600" },
    { label: "Lives Saved", value: "1,293", icon: Heart, color: "text-red-600" },
    { label: "Cities Covered", value: "156", icon: MapPin, color: "text-green-600" },
    { label: "Emergency Requests", value: "24", icon: Clock, color: "text-orange-600" },
  ];

  const emergencyRequests = [
    { id: 1, bloodType: "O-", location: "Mumbai Central Hospital", urgency: "Critical", time: "2 mins ago" },
    { id: 2, bloodType: "AB+", location: "Delhi AIIMS", urgency: "Urgent", time: "15 mins ago" },
    { id: 3, bloodType: "B-", location: "Bangalore Apollo", urgency: "Moderate", time: "1 hour ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-3 rounded-full">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">LifeFlow</h1>
                <p className="text-sm text-gray-600">Connecting Blood Donors & Recipients</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="hidden md:flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Emergency: 108</span>
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Hospital Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Save Lives Through <span className="text-red-500">Blood Donation</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with verified blood donors in your area instantly. Our AI-powered platform helps match compatible donors with recipients in real-time, ensuring no life is lost due to blood shortage.
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Navigation */}
      <section className="py-8 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              onClick={() => setActiveTab('search')}
              variant={activeTab === 'search' ? 'default' : 'outline'}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Find Donors
            </Button>
            <Button
              onClick={() => setActiveTab('register')}
              variant={activeTab === 'register' ? 'default' : 'outline'}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Register as Donor
            </Button>
            <Button
              onClick={() => setActiveTab('emergency')}
              variant={activeTab === 'emergency' ? 'default' : 'outline'}
              className="bg-red-500 hover:bg-red-600 text-white animate-pulse"
            >
              Emergency Request
            </Button>
            <Button
              onClick={() => setActiveTab('compatibility')}
              variant={activeTab === 'compatibility' ? 'default' : 'outline'}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Blood Compatibility
            </Button>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'search' && <BloodSearch />}
            {activeTab === 'register' && <DonorRegistration />}
            {activeTab === 'emergency' && <EmergencyRequest />}
            {activeTab === 'compatibility' && <BloodCompatibilityChecker />}
          </div>
        </div>
      </section>

      {/* Emergency Requests Board */}
      <section className="py-12 px-4 bg-red-50">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            🚨 Live Emergency Requests
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="destructive" 
                      className={`${
                        request.urgency === 'Critical' ? 'bg-red-600' : 
                        request.urgency === 'Urgent' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}
                    >
                      {request.urgency}
                    </Badge>
                    <span className="text-sm text-gray-500">{request.time}</span>
                  </div>
                  <CardTitle className="text-lg">Blood Type: {request.bloodType}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{request.location}</p>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                    Respond to Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose LifeFlow?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Location-Based Matching</h4>
              <p className="text-gray-600">Find nearby donors within 5-10km radius for faster blood collection</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Verified Donors</h4>
              <p className="text-gray-600">All donors are verified with proper documentation and health certificates</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Real-Time Alerts</h4>
              <p className="text-gray-600">Instant notifications for emergency blood requests in your area</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Heart className="h-8 w-8 text-red-500" />
            <h4 className="text-2xl font-bold">LifeFlow</h4>
          </div>
          <p className="text-gray-400 mb-6">
            Together, we can save lives. Every drop counts.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-400 transition-colors">Contact Us</a>
            <a href="#" className="hover:text-red-400 transition-colors">Emergency: 108</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
