import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const SensorGraph = ({ data }) => (
  <Card className="bg-white rounded-lg shadow-md">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-700">Moisture History</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="moisture" stroke="#2563eb" name="Moisture (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default SensorGraph;
