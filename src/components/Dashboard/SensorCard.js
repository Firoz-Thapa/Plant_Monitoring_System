import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const SensorCard = ({ title, icon, value, status }) => {
  const statusColors = {
    Low: 'text-red-500',
    Optimal: 'text-green-500',
    High: 'text-blue-500'
  };

  return (
    <Card className="transition-transform transform hover:scale-105 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg font-medium text-gray-700">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-semibold ${statusColors[status] || ''}`}>
          {value}
        </div>
        {status && <div className="text-md mt-2 text-gray-600">Status: <span className={statusColors[status]}>{status}</span></div>}
      </CardContent>
    </Card>
  );
};

export default SensorCard;
