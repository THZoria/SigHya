import React from 'react';

const Partners = () => {
  return (
    <div className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-12">
          Nos partenariats
        </h2>
        
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Hacktuality */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">
              Partenariat avec l'équipe Hacktuality
            </h3>
            <p className="text-gray-300">
              Nous sommes fiers de travailler en partenariat avec l'équipe Hacktuality, 
              un site d'actualité sur le modding de console. Visitez leur site pour 
              les dernières nouvelles et mises à jour dans le monde du modding!
            </p>
          </div>

          {/* My Happy Ten Challenge */}
          <div className="bg-gray-900 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">
              Partenaire My Happy Ten Challenge
            </h3>
            <p className="text-gray-300">
              My Happy Ten Challenge est un serveur Discord basé sur la nostalgie 
              des anciens jeux et dont l'objectif est de créer une communauté pour 
              y réaliser des challenges pour rejouer à ces jeux. Nous vous invitons 
              à aller sur leur site pour voir les challenges en cours ainsi qu'à 
              rejoindre leur Discord.
            </p>
          </div>
        </div>

        {/* Activités */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            Nos activités
          </h3>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <li className="bg-gray-900 rounded-lg p-6 text-gray-300">
              Entraide sur le modding
            </li>
            <li className="bg-gray-900 rounded-lg p-6 text-gray-300">
              Actualités sur le modding
            </li>
            <li className="bg-gray-900 rounded-lg p-6 text-gray-300">
              Proposer des débats sur Discord et Youtube sur le modding et l'informatique en général
            </li>
            <li className="bg-gray-900 rounded-lg p-6 text-gray-300">
              Réaliser des projets communautaire sur le modding
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Partners;