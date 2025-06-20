
import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface Hospital {
  id: number;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface HospitalSearchProps {
  onHospitalSelect?: (hospital: Hospital) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const HospitalSearch = ({ 
  onHospitalSelect, 
  placeholder = "Search for hospitals...", 
  label = "Hospital",
  required = false 
}: HospitalSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Delhi Government Hospitals Data
  const delhiHospitals: Hospital[] = [
    {
      id: 1,
      name: "All India Institute of Medical Sciences (AIIMS)",
      address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi - 110029",
      coordinates: { lat: 28.5672, lng: 77.2100 }
    },
    {
      id: 2,
      name: "Safdarjung Hospital",
      address: "Safdarjung Enclave, New Delhi - 110029",
      coordinates: { lat: 28.5665, lng: 77.2063 }
    },
    {
      id: 3,
      name: "Ram Manohar Lohia Hospital",
      address: "Park Street, New Delhi - 110001",
      coordinates: { lat: 28.6358, lng: 77.2245 }
    },
    {
      id: 4,
      name: "Guru Teg Bahadur Hospital",
      address: "Dilshad Garden, New Delhi - 110095",
      coordinates: { lat: 28.6897, lng: 77.3206 }
    },
    {
      id: 5,
      name: "Lok Nayak Hospital",
      address: "Jawahar Lal Nehru Marg, New Delhi - 110002",
      coordinates: { lat: 28.6433, lng: 77.2267 }
    },
    {
      id: 6,
      name: "Lady Hardinge Medical College & Hospital",
      address: "Shaheed Bhagat Singh Marg, New Delhi - 110001",
      coordinates: { lat: 28.6389, lng: 77.2219 }
    },
    {
      id: 7,
      name: "Maulana Azad Medical College & Hospital",
      address: "Bahadur Shah Zafar Marg, New Delhi - 110002",
      coordinates: { lat: 28.6408, lng: 77.2394 }
    },
    {
      id: 8,
      name: "Hindu Rao Hospital",
      address: "Malka Ganj, New Delhi - 110007",
      coordinates: { lat: 28.6667, lng: 77.2167 }
    },
    {
      id: 9,
      name: "Delhi Heart & Lung Institute",
      address: "Panchkuian Road, New Delhi - 110055",
      coordinates: { lat: 28.6333, lng: 77.2167 }
    },
    {
      id: 10,
      name: "Rajiv Gandhi Super Speciality Hospital",
      address: "Tahirpur, New Delhi - 110093",
      coordinates: { lat: 28.7167, lng: 77.2500 }
    },
    {
      id: 11,
      name: "Guru Nanak Eye Centre",
      address: "Maharaja Ranjit Singh Marg, New Delhi - 110002",
      coordinates: { lat: 28.6467, lng: 77.2333 }
    },
    {
      id: 12,
      name: "Dr. Baba Saheb Ambedkar Hospital",
      address: "Sector 6, Rohini, New Delhi - 110085",
      coordinates: { lat: 28.7333, lng: 77.1167 }
    },
    {
      id: 13,
      name: "Deen Dayal Upadhyay Hospital",
      address: "Hari Nagar, New Delhi - 110064",
      coordinates: { lat: 28.6167, lng: 77.1000 }
    },
    {
      id: 14,
      name: "Sanjay Gandhi Memorial Hospital",
      address: "Mangolpuri, New Delhi - 110083",
      coordinates: { lat: 28.6833, lng: 77.0667 }
    },
    {
      id: 15,
      name: "Bhagwan Mahavir Hospital",
      address: "Pitampura, New Delhi - 110088",
      coordinates: { lat: 28.7000, lng: 77.1333 }
    }
  ];

  // Filter hospitals based on search term
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = delhiHospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHospitals(filtered);
      setShowDropdown(true);
    } else {
      setFilteredHospitals([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear selection if user is typing something different
    if (selectedHospital && !selectedHospital.name.toLowerCase().includes(value.toLowerCase())) {
      setSelectedHospital(null);
    }
  };

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setSearchTerm(hospital.name);
    setShowDropdown(false);
    
    if (onHospitalSelect) {
      onHospitalSelect(hospital);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {label && (
        <Label htmlFor="hospital-search" className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="hospital-search"
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* Dropdown */}
      {showDropdown && filteredHospitals.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital.id}
              onClick={() => handleHospitalSelect(hospital)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {hospital.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {hospital.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showDropdown && searchTerm.length >= 2 && filteredHospitals.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No hospitals found matching "{searchTerm}"
          </div>
        </div>
      )}

      {/* Selected hospital info */}
      {selectedHospital && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Selected: {selectedHospital.name}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {selectedHospital.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalSearch;
