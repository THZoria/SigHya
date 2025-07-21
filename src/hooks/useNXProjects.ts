import { useState, useEffect } from 'react';

export interface NXProject {
  name: string;
  version: string;
  requiredFirmware: string;
  releaseDate: string;
  projectUrl: string;
}

interface NXProjectsData {
  projects: NXProject[];
}

export const useNXProjects = () => {
  const [projects, setProjects] = useState<NXProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/nx-projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch projects data');
        }
        
        const data: NXProjectsData = await response.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while loading projects');
        console.error('Error loading NX projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}; 