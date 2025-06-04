
import React from 'react';
import { Project } from '@/types/project';
import { Absence } from '@/types/calendar';
import DashboardStats from './dashboard/DashboardStats';
import ProjectsLocationMap from './dashboard/ProjectsLocationMap';
import FinancialSummary from './dashboard/FinancialSummary';
import AbsencesSummary from './dashboard/AbsencesSummary';

interface DashboardWithDataProps {
  projects: Project[];
  absences: Absence[];
}

const DashboardWithData: React.FC<DashboardWithDataProps> = ({ projects, absences }) => {
  return (
    <div className="space-y-6">
      <DashboardStats projects={projects} absences={absences} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsLocationMap projects={projects} />
        <FinancialSummary projects={projects} />
      </div>
      
      <AbsencesSummary absences={absences} />
    </div>
  );
};

export default DashboardWithData;
