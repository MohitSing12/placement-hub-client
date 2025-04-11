
import { Company, Position, User, Application } from '@/types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.edu',
    rollNumber: 'CS2020001',
    branch: 'Computer Science',
    year: 4,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.edu',
    rollNumber: 'CS2020002',
    branch: 'Computer Science',
    year: 3,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Mock Companies with Positions
export const companies: Company[] = [
  {
    id: '1',
    name: 'Tech Innovations Inc',
    logo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Leading tech company focused on AI and machine learning solutions',
    location: 'Bangalore, India',
    positions: [],
  },
  {
    id: '2',
    name: 'Global Software Solutions',
    logo: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'International software development and consulting firm',
    location: 'Mumbai, India with remote options',
    positions: [],
  },
  {
    id: '3',
    name: 'DataSphere Analytics',
    logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Data analytics company providing insights for businesses',
    location: 'Hyderabad, India',
    positions: [],
  },
  {
    id: '4',
    name: 'NextGen Systems',
    logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Innovative systems engineering firm working on cutting-edge technologies',
    location: 'Pune, India',
    positions: [],
  },
  {
    id: '5',
    name: 'Cloud Enterprises',
    logo: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Cloud infrastructure and services company',
    location: 'Delhi NCR, India',
    positions: [],
  },
];

// Create positions for companies
export const positions: Position[] = [
  {
    id: '1',
    companyId: '1',
    title: 'Software Engineer',
    description: 'Develop and maintain software applications using modern technologies',
    requirements: ['B.Tech in CS/IT', 'Java/Python proficiency', 'Good problem-solving skills'],
    salary: {
      min: 800000,
      max: 1200000,
      currency: 'INR',
    },
    deadline: '2025-06-15',
  },
  {
    id: '2',
    companyId: '1',
    title: 'Data Scientist',
    description: 'Work on machine learning models and data analysis',
    requirements: ['B.Tech/M.Tech in CS/IT', 'Python, R, TensorFlow', 'Statistics knowledge'],
    salary: {
      min: 1000000,
      max: 1500000,
      currency: 'INR',
    },
    deadline: '2025-06-10',
  },
  {
    id: '3',
    companyId: '2',
    title: 'Frontend Developer',
    description: 'Build responsive web applications using React and modern frontend tools',
    requirements: ['B.Tech in CS/IT', 'HTML/CSS/JS expertise', 'React/Angular experience'],
    salary: {
      min: 700000,
      max: 1100000,
      currency: 'INR',
    },
    deadline: '2025-06-20',
  },
  {
    id: '4',
    companyId: '3',
    title: 'Data Analyst',
    description: 'Analyze business data to provide actionable insights',
    requirements: ['B.Tech in any stream', 'SQL proficiency', 'Data visualization skills'],
    salary: {
      min: 600000,
      max: 900000,
      currency: 'INR',
    },
    deadline: '2025-06-25',
  },
  {
    id: '5',
    companyId: '4',
    title: 'System Engineer',
    description: 'Design and implement robust system solutions',
    requirements: ['B.Tech in CS/IT/ECE', 'Linux expertise', 'Networking knowledge'],
    salary: {
      min: 750000,
      max: 1000000,
      currency: 'INR',
    },
    deadline: '2025-06-18',
  },
  {
    id: '6',
    companyId: '5',
    title: 'Cloud Engineer',
    description: 'Work on cloud infrastructure and deployment solutions',
    requirements: ['B.Tech in CS/IT', 'AWS/Azure certification', 'DevOps experience'],
    salary: {
      min: 900000,
      max: 1400000,
      currency: 'INR',
    },
    deadline: '2025-06-12',
  },
];

// Add positions to companies
companies.forEach(company => {
  company.positions = positions.filter(position => position.companyId === company.id);
});

// Mock Applications
export const applications: Application[] = [
  {
    id: '1',
    userId: '1',
    companyId: '1',
    positionId: '1',
    status: 'applied',
    appliedDate: '2025-04-05',
    updatedDate: '2025-04-05',
  },
  {
    id: '2',
    userId: '1',
    companyId: '3',
    positionId: '4',
    status: 'selected',
    appliedDate: '2025-04-02',
    updatedDate: '2025-04-08',
    notes: 'Interview scheduled for April 15th',
  },
  {
    id: '3',
    userId: '1',
    companyId: '5',
    positionId: '6',
    status: 'rejected',
    appliedDate: '2025-04-01',
    updatedDate: '2025-04-07',
  },
  {
    id: '4',
    userId: '1',
    companyId: '2',
    positionId: '3',
    status: 'pending',
    appliedDate: '2025-04-09',
    updatedDate: '2025-04-09',
  },
];
