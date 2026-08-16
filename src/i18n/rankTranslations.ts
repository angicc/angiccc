// ─── Chess rank translations ──────────────────────────────────────────────────
// The rank shown on the Profile — its name, its one-line description and the
// historical figure it is modelled on — rendered in English for every language
// until now. English is the source of truth in chessRanks.ts; this file carries
// the other five.
//
// Proper names are transliterated rather than left in Latin script for ru/mk,
// because a Cyrillic sentence with a Latin name embedded is exactly the mixed-
// script rendering the app's build guard exists to prevent.
import type { Language } from './translations';

interface RankText { name: string; desc: string; historicalFigure: string }

const RANK_TRANS: Partial<Record<Language, Record<string, RankText>>> = {
  es: {
    'pawn': { name: 'Peón', desc: 'Todo gran historiador empieza como un aprendiz curioso.', historicalFigure: 'Erudito Novato' },
    'squire': { name: 'Escudero', desc: 'Entrenando bajo el estandarte del conocimiento.', historicalFigure: 'Escudero Medieval' },
    'knight': { name: 'Caballero', desc: 'Cabalgando por los anales de la historia con determinación.', historicalFigure: 'Ricardo Corazón de León' },
    'crusader': { name: 'Cruzado', desc: 'En una búsqueda incansable de la verdad histórica.', historicalFigure: 'Godofredo de Bouillon' },
    'centurion': { name: 'Centurión', desc: 'Comandante de cien victorias en el dominio de la historia.', historicalFigure: 'Centurión Romano' },
    'vizier': { name: 'Visir', desc: 'Consejero de confianza de imperios, guardián de crónicas.', historicalFigure: 'Nizam al-Mulk' },
    'caesar': { name: 'César', desc: 'Has cruzado el Rubicón del conocimiento histórico.', historicalFigure: 'Julio César' },
    'pharaoh': { name: 'Faraón', desc: 'Dios-rey del dominio histórico: tu nombre perdurará.', historicalFigure: 'Ramsés el Grande' },
    'emperor': { name: 'Emperador', desc: 'Soberano de todas las eras: tu imperio de conocimiento es vasto.', historicalFigure: 'Napoleón Bonaparte' },
    'alexander': { name: 'Alejandro', desc: 'El Grande: conquistador de toda la historia, de la antigua a la moderna.', historicalFigure: 'Alejandro Magno' },
  },
  ru: {
    'pawn': { name: 'Пешка', desc: 'Каждый великий историк начинает с любопытства.', historicalFigure: 'Начинающий учёный' },
    'squire': { name: 'Оруженосец', desc: 'Обучение под знаменем знания.', historicalFigure: 'Средневековый оруженосец' },
    'knight': { name: 'Рыцарь', desc: 'Целеустремлённый путь сквозь анналы истории.', historicalFigure: 'Ричард Львиное Сердце' },
    'crusader': { name: 'Крестоносец', desc: 'В неустанном поиске исторической истины.', historicalFigure: 'Готфрид Бульонский' },
    'centurion': { name: 'Центурион', desc: 'Командующий сотней побед в познании истории.', historicalFigure: 'Римский центурион' },
    'vizier': { name: 'Визирь', desc: 'Доверенный советник империй, хранитель хроник.', historicalFigure: 'Низам аль-Мульк' },
    'caesar': { name: 'Цезарь', desc: 'Вы перешли Рубикон исторического знания.', historicalFigure: 'Юлий Цезарь' },
    'pharaoh': { name: 'Фараон', desc: 'Бог-царь исторического мастерства — ваше имя переживёт века.', historicalFigure: 'Рамсес Великий' },
    'emperor': { name: 'Император', desc: 'Владыка всех эпох — ваша империя знаний огромна.', historicalFigure: 'Наполеон Бонапарт' },
    'alexander': { name: 'Александр', desc: 'Великий — покоритель всей истории, от древней до современной.', historicalFigure: 'Александр Македонский' },
  },
  mk: {
    'pawn': { name: 'Пешак', desc: 'Секој голем историчар почнува како љубопитен ученик.', historicalFigure: 'Почетник-научник' },
    'squire': { name: 'Штитоносец', desc: 'Обука под знамето на знаењето.', historicalFigure: 'Средновековен штитоносец' },
    'knight': { name: 'Витез', desc: 'Јавање низ аналите на историјата со цел.', historicalFigure: 'Ричард Лавовско Срце' },
    'crusader': { name: 'Крстоносец', desc: 'Во неуморна потрага по историската вистина.', historicalFigure: 'Годфри Бујонски' },
    'centurion': { name: 'Центурион', desc: 'Заповедник на сто победи во владеењето на историјата.', historicalFigure: 'Римски центурион' },
    'vizier': { name: 'Везир', desc: 'Доверлив советник на империите, чувар на хрониките.', historicalFigure: 'Низам ал-Мулк' },
    'caesar': { name: 'Цезар', desc: 'Го премина Рубикон на историското знаење.', historicalFigure: 'Јулиј Цезар' },
    'pharaoh': { name: 'Фараон', desc: 'Бог-крал на историското владеење — твоето име ќе опстане.', historicalFigure: 'Рамзес Велики' },
    'emperor': { name: 'Император', desc: 'Владетел на сите епохи — твојата империја на знаење е огромна.', historicalFigure: 'Наполеон Бонапарта' },
    'alexander': { name: 'Александар', desc: 'Велики — освојувач на целата историја, од античка до модерна.', historicalFigure: 'Александар Македонски' },
  },
  de: {
    'pawn': { name: 'Bauer', desc: 'Jeder große Historiker beginnt als neugieriger Lernender.', historicalFigure: 'Angehender Gelehrter' },
    'squire': { name: 'Knappe', desc: 'Ausbildung unter dem Banner des Wissens.', historicalFigure: 'Mittelalterlicher Knappe' },
    'knight': { name: 'Springer', desc: 'Zielstrebig durch die Annalen der Geschichte.', historicalFigure: 'Richard Löwenherz' },
    'crusader': { name: 'Kreuzritter', desc: 'Auf unermüdlicher Suche nach der historischen Wahrheit.', historicalFigure: 'Gottfried von Bouillon' },
    'centurion': { name: 'Zenturio', desc: 'Befehlshaber über hundert Siege der Geschichtsbeherrschung.', historicalFigure: 'Römischer Zenturio' },
    'vizier': { name: 'Wesir', desc: 'Vertrauter Berater der Reiche, Hüter der Chroniken.', historicalFigure: 'Nizām al-Mulk' },
    'caesar': { name: 'Cäsar', desc: 'Du hast den Rubikon des historischen Wissens überschritten.', historicalFigure: 'Julius Cäsar' },
    'pharaoh': { name: 'Pharao', desc: 'Gottkönig der Geschichtsbeherrschung — dein Name wird bleiben.', historicalFigure: 'Ramses der Große' },
    'emperor': { name: 'Kaiser', desc: 'Herrscher aller Epochen — dein Reich des Wissens ist gewaltig.', historicalFigure: 'Napoleon Bonaparte' },
    'alexander': { name: 'Alexander', desc: 'Der Große — Eroberer der gesamten Geschichte, von der Antike bis heute.', historicalFigure: 'Alexander der Große' },
  },
  fr: {
    'pawn': { name: 'Pion', desc: 'Tout grand historien commence par être un apprenant curieux.', historicalFigure: 'Érudit novice' },
    'squire': { name: 'Écuyer', desc: 'En formation sous la bannière du savoir.', historicalFigure: 'Écuyer médiéval' },
    'knight': { name: 'Cavalier', desc: 'Chevauchant les annales de l’histoire avec détermination.', historicalFigure: 'Richard Cœur de Lion' },
    'crusader': { name: 'Croisé', desc: 'En quête inlassable de la vérité historique.', historicalFigure: 'Godefroy de Bouillon' },
    'centurion': { name: 'Centurion', desc: 'Commandant de cent victoires dans la maîtrise de l’histoire.', historicalFigure: 'Centurion romain' },
    'vizier': { name: 'Vizir', desc: 'Conseiller de confiance des empires, gardien des chroniques.', historicalFigure: 'Nizam al-Mulk' },
    'caesar': { name: 'César', desc: 'Tu as franchi le Rubicon du savoir historique.', historicalFigure: 'Jules César' },
    'pharaoh': { name: 'Pharaon', desc: 'Dieu-roi de la maîtrise historique — ton nom traversera les âges.', historicalFigure: 'Ramsès le Grand' },
    'emperor': { name: 'Empereur', desc: 'Souverain de toutes les époques — ton empire du savoir est vaste.', historicalFigure: 'Napoléon Bonaparte' },
    'alexander': { name: 'Alexandre', desc: 'Le Grand — conquérant de toute l’histoire, de l’Antiquité à nos jours.', historicalFigure: 'Alexandre le Grand' },
  },
};

/** Localised rank text, or null when English (the source) should be used. */
export function getTranslatedRank(rankId: string, lang: Language): RankText | null {
  return RANK_TRANS[lang]?.[rankId] ?? null;
}
