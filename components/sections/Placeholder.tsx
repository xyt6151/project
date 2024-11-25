import { useState } from 'react';
import { ChartBarIcon, ArrowTrendingUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

interface Metric {
  id: number;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export default function Placeholder() {
  const [metrics] = useState<Metric[]>([
    { id: 1, name: 'Total Revenue', value: '$45,231', change: '+20.1%', trend: 'up' },
    { id: 2, name: 'Active Users', value: '2,345', change: '+15.3%', trend: 'up' },
    { id: 3, name: 'Conversion Rate', value: '3.2%', change: '-2.1%', trend: 'down' },
  ]);

  const [selectedMetric, setSelectedMetric] = useState<number>(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedMetric === metric.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white border-2 border-gray-100 hover:border-blue-200'
            }`}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {metric.id === 1 ? (
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
                ) : metric.id === 2 ? (
                  <ChartBarIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowTrendingUpIcon className="h-5 w-5 text-purple-500" />
                )}
                <span className="text-sm text-gray-500">{metric.name}</span>
              </div>
              <span
                className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
        <div className="h-[160px] bg-gray-50 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Chart visualization would go here</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => alert('Generating report...')}
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}