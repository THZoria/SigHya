/**
 * Interface representing a manga publication
 * Contains all relevant information about a manga release
 */
export interface Manga {
    /** Unique identifier for the manga */
    id: string;
    
    /** Name/title of the manga */
    nom_manga: string;
    
    /** Release date in DD/MM/YYYY format */
    date_sortie: string;
    
    /** Price of the manga (can include currency) */
    prix: string;
    
    /** Publisher name (null if not specified) */
    editeur: string | null;
    
    /** Purchase link URL (null if not available) */
    lien_acheter: string | null;
    
    /** URL or path to the manga cover image */
    image: string;
  }