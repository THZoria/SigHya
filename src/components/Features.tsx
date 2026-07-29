import { motion } from 'framer-motion';
import { Users, Wrench, MessageSquare, Rocket } from 'lucide-react';
import { useI18n } from '../i18n/context';

/**
 * Features component - Displays key features and capabilities of the platform
 * Shows community, expertise, projects, and events sections with animations
 */
const Features = () => {
  const { t } = useI18n();

  // Feature items configuration with icons and translations
  const features = [
    {
      name: t('home.features.items.community.title'),
      description: t('home.features.items.community.description'),
      icon: Users,
    },
    {
      name: t('home.features.items.expertise.title'),
      description: t('home.features.items.expertise.description'),
      icon: Wrench,
    },
    {
      name: t('home.features.items.projects.title'),
      description: t('home.features.items.projects.description'),
      icon: Rocket,
    },
    {
      name: t('home.features.items.events.title'),
      description: t('home.features.items.events.description'),
      icon: MessageSquare,
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
            {t('home.features.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-200">
            {t('home.features.subtitle')}
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
                  {/* Feature icon with hover animation */}
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-flex items-center justify-center p-3 bg-blue-600/20 rounded-xl mb-6 group-hover:bg-blue-600/30"
                  >
                    <feature.icon className="h-7 w-7 text-blue-400" aria-hidden="true" />
                  </motion.div>
                  
                  {/* Feature title */}
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {feature.name}
                  </h3>
                  
                  {/* Feature description */}
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
