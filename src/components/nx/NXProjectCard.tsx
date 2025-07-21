import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { NXProject } from '../../hooks/useNXProjects';
import { useI18n } from '../../i18n/context';

interface NXProjectCardProps {
  project: NXProject;
  index: number;
}

const NXProjectCard: React.FC<NXProjectCardProps> = ({ project, index }) => {
  const { t } = useI18n();
  return (
    <motion.a
      href={project.projectUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="block bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 cursor-pointer"
    >
      {/* Project Name */}
      <h3 className="text-xl font-bold text-blue-400 mb-4">
        {project.name}
      </h3>

      {/* Project Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">{t('nxProjects.projectCard.version')}</span>
          <span className="text-white font-medium">{project.version}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">{t('nxProjects.projectCard.requiredFirmware')}</span>
          <span className={`font-medium ${
            project.requiredFirmware === "Non disponible" 
              ? "text-yellow-400" 
              : "text-white"
          }`}>
            {project.requiredFirmware}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">{t('nxProjects.projectCard.releaseDate')}</span>
          <span className="text-white font-medium">
            {new Date(project.releaseDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* External Link Indicator */}
      <div className="flex items-center justify-center gap-2 text-blue-400 text-sm mt-4">
        <ExternalLink className="w-4 h-4" />
        {t('nxProjects.projectCard.viewProject')}
      </div>
    </motion.a>
  );
};

export default NXProjectCard; 