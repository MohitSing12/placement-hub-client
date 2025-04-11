
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  BriefcaseBusiness, 
  Building, 
  LogOut, 
  User 
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Layout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  // Redirect to login if not authenticated
  if (!currentUser) {
    navigate('/login', { replace: true });
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-30 bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">PlacementHub</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.rollNumber}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-card shadow-sm">
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/companies"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive('/companies') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <BriefcaseBusiness className="h-5 w-5" />
                  <span>Companies</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/applications"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive('/applications') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Applications</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive('/profile') 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Bottom navigation for mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-30">
          <div className="grid grid-cols-4 p-2">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center justify-center p-2 ${
                isActive('/dashboard') ? 'text-primary' : ''
              }`}
            >
              <Building className="h-5 w-5" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              to="/companies"
              className={`flex flex-col items-center justify-center p-2 ${
                isActive('/companies') ? 'text-primary' : ''
              }`}
            >
              <BriefcaseBusiness className="h-5 w-5" />
              <span className="text-xs mt-1">Companies</span>
            </Link>
            <Link
              to="/applications"
              className={`flex flex-col items-center justify-center p-2 ${
                isActive('/applications') ? 'text-primary' : ''
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="text-xs mt-1">Applications</span>
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center p-2 ${
                isActive('/profile') ? 'text-primary' : ''
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container p-4 md:p-6 pb-20 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
