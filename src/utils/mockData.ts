import { Applicant } from '../types/applicant';

const names = [
  'Alex Johnson', 'Sarah Chen', 'Michael Brown', 'Emily Davis', 'David Wilson',
  'Jessica Martinez', 'Chris Taylor', 'Amanda Garcia', 'Robert Lee', 'Lisa Wang',
  'James Rodriguez', 'Anna Thompson', 'Mark Anderson', 'Rachel Kim', 'Kevin Zhang',
  'Laura Patel', 'Steven Clark', 'Maria Gonzalez', 'Ryan Murphy', 'Jennifer Liu',
  'Thomas Wright', 'Sophia Adams', 'Daniel Singh', 'Olivia Cooper', 'Andrew Kumar'
];

const positions = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Product Manager', 'UX Designer', 'Data Scientist', 'DevOps Engineer',
  'Quality Assurance Engineer', 'Technical Writer', 'Marketing Manager', 'Sales Representative'
];

const statuses: Applicant['status'][] = ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
const sources = ['Website', 'LinkedIn', 'Indeed', 'Referral', 'Career Fair', 'Other'];

const skillSets = [
  ['JavaScript', 'React', 'Node.js'],
  ['Python', 'Django', 'PostgreSQL'],
  ['Java', 'Spring Boot', 'MySQL'],
  ['TypeScript', 'Next.js', 'MongoDB'],
  ['Vue.js', 'Nuxt.js', 'Express.js'],
  ['Angular', 'NestJS', 'Redis'],
  ['PHP', 'Laravel', 'MariaDB'],
  ['Go', 'Docker', 'Kubernetes'],
  ['AWS', 'DevOps', 'CI/CD'],
  ['React Native', 'iOS', 'Android']
];

const educationLevels = [
  'Bachelor in Computer Science',
  'Master in Software Engineering',
  'Bachelor in Information Technology',
  'Master in Computer Science',
  'Bachelor in Electrical Engineering',
  'PhD in Computer Science',
  'Bachelor in Mathematics',
  'Master in Data Science'
];

export const generateMockApplicants = (count: number): Applicant[] => {
  return Array.from({ length: count }, (_, index) => {
    const name = names[index % names.length];
    const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
    const daysAgo = Math.floor(Math.random() * 30);
    const appliedDate = new Date();
    appliedDate.setDate(appliedDate.getDate() - daysAgo);

    return {
      id: (index + 1).toString(),
      atsNumber: `ATS${8001 + index}`,
      name,
      email,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      position: positions[Math.floor(Math.random() * positions.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      experience: Math.floor(Math.random() * 10),
      skills: skillSets[Math.floor(Math.random() * skillSets.length)],
      education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
      appliedDate: appliedDate.toISOString(),
      resumeUrl: Math.random() > 0.3 ? `https://example.com/resumes/${name.replace(' ', '_')}_resume.pdf` : undefined,
      notes: Math.random() > 0.5 ? `Interview scheduled. Strong candidate with ${Math.floor(Math.random() * 5) + 1} years of experience.` : undefined,
    };
  });
};