export interface Manga {
    id: string;
    nom_manga: string;
    date_sortie: string;
    prix: string;
    editeur: string | null;
    lien_acheter: string | null;
    image: string;
  }