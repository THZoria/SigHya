import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Tag, Cpu } from 'lucide-react';
import { NXProject } from '../../hooks/useNXProjects';
import { useI18n } from '../../i18n/context';

interface NXProjectCardProps {
  project: NXProject;
  index: number;
}

const NXProjectCard: React.FC<NXProjectCardProps> = ({ project, index }) => {
  const { t } = useI18n();
  
  // Build GitHub URL from user/repo format
  const githubUrl = `https://github.com/${project.projectUrl}`;
  
  return (
    <motion.a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="group block bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-700/60 hover:border-blue-500/40 hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">
          {project.name}
        </h3>
        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
      </div>

      {/* Author */}
      {project.author && (
        <div className="flex items-center gap-2 mb-3">
          <img 
            src={project.author.avatar} 
            alt={project.author.name}
            className="w-5 h-5 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-xs text-gray-500">
            by {project.author.name}
          </span>
        </div>
      )}

      {/* Project Description */}
      {project.description && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>
      )}

      {/* Project Details */}
      <div className="space-y-2">
        {/* Version */}
        <div className="flex items-center gap-2 text-sm">
          <Tag className="w-3 h-3 text-blue-400 flex-shrink-0" />
          <span className="text-gray-400">{t('nxProjects.projectCard.version')}</span>
          <span className="text-white font-medium ml-auto">
            {project.version && project.version !== 'N/A' ? project.version : 'Loading...'}
          </span>
        </div>
        
        {/* Firmware */}
        <div className="flex items-center gap-2 text-sm">
          <Cpu className="w-3 h-3 text-green-400 flex-shrink-0" />
          <span className="text-gray-400">{t('nxProjects.projectCard.requiredFirmware')}</span>
          <span className={`font-medium ml-auto ${
            project.requiredFirmware === "Non disponible" 
              ? "text-yellow-400" 
              : "text-white"
          }`}>
            {project.requiredFirmware}
          </span>
        </div>

        {/* Release Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-3 h-3 text-purple-400 flex-shrink-0" />
          <span className="text-gray-400">{t('nxProjects.projectCard.releaseDate')}</span>
          <span className="text-white font-medium ml-auto">
            {project.releaseDate && project.releaseDate !== 'N/A' 
              ? new Date(project.releaseDate).toLocaleDateString()
              : 'Loading...'
            }
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export default NXProjectCard; 