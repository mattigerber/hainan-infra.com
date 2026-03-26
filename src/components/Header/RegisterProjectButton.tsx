"use client";

import React from 'react';
import { registerProjectMail } from './registerProjectMail';
import { useI18n } from '@/i18n/I18nProvider';

const RegisterProjectButton = () => {
  const { t } = useI18n();
  const mailto = `mailto:${registerProjectMail.to}?subject=${encodeURIComponent(registerProjectMail.subject)}&body=${encodeURIComponent(registerProjectMail.body)}`;

  return (
    <a
      href={mailto}
      className="inline-flex w-full min-h-[42px] items-center justify-start border border-white bg-black px-3 py-2 text-left text-xs font-playfair text-white transition hover:bg-white hover:text-black sm:w-auto sm:justify-center sm:px-4 sm:text-sm"
    >
      {t("registerProject.button")}
    </a>
  );
};

export default RegisterProjectButton;
