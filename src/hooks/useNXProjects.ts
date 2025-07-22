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

interface GitHubRelease {
  tag_name: string;
  published_at: string;
}

interface GitHubRepo {
  description: string;
  homepage?: string;
  topics?: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface NXProjectsData {
  projects: Omit<NXProject, 'version' | 'releaseDate' | 'description' | 'author'>[];
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

  const fetchGitHubData = async (repo: string): Promise<{ 
    version: string; 
    releaseDate: string; 
    description: string;
    author: { name: string; avatar: string };
  } | null> => {
    const startTime = performance.now();
    
    try {
      // Fetch both release and repo data concurrently
      const [releaseResponse, repoResponse] = await Promise.all([
        fetchWithProxy(`https://api.github.com/repos/${repo}/releases/latest`),
        fetchWithProxy(`https://api.github.com/repos/${repo}`)
      ]);
      
      let releaseData: GitHubRelease | null = null;
      let repoData: GitHubRepo | null = null;
      
      // Parse release data
      if (releaseResponse.ok) {
        releaseData = await releaseResponse.json();
      }
      
      // Parse repo data
      if (repoResponse.ok) {
        repoData = await repoResponse.json();
      }
      
      const endTime = performance.now();
      const time = ((endTime - startTime) / 1000).toFixed(3);
      
      if (releaseData) {
        console.log(`${repo}: ${releaseData.tag_name} (${time}s)`);
      } else {
        console.warn(`No release data for ${repo} (${time}s)`);
      }
      
      return {
        version: releaseData?.tag_name || 'N/A',
        releaseDate: releaseData?.published_at?.split('T')[0] || 'N/A',
        description: repoData?.description || 'No description available',
        author: {
          name: repoData?.owner?.login || 'Unknown',
          avatar: repoData?.owner?.avatar_url || ''
        }
      };
    } catch (err) {
      const endTime = performance.now();
      const time = ((endTime - startTime) / 1000).toFixed(3);
      console.warn(`Failed to fetch data for ${repo} (${time}s):`, err);
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
        
        // Fetch GitHub data for each project
        console.log('Fetching GitHub data for all projects...');
        const projectsWithData = await Promise.all(
          data.projects.map(async (project) => {
            const githubData = await fetchGitHubData(project.projectUrl);
            return {
              ...project,
              version: githubData?.version || 'N/A',
              releaseDate: githubData?.releaseDate || 'N/A',
              description: githubData?.description || 'No description available',
              author: githubData?.author || { name: 'Unknown', avatar: '' }
            };
          })
        );
        
        const endTime = performance.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log(`Successfully loaded all projects in ${totalTime} seconds`);
        console.log(`Projects loaded: ${projectsWithData.length}`);
        console.log(`Average time per project: ${(parseFloat(totalTime) / projectsWithData.length).toFixed(3)} seconds`);
        
        setProjects(projectsWithData);
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