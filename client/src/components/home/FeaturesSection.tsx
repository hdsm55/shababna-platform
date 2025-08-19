import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  Lightbulb,
  Globe,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../ui/Card/Card';
import { Button } from '../ui/Button/ButtonSimple';

// تحسين الأداء باستخدام memo
const FeatureCard = memo(
  ({ feature, index }: { feature: any; index: number }) => {
    const navigate = useNavigate();

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      },
    };

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="h-full"
      >
        <Card
          variant="elevated"
          className="h-full p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-200 border-0 shadow-md hover:shadow-lg"
        >
          <div
            className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}
          >
            <feature.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-dark-500 mb-3">
            {feature.title}
          </h3>
          <p className="text-dark-600 mb-4 leading-relaxed text-sm">
            {feature.description}
          </p>
          <ul className="space-y-2 mb-4">
            {feature.features.map((item: string, idx: number) => (
              <li
                key={idx}
                className="flex items-center justify-center gap-2 text-xs text-dark-600"
              >
                <CheckCircle className="w-3 h-3 text-primary-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full py-2 text-xs font-semibold border-2 border-dark-300 hover:bg-dark-50 text-dark-700"
            onClick={() => navigate('/programs')}
          >
            اعرف المزيد
            <ArrowRight className="w-3 h-3 mr-1" />
          </Button>
        </Card>
      </motion.div>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: HeartHandshake,
      title: 'مجتمع عالمي',
      description:
        'تواصل مع شباب من مختلف الدول الإسلامية في بيئة داعمة ومحفزة للتطوير',
      features: ['شباب من 18 دولة', 'دعم مستمر', 'تواصل فعال'],
      gradient: 'from-secondary-600 to-secondary-700',
    },
    {
      icon: Lightbulb,
      title: 'برامج تطويرية',
      description: 'برامج متقدمة لبناء الشخصية والقيادة والتأثير المجتمعي الإيجابي',
      features: ['برامج قيادية', 'تطوير المهارات', 'نجاح مستدام'],
      gradient: 'from-primary-600 to-primary-700',
    },
    {
      icon: Globe,
      title: 'فعاليات تفاعلية',
      description:
        'لقاءات وورش عمل تفاعلية لتعزيز المعرفة ومهارات القيادة للشباب المسلم',
      features: ['فعاليات دورية', 'ورش تفاعلية', 'شبكات مهنية'],
      gradient: 'from-accent-600 to-accent-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/20 to-secondary-50/20" />
      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark-500 mb-4">
            ماذا نقدم
          </h2>
          <p className="text-base md:text-lg text-dark-600 max-w-3xl mx-auto leading-relaxed">
            برامج وفعاليات شبابية إسلامية مصرية مصممة لبناء قادة المستقبل
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
