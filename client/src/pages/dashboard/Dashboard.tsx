import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Users, DollarSign, TrendingUp, Plus, BarChart3 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const stats = [
    {
      title: t('dashboard.stats.events'),
      value: '24',
      change: '+12%',
      icon: Calendar,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      changeColor: 'text-green-600',
    },
    {
      title: t('dashboard.stats.programs'),
      value: '8',
      change: '+2',
      icon: BarChart3,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50',
      changeColor: 'text-green-600',
    },
    {
      title: t('dashboard.stats.members'),
      value: '1,247',
      change: '+18%',
      icon: Users,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      changeColor: 'text-green-600',
    },
    {
      title: t('dashboard.stats.donations'),
      value: '$15,420',
      change: '+25%',
      icon: DollarSign,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      changeColor: 'text-green-600',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'event',
      title: 'Youth Leadership Summit registered 25 new participants',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'program',
      title: 'Digital Innovation Academy program launched',
      time: '5 hours ago',
      status: 'info',
    },
    {
      id: 3,
      type: 'donation',
      title: 'New donation of $500 received',
      time: '1 day ago',
      status: 'success',
    },
    {
      id: 4,
      type: 'member',
      title: '12 new members joined this week',
      time: '2 days ago',
      status: 'info',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Youth Leadership Summit 2024',
      date: 'March 15, 2024',
      attendees: 150,
      status: 'confirmed',
    },
    {
      id: 2,
      title: 'Digital Marketing Workshop',
      date: 'February 20, 2024',
      attendees: 50,
      status: 'pending',
    },
    {
      id: 3,
      title: 'Global Youth Networking Event',
      date: 'February 28, 2024',
      attendees: 100,
      status: 'confirmed',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-600 mt-2">
              {t('dashboard.welcome')}, {user?.firstName}!
            </p>
          </div>
          <Button icon={Plus}>
            Add New Event
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className={`text-sm ${stat.changeColor} flex items-center mt-1`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Activities
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.date}</p>
                      <p className="text-xs text-gray-500">{event.attendees} attendees</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;