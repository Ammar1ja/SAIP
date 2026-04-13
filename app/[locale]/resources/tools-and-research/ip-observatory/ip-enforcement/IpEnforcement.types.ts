export interface IpEnforcementTabProps {
  id: string;
  title: string;
  description: string;
  statistics: Array<{
    label: string;
    value: string;
    trend: {
      value: string;
      direction: 'up' | 'down';
      description: string;
    };
  }>;
}
