import type { Language } from './translations';

interface StepContent {
  title: string;
  desc: string;
  tips: string[];
  linkLabel: string;
}

interface FaqItem {
  q: string;
  a: string;
}

const STEP_META = [
  { step: 1, link: '/pricing' },
  { step: 2, link: '/eras' },
  { step: 3, link: '/timeline' },
  { step: 4, link: '/tutor' },
  { step: 5, link: '/eras' },
  { step: 6, link: '/smart-quiz' },
  { step: 7, link: '/flashcards' },
  { step: 8, link: '/notes' },
  { step: 9, link: '/progress' },
  { step: 10, link: '/essay' },
  { step: 11, link: '/debate' },
  { step: 12, link: '/video-review' },
];

const STEPS_EN: StepContent[] = [
  { title: 'Choose Your Plan', desc: 'Start for free with 4 intro lessons (one per era). Upgrade to Pro for all 18 lessons and AI Tutor access, or go Master for unlimited AI and downloads.', tips: ['Free plan: no credit card needed', 'Pro Learner: $10/month, most popular', 'Master Student: $20/month, unlimited everything'], linkLabel: 'View Plans' },
  { title: 'Explore Eras & Lessons', desc: 'Navigate to Eras & Lessons from the sidebar. Choose an era — Ancient World, Middle Ages, Early Modern, or Modern — and open any unlocked lesson.', tips: ['Each era has 6–7 lessons', 'Lessons include rich historical detail', 'Complete a lesson to unlock the era quiz'], linkLabel: 'Go to Eras' },
  { title: 'Explore the Timeline', desc: 'The interactive timeline shows 50+ pivotal events across all eras. Click any event to read a summary and jump directly to its lesson.', tips: ['Filter by era using the tab bar', 'Events link directly to lessons', 'Pro users see all categories and filters'], linkLabel: 'Open Timeline' },
  { title: 'Ask Clio — Your AI Tutor', desc: 'Clio is your personal AI history tutor. Ask anything about history, get explanations, compare events, or dig deeper into any topic from your lessons.', tips: ['Available on Pro and Master plans', 'Pro: 50 messages/month', 'Master: unlimited messages', 'Clio also appears as a chatbot on the landing page'], linkLabel: 'Open AI Tutor' },
  { title: 'Take Quizzes & Earn XP', desc: 'Each era has a quiz with 15 questions testing what you learned. Correct answers earn XP, level you up, and track your score per era.', tips: ['15 questions per era quiz', '+15 XP per correct answer', 'Quiz explanations available on Pro+'], linkLabel: 'Go to Eras' },
  { title: 'Try the Smart Quiz', desc: 'Smart Quiz is an adaptive 10-question session drawn from all 4 eras. The algorithm targets your weakest areas and calibrates difficulty to your performance.', tips: ['Available on Pro and Master plans', '10 questions per session', 'Algorithm weights weak eras higher', 'Earn up to +150 XP per session'], linkLabel: 'Try Smart Quiz' },
  { title: 'Review with Flashcards', desc: 'Flashcards let you drill key terms, dates, and concepts from every lesson. Flip cards to reveal answers and mark them as known or unknown.', tips: ['Cards drawn from all lessons', 'Great for revision before quizzes', 'Track how many you know'], linkLabel: 'Open Flashcards' },
  { title: 'Write Personal Notes', desc: 'Capture your thoughts, insights, and summaries as you study. Notes are linked to lessons and saved locally — always there when you come back.', tips: ['Notes saved per lesson', 'Accessible from the My Notes page', 'All data stored locally on your device'], linkLabel: 'Open Notes' },
  { title: 'Track Your Progress', desc: 'The Progress page shows your XP history, era completion rates, quiz scores, streak, and achievement badges. See exactly where you stand.', tips: ['Streak resets if you miss a day', 'Achievements unlock at milestones', 'Charts update after every quiz'], linkLabel: 'View Progress' },
  { title: 'Essay Challenge', desc: 'Put your historical knowledge to the test with a timed essay challenge. Clio grades your essay live with detailed analysis on argument, evidence, depth, and writing quality.', tips: ['Available on Pro and Master plans', 'Essays are graded by Clio — strict but constructive', 'Choose from multiple historical topics', 'Earn XP proportional to your grade (A = max XP)'], linkLabel: 'Try Essay Challenge' },
  { title: 'Debate a Philosopher', desc: 'A new philosopher is featured every 12 hours. Engage them in vigorous philosophical debate — they have pre-loaded arguments and a strong command of their own philosophy. Make them concede to earn XP.', tips: ['Available on Pro Learner and above', 'A new philosopher appears every 12 hours', 'Earn XP by making the philosopher concede', 'Greater philosophers yield more XP', 'Use pre-loaded starter arguments or write your own'], linkLabel: 'Open Debate' },
  { title: 'Video Review Challenge', desc: 'Watch a curated educational history video (≤10 min), then write your analysis identifying the main motive or argument. Clio grades your review sentence-by-sentence with a live 3D animation.', tips: ['Exclusive to Master Student plan', 'A new video unlocks every 12 hours', 'Earn special Video XP — separate from regular XP', 'Video XP advances your Historical Chess Rank', 'Chess Rank gives 2× advantage on the Leaderboard'], linkLabel: 'Open Video Review' },
];

const STEPS_ES: StepContent[] = [
  { title: 'Elige tu Plan', desc: 'Comienza gratis con 4 lecciones introductorias (una por era). Actualiza a Pro para todas las 18 lecciones y el Tutor IA, o elige Master para IA ilimitada y descargas.', tips: ['Plan gratuito: sin tarjeta de crédito', 'Pro Learner: $10/mes, el más popular', 'Master Student: $20/mes, todo ilimitado'], linkLabel: 'Ver Planes' },
  { title: 'Explora Eras y Lecciones', desc: 'Navega a Eras y Lecciones desde la barra lateral. Elige una era — Mundo Antiguo, Edad Media, Época Moderna Temprana o Era Moderna — y abre cualquier lección desbloqueada.', tips: ['Cada era tiene 6–7 lecciones', 'Las lecciones incluyen detalle histórico enriquecido', 'Completa una lección para desbloquear el quiz de era'], linkLabel: 'Ir a Eras' },
  { title: 'Explora la Línea de Tiempo', desc: 'La línea de tiempo interactiva muestra más de 50 eventos cruciales de todas las eras. Haz clic en cualquier evento para leer un resumen y saltar directamente a su lección.', tips: ['Filtra por era con la barra de pestañas', 'Los eventos enlazan directamente a lecciones', 'Los usuarios Pro ven todas las categorías y filtros'], linkLabel: 'Abrir Línea de Tiempo' },
  { title: 'Pregunta a Clio — Tu Tutor IA', desc: 'Clio es tu tutor personal de historia con IA. Pregunta cualquier cosa sobre historia, obtén explicaciones, compara eventos o profundiza en cualquier tema de tus lecciones.', tips: ['Disponible en planes Pro y Master', 'Pro: 50 mensajes/mes', 'Master: mensajes ilimitados', 'Clio también aparece como chatbot en la página de inicio'], linkLabel: 'Abrir Tutor IA' },
  { title: 'Haz Quizzes y Gana XP', desc: 'Cada era tiene un quiz con 15 preguntas que evalúan lo que aprendiste. Las respuestas correctas ganan XP, suben de nivel y rastrean tu puntuación por era.', tips: ['15 preguntas por quiz de era', '+15 XP por respuesta correcta', 'Explicaciones del quiz disponibles en Pro+'], linkLabel: 'Ir a Eras' },
  { title: 'Prueba el Quiz Inteligente', desc: 'El Quiz Inteligente es una sesión adaptativa de 10 preguntas de las 4 eras. El algoritmo se enfoca en tus áreas más débiles y calibra la dificultad según tu rendimiento.', tips: ['Disponible en planes Pro y Master', '10 preguntas por sesión', 'El algoritmo prioriza las eras débiles', 'Gana hasta +150 XP por sesión'], linkLabel: 'Probar Quiz Inteligente' },
  { title: 'Repasa con Tarjetas', desc: 'Las tarjetas te permiten practicar términos clave, fechas y conceptos de cada lección. Voltea las tarjetas para ver respuestas y márcalas como conocidas o desconocidas.', tips: ['Tarjetas de todas las lecciones', 'Ideal para repasar antes de quizzes', 'Rastrea cuántas conoces'], linkLabel: 'Abrir Tarjetas' },
  { title: 'Escribe Notas Personales', desc: 'Captura tus pensamientos, ideas y resúmenes mientras estudias. Las notas están vinculadas a lecciones y guardadas localmente — siempre disponibles cuando vuelves.', tips: ['Notas guardadas por lección', 'Accesibles desde la página Mis Notas', 'Todos los datos guardados localmente en tu dispositivo'], linkLabel: 'Abrir Notas' },
  { title: 'Sigue tu Progreso', desc: 'La página de Progreso muestra tu historial de XP, tasas de completación por era, puntuaciones de quiz, racha y logros. Ve exactamente dónde estás.', tips: ['La racha se reinicia si pierdes un día', 'Los logros se desbloquean en hitos', 'Los gráficos se actualizan después de cada quiz'], linkLabel: 'Ver Progreso' },
  { title: 'Desafío de Ensayo', desc: 'Pon a prueba tu conocimiento histórico con un desafío de ensayo. Clio evalúa tu ensayo en vivo con análisis detallado sobre argumento, evidencia, profundidad y calidad de escritura.', tips: ['Disponible en planes Pro y Master', 'Los ensayos son evaluados por Clio — estricto pero constructivo', 'Elige entre múltiples temas históricos', 'Gana XP proporcional a tu nota (A = XP máximo)'], linkLabel: 'Probar Desafío de Ensayo' },
  { title: 'Debate con un Filósofo', desc: 'Cada 12 horas se presenta un nuevo filósofo. Debátelos filosóficamente — tienen argumentos pre-cargados y dominio de su propia filosofía. Hazlos conceder para ganar XP.', tips: ['Disponible en Pro Learner y superior', 'Nuevo filósofo cada 12 horas', 'Gana XP haciendo conceder al filósofo', 'Los filósofos más grandes dan más XP', 'Usa argumentos de inicio o escribe los tuyos'], linkLabel: 'Abrir Debate' },
  { title: 'Desafío de Revisión de Vídeo', desc: 'Mira un vídeo educativo de historia (≤10 min), luego escribe tu análisis identificando el motivo o argumento principal. Clio evalúa tu revisión frase por frase con una animación 3D en vivo.', tips: ['Exclusivo del plan Master Student', 'Nuevo vídeo cada 12 horas', 'Gana XP de Vídeo especial — separado del XP regular', 'El XP de Vídeo avanza tu Rango de Ajedrez Histórico', 'El Rango de Ajedrez da ventaja 2× en el Marcador'], linkLabel: 'Abrir Revisión de Vídeo' },
];

const STEPS_RU: StepContent[] = [
  { title: 'Выберите свой план', desc: 'Начните бесплатно с 4 вводных уроков (по одному на эпоху). Обновитесь до Pro для доступа ко всем 18 урокам и ИИ-Наставнику, или выберите Master для неограниченного ИИ и загрузок.', tips: ['Бесплатный план: без кредитной карты', 'Pro Learner: $10/мес, самый популярный', 'Master Student: $20/мес, всё без ограничений'], linkLabel: 'Посмотреть Планы' },
  { title: 'Изучайте Эпохи и Уроки', desc: 'Перейдите в раздел «Эпохи и Уроки» из боковой панели. Выберите эпоху — Древний мир, Средние века, Раннее Новое время или Современная эра — и откройте любой разблокированный урок.', tips: ['Каждая эпоха содержит 6–7 уроков', 'Уроки включают детальный исторический материал', 'Завершите урок, чтобы разблокировать викторину по эпохе'], linkLabel: 'Перейти к Эпохам' },
  { title: 'Исследуйте Хронологию', desc: 'Интерактивная хронология показывает более 50 ключевых событий всех эпох. Нажмите на любое событие, чтобы прочитать описание и перейти прямо к уроку.', tips: ['Фильтрация по эпохам через панель вкладок', 'События ведут напрямую к урокам', 'Пользователи Pro видят все категории и фильтры'], linkLabel: 'Открыть Хронологию' },
  { title: 'Спросите Клио — ИИ-Наставника', desc: 'Клио — ваш персональный репетитор истории на базе ИИ. Задавайте любые вопросы по истории, получайте объяснения, сравнивайте события или углубляйтесь в любую тему.', tips: ['Доступно на планах Pro и Master', 'Pro: 50 сообщений/мес', 'Master: неограниченные сообщения', 'Клио также доступна как чат-бот на главной странице'], linkLabel: 'Открыть ИИ-Наставника' },
  { title: 'Проходите Викторины и Зарабатывайте XP', desc: 'Каждая эпоха имеет викторину с 15 вопросами для проверки знаний. Правильные ответы приносят XP, повышают уровень и отслеживают результат по эпохам.', tips: ['15 вопросов в викторине по эпохе', '+15 XP за правильный ответ', 'Объяснения к вопросам доступны на Pro+'], linkLabel: 'Перейти к Эпохам' },
  { title: 'Попробуйте Умную Викторину', desc: 'Умная Викторина — адаптивная сессия из 10 вопросов из всех 4 эпох. Алгоритм нацелен на ваши слабые места и регулирует сложность по результатам.', tips: ['Доступно на планах Pro и Master', '10 вопросов за сессию', 'Алгоритм приоритизирует слабые эпохи', 'Зарабатывайте до +150 XP за сессию'], linkLabel: 'Попробовать Умную Викторину' },
  { title: 'Повторяйте с Карточками', desc: 'Карточки позволяют повторять ключевые термины, даты и концепции из каждого урока. Переворачивайте карточки и отмечайте как «знаю» или «не знаю».', tips: ['Карточки из всех уроков', 'Отлично для подготовки к викторинам', 'Отслеживайте, сколько вы уже знаете'], linkLabel: 'Открыть Карточки' },
  { title: 'Ведите Личные Заметки', desc: 'Записывайте мысли, идеи и краткие конспекты во время учёбы. Заметки привязаны к урокам и хранятся локально — всегда под рукой.', tips: ['Заметки сохраняются по урокам', 'Доступны на странице «Мои Заметки»', 'Данные хранятся локально на вашем устройстве'], linkLabel: 'Открыть Заметки' },
  { title: 'Следите за Прогрессом', desc: 'Страница Прогресса показывает историю XP, завершённость эпох, результаты викторин, серию и достижения. Узнайте, где именно вы находитесь.', tips: ['Серия сбрасывается, если пропустить день', 'Достижения открываются на определённых вехах', 'Графики обновляются после каждой викторины'], linkLabel: 'Смотреть Прогресс' },
  { title: 'Эссе-Задание', desc: 'Проверьте свои знания истории в эссе-задании. Клио оценивает ваше эссе в реальном времени с детальным анализом аргументации, доказательств, глубины и качества написания.', tips: ['Доступно на планах Pro и Master', 'Эссе оцениваются Клио — строго, но конструктивно', 'Выбирайте из нескольких исторических тем', 'Зарабатывайте XP пропорционально оценке (A = максимум XP)'], linkLabel: 'Попробовать Эссе-Задание' },
  { title: 'Дискуссия с Философом', desc: 'Каждые 12 часов появляется новый философ. Вступите с ним в философскую дискуссию — у него есть предустановленные аргументы и глубокое знание своей философии. Заставьте его признать поражение и получите XP.', tips: ['Доступно на Pro Learner и выше', 'Новый философ каждые 12 часов', 'Зарабатывайте XP, заставляя философа сдаться', 'Более великие философы дают больше XP', 'Используйте стартовые аргументы или пишите свои'], linkLabel: 'Открыть Дискуссию' },
  { title: 'Видео-Задание', desc: 'Посмотрите обучающее историческое видео (≤10 мин), затем напишите анализ, определив главный мотив или аргумент. Клио оценивает ваш обзор предложение за предложением с живой 3D-анимацией.', tips: ['Только для плана Master Student', 'Новое видео доступно каждые 12 часов', 'Зарабатывайте специальный Видео XP — отдельно от обычного XP', 'Видео XP повышает ваш Исторический Шахматный Ранг', 'Шахматный Ранг даёт преимущество 2× в рейтинге'], linkLabel: 'Открыть Видео-Задание' },
];

const STEPS_MK: StepContent[] = [
  { title: 'Избери го твојот план', desc: 'Започни бесплатно со 4 вводни лекции (по една за секоја епоха). Надгради на Pro за пристап до сите 18 лекции и ВИ Тутор, или избери Master за неограничен ВИ и преземања.', tips: ['Бесплатен план: без кредитна картичка', 'Pro Learner: $10/месец, најпопуларен', 'Master Student: $20/месец, сè неограничено'], linkLabel: 'Погледни Планови' },
  { title: 'Истражи Епохи и Лекции', desc: 'Оди на Епохи и Лекции преку страничната лента. Избери епоха — Античко Доба, Среден Век, Рано Модерно Доба или Модерна Ера — и отвори која сакаш отклучена лекција.', tips: ['Секоја епоха има 6–7 лекции', 'Лекциите содржат богати историски детали', 'Заврши лекција за да го отклучиш квизот за таа епоха'], linkLabel: 'Оди на Епохи' },
  { title: 'Истражи ја Временската Линија', desc: 'Интерактивната временска линија прикажува 50+ клучни настани од сите епохи. Кликни на кој било настан за да прочиташ краток опис и да скокнеш директно на неговата лекција.', tips: ['Филтрирај по епоха со лентата за картички', 'Настаните водат директно до лекции', 'Корисниците на Pro ги гледаат сите категории и филтри'], linkLabel: 'Отвори Временска Линија' },
  { title: 'Прашај ја Клио — твојот ВИ Тутор', desc: 'Клио е твојот личен ВИ тутор за историја. Прашај за сè поврзано со историјата, добивај објаснувања, споредувај настани или задлабочи се во која тема сакаш.', tips: ['Достапно на плановите Pro и Master', 'Pro: 50 пораки/месец', 'Master: неограничени пораки', 'Клио исто така се наоѓа на почетната страница'], linkLabel: 'Отвори ВИ Тутор' },
  { title: 'Прави Квизови и Освои XP', desc: 'Секоја епоха има квиз со 15 прашања кои го тестираат она што си го научил. Точните одговори носат XP, те покачуваат во ниво и го следат твојот резултат по епохи.', tips: ['15 прашања по квиз за епоха', '+15 XP за точен одговор', 'Објаснувања за квизот достапни на Pro+'], linkLabel: 'Оди на Епохи' },
  { title: 'Обиди се со Паметниот Квиз', desc: 'Паметниот Квиз е адаптивна сесија со 10 прашања од сите 4 епохи. Алгоритмот ги таргетира твоите слаби области и ја калибрира тежината според твоите резултати.', tips: ['Достапно на плановите Pro и Master', '10 прашања по сесија', 'Алгоритмот ги приоритизира слабите епохи', 'Освои до +150 XP по сесија'], linkLabel: 'Обиди се со Паметниот Квиз' },
  { title: 'Повторувај со Картички', desc: 'Картичките ти овозможуваат да вежбаш клучни термини, датуми и концепти од секоја лекција. Превртувај ги картичките и означи ги како познати или непознати.', tips: ['Картички од сите лекции', 'Одлично за ревизија пред квизови', 'Следи колку знаеш'], linkLabel: 'Отвори Картички' },
  { title: 'Пишувај Лични Белешки', desc: 'Запиши ги своите мисли, согледувања и резимеа додека учиш. Белешките се поврзани со лекции и зачувани локално — секогаш ти се достапни кога ќе се вратиш.', tips: ['Белешките се зачувани по лекции', 'Достапни на страницата Мои Белешки', 'Сите податоци зачувани локално на твојот уред'], linkLabel: 'Отвори Белешки' },
  { title: 'Следи го Напредокот', desc: 'Страницата за Напредок ги прикажува историјата на XP, стапките на завршување по епохи, резултатите од квизови, серијата и достигнувањата. Виж точно каде се наоѓаш.', tips: ['Серијата се ресетира ако пропуштиш ден', 'Достигнувањата се отклучуваат на пресвртни точки', 'Графиконите се ажурираат по секој квиз'], linkLabel: 'Погледни Напредок' },
  { title: 'Есеј Предизвик', desc: 'Провери го своето историско знаење со есеј предизвик. Клио го оценува твојот есеј во реално време со детална анализа на аргументот, доказите, длабочината и квалитетот на пишување.', tips: ['Достапно на плановите Pro и Master', 'Есеите ги оценува Клио — строго но конструктивно', 'Бирај од повеќе историски теми', 'Освои XP пропорционално на твојата оценка (А = максимален XP)'], linkLabel: 'Обиди се со Есеј Предизвик' },
  { title: 'Дебатирај со Филозоф', desc: 'Секои 12 часа се прикажува нов филозоф. Вклучи се во жестока филозофска дебата — тие имаат претходно вчитани аргументи и силно познавање на сопствената филозофија. Натерај ги да се предадат за да освоиш XP.', tips: ['Достапно на Pro Learner и повисоко', 'Нов филозоф на секои 12 часа', 'Освои XP со тоа што ќе го натераш филозофот да се предаде', 'Поголеми филозофи носат повеќе XP', 'Користи претходно вчитани аргументи или пиши свои'], linkLabel: 'Отвори Дебата' },
  { title: 'Видео Предизвик за Преглед', desc: 'Гледај образователно историско видео (≤10 мин), потоа напиши ја твојата анализа со идентификување на главниот мотив или аргумент. Клио го оценува твојот преглед реченица по реченица со живи 3D анимации.', tips: ['Ексклузивно за планот Master Student', 'Ново видео се отклучува на секои 12 часа', 'Освои специјален Видео XP — одделно од обичниот XP', 'Видео XP го напредува твојот Историски Шаховски Ранг', 'Шаховскиот Ранг дава предност 2× на Листата'], linkLabel: 'Отвори Видео Преглед' },
];

const FAQ_EN: FaqItem[] = [
  { q: 'Is my data saved?', a: 'All progress, notes, and settings are saved locally in your browser. Clearing browser data will reset everything.' },
  { q: 'Can I use Historify on mobile?', a: 'Yes — the app is fully responsive. Use the hamburger menu in the top-left to open the sidebar on mobile.' },
  { q: 'How do I upgrade my plan?', a: 'Go to the Pricing page or click "Upgrade Plan" in the sidebar. Changes apply instantly.' },
  { q: 'What happens to my progress if I upgrade?', a: 'All XP, quiz scores, notes, and streaks carry over seamlessly when you upgrade.' },
  { q: 'How does the Smart Quiz algorithm work?', a: 'It assigns higher weight to eras where your quiz score is low or where you have never attempted a quiz. Difficulty calibrates based on your average score across all quizzes.' },
];

const FAQ_ES: FaqItem[] = [
  { q: '¿Están guardados mis datos?', a: 'Todo el progreso, notas y configuraciones se guardan localmente en tu navegador. Borrar los datos del navegador reiniciará todo.' },
  { q: '¿Puedo usar Historify en móvil?', a: 'Sí — la app es completamente responsiva. Usa el menú hamburguesa en la esquina superior izquierda para abrir la barra lateral en móvil.' },
  { q: '¿Cómo actualizo mi plan?', a: 'Ve a la página de Precios o haz clic en "Actualizar Plan" en la barra lateral. Los cambios se aplican al instante.' },
  { q: '¿Qué pasa con mi progreso si actualizo?', a: 'Todo el XP, puntuaciones de quiz, notas y rachas se mantienen al actualizar.' },
  { q: '¿Cómo funciona el algoritmo del Quiz Inteligente?', a: 'Asigna mayor peso a las eras donde tu puntuación es baja o donde nunca has intentado un quiz. La dificultad se calibra basándose en tu puntuación media en todos los quizzes.' },
];

const FAQ_RU: FaqItem[] = [
  { q: 'Сохраняются ли мои данные?', a: 'Весь прогресс, заметки и настройки сохраняются локально в браузере. Очистка данных браузера сбросит всё.' },
  { q: 'Можно ли использовать Historify на мобильном?', a: 'Да — приложение полностью адаптивно. Используйте кнопку меню в верхнем левом углу, чтобы открыть боковую панель на мобильном устройстве.' },
  { q: 'Как обновить план?', a: 'Перейдите на страницу Тарифов или нажмите «Обновить план» в боковой панели. Изменения применяются мгновенно.' },
  { q: 'Что происходит с прогрессом при обновлении плана?', a: 'Весь XP, результаты викторин, заметки и серии сохраняются при обновлении.' },
  { q: 'Как работает алгоритм Умной Викторины?', a: 'Он присваивает больший вес эпохам, где ваш результат низкий или где вы никогда не проходили викторину. Сложность регулируется на основе вашего среднего результата по всем викторинам.' },
];

const FAQ_MK: FaqItem[] = [
  { q: 'Дали моите податоци се зачувани?', a: 'Целиот напредок, белешки и поставки се зачувани локално во твојот пребарувач. Бришењето на податоците ќе го ресетира сè.' },
  { q: 'Дали можам да го користам Historify на мобилен?', a: 'Да — апликацијата е целосно одговарачка. Користи го мени копчето во горниот лев агол за да ја отвориш страничната лента на мобилен.' },
  { q: 'Како да го надградам мојот план?', a: 'Оди на страницата за Цени или кликни на „Надгради го Планот" во страничната лента. Промените се применуваат веднаш.' },
  { q: 'Што се случува со мојот напредок ако надградам?', a: 'Целиот XP, резултати од квизови, белешки и серии се пренесуваат беспрекорно при надградување.' },
  { q: 'Како функционира алгоритмот на Паметниот Квиз?', a: 'Тој доделува поголема тежина на епохите каде твојот резултат е низок или каде никогаш не си пробувал квиз. Тежината се калибрира врз основа на твојот просечен резултат од сите квизови.' },
];

export function getTranslatedGuideContent(language: Language) {
  const stepsMap: Record<Language, StepContent[]> = { en: STEPS_EN, es: STEPS_ES, ru: STEPS_RU, mk: STEPS_MK };
  const faqMap: Record<Language, FaqItem[]> = { en: FAQ_EN, es: FAQ_ES, ru: FAQ_RU, mk: FAQ_MK };
  const stepsContent = stepsMap[language] ?? STEPS_EN;
  const faqContent = faqMap[language] ?? FAQ_EN;
  return {
    steps: STEP_META.map((meta, i) => ({ ...meta, ...stepsContent[i] })),
    faq: faqContent,
  };
}
