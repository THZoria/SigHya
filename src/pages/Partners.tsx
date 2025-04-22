import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MessageSquare, Gamepad2, ChevronRight, MessageCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Partners = () => {
  const partners = [
    {
      name: "Sblerky",
      description: "Communauté dédiée au modding et à l'entraide",
      type: "Support Technique",
      badgeColor: "bg-emerald-500/10 text-emerald-400",
      icon: MessageSquare,
      image: "/partners/sblerky.jpg",
      links: [
        { label: "Discord", url: "https://discordapp.com/invite/c9HJVkbufc", icon: MessageCircle }
      ],
      features: [
        "Support technique",
        "Entraide communautaire",
        "Communauté active"
      ]
    },
    {
      name: "LS-Atelier",
      description: "Communauté spécialisée dans le modding",
      type: "Support Technique",
      badgeColor: "bg-emerald-500/10 text-emerald-400",
      icon: Gamepad2,
      image: "/partners/ls_atelier.jpg",
      links: [
        { label: "Discord", url: "https://discord.gg/ykn7xXvJrd", icon: MessageCircle }
      ],
      features: [
        "Support technique avancé",
        "Guides et tutoriels",
        "Communauté d'experts"
      ]
    },
    {
      name: "Homebrew France",
      description: "La référence française du homebrew et du modding",
      type: "Ressources & Documentation",
      badgeColor: "bg-purple-500/10 text-purple-400",
      icon: Globe,
      image: "/partners/homebrew_france.png",
      links: [
        { label: "Site Web", url: "https://homebrewfrance.fr", icon: Globe }
      ],
      features: [
        "Actualités homebrew",
        "Ressources techniques",
        "Documentation française"
      ]
    },
    {
      name: "Oxycore",
      description: "Communauté d'émulation et de préservation",
      type: "Émulation",
      badgeColor: "bg-amber-500/10 text-amber-400",
      icon: Gamepad2,
      image: "/partners/oxycore.png",
      links: [
        { label: "Discord", url: "https://discord.gg/oxycore-emulation-1015296412013035591", icon: MessageCircle }
      ],
      features: [
        "Émulation de consoles",
        "Préservation des jeux",
        "Support technique"
      ]
    },
    {
      name: "My Happy Ten Challenge",
      description: "Challenges et nostalgie du retrogaming",
      type: "Retrogaming",
      badgeColor: "bg-rose-500/10 text-rose-400",
      icon: Gamepad2,
      image: "/partners/happy_ten.jpg",    
      links: [
        { label: "Site Web", url: "http://retrogaming.charpenel.org/", icon: Globe }
      ],
      features: [
        "Challenges retrogaming",
        "Événements communautaires",
        "Partage de passion"
      ]
    },
    {
      name: "HizMod's",
      description: "Communauté de modding et d'entraide",
      type: "Support Technique",
      badgeColor: "bg-emerald-500/10 text-emerald-400",
      icon: MessageSquare,
      image: "/partners/hiz_mod.webp",
      links: [
        { label: "Discord", url: "https://discord.gg/2XwaXfBtDr", icon: MessageCircle }
      ],
      features: [
        "Support technique",
        "Guides de modding",
        "Communauté active"
      ]
    },
    {
      name: "Anth0 - Mig Switch",
      description: "Expertise en modding de Nintendo Switch",
      type: "Support Nintendo",
      badgeColor: "bg-red-500/10 text-red-400",
      icon: Gamepad2,
      image: "/partners/anth0_mig.png",
      links: [
        { label: "Discord", url: "https://discord.gg/2XwaXfBtDr", icon: MessageCircle }
      ],
      features: [
        "Spécialiste Switch",
        "Support technique",
        "Guides détaillés"
      ]
    },
    {
      name: "Akitatek",
      description: "Communauté technique et modding",
      type: "Support Technique",
      badgeColor: "bg-emerald-500/10 text-emerald-400",
      icon: MessageSquare,
      image: "/partners/akitatek.png",
      links: [
        { label: "Discord", url: "https://discord.gg/Kzjw8VAXMd", icon: MessageCircle }
      ],
      features: [
        "Support technique",
        "Entraide communautaire",
        "Ressources modding"
      ]
    },
    {
      name: "Game Boy - Jeux, Homebrew, Mods",
      type: "Retrogaming",
      badgeColor: "bg-rose-500/10 text-rose-400",
      icon: MessageSquare,
      image: "/partners/game_boy.png",
      links: [
        { label: "Discord", url: "https://discord.gg/8ZtjJaE6", icon: MessageCircle }
      ],
      features: [
        "Développement Homebrew",
        "Développement Mods",
        "Conception de jeux GB/GBA en physique"
      ]
    }
  ];

  const collaborations = [
    {
      title: "Projets Communautaires",
      description: "Développement de projets open source pour la communauté modding",
      icon: MessageSquare
    },
    {
      title: "Événements Partagés",
      description: "Organisation d'événements en collaboration avec nos partenaires",
      icon: MessageCircle
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-16"
          >
            <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text mb-6">
              Nos Partenaires
            </h1>
            <p className="text-lg sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez les partenaires qui nous accompagnent dans notre mission de 
              promouvoir le modding et la préservation des jeux vidéo.
            </p>
          </motion.div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-10 sm:mb-16">
            {partners.map((partner, index) => (
              <React.Fragment key={partner.name}>
                {/* Version Mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="sm:hidden bg-gray-800/80 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        {partner.image ? (
                          <img
                            src={partner.image}
                            alt={partner.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="p-3.5 bg-blue-500/10 rounded-lg">
                            <partner.icon className="w-8 h-8 text-blue-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {partner.name}
                          </h3>
                          <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${partner.badgeColor}`}>
                            {partner.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6">
                      {partner.description}
                    </p>
                    <ul className="space-y-4 mb-6">
                      {partner.features.map((feature) => (
                        <li key={feature} className="flex items-center text-gray-300 text-sm sm:text-base md:text-lg">
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-blue-500 rounded-full mr-2 sm:mr-3 md:mr-4" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {partner.links.map((link) => (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={link.label}
                        className="flex items-center justify-center w-full px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 bg-gray-700 text-gray-200 text-sm sm:text-base md:text-lg rounded-lg hover:bg-gray-600 transition-colors duration-300 font-medium"
                      >
                        <link.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-2.5 md:mr-3" />
                        {link.label}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Version Desktop */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hidden sm:block bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    {partner.image ? (
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="p-2.5 bg-blue-500/10 rounded-lg">
                        <partner.icon className="w-6 h-6 text-blue-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-col gap-2 mb-4">
                        <h3 className="text-lg font-bold text-white">
                          {partner.name}
                        </h3>
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${partner.badgeColor} self-start`}>
                          {partner.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-4">
                        {partner.description}
                      </p>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                          {partner.links.map((link) => (
                            <a
                              key={link.label}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1.5 bg-gray-700 text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-600 transition-all duration-300 group"
                            >
                              <link.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                              {link.label}
                              <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                            </a>
                          ))}
                        </div>
                        <ul className="space-y-2">
                          {partner.features.map((feature) => (
                            <li key={feature} className="flex items-center text-gray-300 text-sm">
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mr-1.5 sm:mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>

          {/* Collaborations Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-3xl font-bold text-white mb-4">
              Nos Collaborations
            </h2>
            <p className="text-lg text-gray-300">
              Découvrez les différentes façons dont nous collaborons avec nos partenaires
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {collaborations.map((collab, index) => (
              <motion.div
                key={collab.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-blue-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-500/10 rounded-lg">
                    <collab.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1.5">
                      {collab.title}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {collab.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Partners;
