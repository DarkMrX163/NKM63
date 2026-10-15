import React, { useState } from 'react';
import { 
  Camera, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Sparkles, 
  Info,
  BookOpen,
  Share2
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export interface PhotoArchiveItem {
  id: string;
  title: string;
  year: string;
  category: 'architecture' | 'streets' | 'courtyard' | 'children' | 'infra';
  categoryLabel: string;
  imageUrl: string;
  fallbackUrl: string;
  description: string;
  historicalContext: string;
  location: string;
  source: string;
}

export const ARCHIVE_PHOTOS: PhotoArchiveItem[] = [
  {
    id: 'photo1',
    title: 'Главная площадь и памятник В.И. Ленину',
    year: '1980–1990 гг.',
    category: 'streets',
    categoryLabel: 'Улицы & Проспекты',
    imageUrl: '/images/photoarchive/photo1.jpg',
    fallbackUrl: 'p6eh4ow3vnlekgdx1u.webp',
    description: 'Ученики начальных классов с учителем шествуют возле монумента на центральной площади города. Вдали видны жилые кварталы и молодая парковая зелень.',
    historicalContext: 'Памятник В.И. Ленину на центральной площади Нефтегорска был торжественно открыт как один из главных архитектурных и идеологических акцентов молодого города нефтяников. В 1980-х годах площадь служила местом проведения праздничных демонстраций 1 Мая и 7 Ноября.',
    location: 'Центральная площадь, Нефтегорск',
    source: 'Архив PastVu #1384488'
  },
  {
    id: 'photo2',
    title: 'Строительство микрорайонов и земляные работы',
    year: '1960–1970 гг.',
    category: 'architecture',
    categoryLabel: 'Строительство & Архитектура',
    imageUrl: '/images/photoarchive/photo2.jpg',
    fallbackUrl: 'GtvBGS5Jpd-ORixULv4N00ggThstabKbklGQUOcQxCMwjxWaKcUoEXv43lQbGxWoMLzHFzybEXHLwNP9cQK5gxwV.jpg',
    description: 'Тяжёлые советские гусеничные бульдозеры ДТ-75 и Т-100 равняют котлованы под фундаменты пятиэтажек. Так закладывался фундамент города.',
    historicalContext: 'Первые кварталы Нефтегорска возводились с высокой скоростью комсомольско-молодёжными бригадами. На заднем плане снимка видны уже заселённые кирпичные дома первых микрорайонов.',
    location: 'Строящийся микрорайон, Нефтегорск',
    source: 'Музейный архив строителей #1389676'
  },
  {
    id: 'photo3',
    title: 'Уютный советский дворик и быт первых жителей',
    year: '1960-е гг.',
    category: 'courtyard',
    categoryLabel: 'Дворовая жизнь & Семья',
    imageUrl: '/images/photoarchive/photo3.jpg',
    fallbackUrl: 'iPcb1GL6Tabrh_brzx6EMYfJhw9rIsMB3DlOLPYPfxQy1gnJ1kmpNGCMPIJ6uUbmD-NGUYEWv49LTvord13PHHL3.jpg',
    description: 'Первые уютные дворы с деревянными штакетниками, сушащимся бельём на степном ветерке и первыми саженцами деревьев.',
    historicalContext: 'В 1960-х годах жильцы новых домов активно благоустраивали свои дворы: высаживали тополя и берёзы, мастерили скамейки и детские беседки-грибки.',
    location: 'Жилой двор 1-го микрорайона, Нефтегорск',
    source: 'Архив PastVu #1376203'
  },
  {
    id: 'photo4',
    title: 'Строительство комплекса общественного центра',
    year: '1970–1975 гг.',
    category: 'architecture',
    categoryLabel: 'Строительство & Архитектура',
    imageUrl: '/images/photoarchive/photo4.jpg',
    fallbackUrl: 'Jw5YzOGCao2ql6_5Lo6C67wwjm7JGFJZnvMiSvOcBsz6RRra9Jtlc1xSxrvwzsXOiSpj1kLcqx_KySL3Gy78Bmj6j5yy5A.jpg',
    description: 'Вид с высоты на возведение Дома культуры «Нефтяник» и административных корпусов. Стенды с наглядной агитацией информировали жителей.',
    historicalContext: 'Дом культуры «Нефтяник» стал главным культурным центром Нефтегорского района, где проводились концерты, кинопоказы и собрания передовиков нефтяной промышленности.',
    location: 'Центральный ансамбль, Нефтегорск',
    source: 'Архив PastVu #1458430'
  },
  {
    id: 'photo5',
    title: 'Дворовая хоккейная коробка и зимний каток',
    year: '1980-е гг.',
    category: 'infra',
    categoryLabel: 'Инфраструктура & Спорт',
    imageUrl: '/images/photoarchive/photo5.jpg',
    fallbackUrl: 'TPtEZtLC0_bw7ytMbpVQwhvHaM3b5RlEeiMPGUwUUcqpc7CFzupe_BKtRouGAWWJYE3svIUhAxGA7Kn2TCADTPc5.jpg',
    description: 'Зимняя жизнь дворов Нефтегорска. Сотни детей и подростков на коньках: дворовые матчи по хоккею с шайбой на свежем воздухе.',
    historicalContext: 'Хоккейные коробки заливались за счет комсомольских организаций и энтузиастов-жильцов. Дворовый турнир «Золотая шайба» был самым популярным зимним событием.',
    location: 'Двор по Проспекту Победы, Нефтегорск',
    source: 'Архив PastVu #1571064'
  },
  {
    id: 'photo6',
    title: 'Зимняя прогулка у детского сада № 6',
    year: '1980-е гг.',
    category: 'children',
    categoryLabel: 'Детство & Школа',
    imageUrl: '/images/photoarchive/photo6.jpg',
    fallbackUrl: 'y5wXvKXBiACnX0uaR1mkE_8elGO0mtSR46fTjcsQq3CQzdeaqwU5XpqXv9pFTPxqEGm72KpHtvQ5y76vfNwqgfJUNFzbiw.jpg',
    description: 'Мать и маленькая дочка в традиционных советских цигейковых шубках и шапках-ушанках на игровой площадке с резными деревянными домиками.',
    historicalContext: 'С развитием Нефтегорска открывались современные детские сады, обеспечивавшие уход за детьми нефтяников и строителей.',
    location: 'Территория детского сада №6, Нефтегорск',
    source: 'Архив PastVu #1430635'
  },
  {
    id: 'photo7',
    title: 'Школьный учебно-опытнический участок юннатов',
    year: '1970–1980 гг.',
    category: 'children',
    categoryLabel: 'Детство & Школа',
    imageUrl: '/images/photoarchive/photo7.jpg',
    fallbackUrl: 'BmU4Ro8fZrdhuzKHaTmPWNQy8F4wzCjwrvAZWGF8VL59uXXnC4drS_Lpfo3Cx2C1upWYyIgNatn0P-33h04_B_MmzosfVw.jpg',
    description: 'Школьники-юннаты Нефтегорска с лейками и вёдрами ухаживают за делянками «Вика яровая» и кукурузой, осваивая основы агрономии.',
    historicalContext: 'Школьные опытные участки обучали детей уважению к земледелию и труду. На заволжских чернозёмах выращивались полезные культуры и цветы.',
    location: 'Школьный участок, Нефтегорск',
    source: 'Архив PastVu #1570828'
  },
  {
    id: 'photo8',
    title: 'Проспект Победы и благоустройство 1970-х',
    year: '1975 г.',
    category: 'streets',
    categoryLabel: 'Улицы & Проспекты',
    imageUrl: '/images/photoarchive/photo8.jpg',
    fallbackUrl: 'NJiIsBcuolekyIXJflitXL62si4WPZLP_CiHqLRutFw785BPJngFegN7o6_rRYwCW9k-s9zcXvxj4-Vdyl1naIWl.jpg',
    description: 'Велосипедист на только что заасфальтированном Проспекте Победы. На фасаде жилого дома возвышается транспарант «Слава советскому народу!».',
    historicalContext: 'Проспект Победы — центральная магистраль города. Укладка первого асфальта и посадка газонов вдоль проспекта была завершена к середине 1970-х годов.',
    location: 'Проспект Победы, д. 16, Нефтегорск',
    source: 'Архив PastVu #1458492'
  },
  {
    id: 'photo9',
    title: 'Строительство и запуск городского гидроузла',
    year: '1980 г.',
    category: 'infra',
    categoryLabel: 'Инфраструктура & Спорт',
    imageUrl: '/images/photoarchive/photo9.jpg',
    fallbackUrl: 'vA0KMSlNhfWPhA5oN_HzbQ5ASeagTYQWnbNWtyBCWbrF0iTKv9fOtp1yVUJuajbU21Red2rWVp6DcoH8dYg_1R4UupZ-TQ.jpg',
    description: 'Руководители стройки и инженеры инспектируют запуск водосбросного узла и водозаборной инфраструктуры Нефтегорска.',
    historicalContext: 'Обеспечение города чистой питьевой и технической водой было важнейшим этапом развития инженерных сетей в степной зоне Поволжья.',
    location: 'Городской гидроузел, Нефтегорск',
    source: 'Архив PastVu #1384524'
  },
  {
    id: 'photo10',
    title: '«Нефтегорск 1979 г.»: Универмаг и лозунги эпохи',
    year: '1979 г.',
    category: 'streets',
    categoryLabel: 'Улицы & Проспекты',
    imageUrl: '/images/photoarchive/photo10.jpg',
    fallbackUrl: '6BXbU9H-SF-ANcbUTWHtbe-MZ0p3bnPdgEHhGtHwhTMaM0qs3Y3NOTtfWtYcryT6wv6rRJNUFFPENO5gjGxyaDhNrwDzSQ.jpg',
    description: 'Редкий цветной архивный снимок 1979 года. Торжественное здание главного Универмага Нефтегорска с плакатом «Решения XXV съезда КПСС претворим в жизнь!».',
    historicalContext: 'Универмаг Нефтегорска был главным торговым комплексом района. В 1979 году город отмечал успешное выполнение показателей пятилетки.',
    location: 'Универмаг на Проспекте Победы, Нефтегорск',
    source: 'Архивная коллекция #1376202'
  }
];

export const PhotoArchive: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const categories = [
    { id: 'all', label: 'Все снимки (10)' },
    { id: 'architecture', label: 'Строительство & Архитектура' },
    { id: 'streets', label: 'Улицы & Проспекты' },
    { id: 'courtyard', label: 'Дворовая жизнь' },
    { id: 'children', label: 'Детство & Школа' },
    { id: 'infra', label: 'Инфраструктура' }
  ];

  const filteredPhotos = ARCHIVE_PHOTOS.filter((photo) => {
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    const matchesQuery = 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const openLightbox = (index: number) => {
    soundFx.playClick();
    setActivePhotoIdx(index);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    soundFx.playClick();
    setActivePhotoIdx(null);
  };

  const prevPhoto = () => {
    soundFx.playClick();
    if (activePhotoIdx !== null) {
      setActivePhotoIdx((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev! - 1));
      setIsZoomed(false);
    }
  };

  const nextPhoto = () => {
    soundFx.playClick();
    if (activePhotoIdx !== null) {
      setActivePhotoIdx((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev! + 1));
      setIsZoomed(false);
    }
  };

  const currentPhoto = activePhotoIdx !== null ? filteredPhotos[activePhotoIdx] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-amber-200/60 dark:border-slate-800 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold font-serif border border-amber-500/20">
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              Краеведческая фотохроника Нефтегорска
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white leading-tight">
              Исторический Фотоархив (1960–1990 гг.)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Исследуйте 10 подлинных архивных фотографий строительства Нефтегорска, запечатлевших первые жилые кварталы, запуск объектов инфраструктуры, дворовый быт, детские сады и атмосферу молодых улиц Поволжья.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-4 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-bold font-serif border border-amber-300/50 flex items-center gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              10 Подлинных Снимков
            </span>
          </div>
        </div>

        {/* Controls: Search and Categories */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по названию, году, месту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { soundFx.playClick(); setSelectedCategory(cat.id); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Cards Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800">
          <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Снимков по вашему запросу не найдено</p>
          <p className="text-xs text-slate-500 mt-1">Попробуйте изменить поисковый запрос или фильтр категории</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-300 flex flex-col"
            >
              {/* Image Frame */}
              <div 
                className="relative aspect-4/3 overflow-hidden bg-slate-950 cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  onError={(e) => {
                    e.currentTarget.src = photo.fallbackUrl;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                />

                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold font-serif shadow-md border border-amber-400/40">
                    📜 {photo.year}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold shadow-md border border-slate-700">
                    {photo.categoryLabel}
                  </span>
                </div>

                {/* Zoom Hover Button */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3.5 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-4 h-4" />
                    Увеличить снимок
                  </span>
                </div>
              </div>

              {/* Photo Description Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 
                    onClick={() => openLightbox(index)}
                    className="text-base font-bold font-serif text-slate-900 dark:text-white leading-snug hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                  >
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {photo.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate max-w-[170px]">{photo.location}</span>
                  </span>
                  <button
                    onClick={() => openLightbox(index)}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                  >
                    Подробнее →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / High-Res View Modal */}
      {currentPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-xs font-bold font-serif">
                  {currentPhoto.year}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white font-serif truncate max-w-md">
                  {currentPhoto.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentPhoto.imageUrl}
                  download={`neftegorsk_archive_${currentPhoto.id}.jpg`}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="Скачать фото"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
              
              {/* Photo Viewport */}
              <div className="lg:col-span-8 bg-black relative flex items-center justify-center p-4 min-h-[300px] sm:min-h-[420px]">
                <img
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.title}
                  onError={(e) => {
                    e.currentTarget.src = currentPhoto.fallbackUrl;
                  }}
                  className={`max-h-[65vh] w-auto object-contain transition-transform duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Left/Right Navigation Buttons */}
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-white hover:bg-amber-500 transition-colors border border-slate-700 shadow-xl"
                  title="Предыдущее фото"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 text-white hover:bg-amber-500 transition-colors border border-slate-700 shadow-xl"
                  title="Следующее фото"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Photo History & Context Sidebar */}
              <div className="lg:col-span-4 p-6 bg-slate-900/95 space-y-5 border-t lg:border-t-0 lg:border-l border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-serif">
                    {currentPhoto.categoryLabel}
                  </span>
                  <h4 className="text-lg font-bold text-white font-serif mt-1 leading-snug">
                    {currentPhoto.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {currentPhoto.location}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 font-serif">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    Краеведческое описание:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {currentPhoto.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-serif">
                    <Info className="w-4 h-4 text-amber-400" />
                    Исторический контекст:
                  </div>
                  <p className="text-xs text-amber-100/90 leading-relaxed font-serif">
                    {currentPhoto.historicalContext}
                  </p>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-800 flex items-center justify-between">
                  <span>{currentPhoto.source}</span>
                  <span className="font-mono text-amber-500">{activePhotoIdx! + 1} из {filteredPhotos.length}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
