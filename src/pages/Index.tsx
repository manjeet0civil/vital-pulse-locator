
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Users, Clock, Shield, Phone, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DonorProfile from "@/components/DonorProfile";
import DonorSearch from "@/components/DonorSearch";
import EmergencyRequest from "@/components/EmergencyRequest";
import BloodCompatibilityChecker from "@/components/BloodCompatibilityChecker";

const Index = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [stats, setStats] = useState({
    activeDonors: 0,
    totalRequests: 0,
    emergencyRequests: 0
  });
  const [emergencyRequests, setEmergencyRequests] = useState<any[]>([]);
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Fetch real-time statistics
  useEffect(() => {
    fetchStats();
    fetchEmergencyRequests();

    // Set up real-time subscriptions
    const donorsChannel = supabase
      .channel('donors-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donors' }, () => {
        fetchStats();
      })
      .subscribe();

    const requestsChannel = supabase
      .channel('requests-stats')  
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests' }, () => {
        fetchStats();
        fetchEmergencyRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(donorsChannel);
      supabase.removeChannel(requestsChannel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Count active donors
      const { count: donorCount } = await supabase
        .from('donors')
        .select('*', { count: 'exact', head: true })
        .eq('availability_status', true);

      // Count total requests
      const { count: requestCount } = await supabase
        .from('blood_requests')
        .select('*', { count: 'exact', head: true });

      // Count emergency requests
      const { count: emergencyCount } = await supabase
        .from('blood_requests')
        .select('*', { count: 'exact', head: true })
        .eq('urgency_level', 'emergency')
        .eq('status', 'active');

      setStats({
        activeDonors: donorCount || 0,
        totalRequests: requestCount || 0,
        emergencyRequests: emergencyCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEmergencyRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select(`
          *,
          profiles!inner(name)
        `)
        .eq('urgency_level', 'emergency')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setEmergencyRequests(data || []);
    } catch (error) {
      console.error('Error fetching emergency requests:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading LifeFlow...</p>
        </div>
      </div>
    );
  }

  const displayStats = [
    { label: "Active Donors", value: stats.activeDonors.toString(), icon: Users, color: "text-blue-600" },
    { label: "Total Lives Helped", value: stats.totalRequests.toString(), icon: Heart, color: "text-red-600" },
    { label: "Cities Covered", value: "156", icon: MapPin, color: "text-green-600" },
    { label: "Emergency Requests", value: stats.emergencyRequests.toString(), icon: Clock, color: "text-orange-600" },
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
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user.email}</span>
                  <Button onClick={handleSignOut} variant="outline" className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/auth')} className="bg-red-500 hover:bg-red-600 text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
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
            Connect with verified blood donors in your area instantly. Our real-time platform helps match compatible donors with recipients, ensuring no life is lost due to blood shortage.
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {displayStats.map((stat, index) => (
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
              className={activeTab === 'search' ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}
            >
              Find Donors
            </Button>
            <Button
              onClick={() => setActiveTab('profile')}
              variant={activeTab === 'profile' ? 'default' : 'outline'}
              className={activeTab === 'profile' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
            >
              {user ? 'My Profile' : 'Donor Profile'}
            </Button>
            <Button
              onClick={() => setActiveTab('emergency')}
              variant={activeTab === 'emergency' ? 'default' : 'outline'}
              className={activeTab === 'emergency' ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : ''}
            >
              Emergency Request
            </Button>
            <Button
              onClick={() => setActiveTab('compatibility')}
              variant={activeTab === 'compatibility' ? 'default' : 'outline'}
              className={activeTab === 'compatibility' ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}
            >
              Blood Compatibility
            </Button>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'search' && <DonorSearch />}
            {activeTab === 'profile' && <DonorProfile />}
            {activeTab === 'emergency' && <EmergencyRequest />}
            {activeTab === 'compatibility' && <BloodCompatibilityChecker />}
          </div>
        </div>
      </section>

      {/* Emergency Requests Board */}
      {emergencyRequests.length > 0 && (
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
                      <Badge variant="destructive" className="bg-red-600">
                        Emergency
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg">Blood Type: {request.blood_group}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">
                      Requested by: {request.profiles?.name || 'Anonymous'}
                    </p>
                    <p className="text-gray-600 mb-4">{request.location}</p>
                    <Button 
                      onClick={() => setActiveTab('search')}
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      Help Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
