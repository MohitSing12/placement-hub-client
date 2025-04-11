
export type User = {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  branch: string;
  year: number;
  avatar?: string;
};

export type Company = {
  id: string;
  name: string;
  logo?: string;
  description: string;
  location: string;
  positions: Position[];
};

export type Position = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
};

export type ApplicationStatus = 'pending' | 'applied' | 'selected' | 'rejected';

export type Application = {
  id: string;
  userId: string;
  companyId: string;
  positionId: string;
  status: ApplicationStatus;
  appliedDate: string;
  updatedDate: string;
  notes?: string;
};
