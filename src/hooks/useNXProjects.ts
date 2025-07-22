import { useState, useEffect } from 'react';

export interface NXProject {
  name: string;
  requiredFirmware: string;
  projectUrl: string; // user/repo format
  version?: string;
  releaseDate?: string;
}

interface GitHubRelease {
  tag_name: string;
  published_at: string;
}

interface NXProjectsData {
  projects: Omit<NXProject, 'version' | 'releaseDate'>[];
}

// List of CORS proxies to use as fallbacks
const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://thingproxy.freeboard.io/fetch/',
  'https://corsproxy.io/?'
];

export const useNXProjects = () => {
  const [projects, setProjects] = useState<NXProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithProxy = async (url: string, proxyIndex: number = 0): Promise<Response> => {
    try {
      // Try direct request first
      if (proxyIndex === 0) {
        const response = await fetch(url);
        if (response.ok) {
          return response;
        }
        
        // Check if it's a rate limit error
        if (response.status === 403) {
          const errorData = await response.json().catch(() => ({}));
          if (errorData.message?.includes('rate limit')) {
            console.warn('Rate limit detected, trying proxy...');
            return fetchWithProxy(url, 1);
          }
        }
        
        return response;
      }
      
      // Use proxy if direct request failed
      if (proxyIndex <= PROXY_URLS.length) {
        const proxyUrl = PROXY_URLS[proxyIndex - 1] + encodeURIComponent(url);
        console.log(`Trying proxy ${proxyIndex}: ${PROXY_URLS[proxyIndex - 1]}`);
        
        const response = await fetch(proxyUrl);
        if (response.ok) {
          return response;
        }
        
        // Try next proxy
        if (proxyIndex < PROXY_URLS.length) {
          return fetchWithProxy(url, proxyIndex + 1);
        }
      }
      
      throw new Error('All proxies failed');
    } catch (err) {
      if (proxyIndex < PROXY_URLS.length) {
        console.warn(`Proxy ${proxyIndex} failed, trying next...`);
        return fetchWithProxy(url, proxyIndex + 1);
      }
      throw err;
    }
  };

  const fetchGitHubRelease = async (repo: string): Promise<{ version: string; releaseDate: string } | null> => {
    const startTime = performance.now();
    
    try {
      const url = `https://api.github.com/repos/${repo}/releases/latest`;
      const response = await fetchWithProxy(url);
      
      if (!response.ok) {
        const endTime = performance.now();
        const time = ((endTime - startTime) / 1000).toFixed(3);
        console.warn(`GitHub API returned ${response.status} for ${repo} (${time}s)`);
        return null;
      }
      
      const release: GitHubRelease = await response.json();
      const endTime = performance.now();
      const time = ((endTime - startTime) / 1000).toFixed(3);
      console.log(`${repo}: ${release.tag_name} (${time}s)`);
      
      return {
        version: release.tag_name,
        releaseDate: release.published_at.split('T')[0] // Get only the date part
      };
    } catch (err) {
      const endTime = performance.now();
      const time = ((endTime - startTime) / 1000).toFixed(3);
      console.warn(`Failed to fetch release for ${repo} (${time}s):`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const startTime = performance.now();
      console.log('Starting to fetch NX projects data...');
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/nx-projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch projects data');
        }
        
        const data: NXProjectsData = await response.json();
        console.log(`Loaded ${data.projects.length} projects from JSON`);
        
        // Fetch release data for each project
        console.log('Fetching GitHub release data for all projects...');
        const projectsWithReleases = await Promise.all(
          data.projects.map(async (project) => {
            const releaseData = await fetchGitHubRelease(project.projectUrl);
            return {
              ...project,
              version: releaseData?.version || 'N/A',
              releaseDate: releaseData?.releaseDate || 'N/A'
            };
          })
        );
        
        const endTime = performance.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log(`Successfully loaded all projects in ${totalTime} seconds`);
        console.log(`Projects loaded: ${projectsWithReleases.length}`);
        console.log(`Average time per project: ${(parseFloat(totalTime) / projectsWithReleases.length).toFixed(3)} seconds`);
        
        setProjects(projectsWithReleases);
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