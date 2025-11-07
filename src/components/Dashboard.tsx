import type { ReactNode } from 'react';
import './Dashboard.css';

interface DashboardProps {
  children: ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  return (
    <aside className="dashboard">
      {children}
    </aside>
  );
};

export default Dashboard;

