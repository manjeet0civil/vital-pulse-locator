
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Phone, Clock, MapPin, Users, Zap, Hospital } from "lucide-react";
import HospitalSearch from "./HospitalSearch";

const EmergencyRequest = () => {
  const { toast } = useToast();
  const [emergencyData, setEmergencyData] = useState({
    patientName: '',
    bloodType: '',
    unitsNeeded: '',
    hospitalName: '',
    hospitalAddress: '',
    contactPerson: '',
    contactPhone: '',
    urgencyLevel: 'critical',
    medicalCondition: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'critical', label: 'Critical (Life-threatening)', color: 'bg-red-600' },
    { value: 'urgent', label: 'Urgent (Within 6 hours)', color: 'bg-orange-500' },
    { value: 'moderate', label: 'Moderate (Within 24 hours)', color: 'bg-yellow-500' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setEmergencyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHospitalSelect = (hospital: any) => {
    console.log('Selected hospital:', hospital);
    setEmergencyData(prev => ({
      ...prev,
      hospitalName: hospital.name,
      hospitalAddress: hospital.address
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Emergency request data:', emergencyData);

    // Simulate emergency alert broadcasting
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "🚨 Emergency Alert Broadcasted!",
        description: "Your request has been sent to 247 nearby donors and 12 hospitals.",
      });

      // Reset form
      setEmergencyData({
        patientName: '',
        bloodType: '',
        unitsNeeded: '',
        hospitalName: '',
        hospitalAddress: '',
        contactPerson: '',
        contactPhone: '',
        urgencyLevel: 'critical',
        medicalCondition: '',
        additionalNotes: ''
      });
    }, 2000);
  };

  const selectedUrgency = urgencyLevels.find(level => level.value === emergencyData.urgencyLevel);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-t-4 border-red-500 animate-pulse-border">
      <CardHeader className="text-center pb-8 bg-red-50">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-500 p-4 rounded-full animate-pulse">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-red-600">Emergency Blood Request</CardTitle>
        <CardDescription className="text-lg text-gray-700">
          Create an urgent request that will be broadcasted to all nearby donors and hospitals
        </CardDescription>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <Badge className="bg-red-100 text-red-800 px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            Instant Notifications
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            5km Radius Alert
          </Badge>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">
            <Hospital className="h-4 w-4 mr-2" />
            Hospital Network
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Patient Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={emergencyData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  placeholder="Full name of the patient"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="bloodType">Blood Type Required *</Label>
                <Select 
                  value={emergencyData.bloodType} 
                  onValueChange={(value) => handleInputChange('bloodType', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select blood type needed" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="font-semibold text-red-600 text-lg">{type}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unitsNeeded">Units Needed *</Label>
                <Select 
                  value={emergencyData.unitsNeeded} 
                  onValueChange={(value) => handleInputChange('unitsNeeded', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Number of units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Unit</SelectItem>
                    <SelectItem value="2">2 Units</SelectItem>
                    <SelectItem value="3">3 Units</SelectItem>
                    <SelectItem value="4">4 Units</SelectItem>
                    <SelectItem value="5+">5+ Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                <Select 
                  value={emergencyData.urgencyLevel} 
                  onValueChange={(value) => handleInputChange('urgencyLevel', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                          <span>{level.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="medicalCondition">Medical Condition/Reason *</Label>
              <Input
                id="medicalCondition"
                value={emergencyData.medicalCondition}
                onChange={(e) => handleInputChange('medicalCondition', e.target.value)}
                placeholder="e.g., Accident, Surgery, Thalassemia, Cancer treatment"
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Hospital Information with Auto-suggest */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Hospital className="h-5 w-5 mr-2 text-blue-600" />
              Hospital Information
            </h3>
            <div className="space-y-4">
              <HospitalSearch
                label="Hospital Name"
                placeholder="Search for Delhi government hospitals..."
                onHospitalSelect={handleHospitalSelect}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-purple-600" />
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={emergencyData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="Name of person to contact"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={emergencyData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={emergencyData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any additional information that might help donors..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          {/* Alert Preview */}
          {selectedUrgency && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Alert Preview:</h4>
              <div className={`p-4 rounded-lg text-white ${selectedUrgency.color}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold">EMERGENCY BLOOD REQUEST</span>
                </div>
                <p className="text-sm">
                  <strong>Blood Type:</strong> {emergencyData.bloodType || '[Blood Type]'} • 
                  <strong> Units:</strong> {emergencyData.unitsNeeded || '[Units]'} • 
                  <strong> Hospital:</strong> {emergencyData.hospitalName || '[Hospital]'}
                </p>
                <p className="text-sm mt-1">
                  <strong>Contact:</strong> {emergencyData.contactPerson || '[Contact Person]'} - {emergencyData.contactPhone || '[Phone]'}
                </p>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className={`w-full text-lg py-6 text-white ${selectedUrgency?.color || 'bg-red-600'} hover:opacity-90`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Broadcasting Emergency Alert...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Broadcast Emergency Request
              </>
            )}
          </Button>
        </form>

        {/* Emergency Features */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">What happens after you submit:</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <Clock className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Instant Alerts</p>
                <p>All donors within 10km get push notifications immediately</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Hospital Network</p>
                <p>Alert sent to nearby hospitals and blood banks</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">GPS Tracking</p>
                <p>Real-time directions provided to responding donors</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyRequest;
