
import { useEffect, useState } from "react";
import { dataService } from "@/services/dataService";
import { Company } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const allCompanies = await dataService.getCompanies();
        setCompanies(allCompanies);
        setFilteredCompanies(allCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    // Filter companies based on search term
    const filtered = companies.filter((company) => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <p className="text-muted-foreground">
          Explore companies and their available positions.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search companies by name, description or location..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 gap-2">
          <Search className="h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="font-medium text-lg mt-4">No companies found</h3>
          <p className="text-muted-foreground">
            We couldn't find any companies matching your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-12 w-12 rounded"
                    />
                  ) : (
                    <Building className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle>{company.name}</CardTitle>
                    <CardDescription>{company.location}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm line-clamp-3">
                  {company.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{company.positions.length} open positions</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to={`/companies/${company.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
