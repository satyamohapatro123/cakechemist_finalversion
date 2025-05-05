import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminProfile from "@/components/admin/AdminProfile";
import { SectionHeading } from "@/components/ui/section-heading";

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in and is an admin
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'admin') {
        setIsAuthenticated(true);
      } else {
        // Redirect non-admin users to user profile
        navigate('/profile');
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
            title="Admin Profile"
            subtitle="Manage your administrator account"
          />
        </div>
      </section>
      
      <AdminProfile />
    </>
  );
};

export default AdminProfilePage;
