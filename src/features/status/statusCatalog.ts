// ─── Status page · localization catalog ───────────────────────────────────────
// Self-contained in all six languages, the same contract the Atlas and Imperium
// use. The status text itself (summaries, incident bodies) is localized inside
// status.json, because it changes with every incident; this file holds only the
// furniture around it.
import type { Language } from '@/i18n/translations';
import type { Health, EntryKind } from './statusModel';

type Entry = Partial<Record<Language, string>> & { en: string };

const CATALOG: Record<string, Entry> = {
  status_title: { en: 'App Status', es: 'Estado de la app', ru: 'Состояние приложения', mk: 'Состојба на апликацијата', de: 'App-Status', fr: "État de l'application" },
  status_subtitle: {
    en: 'What is working, what is not, and what changed recently.',
    es: 'Qué funciona, qué no y qué ha cambiado recientemente.',
    ru: 'Что работает, что нет и что изменилось недавно.',
    mk: 'Што работи, што не работи и што се смени неодамна.',
    de: 'Was funktioniert, was nicht, und was sich zuletzt geändert hat.',
    fr: "Ce qui fonctionne, ce qui ne fonctionne pas, et ce qui a changé récemment.",
  },
  status_current: { en: 'Current status', es: 'Estado actual', ru: 'Текущее состояние', mk: 'Тековна состојба', de: 'Aktueller Status', fr: 'État actuel' },
  status_components: { en: 'Components', es: 'Componentes', ru: 'Компоненты', mk: 'Компоненти', de: 'Komponenten', fr: 'Composants' },
  status_history: { en: 'Updates and incidents', es: 'Actualizaciones e incidencias', ru: 'Обновления и инциденты', mk: 'Ажурирања и инциденти', de: 'Updates und Störungen', fr: 'Mises à jour et incidents' },
  status_updated: { en: 'Last updated', es: 'Última actualización', ru: 'Последнее обновление', mk: 'Последно ажурирање', de: 'Zuletzt aktualisiert', fr: 'Dernière mise à jour' },
  status_resolved: { en: 'Resolved', es: 'Resuelto', ru: 'Устранено', mk: 'Решено', de: 'Behoben', fr: 'Résolu' },
  status_ongoing: { en: 'Ongoing', es: 'En curso', ru: 'Продолжается', mk: 'Во тек', de: 'Andauernd', fr: 'En cours' },
  status_unavailable: {
    en: 'Could not load the status page. The app itself is unaffected.',
    es: 'No se pudo cargar el estado. La app no se ve afectada.',
    ru: 'Не удалось загрузить состояние. На работу приложения это не влияет.',
    mk: 'Состојбата не можеше да се вчита. Тоа не влијае на апликацијата.',
    de: 'Der Status konnte nicht geladen werden. Die App selbst ist nicht betroffen.',
    fr: "Impossible de charger l'état. L'application elle-même n'est pas affectée.",
  },
  status_view: { en: 'View status', es: 'Ver estado', ru: 'Посмотреть состояние', mk: 'Види состојба', de: 'Status ansehen', fr: "Voir l'état" },
  status_dismiss: { en: 'Dismiss', es: 'Descartar', ru: 'Скрыть', mk: 'Затвори', de: 'Ausblenden', fr: 'Masquer' },

  // ── Health levels ──
  health_operational: { en: 'All systems operational', es: 'Todos los sistemas operativos', ru: 'Все системы работают', mk: 'Сите системи работат', de: 'Alle Systeme betriebsbereit', fr: 'Tous les systèmes opérationnels' },
  health_degraded: { en: 'Partially degraded', es: 'Parcialmente degradado', ru: 'Частичные сбои', mk: 'Делумно намалена функционалност', de: 'Teilweise beeinträchtigt', fr: 'Partiellement dégradé' },
  health_maintenance: { en: 'Under maintenance', es: 'En mantenimiento', ru: 'Техническое обслуживание', mk: 'Во одржување', de: 'Wartungsarbeiten', fr: 'En maintenance' },
  health_outage: { en: 'Major outage', es: 'Caída importante', ru: 'Крупный сбой', mk: 'Голем прекин', de: 'Schwere Störung', fr: 'Panne majeure' },

  // ── Entry kinds ──
  kind_release: { en: 'Update', es: 'Actualización', ru: 'Обновление', mk: 'Ажурирање', de: 'Update', fr: 'Mise à jour' },
  kind_incident: { en: 'Incident', es: 'Incidencia', ru: 'Инцидент', mk: 'Инцидент', de: 'Störung', fr: 'Incident' },
  kind_maintenance: { en: 'Maintenance', es: 'Mantenimiento', ru: 'Обслуживание', mk: 'Одржување', de: 'Wartung', fr: 'Maintenance' },
  'kind_known-issue': { en: 'Known issue', es: 'Problema conocido', ru: 'Известная проблема', mk: 'Познат проблем', de: 'Bekanntes Problem', fr: 'Problème connu' },

  // ── Component names ──
  comp_app: { en: 'The app', es: 'La aplicación', ru: 'Приложение', mk: 'Апликацијата', de: 'Die App', fr: "L'application" },
  comp_lessons: { en: 'Lessons and quizzes', es: 'Lecciones y cuestionarios', ru: 'Уроки и викторины', mk: 'Лекции и квизови', de: 'Lektionen und Quiz', fr: 'Leçons et quiz' },
  comp_ai: { en: 'Clio and AI features', es: 'Clío y funciones de IA', ru: 'Клио и ИИ-функции', mk: 'Клио и ВИ функции', de: 'Clio und KI-Funktionen', fr: 'Clio et fonctions IA' },
  comp_maps: { en: 'Maps and territories', es: 'Mapas y territorios', ru: 'Карты и территории', mk: 'Карти и територии', de: 'Karten und Gebiete', fr: 'Cartes et territoires' },
  comp_accounts: { en: 'Accounts and friends', es: 'Cuentas y amigos', ru: 'Аккаунты и друзья', mk: 'Сметки и пријатели', de: 'Konten und Freunde', fr: 'Comptes et amis' },
  comp_billing: { en: 'Subscriptions and payments', es: 'Suscripciones y pagos', ru: 'Подписки и платежи', mk: 'Претплати и плаќања', de: 'Abos und Zahlungen', fr: 'Abonnements et paiements' },
};

export function statusText(key: string, language: Language): string {
  const entry = CATALOG[key];
  return entry ? (entry[language] ?? entry.en) : key;
}

export function healthLabel(h: Health, language: Language): string {
  return statusText(`health_${h}`, language);
}

export function kindLabel(k: EntryKind, language: Language): string {
  return statusText(`kind_${k}`, language);
}

export function componentLabel(id: string, language: Language): string {
  const key = `comp_${id}`;
  return key in CATALOG ? statusText(key, language) : id;
}

/** Exposed for the completeness test. */
export const STATUS_CATALOG = CATALOG;

/** Tailwind classes per health level, so the colour is decided in one place. */
export const HEALTH_STYLE: Record<Health, { dot: string; text: string; border: string; bg: string }> = {
  operational: { dot: 'bg-emerald-400', text: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/[0.06]' },
  degraded:    { dot: 'bg-amber-400',   text: 'text-amber-400',   border: 'border-amber-400/30',   bg: 'bg-amber-400/[0.06]' },
  maintenance: { dot: 'bg-sky-400',     text: 'text-sky-400',     border: 'border-sky-400/30',     bg: 'bg-sky-400/[0.06]' },
  outage:      { dot: 'bg-rose-500',    text: 'text-rose-400',    border: 'border-rose-500/30',    bg: 'bg-rose-500/[0.06]' },
};
