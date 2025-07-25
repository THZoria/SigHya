import { useState, useEffect } from 'react';

export interface NXProject {
  name: string;
  author: string;
  authorAvatar: string;
  authorUrl: string;
  projectUrl: string;
  projectFullUrl: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  createdAt: string;
  latestVersion: string;
  latestReleaseUrl: string;
  latestReleaseDate: string;
  requiredFirmware: string;
}

interface NXHubResponse {
  projects: NXProject[];
}

export type SortOption = 'name' | 'author' | 'stars' | 'forks' | 'latestReleaseDate' | 'lastUpdated';
export type SortDirection = 'asc' | 'desc';

export const useNXProjects = () => {
  const [projects, setProjects] = useState<NXProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<NXProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedFirmware, setSelectedFirmware] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('stars');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Get unique languages and firmware versions
  const languages = [...new Set(projects.map(p => p.language).filter(Boolean))].sort();
  const firmwareVersions = [...new Set(projects.map(p => p.requiredFirmware))].sort();

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.language.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply language filter
    if (selectedLanguage) {
      filtered = filtered.filter(project => project.language === selectedLanguage);
    }

    // Apply firmware filter
    if (selectedFirmware) {
      filtered = filtered.filter(project => project.requiredFirmware === selectedFirmware);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'stars':
          aValue = Number(a.stars);
          bValue = Number(b.stars);
          break;
        case 'forks':
          aValue = Number(a.forks);
          bValue = Number(b.forks);
          break;
        case 'latestReleaseDate':
          aValue = new Date(a.latestReleaseDate);
          bValue = new Date(b.latestReleaseDate);
          break;
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        default:
          aValue = a.stars;
          bValue = b.stars;
      }

      // For ascending: a < b returns -1, a > b returns 1
      // For descending: a < b returns 1, a > b returns -1
      if (aValue < bValue) {
        return sortDirection === 'desc' ? 1 : -1;
      }
      if (aValue > bValue) {
        return sortDirection === 'desc' ? -1 : 1;
      }
      return 0;
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedLanguage, selectedFirmware, sortBy, sortDirection]);

  useEffect(() => {
    const fetchProjects = async () => {
      const startTime = performance.now();
      console.log('Starting to fetch NX projects data from nxhub.pw...');
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://nxhub.pw/output/projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch projects data from nxhub.pw');
        }
        
        const data: NXHubResponse = await response.json();
        console.log(`Loaded ${data.projects.length} projects from nxhub.pw`);
        
        const endTime = performance.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log(`Successfully loaded all projects in ${totalTime} seconds`);
        console.log(`Projects loaded: ${data.projects.length}`);
        console.log(`Average time per project: ${(parseFloat(totalTime) / data.projects.length).toFixed(3)} seconds`);
        
        setProjects(data.projects);
      } catch (err) {
        const endTime = performance.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        console.error(`Error loading NX projects after ${totalTime} seconds:`, err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { 
    projects: filteredProjects, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm,
    totalProjects: projects.length,
    selectedLanguage,
    setSelectedLanguage,
    selectedFirmware,
    setSelectedFirmware,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    languages,
    firmwareVersions
  };
}; 