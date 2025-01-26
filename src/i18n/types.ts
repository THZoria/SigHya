export type Language = 'en' | 'fr' | 'es';

export interface Translation {
  common: {
    loading: string;
    error: string;
    notFound: string;
  };
  nav: {
    home: string;
    nxChecker: string;
    nxDevice: string;
    ps5: string;
    partners: string;
    roadmap: string;
    manga: string;
    legal: string;
  };
  nxChecker: {
    title: string;
    subtitle: string;
    serialNumber: {
      label: string;
      placeholder: string;
    };
    help: {
      title: string;
      description: string;
    };
    button: string;
    results: {
      title: string;
      compatible: string;
      incompatible: string;
      mariko: string;
      oled: string;
      lite: string;
      unknown: string;
      indeterminate: string;
    };
  };
  nxDevice: {
    title: string;
    subtitle: string;
    warning: {
      local: string;
      noServer: string;
    };
    upload: {
      title: string;
      subtitle: string;
    };
    processing: string;
    success: string;
    fileInfo: {
      deviceId: string;
      fileSize: string;
      markers: string;
      start: string;
      end: string;
      rawData: string;
    };
    instructions: {
      title: string;
      selectFile: string;
      format: string;
      warning: string;
    };
  };
  ps5: {
    title: string;
    subtitle: string;
    search: {
      title: string;
      description: string;
      placeholder: string;
    };
    results: {
      found: string;
      found_plural: string;
      page: string;
      of: string;
      noResults: string;
      priority: {
        critical: string;
        high: string;
        medium: string;
        low: string;
      };
    };
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      joinDiscord: string;
      checkSwitch: string;
    };
    features: {
      title: string;
      subtitle: string;
      items: {
        community: {
          title: string;
          description: string;
        };
        expertise: {
          title: string;
          description: string;
        };
        projects: {
          title: string;
          description: string;
        };
        events: {
          title: string;
          description: string;
        };
      };
    };
  };
}