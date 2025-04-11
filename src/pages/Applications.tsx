
import { useEffect, useState } from "react";
import { dataService } from "@/services/dataService";
import { Application, Company, Position } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Calendar, ChevronRight, MailOpen, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const Applications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Array<Application & { company: Company; position: Position }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;

      try {
        const userApplications = await dataService.getUserApplications(currentUser.id);
        setApplications(userApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Applications</h1>
        <p className="text-muted-foreground">
          Track the status of all your job applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center p-8">
            <ClipboardList className="h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-medium text-lg mt-4">No applications yet</h3>
            <p className="text-muted-foreground">
              You haven't applied to any positions yet.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/companies">Browse Companies</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-3/4 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {app.company.logo ? (
                        <img
                          src={app.company.logo}
                          alt={app.company.name}
                          className="h-12 w-12 rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                          <Building className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{app.position.title}</h3>
                      <p className="text-muted-foreground">{app.company.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Applied on {app.appliedDate}
                        </span>
                      </div>
                      {app.notes && (
                        <div className="mt-2 text-sm border-l-2 border-primary pl-2 italic">
                          {app.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:w-1/4 bg-muted p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l">
                  <div className="flex justify-center md:justify-end mb-4">
                    <span className={getStatusBadgeVariant(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full flex justify-between items-center" 
                    asChild
                  >
                    <Link to={`/companies/${app.company.id}`}>
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Application Stats */}
      {applications.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClipboardList className="h-5 w-5 text-primary mr-2" />
                <div className="text-2xl font-bold">{applications.length}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MailOpen className="h-5 w-5 text-primary mr-2" />
                <div className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'applied').length}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Selected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center mr-2">
                  <span className="text-success text-sm">✓</span>
                </div>
                <div className="text-2xl font-bold text-success">
                  {applications.filter(app => app.status === 'selected').length}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center mr-2">
                  <span className="text-destructive text-sm">✕</span>
                </div>
                <div className="text-2xl font-bold text-destructive">
                  {applications.filter(app => app.status === 'rejected').length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Applications;
