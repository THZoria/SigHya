import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Terminal, Wrench, Package } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useI18n } from '../i18n/context';

const Tools = () => {
  const { t } = useI18n();

  const tools = [
    {
      title: t('tools.items.nxChecker.title'),
      description: t('tools.items.nxChecker.description'),
      icon: Gamepad2,
      path: '/nxchecker',
      color: 'blue'
    },
    {
      title: t('tools.items.nxDevice.title'),
      description: t('tools.items.nxDevice.description'),
      icon: Terminal,
      path: '/nxdevice',
      color: 'green'
    },
    {
      title: t('tools.items.ps5.title'),
      description: t('tools.items.ps5.description'),
      icon: Wrench,
      path: '/ps5',
      color: 'purple'
    },
    {
      title: t('tools.items.nspForwarder.title'),
      description: t('tools.items.nspForwarder.description'),
      icon: Package,
      path: '/nsp-forwarder',
      color: 'purple'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-4 pb-2.5"
            >
              {t('tools.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              {t('tools.subtitle')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-${tool.color}-500/10`}>
                      <tool.icon className={`w-6 h-6 text-${tool.color}-400`} />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      {tool.title}
                    </h2>
                  </div>
                  
                  <p className="text-gray-300 mb-6 flex-grow">
                    {tool.description}
                  </p>

                  <Link
                    to={tool.path}
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-lg bg-${tool.color}-500/10 text-${tool.color}-400 hover:bg-${tool.color}-500/20 transition-colors duration-300`}
                  >
                    {t('tools.items.action')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Tools;