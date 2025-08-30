import React from 'react';
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
import { useApplicants } from '../context/ApplicantContext';
import { AnalyticsCard } from './ui/AnalyticsCard';
import { RecentCandidates } from './ui/RecentCandidates';
import { FilterPanel } from './ui/FilterPanel';

export const Dashboard: React.FC = () => {
  const { applicants } = useApplicants();

  const totalApplicants = applicants.length;
  const newApplicants = applicants.filter(a => a.status === 'New').length;
  const inProgress = applicants.filter(a => ['Screening', 'Interview'].includes(a.status)).length;
  const hired = applicants.filter(a => a.status === 'Hired').length;

  const recentApplicants = applicants
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Total Applicants"
          value={totalApplicants}
          icon={Users}
          color="blue"
          trend="+12% from last month"
        />
        <AnalyticsCard
          title="New Applications"
          value={newApplicants}
          icon={Clock}
          color="yellow"
          trend="+5% from last week"
        />
        <AnalyticsCard
          title="In Progress"
          value={inProgress}
          icon={TrendingUp}
          color="purple"
          trend="+8% from last week"
        />
        <AnalyticsCard
          title="Hired"
          value={hired}
          icon={UserCheck}
          color="green"
          trend="+3% from last month"
        />
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter & Analytics</h2>
        <FilterPanel />
      </div>

      {/* Recent Candidates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Candidates</h2>
        <RecentCandidates applicants={recentApplicants} />
      </div>
    </div>
  );
};