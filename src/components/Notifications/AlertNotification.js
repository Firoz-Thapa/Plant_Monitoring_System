import React from 'react';
import { Alert, AlertDescription } from '../ui/Alert';
import { Bell } from 'lucide-react';

const AlertNotification = ({ moisture }) => (
  <div className="space-y-4">
    {moisture < 30 && (
      <Alert className="animate-pulse bg-red-100 border-l-4 border-red-500">
        <AlertDescription className="flex items-center gap-2 text-red-700">
          <Bell className="text-red-500" /> Moisture level is low! Consider watering your plant.
        </AlertDescription>
      </Alert>
    )}
  </div>
);

export default AlertNotification;
