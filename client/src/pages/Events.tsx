import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Filter, Search, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchEvents } from '../services/eventsApi';
import { Event } from '../types';

const Events: React.FC = () => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filters = [
    { key: 'all', label: t('events.filter.all') },
    { key: 'workshop', label: t('events.filter.workshop') },
    { key: 'conference', label: t('events.filter.conference') },
    { key: 'networking', label: t('events.filter.networking') },
  ];

  // Prepare query parameters
  const queryParams = {
    category: selectedFilter === 'all' ? undefined : selectedFilter,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 10,
    status: 'upcoming', // Only show upcoming events by default
  };

  // Fetch events using React Query
  const {
    data: eventsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => fetchEvents(queryParams),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const events = eventsData?.data?.items || [];
  const pagination = eventsData?.data?.pagination;

  // Handle filter changes
  const handleFilterChange = (filterKey: string) => {
    setSelectedFilter(filterKey);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workshop':
        return 'bg-primary-100 text-primary-800';
      case 'conference':
        return 'bg-secondary-100 text-secondary-800';
      case 'networking':
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  {t('events.title')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('events.subtitle')}
              </p>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleFilterChange(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedFilter === filter.key
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:border-primary-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: events.length.toString(),
                label: 'Total Events',
                icon: Calendar,
              },
              {
                number: events
                  .filter((e) => e.status === 'upcoming')
                  .length.toString(),
                label: 'Upcoming',
                icon: Clock,
              },
              {
                number: events
                  .filter((e) => e.status === 'active')
                  .length.toString(),
                label: 'Active',
                icon: Users,
              },
              {
                number: events
                  .filter((e) => e.status === 'completed')
                  .length.toString(),
                label: 'Completed',
                icon: Calendar,
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4 group-hover:bg-primary-200 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 font-medium mb-2">
                  {t('common.error.title')}
                </p>
                <p className="text-red-600 text-sm mb-4">
                  {error instanceof Error
                    ? error.message
                    : t('common.error.message')}
                </p>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  {t('common.retry')}
                </Button>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && !isError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event: Event, index: number) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      hover
                      className="overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={
                            event.image ||
                            'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg'
                          }
                          alt={event.title}
                          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                              event.category
                            )}`}
                          >
                            {event.category.charAt(0).toUpperCase() +
                              event.category.slice(1)}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status.charAt(0).toUpperCase() +
                              event.status.slice(1)}
                          </span>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {format(new Date(event.start_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {format(new Date(event.start_date), 'HH:mm')} -{' '}
                            {format(new Date(event.end_date), 'HH:mm')}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {event.location}
                          </div>
                          {event.max_attendees && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                              {event.attendees}/{event.max_attendees} attendees
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button
                            size="sm"
                            className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                            disabled={
                              event.status === 'cancelled' ||
                              event.status === 'completed'
                            }
                            onClick={() => {
                              // TODO: Implement event registration
                              console.log('Register for event:', event.id);
                            }}
                          >
                            {event.status === 'cancelled'
                              ? 'Cancelled'
                              : event.status === 'completed'
                              ? 'Completed'
                              : t('events.register')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                            onClick={() => {
                              // TODO: Navigate to event details page
                              console.log('View event details:', event.id);
                            }}
                          >
                            {t('events.learnMore')}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {events.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm || selectedFilter !== 'all'
                      ? 'No events found matching your criteria.'
                      : 'No events available at the moment.'}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Join Our Events?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Don't miss out on amazing opportunities to learn, grow, and
              connect with like-minded youth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                icon={Calendar}
                className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                View All Events
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Get Notifications
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Events;
