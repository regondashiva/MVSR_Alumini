import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  UserIcon,
  ChartBarIcon
} from '@heroicons/react/outline';

const UserStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserStatistics();
  }, []);

  const fetchUserStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/users/statistics');
      const data = await response.json();
      
      if (data.success) {
        setStatistics(data.data);
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mvsr-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading user statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Statistics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserStatistics}
            className="px-4 py-2 bg-mvsr-600 text-white rounded-lg hover:bg-mvsr-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const roleData = [
    {
      name: 'Admin',
      count: statistics?.byRole?.admin || 0,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700'
    },
    {
      name: 'Alumni',
      count: statistics?.byRole?.alumni || 0,
      icon: BriefcaseIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      name: 'Students',
      count: statistics?.byRole?.student || 0,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      name: 'Faculty',
      count: statistics?.byRole?.faculty || 0,
      icon: UsersIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700'
    }
  ];

  const statsCards = [
    {
      name: 'Total Users',
      value: statistics?.totalUsers || 0,
      icon: UsersIcon,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-700'
    },
    {
      name: 'Verified Users',
      value: statistics?.verifiedUsers || 0,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      name: 'Active Users',
      value: statistics?.activeUsers || 0,
      icon: UserIcon,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <ChartBarIcon className="h-8 w-8 mr-3 text-mvsr-600" />
                User Statistics
              </h1>
              <p className="text-gray-600 mt-1">Overview of all users in the system</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Users by Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleData.map((role, index) => {
              const Icon = role.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`p-4 rounded-lg ${role.bgColor} mb-4`}>
                    <Icon className={`h-8 w-8 ${role.textColor} mx-auto`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{role.count}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${role.color} h-2 rounded-full`}
                        style={{ width: `${statistics?.totalUsers ? (role.count / statistics.totalUsers) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {statistics?.totalUsers ? Math.round((role.count / statistics.totalUsers) * 100) : 0}% of total
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {roleData.map((role, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${role.bgColor} mr-3`}>
                          <role.icon className={`h-4 w-4 ${role.textColor}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{role.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{role.count}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {statistics?.totalUsers ? Math.round((role.count / statistics.totalUsers) * 100) : 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        role.count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {role.count > 0 ? 'Active' : 'Empty'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
