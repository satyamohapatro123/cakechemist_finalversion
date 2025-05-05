import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "@/components/user/UserProfile";
import { SectionHeading } from "@/components/ui/section-heading";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'admin') {
        // Redirect admin to admin profile
        navigate('/admin/profile');
      } else {
        setIsAuthenticated(true);
      }
    } else {
      // Redirect to login if not authenticated
      navigate('/login');
    }
  }, [navigate]);
  
  if (!isAuthenticated) {
    return <div className="container-custom py-20 text-center">Checking authentication...</div>;
  }
  
  return (
    <>
      <section className="bg-muted/30 py-12">
        <div className="container-custom">
          <SectionHeading
            title="My Account"
            subtitle="Manage your profile and preferences"
          />
        </div>
      </section>
      
      <UserProfile />
    </>
  );
};

export default UserProfilePage;
