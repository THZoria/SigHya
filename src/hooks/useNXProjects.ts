import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [projects, setProjects] = useState<NXProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<NXProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(searchParams.get('lang') || '');
  const [selectedFirmware, setSelectedFirmware] = useState<string>(searchParams.get('fw') || '');
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'stars');
  const [sortDirection, setSortDirection] = useState<SortDirection>((searchParams.get('order') as SortDirection) || 'desc');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('perPage') || '12'));

  const languages = [...new Set(projects.map(p => p.language).filter(Boolean))].sort();
  const firmwareVersions = [...new Set(projects.map(p => p.requiredFirmware))].sort();

  const updateURLParams = (updates: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams);
    let hasChanges = false;
    
    Object.entries(updates).forEach(([key, value]) => {
      const currentValue = newParams.get(key);
      const newValue = value === '' || value === 0 || value === '1' ? null : value.toString();
      
      if (currentValue !== newValue) {
        hasChanges = true;
        if (newValue === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, newValue);
        }
      }
    });
    
    if (hasChanges) {
      setSearchParams(newParams, { replace: true });
    }
  };

  // Use replaceState instead of setSearchParams to update URL without triggering re-render
  // This prevents infinite loops when URL changes would cause state updates that change URL again
  const setSearchTermWithURL = (term: string) => {
    if (searchTerm !== term) {
      setSearchTerm(term);
      
      const url = new URL(window.location.href);
      if (term.trim()) {
        url.searchParams.set('q', term);
      } else {
        url.searchParams.delete('q');
      }
      url.searchParams.delete('page');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const setSelectedLanguageWithURL = (lang: string) => {
    if (selectedLanguage !== lang) {
      setSelectedLanguage(lang);
      updateURLParams({ lang, page: 1 });
    }
  };

  const setSelectedFirmwareWithURL = (fw: string) => {
    if (selectedFirmware !== fw) {
      setSelectedFirmware(fw);
      updateURLParams({ fw, page: 1 });
    }
  };

  const setSortByWithURL = (sort: SortOption) => {
    if (sortBy !== sort) {
      setSortBy(sort);
      updateURLParams({ sort });
    }
  };

  const setSortDirectionWithURL = (order: SortDirection) => {
    if (sortDirection !== order) {
      setSortDirection(order);
      updateURLParams({ order });
    }
  };

  const setCurrentPageWithURL = (page: number) => {
    if (currentPage !== page) {
      setCurrentPage(page);
      updateURLParams({ page });
    }
  };

  const setItemsPerPageWithURL = (perPage: number) => {
    if (itemsPerPage !== perPage) {
      setItemsPerPage(perPage);
      updateURLParams({ perPage, page: 1 });
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('');
    setSelectedFirmware('');
    setCurrentPage(1);
    setSortBy('stars');
    setSortDirection('desc');
    setItemsPerPage(12);
    
    setSearchParams({}, { replace: true });
  };

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = itemsPerPage === -1 ? filteredProjects.length : startIndex + itemsPerPage;
  const paginatedProjects = itemsPerPage === -1 ? filteredProjects : filteredProjects.slice(startIndex, endIndex);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm.trim()) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.language.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(project => project.language === selectedLanguage);
    }

    if (selectedFirmware) {
      filtered = filtered.filter(project => project.requiredFirmware === selectedFirmware);
    }
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
    const hasFilterChanges = searchTerm || selectedLanguage || selectedFirmware;
    if (hasFilterChanges && currentPage !== 1) {
      setCurrentPage(1);
      const url = new URL(window.location.href);
      url.searchParams.set('page', '1');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchTerm, selectedLanguage, selectedFirmware]);

  useEffect(() => {
    const fetchProjects = async () => {
      const startTime = performance.now();
      console.log('Starting to fetch NX projects data from nxhub.pw/data/projects.json...');
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://nxhub.pw/data/projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch projects data from nxhub.pw/data/projects.json');
        }
        
        const data: NXHubResponse = await response.json();
        console.log(`Loaded ${data.projects.length} projects from nxhub.pw/data/projects.json`);
        
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
    projects: paginatedProjects,
    allProjects: filteredProjects,
    loading,
    error,
    searchTerm,
    setSearchTerm: setSearchTermWithURL,
    totalProjects: projects.length,
    selectedLanguage,
    setSelectedLanguage: setSelectedLanguageWithURL,
    selectedFirmware,
    setSelectedFirmware: setSelectedFirmwareWithURL,
    sortBy,
    setSortBy: setSortByWithURL,
    sortDirection,
    setSortDirection: setSortDirectionWithURL,
    languages,
    firmwareVersions,
    currentPage,
    setCurrentPage: setCurrentPageWithURL,
    totalPages,
    itemsPerPage,
    setItemsPerPage: setItemsPerPageWithURL,
    startIndex: itemsPerPage === -1 ? 1 : startIndex + 1,
    endIndex: itemsPerPage === -1 ? filteredProjects.length : Math.min(endIndex, filteredProjects.length),
    clearAllFilters
  };
}; 