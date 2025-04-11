
import { User, Company, Position, Application, ApplicationStatus } from '@/types';
import { users, companies, positions, applications } from './mockData';
import { toast } from "@/components/ui/use-toast";

class DataService {
  private users: User[] = users;
  private companies: Company[] = companies;
  private positions: Position[] = positions;
  private applications: Application[] = applications;

  // Auth related methods
  public async login(email: string, password: string): Promise<User | null> {
    // In a real app, this would validate against a backend
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return null;
    }

    // Simulate successful login
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }

  public async register(userData: Omit<User, 'id'>): Promise<User | null> {
    // Check if email already exists
    if (this.users.some(u => u.email === userData.email)) {
      toast({
        title: "Registration Failed",
        description: "Email already in use",
        variant: "destructive",
      });
      return null;
    }

    // Create new user with generated ID
    const newUser: User = {
      id: `${this.users.length + 1}`,
      ...userData,
    };

    this.users.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
  }

  public getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      return null;
    }
  }

  // Company and position related methods
  public async getCompanies(): Promise<Company[]> {
    return this.companies;
  }

  public async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.find(c => c.id === id);
  }

  public async getPositions(companyId?: string): Promise<Position[]> {
    if (companyId) {
      return this.positions.filter(p => p.companyId === companyId);
    }
    return this.positions;
  }

  public async getPosition(id: string): Promise<Position | undefined> {
    return this.positions.find(p => p.id === id);
  }

  // Application related methods
  public async getUserApplications(userId: string): Promise<Array<Application & { company: Company; position: Position }>> {
    const userApps = this.applications.filter(a => a.userId === userId);
    
    return userApps.map(app => {
      const company = this.companies.find(c => c.id === app.companyId)!;
      const position = this.positions.find(p => p.id === app.positionId)!;
      return { ...app, company, position };
    });
  }

  public async applyForPosition(userId: string, positionId: string): Promise<Application | null> {
    const position = await this.getPosition(positionId);
    if (!position) {
      toast({
        title: "Application Failed",
        description: "Position not found",
        variant: "destructive",
      });
      return null;
    }

    // Check if already applied
    if (this.applications.some(a => a.userId === userId && a.positionId === positionId)) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this position",
        variant: "destructive",
      });
      return null;
    }

    const newApplication: Application = {
      id: `${this.applications.length + 1}`,
      userId,
      companyId: position.companyId,
      positionId,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };

    this.applications.push(newApplication);
    
    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted.",
      variant: "default",
    });
    
    return newApplication;
  }

  public async updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<Application | null> {
    const appIndex = this.applications.findIndex(a => a.id === applicationId);
    
    if (appIndex === -1) {
      return null;
    }
    
    this.applications[appIndex] = {
      ...this.applications[appIndex],
      status,
      updatedDate: new Date().toISOString().split('T')[0],
    };
    
    return this.applications[appIndex];
  }
}

// Export as singleton
export const dataService = new DataService();
