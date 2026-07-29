import { Calendar, Code, Cpu, ExternalLink, GitFork, Star, Tag } from 'lucide-react'
import type React from 'react'
import type { NXProject } from '../../hooks/useNXProjects'
import { useI18n } from '../../i18n/context'

interface NXProjectCardProps {
  project: NXProject
  index: number
}

const NXProjectCard: React.FC<NXProjectCardProps> = ({ project }) => {
  const { t } = useI18n()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const handleCardClick = () => {
    window.open(project.projectFullUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      className="group block bg-gray-800/90 backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-700/60 hover:border-blue-500/50 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)] transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:bg-gray-800"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors duration-200" />
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 mb-3">
        <img
          src={project.authorAvatar}
          alt={project.author}
          className="w-5 h-5 rounded-full"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <span className="text-xs text-gray-500">by {project.author}</span>
      </div>

      {/* Project Description */}
      {project.description && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          <span>{formatNumber(project.stars)}</span>
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="w-3 h-3" />
          <span>{formatNumber(project.forks)}</span>
        </div>
        {project.language && (
          <div className="flex items-center gap-1">
            <Code className="w-3 h-3" />
            <span>{project.language}</span>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="space-y-2">
        {/* Version */}
        <div className="flex items-center gap-2 text-sm">
          <Tag className="w-3 h-3 text-blue-400 flex-shrink-0" />
          <span className="text-gray-400">{t('nxProjects.projectCard.version')}</span>
          <span className="text-white font-medium ml-auto">{project.latestVersion}</span>
        </div>

        {/* Firmware */}
        <div className="flex items-center gap-2 text-sm">
          <Cpu className="w-3 h-3 text-green-400 flex-shrink-0" />
          <span className="text-gray-400">{t('nxProjects.projectCard.requiredFirmware')}</span>
          <span
            className={`font-medium ml-auto ${
              project.requiredFirmware === 'Non disponible' ? 'text-yellow-400' : 'text-white'
            }`}
          >
            {project.requiredFirmware}
          </span>
        </div>

        {/* Release Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-3 h-3 text-purple-400 flex-shrink-0" />
          <span className="text-gray-400">{t('nxProjects.projectCard.releaseDate')}</span>
          <span className="text-white font-medium ml-auto">
            {formatDate(project.latestReleaseDate)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default NXProjectCard
