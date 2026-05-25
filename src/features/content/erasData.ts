import type { Era } from '@/types';

export const ERAS: Era[] = [
  { id: 'ancient', name: 'Ancient History', shortName: 'Ancient', dateRange: '~3000 BCE – 500 CE', description: 'From the first writing systems of Mesopotamia to the fall of the Western Roman Empire. Explore civilizations that laid the foundations of human culture, law, philosophy, and empire.', icon: 'scroll', color: 'text-amber-400', bgGradient: 'from-amber-950/30 to-background', lessonIds: ['ancient-01','ancient-02','ancient-03','ancient-04'], quizId: 'quiz-ancient' },
  { id: 'middle-ages', name: 'Middle Ages', shortName: 'Medieval', dateRange: '~500 – 1500 CE', description: 'A millennium of knights, cathedrals, plagues, and crusades. Discover how the medieval world shaped modern Europe, the rise of Islam, and the preservation of ancient knowledge.', icon: 'castle', color: 'text-blue-400', bgGradient: 'from-blue-950/30 to-background', lessonIds: ['medieval-01','medieval-02','medieval-03'], quizId: 'quiz-medieval' },
  { id: 'early-modern', name: 'Early Modern', shortName: 'Early Modern', dateRange: '~1500 – 1800 CE', description: 'The age of exploration, scientific revolution, and political upheaval. From Columbus to the American Revolution, this era reshaped the globe and our understanding of the universe.', icon: 'compass', color: 'text-emerald-400', bgGradient: 'from-emerald-950/30 to-background', lessonIds: ['earlymod-01','earlymod-02','earlymod-03'], quizId: 'quiz-earlymod' },
  { id: 'modern', name: 'Modern Era', shortName: 'Modern', dateRange: '~1800 CE – Present', description: 'Industrial revolution to the digital age. Two World Wars, decolonization, the Cold War, and the rise of globalization transformed every corner of the earth.', icon: 'industry', color: 'text-rose-400', bgGradient: 'from-rose-950/30 to-background', lessonIds: ['modern-01','modern-02','modern-03','modern-04'], quizId: 'quiz-modern' },
];

export function getEraById(id: string) { return ERAS.find(e => e.id === id); }
export function getEraLessons(eraId: string) { return ERAS.find(e => e.id === eraId)?.lessonIds ?? []; }
