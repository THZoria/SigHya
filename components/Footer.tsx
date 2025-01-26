import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/context';

const Footer = () => {
  const { t } = useI18n();
  
  return (
    <footer className="bg-midnight-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/">
              <img
                className="h-14 w-auto"
                src="/logo.png"
                alt="SigHya"
              />
            </Link>
            <p className="mt-4 text-gray-200 text-sm">
              {t('roadmap.footer.tagline')}
            </p>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-2">
              {t('roadmap.footer.contact.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@sighya.fr" className="text-gray-200 hover:text-white text-sm">
                  {t('roadmap.footer.contact.email')}
                </a>
              </li>
              <li>
                <a href="https://discord.sighya.fr" className="text-gray-200 hover:text-white text-sm">
                  {t('roadmap.footer.contact.support')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-2">
              {t('roadmap.footer.legal.title')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/legal"
                  className="text-gray-200 hover:text-white text-sm"
                >
                  {t('roadmap.footer.legal.terms')}
                </Link>
              </li>
              <li>
                <Link
                  to="/legal"
                  className="text-gray-200 hover:text-white text-sm"
                >
                  {t('roadmap.footer.legal.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 md:mt-8 border-t border-midnight-800 pt-6 md:pt-8">
          <p className="text-center text-gray-300 text-sm">
            &copy; 2018 - {new Date().getFullYear()} SigHya
          </p>
          <div className="flex justify-center mt-1.5 md:mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Version {__APP_VERSION__}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;