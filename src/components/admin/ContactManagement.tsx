import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Phone, Mail, Globe, Save } from "lucide-react";

interface ContactInfo {
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  googleMapUrl: string;
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

const ContactManagement = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: "123 Bakery Street, Baking District",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    phone: "+91 98765 43210",
    email: "info@cakechemist.com",
    website: "www.cakechemist.com",
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1651052186532!5m2!1sen!2sin",
    workingHours: {
      monday: "9:00 AM - 8:00 PM",
      tuesday: "9:00 AM - 8:00 PM",
      wednesday: "9:00 AM - 8:00 PM",
      thursday: "9:00 AM - 8:00 PM",
      friday: "9:00 AM - 8:00 PM",
      saturday: "10:00 AM - 6:00 PM",
      sunday: "Closed"
    },
    socialMedia: {
      facebook: "https://facebook.com/cakechemist",
      instagram: "https://instagram.com/cakechemist",
      twitter: "https://twitter.com/cakechemist"
    }
  });
  
  // Load contact info from localStorage
  useEffect(() => {
    const loadContactInfo = () => {
      const storedContactInfo = localStorage.getItem('contactInfo');
      if (storedContactInfo) {
        setContactInfo(JSON.parse(storedContactInfo));
      }
    };
    
    loadContactInfo();
  }, []);
  
  // Handle input change for basic info
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle input change for working hours
  const handleWorkingHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [name]: value
      }
    }));
  };
  
  // Handle input change for social media
  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };
  
  // Save contact info
  const saveContactInfo = () => {
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    
    // Dispatch event for other parts of the app
    const event = new CustomEvent('contactInfoUpdated');
    window.dispatchEvent(event);
    
    toast({
      title: "Contact Information Saved",
      description: "Your contact information has been updated successfully."
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Contact Information Management</h2>
        <Button onClick={saveContactInfo}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Contact Information</CardTitle>
              <CardDescription>Update your business address, phone, and email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={contactInfo.address}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter street address"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={contactInfo.city}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={contactInfo.state}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter state"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={contactInfo.pincode}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter pincode"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={contactInfo.website}
                    onChange={handleBasicInfoChange}
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>Set your business hours for each day of the week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monday">Monday</Label>
                  <Input
                    id="monday"
                    name="monday"
                    value={contactInfo.workingHours.monday}
                    onChange={handleWorkingHoursChange}
                    placeholder="e.g., 9:00 AM - 8:00 PM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tuesday">Tuesday</Label>
                  <Input
                    id="tuesday"
                    name="tuesday"
                    value={contactInfo.workingHours.tuesday}
                    onChange={handleWorkingHoursChange}
                    placeholder="e.g., 9:00 AM - 8:00 PM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wednesday">Wednesday</Label>
                  <Input
                    id="wednesday"
                    name="wednesday"
                    value={contactInfo.workingHours.wednesday}
                    onChange={handleWorkingHoursChange}
                    placeholder="e.g., 9:00 AM - 8:00 PM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="thursday">Thursday</Label>
                  <Input
                    id="thursday"
                    name="thursday"
                    value={contactInfo.workingHours.thursday}
                    onChange={handleWorkingHoursChange}
                    placeholder="e.g., 9:00 AM - 8:00 PM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="friday">Friday</Label>
                  <Input
                    id="friday"
                    name="friday"
                    value={contactInfo.workingHours.friday}
                    onChange={handleWorkingHoursChange}
                    placeholder="e.g., 9:00 AM - 8:00 PM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="saturday">Saturday</Label>
                  <Input
                    id="saturday"
                    name="saturday"
                    value={contactInfo.workingHours.saturday}
                    onChange={handleWorkingHoursChange}
                    placeholder="e.g., 10:00 AM - 6:00 PM"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sunday">Sunday</Label>
                  <Input
                    id="sunday"
                    name="sunday"
                    value={contactInfo.workingHours.sunday}
                    onChange={handleWorkingHoursChange}
                    placeholder="e.g., Closed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Update your social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={contactInfo.socialMedia.facebook}
                    onChange={handleSocialMediaChange}
                    placeholder="Enter Facebook URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={contactInfo.socialMedia.instagram}
                    onChange={handleSocialMediaChange}
                    placeholder="Enter Instagram URL"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={contactInfo.socialMedia.twitter}
                    onChange={handleSocialMediaChange}
                    placeholder="Enter Twitter URL"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Google Map</CardTitle>
              <CardDescription>Update your Google Maps embed URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleMapUrl">Google Map Embed URL</Label>
                <Textarea
                  id="googleMapUrl"
                  name="googleMapUrl"
                  value={contactInfo.googleMapUrl}
                  onChange={handleBasicInfoChange}
                  placeholder="Enter Google Map embed URL"
                  rows={3}
                />
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Map Preview</h3>
                <div className="border border-border rounded-md overflow-hidden h-64">
                  <iframe
                    src={contactInfo.googleMapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map"
                  ></iframe>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactManagement;
