import React from 'react';
import { Shield, Lock, Server, Copyright, Mail, Globe, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useI18n } from '../i18n/context';

const Legal = () => {
  const { t } = useI18n();

  const sections = [
    {
      icon: Shield,
      title: t('legal.sections.legal.title'),
      content: [
        {
          subtitle: t('legal.sections.legal.publisher.title'),
          text: t('legal.sections.legal.publisher.description'),
          details: [
            { label: t('legal.sections.legal.publisher.director'), value: "SaoriYuki" },
            { label: t('legal.sections.legal.publisher.contact'), value: "contact@sighya.fr", isEmail: true }
          ]
        }
      ]
    },
    {
      icon: Lock,
      title: t('legal.sections.privacy.title'),
      content: [
        {
          subtitle: t('legal.sections.privacy.dataCollection.title'),
          text: t('legal.sections.privacy.dataCollection.description')
        },
        {
          subtitle: t('legal.sections.privacy.cookies.title'),
          text: t('legal.sections.privacy.cookies.description')
        },
        {
          subtitle: t('legal.sections.privacy.dataProtection.title'),
          text: t('legal.sections.privacy.dataProtection.description')
        }
      ]
    },
    {
      icon: Server,
      title: t('legal.sections.hosting.title'),
      content: [
        {
          subtitle: t('legal.sections.hosting.provider.title'),
          text: t('legal.sections.hosting.provider.description'),
          details: [
            { label: t('legal.sections.hosting.provider.country'), value: "France" },
            { label: t('legal.sections.hosting.provider.type'), value: t('legal.sections.hosting.provider.shared') }
          ]
        }
      ]
    },
    {
      icon: Copyright,
      title: t('legal.sections.intellectual.title'),
      content: [
        {
          subtitle: t('legal.sections.intellectual.license.title'),
          text: t('legal.sections.intellectual.license.description')
        },
        {
          subtitle: t('legal.sections.intellectual.usage.title'),
          text: t('legal.sections.intellectual.usage.description')
        }
      ]
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">{t('legal.title')}</h1>
            <p className="text-gray-400">{t('legal.subtitle')}</p>
          </div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className="bg-gray-800 rounded-lg shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-blue-500/10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-6">
                  <section.icon className="w-8 h-8 text-blue-400 mr-4" />
                  <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.content.map((item, i) => (
                    <div key={i} className="border-l-2 border-blue-500 pl-4">
                      <h3 className="text-lg font-medium text-blue-400 mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-300 mb-4">{item.text}</p>
                      {item.details && (
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {item.details.map((detail, j) => (
                            <div key={j} className="flex items-center text-gray-300">
                              <span className="font-medium text-white mr-2">
                                {detail.label} :
                              </span>
                              {detail.isEmail ? (
                                <a
                                  href={`mailto:${detail.value}`}
                                  className="text-blue-400 hover:text-blue-300 flex items-center"
                                >
                                  <Mail className="w-4 h-4 mr-1" />
                                  {detail.value}
                                </a>
                              ) : (
                                <span>{detail.value}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {t('legal.contact.questions')}
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Legal;
