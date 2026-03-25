import { enMessages } from "@/i18n/locales/en";

export type Locale = "en" | "zh" | "ru" | "ar";

export type MessageKey = keyof typeof enMessages;

export type Messages = Record<MessageKey, string>;
