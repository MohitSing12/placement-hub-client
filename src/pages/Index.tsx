
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataService } from "@/services/dataService";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in and redirect accordingly
    const currentUser = dataService.getCurrentUser();
    
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <p className="text-xl">Redirecting...</p>
    </div>
  );
};

export default Index;
