
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, ArrowRight, CheckCircle, XCircle, Info, Heart } from "lucide-react";

const BloodCompatibilityChecker = () => {
  const { toast } = useToast();
  const [recipientBloodType, setRecipientBloodType] = useState('');
  const [compatibilityResults, setCompatibilityResults] = useState<any>(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Blood compatibility matrix
  const compatibilityMatrix: { [key: string]: string[] } = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
    'AB-': ['A-', 'B-', 'AB-', 'O-'],
    'O+': ['O+', 'O-'],
    'O-': ['O-'] // Universal donor blood type
  };

  const donorCompatibility: { [key: string]: string[] } = {
    'A+': ['A+', 'AB+'],
    'A-': ['A+', 'A-', 'AB+', 'AB-'],
    'B+': ['B+', 'AB+'],
    'B-': ['B+', 'B-', 'AB+', 'AB-'],
    'AB+': ['AB+'],
    'AB-': ['AB+', 'AB-'],
    'O+': ['A+', 'B+', 'AB+', 'O+'],
    'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Universal donor
  };

  const getBloodTypeInfo = (bloodType: string) => {
    const info: { [key: string]: any } = {
      'A+': { frequency: '34%', category: 'Common', special: false },
      'A-': { frequency: '6%', category: 'Less Common', special: false },
      'B+': { frequency: '9%', category: 'Less Common', special: false },
      'B-': { frequency: '2%', category: 'Rare', special: false },
      'AB+': { frequency: '3%', category: 'Rare', special: 'Universal Plasma Donor' },
      'AB-': { frequency: '1%', category: 'Very Rare', special: false },
      'O+': { frequency: '38%', category: 'Most Common', special: false },
      'O-': { frequency: '7%', category: 'Less Common', special: 'Universal Blood Donor' }
    };
    return info[bloodType] || { frequency: 'Unknown', category: 'Unknown', special: false };
  };

  const checkCompatibility = () => {
    if (!recipientBloodType) {
      toast({
        title: "Please select a blood type",
        description: "Choose the recipient's blood type to check compatibility.",
        variant: "destructive",
      });
      return;
    }

    const compatibleDonors = compatibilityMatrix[recipientBloodType] || [];
    const canDonateTo = donorCompatibility[recipientBloodType] || [];
    const recipientInfo = getBloodTypeInfo(recipientBloodType);

    setCompatibilityResults({
      recipientType: recipientBloodType,
      compatibleDonors,
      canDonateTo,
      recipientInfo,
      allBloodTypes: bloodTypes
    });

    toast({
      title: "Compatibility Analysis Complete!",
      description: `Found ${compatibleDonors.length} compatible donor types for ${recipientBloodType}.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Main Checker */}
      <Card className="shadow-xl border-t-4 border-purple-500">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            AI Blood Compatibility Checker
          </CardTitle>
          <CardDescription className="text-lg">
            Instantly check which blood types are compatible for donation and receiving
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Recipient Blood Type
              </label>
              <Select value={recipientBloodType} onValueChange={setRecipientBloodType}>
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="Choose blood type" />
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

            <ArrowRight className="h-6 w-6 text-gray-400 hidden md:block" />

            <Button 
              onClick={checkCompatibility}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-lg"
              disabled={!recipientBloodType}
            >
              <Brain className="h-5 w-5 mr-2" />
              Analyze Compatibility
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {compatibilityResults && (
        <div className="space-y-6">
          {/* Recipient Info */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Heart className="h-6 w-6 mr-2 text-red-500" />
                Blood Type: {compatibilityResults.recipientType}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Population Frequency</p>
                  <p className="text-xl font-bold text-gray-900">{compatibilityResults.recipientInfo.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <Badge variant="outline" className="text-sm">
                    {compatibilityResults.recipientInfo.category}
                  </Badge>
                </div>
                {compatibilityResults.recipientInfo.special && (
                  <div>
                    <p className="text-sm text-gray-600">Special Property</p>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {compatibilityResults.recipientInfo.special}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compatible Donors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-700">
                ✅ Can Receive Blood From ({compatibilityResults.compatibleDonors.length} types)
              </CardTitle>
              <CardDescription>
                These blood types can safely donate to {compatibilityResults.recipientType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {compatibilityResults.allBloodTypes.map((bloodType: string) => {
                  const isCompatible = compatibilityResults.compatibleDonors.includes(bloodType);
                  return (
                    <div
                      key={bloodType}
                      className={`p-4 rounded-lg text-center border-2 transition-all ${
                        isCompatible
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-gray-200 bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        {isCompatible ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <p className="font-bold text-lg">{bloodType}</p>
                      <p className="text-xs">
                        {isCompatible ? 'Compatible' : 'Not Compatible'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Can Donate To */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">
                💝 Can Donate Blood To ({compatibilityResults.canDonateTo.length} types)
              </CardTitle>
              <CardDescription>
                If you have {compatibilityResults.recipientType} blood, you can donate to these types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {compatibilityResults.allBloodTypes.map((bloodType: string) => {
                  const canDonate = compatibilityResults.canDonateTo.includes(bloodType);
                  return (
                    <div
                      key={bloodType}
                      className={`p-4 rounded-lg text-center border-2 transition-all ${
                        canDonate
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 bg-gray-50 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        {canDonate ? (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <p className="font-bold text-lg">{bloodType}</p>
                      <p className="text-xs">
                        {canDonate ? 'Can Donate' : 'Cannot Donate'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Educational Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Understanding Blood Compatibility
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Universal Donor (O-):</strong> Can donate to anyone but can only receive from O-
                    </p>
                    <p>
                      <strong>Universal Recipient (AB+):</strong> Can receive from anyone but can only donate to AB+
                    </p>
                    <p>
                      <strong>Rh Factor:</strong> Positive (+) can receive from positive or negative, but negative (-) can only receive from negative
                    </p>
                    <p>
                      <strong>Emergency Situations:</strong> O- blood is often used in emergencies when the recipient's blood type is unknown
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Reference Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Reference: Universal Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">O-</div>
              <p className="font-semibold text-gray-900 mb-1">Universal Blood Donor</p>
              <p className="text-sm text-gray-600">Can donate red blood cells to anyone</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">AB+</div>
              <p className="font-semibold text-gray-900 mb-1">Universal Recipient</p>
              <p className="text-sm text-gray-600">Can receive red blood cells from anyone</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodCompatibilityChecker;
