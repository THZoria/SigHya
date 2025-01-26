import { Home, Gamepad2, Terminal, Users, RocketIcon, BookOpen, Scale } from 'lucide-react';

interface NavItem {
  path: string;
  key: string;
  icon: typeof Home;
}

// Pages principales du site
export const mainNavItems = [
  { path: '/', key: 'home', icon: Home },
  { path: '/nxchecker', key: 'nxChecker', icon: Gamepad2 },
  { path: '/nxdevice', key: 'nxDevice', icon: Terminal },
  { path: '/ps5', key: 'ps5', icon: Terminal },
  { path: '/partners', key: 'partners', icon: Users },
];

// Pages secondaires
export const secondaryNavItems = [
  { path: '/roadmap', key: 'roadmap', icon: RocketIcon },
  { path: '/planning', key: 'manga', icon: BookOpen },
  { path: '/legal', key: 'legal', icon: Scale },
];