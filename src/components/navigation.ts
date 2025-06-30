import { Home, Gamepad2, Users, RocketIcon, BookOpen, Scale } from 'lucide-react';

/**
 * Navigation item interface defining the structure of navigation elements
 */
interface NavItem {
  path: string;
  key: string;
  icon: typeof Home;
}

/**
 * Main navigation items displayed prominently in the navbar
 * These are the primary pages users will access most frequently
 */
export const mainNavItems: NavItem[] = [
  { path: '/', key: 'home', icon: Home },
  { path: '/tools', key: 'tools', icon: Gamepad2 },
  { path: '/partners', key: 'partners', icon: Users },
];

/**
 * Secondary navigation items displayed on the right side of the navbar
 * These are additional pages that are less frequently accessed
 */
export const secondaryNavItems: NavItem[] = [
  { path: '/roadmap', key: 'roadmap', icon: RocketIcon },
  { path: '/planning', key: 'manga', icon: BookOpen },
  { path: '/legal', key: 'legal', icon: Scale },
];