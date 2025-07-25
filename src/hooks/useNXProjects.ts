import { useState, useEffect } from 'react';

export interface NXProject {
  name: string;
  requiredFirmware: string;
  projectUrl: string; // user/repo format
  version?: string;
  releaseDate?: string;
  description?: string;
  author?: {
    name: string;
    avatar: string;
  };
}

interface NXHubProject {
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
  projects: NXHubProject[];
}

export const useNXProjects = () => {
  const [projects, setProjects] = useState<NXProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        // Transform nxhub data to our format
        const transformedProjects: NXProject[] = data.projects.map((project) => ({
          name: project.name,
          requiredFirmware: project.requiredFirmware,
          projectUrl: project.projectUrl,
          version: project.latestVersion,
          releaseDate: project.latestReleaseDate.split('T')[0], // Get only the date part
          description: project.description,
          author: {
            name: project.author,
            avatar: project.authorAvatar
          }
        }));
        
        const endTime = performance.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log(`Successfully loaded all projects in ${totalTime} seconds`);
        console.log(`Projects loaded: ${transformedProjects.length}`);
        console.log(`Average time per project: ${(parseFloat(totalTime) / transformedProjects.length).toFixed(3)} seconds`);
        
        setProjects(transformedProjects);
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

  return { projects, loading, error };
}; 