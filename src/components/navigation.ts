import { Home, Gamepad2, Users, RocketIcon, BookOpen, Scale, Package } from 'lucide-react';

interface NavItem {
  path: string;
  key: string;
  icon: typeof Home;
}

export const mainNavItems: NavItem[] = [
  { path: '/', key: 'home', icon: Home },
  { path: '/tools', key: 'tools', icon: Gamepad2 },
  { path: '/partners', key: 'partners', icon: Users },
];

export const secondaryNavItems: NavItem[] = [
  { path: '/roadmap', key: 'roadmap', icon: RocketIcon },
  { path: '/planning', key: 'manga', icon: BookOpen },
  { path: '/nx-projects', key: 'nxProjects', icon: Package },
  { path: '/legal', key: 'legal', icon: Scale },
];