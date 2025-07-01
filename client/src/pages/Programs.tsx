import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Target,
  Users,
  Clock,
  ArrowRight,
  Heart,
  HandHeart,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Programs: React.FC = () => {
  const { t } = useTranslation();

  // Programs data - will be fetched from API
  const programs = [
    {
      id: 1,
      title: 'Future Leaders Initiative',
      description:
        'A comprehensive 6-month program designed to develop leadership skills, strategic thinking, and project management capabilities among young professionals.',
      duration: '6 months',
      participants: 50,
      category: 'Leadership',
      image:
        'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
      goals: [
        'Develop advanced leadership skills',
        'Build strategic thinking capabilities',
        'Create impactful community projects',
        'Network with global leaders',
      ],
      impact: 'Over 500 graduates leading initiatives worldwide',
    },
    {
      id: 2,
      title: 'Digital Innovation Academy',
      description:
        'An intensive program focusing on emerging technologies, digital transformation, and innovation management for the next generation of tech leaders.',
      duration: '4 months',
      participants: 30,
      category: 'Technology',
      image:
        'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
      goals: [
        'Master emerging technologies',
        'Develop innovative solutions',
        'Build tech startups',
        'Connect with industry experts',
      ],
      impact: '12 successful startups launched by alumni',
    },
    {
      id: 3,
      title: 'Global Citizenship Program',
      description:
        'A transformative program that develops cultural competency, global awareness, and social responsibility among young changemakers.',
      duration: '8 months',
      participants: 40,
      category: 'Social Impact',
      image:
        'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      goals: [
        'Develop cultural competency',
        'Build global networks',
        'Create social impact projects',
        'Promote international cooperation',
      ],
      impact: 'Programs active in 25+ countries',
    },
    {
      id: 4,
      title: 'Entrepreneurship Accelerator',
      description:
        'A fast-track program for young entrepreneurs to develop business skills, validate ideas, and launch successful ventures.',
      duration: '3 months',
      participants: 25,
      category: 'Business',
      image:
        'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg',
      goals: [
        'Validate business ideas',
        'Develop MVP products',
        'Secure funding',
        'Scale operations',
      ],
      impact: '$2M+ in funding raised by participants',
    },
  ];

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
                {t('programs.title')}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('programs.subtitle')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden h-full">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 rounded-full">
                        {program.category}
                      </span>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                          {program.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" />
                          {program.participants}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {program.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {program.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Program Goals
                      </h4>
                      <ul className="space-y-2">
                        {program.goals.map((goal, goalIndex) => (
                          <li
                            key={goalIndex}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <Target className="w-4 h-4 text-primary-600 mr-2 rtl:ml-2 rtl:mr-0 flex-shrink-0" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Impact
                      </h4>
                      <p className="text-sm text-gray-600">{program.impact}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        size="sm"
                        icon={ArrowRight}
                        iconPosition="right"
                        className="flex-1"
                      >
                        {t('programs.support')}
                      </Button>
                      <Button variant="outline" size="sm" icon={Heart}>
                        {t('programs.donate')}
                      </Button>
                      <Button variant="ghost" size="sm" icon={HandHeart}>
                        {t('programs.sponsor')}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Support Youth Development?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Your support helps us create more opportunities for young leaders
              to make a positive impact in their communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" icon={Heart}>
                Make a Donation
              </Button>
              <Button variant="outline" size="lg" icon={HandHeart}>
                Become a Sponsor
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
