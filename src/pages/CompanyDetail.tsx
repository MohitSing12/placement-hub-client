
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dataService } from "@/services/dataService";
import { Company, Position } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Building, Briefcase, ChevronLeft, AlertTriangle } from "lucide-react";

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!id) return;

      try {
        const companyData = await dataService.getCompany(id);
        
        if (!companyData) {
          navigate("/companies", { replace: true });
          return;
        }
        
        setCompany(companyData);
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id, navigate]);

  const handleApply = async (positionId: string) => {
    if (!currentUser) return;

    setApplying(prev => ({ ...prev, [positionId]: true }));
    
    try {
      await dataService.applyForPosition(currentUser.id, positionId);
      // Refresh the page to show the updated status
      navigate('/applications');
    } catch (error) {
      console.error("Error applying for position:", error);
    } finally {
      setApplying(prev => ({ ...prev, [positionId]: false }));
    }
  };

  const formatSalary = (position: Position) => {
    if (!position.salary) return "Not specified";
    const { min, max, currency } = position.salary;
    return `${min / 100000}-${max / 100000} LPA`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-warning mb-4" />
        <h2 className="text-xl font-semibold">Company not found</h2>
        <p className="text-muted-foreground mt-2">The company you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate("/companies")}>
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="pl-0 mb-4"
        onClick={() => navigate("/companies")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Companies
      </Button>

      {/* Company Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex-shrink-0">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="h-16 w-16 rounded-lg"
            />
          ) : (
            <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center">
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{company.location}</span>
          </div>
        </div>
      </div>

      {/* Company Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">About Company</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{company.description}</p>
        </CardContent>
      </Card>

      {/* Open Positions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Open Positions ({company.positions.length})</h2>

        {company.positions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <Briefcase className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="font-medium text-lg mt-4">No open positions</h3>
              <p className="text-muted-foreground">
                This company doesn't have any open positions at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {company.positions.map((position) => (
              <Card key={position.id}>
                <CardHeader>
                  <CardTitle>{position.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {formatDate(position.deadline)}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{position.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Requirements:</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {position.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {position.salary && (
                    <div className="text-sm">
                      <span className="font-medium">Salary:</span> {formatSalary(position)}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleApply(position.id)}
                    disabled={applying[position.id]}
                  >
                    {applying[position.id] ? "Applying..." : "Apply Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
