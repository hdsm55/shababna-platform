import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Events: React.FC = () => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - would come from API in real implementation
  const events = [
    {
      id: 1,
      title: 'Youth Leadership Summit 2024',
      description: 'A comprehensive summit bringing together young leaders from around the world to discuss leadership challenges and solutions.',
      date: new Date('2024-03-15'),
      location: 'Istanbul, Turkey',
      category: 'conference',
      attendees: 150,
      image: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg',
      price: 'Free',
    },
    {
      id: 2,
      title: 'Digital Marketing Workshop',
      description: 'Learn essential digital marketing skills including social media strategy, content creation, and analytics.',
      date: new Date('2024-02-20'),
      location: 'Dubai, UAE',
      category: 'workshop',
      attendees: 50,
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
      price: '$25',
    },
    {
      id: 3,
      title: 'Global Youth Networking Event',
      description: 'Connect with ambitious young professionals and entrepreneurs from diverse backgrounds and industries.',
      date: new Date('2024-02-28'),
      location: 'Riyadh, Saudi Arabia',
      category: 'networking',
      attendees: 100,
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      price: 'Free',
    },
    {
      id: 4,
      title: 'Entrepreneurship Bootcamp',
      description: 'Intensive 3-day bootcamp covering business fundamentals, startup strategies, and pitch development.',
      date: new Date('2024-03-10'),
      location: 'Ankara, Turkey',
      category: 'workshop',
      attendees: 30,
      image: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg',
      price: '$50',
    },
  ];

  const filters = [
    { key: 'all', label: t('events.filter.all') },
    { key: 'workshop', label: t('events.filter.workshop') },
    { key: 'conference', label: t('events.filter.conference') },
    { key: 'networking', label: t('events.filter.networking') },
  ];

  const filteredEvents = events.filter(event => {
    const matchesFilter = selectedFilter === 'all' || event.category === selectedFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {t('events.title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('events.subtitle')}
              </p>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedFilter === filter.key
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.category === 'workshop' ? 'bg-primary-100 text-primary-800' :
                        event.category === 'conference' ? 'bg-secondary-100 text-secondary-800' :
                        'bg-accent-100 text-accent-800'
                      }`}>
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">{event.price}</span>
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
                        {format(event.date, 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        {event.attendees} attendees
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button size="sm" className="flex-1">
                        {t('events.register')}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t('events.learnMore')}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;