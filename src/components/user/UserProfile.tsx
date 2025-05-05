import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Upload, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define user interface
interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  profilePicture?: string;
  role: "user" | "admin";
  createdAt: string;
  lastLogin?: string;
}

// Define form schema for profile update
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter your complete address." }),
  city: z.string().min(2, { message: "Please enter your city." }),
  state: z.string().min(2, { message: "Please enter your state." }),
  pincode: z.string().min(6, { message: "Please enter a valid PIN code." }),
});

// Define form schema for password change
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const UserProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Initialize profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  // Initialize password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Load user data from localStorage
  useEffect(() => {
    const loadUser = () => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser) as UserData;
        setUser(userData);

        // Set form default values
        profileForm.reset({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          pincode: userData.pincode,
        });

        // Set profile image if available
        if (userData.profilePicture) {
          setProfileImage(userData.profilePicture);
        }
      } else {
        // Redirect to login if no user is found
        navigate('/login');
      }
    };

    loadUser();
  }, [navigate, profileForm]);

  // Handle profile form submission
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    setIsLoading(true);

    // In a real app, this would be an API call
    setTimeout(() => {
      if (user) {
        const updatedUser = {
          ...user,
          ...data,
          profilePicture: profileImage || user.profilePicture,
        };

        // Update user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Update users array in localStorage
        const users = localStorage.getItem('users');
        if (users) {
          const usersArray = JSON.parse(users) as UserData[];
          const updatedUsers = usersArray.map(u =>
            u.id === user.id ? updatedUser : u
          );
          localStorage.setItem('users', JSON.stringify(updatedUsers));
        }

        setUser(updatedUser);

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  // Handle password form submission
  const onPasswordSubmit = (data: z.infer<typeof passwordFormSchema>) => {
    setIsLoading(true);

    // In a real app, this would verify the current password against the stored hash
    // and then update with the new hashed password
    setTimeout(() => {
      // For demo purposes, we'll just show a success message
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsLoading(false);
    }, 1000);
  };

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div className="container-custom py-20 text-center">Loading...</div>;
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif mb-8">My Account</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileImage || user.profilePicture} />
                      <AvatarFallback className="text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-center">
                      <Label htmlFor="picture" className="cursor-pointer">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <Upload className="h-4 w-4" />
                          <span>Change Picture</span>
                        </div>
                      </Label>
                      <input
                        id="picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="flex-1">
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="pincode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PIN Code</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="pt-4">
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showCurrentPassword ? "text" : "password"}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showNewPassword ? "text" : "password"}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Alert className="mt-4">
                      <AlertTitle>Password Requirements</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 text-sm">
                          <li>At least 8 characters long</li>
                          <li>Include at least one uppercase letter</li>
                          <li>Include at least one number</li>
                          <li>Include at least one special character</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <div className="pt-4">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Change Password"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Additional security settings for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Last Login</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Account Created</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Log Out from All Devices
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
