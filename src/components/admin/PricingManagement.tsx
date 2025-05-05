import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash, Percent, Tag, MapPin, Navigation } from "lucide-react";
import { getDefaultStoreLocation, saveStoreLocation, StoreLocation } from "@/services/GeolocationService";

const PricingManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dietary");

  // Dietary options state
  const [dietaryOptions, setDietaryOptions] = useState([
    { id: "eggless", name: "Eggless", price: 50, enabled: true },
    { id: "vegan", name: "Vegan", price: 100, enabled: true },
    { id: "gluten_free", name: "Gluten Free", price: 150, enabled: true },
    { id: "sugar_free", name: "Sugar Free", price: 120, enabled: true },
    { id: "lactose_free", name: "Lactose Free", price: 80, enabled: true }
  ]);

  // Tax settings state
  const [taxSettings, setTaxSettings] = useState({
    gstPercentage: 18,
    applyGST: true,
    gstNumber: "27AADCB2230M1ZT"
  });

  // Delivery settings state
  const [deliverySettings, setDeliverySettings] = useState({
    baseDeliveryCharge: 50,
    freeDeliveryThreshold: 1000,
    maxDeliveryDistance: 15,
    chargePerKm: 10,
    enableLocationBasedDelivery: true
  });

  // Packaging settings state
  const [packagingSettings, setPackagingSettings] = useState({
    basicPackagingCharge: 20,
    premiumPackagingCharge: 100,
    giftWrapCharge: 150,
    enablePackagingOptions: true
  });

  // Store location state
  const [storeLocation, setStoreLocation] = useState<StoreLocation>(getDefaultStoreLocation());

  // Load store location on component mount
  useEffect(() => {
    setStoreLocation(getDefaultStoreLocation());
  }, []);

  // Handle dietary option toggle
  const handleDietaryToggle = (id: string) => {
    setDietaryOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );

    toast({
      title: "Setting Updated",
      description: `Dietary option has been ${dietaryOptions.find(o => o.id === id)?.enabled ? 'disabled' : 'enabled'}.`
    });
  };

  // Handle dietary price change
  const handleDietaryPriceChange = (id: string, price: number) => {
    setDietaryOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, price } : option
      )
    );
  };

  // Save dietary changes
  const saveDietaryChanges = () => {
    // In a real app, this would be an API call
    localStorage.setItem('dietaryOptions', JSON.stringify(dietaryOptions));

    toast({
      title: "Settings Saved",
      description: "Dietary pricing options have been updated."
    });
  };

  // Handle tax settings change
  const handleTaxSettingChange = (field: string, value: any) => {
    setTaxSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save tax settings
  const saveTaxSettings = () => {
    // In a real app, this would be an API call
    localStorage.setItem('taxSettings', JSON.stringify(taxSettings));

    toast({
      title: "Settings Saved",
      description: "Tax settings have been updated."
    });
  };

  // Handle delivery settings change
  const handleDeliverySettingChange = (field: string, value: any) => {
    setDeliverySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save delivery settings
  const saveDeliverySettings = () => {
    // In a real app, this would be an API call
    localStorage.setItem('deliverySettings', JSON.stringify(deliverySettings));

    toast({
      title: "Settings Saved",
      description: "Delivery settings have been updated."
    });
  };

  // Handle packaging settings change
  const handlePackagingSettingChange = (field: string, value: any) => {
    setPackagingSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save packaging settings
  const savePackagingSettings = () => {
    // In a real app, this would be an API call
    localStorage.setItem('packagingSettings', JSON.stringify(packagingSettings));

    toast({
      title: "Settings Saved",
      description: "Packaging settings have been updated."
    });
  };

  // Handle store location change
  const handleStoreLocationChange = (field: keyof StoreLocation, value: any) => {
    if (field === 'coordinates') {
      setStoreLocation(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          ...value
        }
      }));
    } else {
      setStoreLocation(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Save store location
  const saveStoreLocationSettings = () => {
    // Save to localStorage via the service
    saveStoreLocation(storeLocation);

    toast({
      title: "Settings Saved",
      description: "Store location has been updated."
    });

    // Dispatch event to notify the app of the update
    const event = new CustomEvent('storeLocationUpdated');
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pricing & Charges Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dietary">Dietary Options</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Charges</TabsTrigger>
          <TabsTrigger value="packaging">Packaging</TabsTrigger>
          <TabsTrigger value="location">Store Location</TabsTrigger>
        </TabsList>

        {/* Dietary Options Tab */}
        <TabsContent value="dietary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dietary Options Pricing</CardTitle>
              <CardDescription>
                Set pricing for different dietary requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dietaryOptions.map(option => (
                  <div key={option.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={option.enabled}
                        onCheckedChange={() => handleDietaryToggle(option.id)}
                      />
                      <Label htmlFor={`price-${option.id}`}>{option.name}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">₹</span>
                      <Input
                        id={`price-${option.id}`}
                        type="number"
                        value={option.price}
                        onChange={(e) => handleDietaryPriceChange(option.id, parseInt(e.target.value) || 0)}
                        className="w-20"
                        disabled={!option.enabled}
                      />
                      <span className="text-muted-foreground">extra</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={saveDietaryChanges} className="mt-6">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings Tab */}
        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>
                Configure GST and other tax settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="apply-gst">Apply GST</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable GST calculation on orders
                    </p>
                  </div>
                  <Switch
                    id="apply-gst"
                    checked={taxSettings.applyGST}
                    onCheckedChange={(checked) => handleTaxSettingChange('applyGST', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="gst-percentage">GST Percentage</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="gst-percentage"
                      type="number"
                      value={taxSettings.gstPercentage}
                      onChange={(e) => handleTaxSettingChange('gstPercentage', parseInt(e.target.value) || 0)}
                      className="w-20"
                      disabled={!taxSettings.applyGST}
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gst-number">Business GST Number</Label>
                  <Input
                    id="gst-number"
                    value={taxSettings.gstNumber}
                    onChange={(e) => handleTaxSettingChange('gstNumber', e.target.value)}
                    placeholder="Enter your GST number"
                    disabled={!taxSettings.applyGST}
                  />
                </div>
              </div>
              <Button onClick={saveTaxSettings} className="mt-6" disabled={!taxSettings.applyGST}>
                Save Tax Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Charges Tab */}
        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Charges</CardTitle>
              <CardDescription>
                Configure delivery fees and free delivery thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-delivery">Base Delivery Charge (₹)</Label>
                  <Input
                    id="base-delivery"
                    type="number"
                    value={deliverySettings.baseDeliveryCharge}
                    onChange={(e) => handleDeliverySettingChange('baseDeliveryCharge', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="free-threshold">Free Delivery Threshold (₹)</Label>
                  <Input
                    id="free-threshold"
                    type="number"
                    value={deliverySettings.freeDeliveryThreshold}
                    onChange={(e) => handleDeliverySettingChange('freeDeliveryThreshold', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Orders above this amount qualify for free delivery
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Location-Based Delivery Charges</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable distance-based delivery fees
                    </p>
                  </div>
                  <Switch
                    checked={deliverySettings.enableLocationBasedDelivery}
                    onCheckedChange={(checked) => handleDeliverySettingChange('enableLocationBasedDelivery', checked)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-distance">Maximum Delivery Distance (km)</Label>
                    <Input
                      id="max-distance"
                      type="number"
                      value={deliverySettings.maxDeliveryDistance}
                      onChange={(e) => handleDeliverySettingChange('maxDeliveryDistance', parseInt(e.target.value) || 0)}
                      disabled={!deliverySettings.enableLocationBasedDelivery}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="charge-per-km">Charge per km (₹)</Label>
                    <Input
                      id="charge-per-km"
                      type="number"
                      value={deliverySettings.chargePerKm}
                      onChange={(e) => handleDeliverySettingChange('chargePerKm', parseInt(e.target.value) || 0)}
                      disabled={!deliverySettings.enableLocationBasedDelivery}
                    />
                  </div>
                </div>
              </div>
              <Button onClick={saveDeliverySettings} className="mt-6">
                Save Delivery Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packaging Tab */}
        <TabsContent value="packaging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Packaging Options</CardTitle>
              <CardDescription>
                Configure packaging fees and options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Packaging Options</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to choose packaging options
                    </p>
                  </div>
                  <Switch
                    checked={packagingSettings.enablePackagingOptions}
                    onCheckedChange={(checked) => handlePackagingSettingChange('enablePackagingOptions', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="basic-packaging">Basic Packaging Charge (₹)</Label>
                  <Input
                    id="basic-packaging"
                    type="number"
                    value={packagingSettings.basicPackagingCharge}
                    onChange={(e) => handlePackagingSettingChange('basicPackagingCharge', parseInt(e.target.value) || 0)}
                    disabled={!packagingSettings.enablePackagingOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="premium-packaging">Premium Packaging Charge (₹)</Label>
                  <Input
                    id="premium-packaging"
                    type="number"
                    value={packagingSettings.premiumPackagingCharge}
                    onChange={(e) => handlePackagingSettingChange('premiumPackagingCharge', parseInt(e.target.value) || 0)}
                    disabled={!packagingSettings.enablePackagingOptions}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gift-wrap">Gift Wrapping Charge (₹)</Label>
                  <Input
                    id="gift-wrap"
                    type="number"
                    value={packagingSettings.giftWrapCharge}
                    onChange={(e) => handlePackagingSettingChange('giftWrapCharge', parseInt(e.target.value) || 0)}
                    disabled={!packagingSettings.enablePackagingOptions}
                  />
                </div>
              </div>
              <Button
                onClick={savePackagingSettings}
                className="mt-6"
                disabled={!packagingSettings.enablePackagingOptions}
              >
                Save Packaging Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Store Location Tab */}
        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Location</CardTitle>
              <CardDescription>
                Configure your store's physical location for delivery calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={storeLocation.name}
                    onChange={(e) => handleStoreLocationChange('name', e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Input
                    id="store-address"
                    value={storeLocation.address}
                    onChange={(e) => handleStoreLocationChange('address', e.target.value)}
                    placeholder="Enter full address"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Store Coordinates</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    These coordinates are used to calculate delivery distances
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-latitude">Latitude</Label>
                      <Input
                        id="store-latitude"
                        type="number"
                        step="0.0001"
                        value={storeLocation.coordinates.latitude}
                        onChange={(e) => handleStoreLocationChange('coordinates', { latitude: parseFloat(e.target.value) })}
                        placeholder="e.g. 19.0760"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="store-longitude">Longitude</Label>
                      <Input
                        id="store-longitude"
                        type="number"
                        step="0.0001"
                        value={storeLocation.coordinates.longitude}
                        onChange={(e) => handleStoreLocationChange('coordinates', { longitude: parseFloat(e.target.value) })}
                        placeholder="e.g. 72.8777"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            handleStoreLocationChange('coordinates', {
                              latitude: position.coords.latitude,
                              longitude: position.coords.longitude
                            });
                            toast({
                              title: "Location Updated",
                              description: "Current location has been set as store location."
                            });
                          },
                          (error) => {
                            toast({
                              title: "Location Error",
                              description: "Could not get current location: " + error.message,
                              variant: "destructive"
                            });
                          }
                        );
                      }}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Use Current Location
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={saveStoreLocationSettings} className="mt-6">
                Save Location Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingManagement;
