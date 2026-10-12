import { QuestionCategory } from '../types/quiz';

export interface MuseumHall {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  categories: QuestionCategory[];
  badgeText: string;
  themeColor: string;
  bgGradient: string;
  accentBorder: string;
  btnColor: string;
  exhibitName: string;
}

export const MUSEUM_HALLS: MuseumHall[] = [
  {
    id: 'hall_neftegorsk',
    title: 'Зал «История Нефтегорска и Чёрное золото»',
    subtitle: 'Город нефтяников, первые скважины и первопроходцы',
    description: 'Экспозиция посвящена открытию нефтяных месторождений в 1960 году, трудовому подвигу геологов, рождению рабочего поселка и получению статуса города.',
    emoji: '🏛️',
    categories: ['neftegorsk', 'industry'],
    badgeText: 'Зал промышленности',
    themeColor: 'amber',
    bgGradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    accentBorder: 'border-amber-500/40 hover:border-amber-500',
    btnColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    exhibitName: 'Макет первой нефтяной вышки и каска первопроходца'
  },
  {
    id: 'hall_barinovka',
    title: 'Зал «Бариновская мельница и сельские ремёсла»',
    subtitle: 'Уникальная шатровая ветряная мельница 1848 года',
    description: 'Экспозиция знакомит с единственной уцелевшей деревянной мельницей шатрового типа в Самарской области, устройством жерновов и традициями мукомолов.',
    emoji: '🌾',
    categories: ['barinovka', 'architecture'],
    badgeText: 'Памятник деревянного зодчества',
    themeColor: 'orange',
    bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    accentBorder: 'border-orange-500/40 hover:border-orange-500',
    btnColor: 'bg-orange-600 hover:bg-orange-700 text-white',
    exhibitName: 'Мельничный жернов XIX века и старинные весы'
  },
  {
    id: 'hall_utevka',
    title: 'Зал «Духовное наследие: Утёвская икона»',
    subtitle: 'Шедевры иконописца Григория Журавлёва и Храм Святой Троицы',
    description: 'Удивительная история крестьянина, родившегося без рук и ног, который писал иконы и расписывал купол храма, держа кисть в зубах.',
    emoji: '🎨',
    categories: ['utevka'],
    badgeText: 'Духовная святыня',
    themeColor: 'indigo',
    bgGradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    accentBorder: 'border-indigo-500/40 hover:border-indigo-500',
    btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    exhibitName: 'Икона святителя Николая Чудотворца'
  },
  {
    id: 'hall_nature',
    title: 'Зал «Природа, реки и степные просторы»',
    subtitle: 'Река Самара, Жигулевские высоты и заповедная фауна',
    description: 'Богатство природы Нефтегорского района и Самарского Заволжья: реки Съезжая и Чапаевка, ковыльные степи, дрофа, бобры и степная флора.',
    emoji: '🌿',
    categories: ['nature_and_rivers', 'nature'],
    badgeText: 'Экологический зал',
    themeColor: 'emerald',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    accentBorder: 'border-emerald-500/40 hover:border-emerald-500',
    btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    exhibitName: 'Гербарий степного ковыля и коллекция минералов'
  },
  {
    id: 'hall_samara',
    title: 'Зал «Летопись и символы Самарской губернии»',
    subtitle: 'Герб с дикой козой, Запасная столица и оборонительные валы',
    description: 'Исторические вехи региона: Самарская крепость, Закамская засечная черта, роль края в годы Великой Отечественной войны и современные традиции.',
    emoji: '🧭',
    categories: ['samara_region'],
    badgeText: 'Губернский архив',
    themeColor: 'blue',
    bgGradient: 'from-blue-500/10 via-sky-500/5 to-transparent',
    accentBorder: 'border-blue-500/40 hover:border-blue-500',
    btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    exhibitName: 'Исторический штандарт и архивные карты Самарского уезда'
  },
  {
    id: 'hall_museum',
    title: 'Зал «Сокровищница музея nkm63.ru»',
    subtitle: 'Главные фонды, крестьянский быт и археология Поволжья',
    description: 'Уникальные раритеты МБУ «Нефтегорский краеведческий музей»: старинная утварь, ткацкие станки, самовары фабрик Баташевых и летописи поселений.',
    emoji: '🏺',
    categories: ['museum_nkm', 'museum'],
    badgeText: 'Музейные фонды',
    themeColor: 'rose',
    bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    accentBorder: 'border-rose-500/40 hover:border-rose-500',
    btnColor: 'bg-rose-600 hover:bg-rose-700 text-white',
    exhibitName: 'Медный самовар XIX века и старинный рушник'
  }
];

export interface CompletedHallRecord {
  hallId: string;
  hallTitle: string;
  score: number;
  accuracy: number;
  completedAt: string;
}
