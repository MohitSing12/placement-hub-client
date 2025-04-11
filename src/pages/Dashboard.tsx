
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Application, Company, Position } from "@/types";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Building, BriefcaseBusiness, Calendar } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Array<Application & { company: Company; position: Position }>>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // Fetch user applications
        const userApplications = await dataService.getUserApplications(currentUser.id);
        setApplications(userApplications);

        // Fetch companies
        const allCompanies = await dataService.getCompanies();
        setCompanies(allCompanies);
        
        // Get recent companies (last 3)
        setRecentCompanies(allCompanies.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'status-badge status-badge-pending';
      case 'applied': return 'status-badge status-badge-applied';
      case 'selected': return 'status-badge status-badge-selected';
      case 'rejected': return 'status-badge status-badge-rejected';
      default: return 'status-badge';
    }
  };

  const formatSalary = (position: Position) => {
    if (!position.salary) return "Not specified";
    const { min, max, currency } = position.salary;
    return `${min / 100000}-${max / 100000} LPA`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {currentUser?.name}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your placement activities and opportunities.
        </p>
      </div>

      {/* Recent Applications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Recent Applications</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/applications">View all</Link>
          </Button>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center p-4 gap-2">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
                <h3 className="font-medium text-lg">No applications yet</h3>
                <p className="text-muted-foreground">
                  You haven't applied to any companies yet. Explore available companies and positions.
                </p>
                <Button className="mt-2" asChild>
                  <Link to="/companies">Explore Companies</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {applications.slice(0, 3).map((app) => (
              <Card key={app.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {app.company.logo ? (
                        <img
                          src={app.company.logo}
                          alt={app.company.name}
                          className="h-8 w-8 rounded"
                        />
                      ) : (
                        <Building className="h-8 w-8 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-base">{app.company.name}</CardTitle>
                        <CardDescription>{app.position.title}</CardDescription>
                      </div>
                    </div>
                    <span className={getStatusBadgeVariant(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Applied: {app.appliedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BriefcaseBusiness className="h-4 w-4" />
                    <span>{formatSalary(app.position)}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" className="w-full text-primary" asChild>
                    <Link to={`/applications/${app.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Companies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recently Added Companies</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/companies">View all</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-10 w-10 rounded"
                    />
                  ) : (
                    <Building className="h-10 w-10 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle className="text-base">{company.name}</CardTitle>
                    <CardDescription>{company.location}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">
                  {company.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="outline">{company.positions.length} positions</Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full text-primary" asChild>
                  <Link to={`/companies/${company.id}`}>
                    View Positions
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Selected Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {applications.filter(app => app.status === 'selected').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
