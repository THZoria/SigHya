# 🎮 SigHya

> A French community platform dedicated to console modding and gaming preservation

<div align="center">

[![Version](https://img.shields.io/badge/version-2.2.5-blue.svg)](https://github.com/THZoria/SigHya)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.2-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

</div>

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Built With](#️-built-with)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

- 🔍 **NX Checker** - Verify your Nintendo Switch compatibility for modding
- 🔑 **NX Device ID** - Extract device ID from PRODINFO.bin files
- 🎮 **PS5 UART** - Analyze PS5 UART error codes and troubleshooting
- 📚 **Manga Planning** - Track upcoming manga releases with calendar integration
- 🌍 **Multi-language** - Available in French, English, and Spanish
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Performance Optimized** - Fast loading with code splitting and lazy loading

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/THZoria/SigHya.git
cd SigHya

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser and navigate to http://localhost:5173
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run preview      # Preview production build

# Building
npm run build        # Build for production
npm run typecheck    # Run TypeScript type checking

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🛠️ Development

### Project Structure

```
src/
├── api/              # API functions and external service calls
├── components/       # Reusable React components
│   ├── manga/       # Manga-specific components
│   └── ui/          # UI components (currently empty)
├── constants/        # Application constants and configuration
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization setup
│   └── locales/     # Translation files
├── pages/           # Page components
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

### Key Components

- **App.tsx** - Main application component with routing setup
- **Navbar.tsx** - Navigation bar with responsive design
- **PageTransition.tsx** - Smooth page transition animations
- **useMediaQuery.ts** - Custom hook for responsive design
- **binParser.ts** - Binary file parsing utilities
- **nxchecker.ts** - Nintendo Switch compatibility checking logic

### Code Style

- **Comments**: All comments are in English for consistency
- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for React and TypeScript best practices
- **Prettier**: Automatic code formatting

## 🛠️ Built With

- ⚛️ **React 18** - A JavaScript library for building user interfaces
- 📘 **TypeScript** - JavaScript with syntax for types
- ⚡ **Vite** - Next generation frontend tooling
- 🎨 **Tailwind CSS** - A utility-first CSS framework
- 🎭 **Framer Motion** - A production-ready motion library
- 🎯 **Lucide Icons** - Beautiful & consistent icons
- 🌐 **React Router** - Client-side routing for React applications

## 🤝 Contributing

We love contributions! Here's how you can help:

### Development Process

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 🔧 Make your changes following the code style guidelines
4. ✅ Add tests if applicable
5. 📝 Update documentation as needed
6. 📫 Submit a pull request

### Code Guidelines

- Write clear, descriptive commit messages
- Add comments in English for all functions and complex logic
- Follow the existing code style and formatting
- Ensure all TypeScript types are properly defined
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Acknowledgments

### 🌟 Special Thanks

#### Ghost0159
A huge thank you to Ghost0159 for their exceptional contribution:
- Complete rewrite of the website in React + TypeScript
- Implementation of modern web practices and performance optimizations
- Enhanced user interface and experience
- Multi-language support integration
- Comprehensive code documentation and clean architecture

#### Additional Thanks
- **Nautiljon** for manga data and release information
- **Console Service Tool** for PS5 error codes and troubleshooting data
- Our amazing community members and contributors
- All the developers who maintain the open-source libraries we use

---

<div align="center">
Made with ❤️ by the SigHya team
</div>