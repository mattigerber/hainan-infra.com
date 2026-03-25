"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';
import { socialLinks } from '@/config/socialLinks';

const Footer = () => {
  const { t, locale } = useI18n();

  return (
    <footer className="mt-12 border-t border-white bg-black py-12">
      <div className="mx-auto max-w-7xl px-8 sm:px-6 md:px-10 2xl:max-w-[90rem]">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          {/* Left: Legal navigation */}
          <div className="flex justify-center md:justify-start">
            <div className="flex flex-col items-center gap-2 md:items-start">
              <Link
                href={`/${locale}/privacy`}
                className="font-playfair text-sm text-white transition hover:text-white/70"
              >
                {t('nav.privacy')}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="font-playfair text-sm text-white transition hover:text-white/70"
              >
                {t('nav.terms')}
              </Link>
              <Link
                href={`/${locale}/risks`}
                className="font-playfair text-sm text-white transition hover:text-white/70"
              >
                {t('nav.risks')}
              </Link>
              <Link
                href={`/${locale}/downloads`}
                className="font-playfair text-sm text-white transition hover:text-white/70"
              >
                {t('nav.downloads')}
              </Link>
            </div>
          </div>

          {/* Center: Social Media Icons */}
          <div className="flex justify-center gap-3 sm:gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="inline-flex h-10 w-10 items-center justify-center border border-white/30 p-1.5 transition hover:border-white sm:h-11 sm:w-11"
              >
                <Image
                  src={social.icon}
                  alt={`${social.name} icon`}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain brightness-0 invert"
                />
              </a>
            ))}
          </div>

          {/* Right: Logo, Copyright */}
          <div className="flex flex-col items-center gap-3 md:items-end">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={132}
              height={44}
              className="h-10 w-auto"
            />
            <div className="text-center text-xs text-white/70 md:text-right">
              <span>{t('footer.copyright')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
