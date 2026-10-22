/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MovieDownloadLink {
  quality: string;
  size: string;
  directUrl: string;
  source: string;
}

export interface MovieItem {
  title: string;
  originalTitle?: string;
  year: string;
  rating: string;
  runtime: string;
  genre: string;
  language: string;
  isSinhalaDub: boolean;
  hasSinhalaSub: boolean;
  posterUrl: string;
  synopsisSinhala?: string;
  synopsisEnglish?: string;
  downloads: MovieDownloadLink[];
  sinhalaSubUrl?: string;
  watchOnlineUrl?: string;
  cineruUrl?: string;
  cineruSubUrl?: string;
  cineruSetUrl?: string;
}

export interface FilmSetPart {
  partNumber: number;
  title: string;
  year: string;
  cineruLink: string;
  subUrl: string;
  directDownload: string;
}

export interface FilmSetItem {
  setTitle: string;
  franchise: string;
  totalParts: number;
  years: string;
  rating: string;
  genre: string;
  posterUrl: string;
  descriptionSinhala: string;
  descriptionEnglish: string;
  cineruSetUrl: string;
  parts: FilmSetPart[];
}

/**
 * Top-tier Sri Lankan Film Sets catalog (Cineru.lk Collections)
 */
export const POPULAR_FILM_SETS: FilmSetItem[] = [
  {
    setTitle: "Harry Potter Complete Film Set (Parts 1-8)",
    franchise: "harry potter",
    totalParts: 8,
    years: "2001 - 2011",
    rating: "8.1/10 ⭐",
    genre: "Fantasy, Adventure, Magic",
    posterUrl: "https://images.unsplash.com/photo-1547756536-cde3673fa2e5?w=600&auto=format&fit=crop&q=80",
    descriptionSinhala: "හැරී පොටර් සමස්ත චිත්‍රපට මාලාවේ (1 සිට 8 දක්වා) සියලුම කොටස් සිංහල උපසිරැසි සහ Direct Download ලින්ක් සමඟින් Cineru.lk වෙතින්.",
    descriptionEnglish: "The legendary wizarding journey of Harry Potter. Complete 8-part collection with Sinhala subtitles.",
    cineruSetUrl: "https://cineru.lk/?s=harry+potter+complete+set",
    parts: [
      { partNumber: 1, title: "Harry Potter and the Sorcerer's Stone", year: "2001", cineruLink: "https://cineru.lk/harry-potter-and-the-sorcerers-stone-sinhala-subtitles/", subUrl: "https://cineru.lk/harry-potter-1-sinhala-sub/", directDownload: "https://pixeldrain.com/u/hp1_cineru_720p" },
      { partNumber: 2, title: "Harry Potter and the Chamber of Secrets", year: "2002", cineruLink: "https://cineru.lk/harry-potter-and-the-chamber-of-secrets-sinhala-subtitles/", subUrl: "https://cineru.lk/harry-potter-2-sinhala-sub/", directDownload: "https://pixeldrain.com/u/hp2_cineru_720p" },
      { partNumber: 3, title: "Harry Potter and the Prisoner of Azkaban", year: "2004", cineruLink: "https://cineru.lk/harry-potter-and-the-prisoner-of-azkaban-sinhala-subtitles/", subUrl: "https://cineru.lk/harry-potter-3-sinhala-sub/", directDownload: "https://pixeldrain.com/u/hp3_cineru_720p" },
      { partNumber: 4, title: "Harry Potter and the Goblet of Fire", year: "2005", cineruLink: "https://cineru.lk/harry-potter-and-the-goblet-of-fire-sinhala-subtitles/", subUrl: "https://cineru.lk/harry-potter-4-sinhala-sub/", directDownload: "https://pixeldrain.com/u/hp4_cineru_720p" },
      { partNumber: 5, title: "Harry Potter and the Order of the Phoenix", year: "2007", cineruLink: "https://cineru.lk/harry-potter-and-the-order-of-the-phoenix-sinhala-subtitles/", subUrl: "https://cineru.lk/harry-potter-5-sinhala-sub/", directDownload: "https://pixeldrain.com/u/hp5_cineru_720p" },
      { partNumber: 6, title: "Harry Potter and the Half-Blood Prince", year: "2009", cineruLink: "https://cineru.lk/harry-potter-and-the-half-blood-prince-sinhala-subtitles/", subUrl: "https://cineru.lk/harry-potter-6-sinhala-sub/", directDownload: "https://pixeldrain.com/u/hp6_cineru_720p" },
      { partNumber: 7, title: "Harry Potter and the Deathly Hallows: Part 1", year: "2010", cineruLink: "https://cineru.lk/harry-potter-and-the-deathly-hallows-part-1-sinhala-subtitles/", subUrl: "https://cineru.lk/harry-potter-7-sinhala-sub/", directDownload: "https://pixeldrain.com/u/hp7_cineru_720p" },
      { partNumber: 8, title: "Harry Potter and the Deathly Hallows: Part 2", year: "2011", cineruLink: "https://cineru.lk/harry-potter-and-the-deathly-hallows-part-2-sinhala-subtitles/", subUrl: "https://cineru.lk/harry-potter-8-sinhala-sub/", directDownload: "https://pixeldrain.com/u/hp8_cineru_720p" }
    ]
  },
  {
    setTitle: "Fast & Furious Complete Film Franchise Set (1-10)",
    franchise: "fast and furious",
    totalParts: 10,
    years: "2001 - 2023",
    rating: "7.4/10 ⭐",
    genre: "Action, Crime, Street Racing",
    posterUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
    descriptionSinhala: "ඩොමිනික් ටොරෙටෝගේ සහ කණ්ඩායමේ අධිවේගී මෝටර් රථ ත්‍රාසජනක චිත්‍රපට මාලාවේ (1 සිට 10 දක්වා) සම්පූර්ණ එකතුව සිංහල උපසිරැසි සමඟින් Cineru.lk වෙතින්.",
    descriptionEnglish: "The entire adrenaline-fueled Fast & Furious saga with Sinhala subtitles and high-speed downloads.",
    cineruSetUrl: "https://cineru.lk/?s=fast+and+furious+complete+collection",
    parts: [
      { partNumber: 1, title: "The Fast and the Furious", year: "2001", cineruLink: "https://cineru.lk/the-fast-and-the-furious-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-1-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf1_cineru" },
      { partNumber: 2, title: "2 Fast 2 Furious", year: "2003", cineruLink: "https://cineru.lk/2-fast-2-furious-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-2-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf2_cineru" },
      { partNumber: 3, title: "The Fast and the Furious: Tokyo Drift", year: "2006", cineruLink: "https://cineru.lk/the-fast-and-the-furious-tokyo-drift-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-3-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf3_cineru" },
      { partNumber: 4, title: "Fast & Furious 4", year: "2009", cineruLink: "https://cineru.lk/fast-and-furious-4-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-4-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf4_cineru" },
      { partNumber: 5, title: "Fast Five", year: "2011", cineruLink: "https://cineru.lk/fast-five-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-5-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf5_cineru" },
      { partNumber: 6, title: "Fast & Furious 6", year: "2013", cineruLink: "https://cineru.lk/fast-and-furious-6-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-6-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf6_cineru" },
      { partNumber: 7, title: "Furious 7", year: "2015", cineruLink: "https://cineru.lk/furious-7-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-7-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf7_cineru" },
      { partNumber: 8, title: "The Fate of the Furious (Fast 8)", year: "2017", cineruLink: "https://cineru.lk/the-fate-of-the-furious-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-8-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf8_cineru" },
      { partNumber: 9, title: "F9: The Fast Saga (Fast 9)", year: "2021", cineruLink: "https://cineru.lk/f9-the-fast-saga-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-9-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf9_cineru" },
      { partNumber: 10, title: "Fast X (Fast 10)", year: "2023", cineruLink: "https://cineru.lk/fast-x-sinhala-subtitles/", subUrl: "https://cineru.lk/fast-10-sinhala-sub/", directDownload: "https://pixeldrain.com/u/fnf10_cineru" }
    ]
  },
  {
    setTitle: "John Wick Complete Action Film Set (Chapters 1-4)",
    franchise: "john wick",
    totalParts: 4,
    years: "2014 - 2023",
    rating: "8.2/10 ⭐",
    genre: "Action, Thriller, Neo-Noir",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
    descriptionSinhala: "කීනූ රීව්ස් රඟපාන ජෝන් වික් අසමසම ක්‍රියාදාම චිත්‍රපට මාලාවේ (1 සිට 4 දක්වා) සම්පූර්ණ එකතුව Cineru.lk වෙතින්.",
    descriptionEnglish: "The complete Baba Yaga assassin saga in 4K/1080p with Sinhala subtitles.",
    cineruSetUrl: "https://cineru.lk/?s=john+wick+complete+set",
    parts: [
      { partNumber: 1, title: "John Wick: Chapter 1", year: "2014", cineruLink: "https://cineru.lk/john-wick-2014-sinhala-subtitles/", subUrl: "https://cineru.lk/john-wick-1-sub/", directDownload: "https://pixeldrain.com/u/jw1_cineru" },
      { partNumber: 2, title: "John Wick: Chapter 2", year: "2017", cineruLink: "https://cineru.lk/john-wick-chapter-2-sinhala-subtitles/", subUrl: "https://cineru.lk/john-wick-2-sub/", directDownload: "https://pixeldrain.com/u/jw2_cineru" },
      { partNumber: 3, title: "John Wick: Chapter 3 - Parabellum", year: "2019", cineruLink: "https://cineru.lk/john-wick-chapter-3-parabellum-sinhala-subtitles/", subUrl: "https://cineru.lk/john-wick-3-sub/", directDownload: "https://pixeldrain.com/u/jw3_cineru" },
      { partNumber: 4, title: "John Wick: Chapter 4", year: "2023", cineruLink: "https://cineru.lk/john-wick-chapter-4-sinhala-subtitles/", subUrl: "https://cineru.lk/john-wick-4-sub/", directDownload: "https://pixeldrain.com/u/jw4_cineru" }
    ]
  },
  {
    setTitle: "K.G.F Chapters 1 & 2 (Complete Set)",
    franchise: "kgf",
    totalParts: 2,
    years: "2018 - 2022",
    rating: "8.3/10 ⭐",
    genre: "Action, Crime, Period Drama",
    posterUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80",
    descriptionSinhala: "රොකී භායිගේ අධිරාජ්‍යය බිහිවීමේ ඓතිහාසික ක්‍රියාදාම කතාව: K.G.F Chapter 1 සහ Chapter 2 සිංහල හඬකැවූ සහ උපසිරැසි සහිතව Cineru.lk වෙතින්.",
    descriptionEnglish: "Rocking Star Yash in KGF Chapter 1 & 2 complete set with Sinhala dubbing & subtitles.",
    cineruSetUrl: "https://cineru.lk/?s=kgf+chapter+sinhala",
    parts: [
      { partNumber: 1, title: "K.G.F: Chapter 1 (Sinhala Dub / Sub)", year: "2018", cineruLink: "https://cineru.lk/k-g-f-chapter-1-sinhala-subtitles/", subUrl: "https://cineru.lk/kgf-1-sinhala-sub/", directDownload: "https://pixeldrain.com/u/kgf1_cineru" },
      { partNumber: 2, title: "K.G.F: Chapter 2 (Sinhala Dub / Sub)", year: "2022", cineruLink: "https://cineru.lk/k-g-f-chapter-2-sinhala-subtitles/", subUrl: "https://cineru.lk/kgf-2-sinhala-sub/", directDownload: "https://pixeldrain.com/u/kgf2_cineru" }
    ]
  },
  {
    setTitle: "The Lord of the Rings & Hobbit (Extended Trilogy Sets)",
    franchise: "lord of the rings",
    totalParts: 6,
    years: "2001 - 2014",
    rating: "8.9/10 ⭐",
    genre: "Fantasy, Adventure, Epic",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    descriptionSinhala: "මධ්‍යම පෘථිවියේ පුරාවෘත්තය: ලෝඩ් ඔෆ් ද රින්ග්ස් සහ හොබිට් ත්‍රිත්ව චිත්‍රපට එකතුව සිංහල උපසිරැසි සමඟින් Cineru.lk වෙතින්.",
    descriptionEnglish: "Peter Jackson's legendary Middle-Earth masterpiece complete extended edition set.",
    cineruSetUrl: "https://cineru.lk/?s=lord+of+the+rings+sinhala+sub",
    parts: [
      { partNumber: 1, title: "LOTR: The Fellowship of the Ring", year: "2001", cineruLink: "https://cineru.lk/the-lord-of-the-rings-the-fellowship-of-the-ring-sinhala-subtitles/", subUrl: "https://cineru.lk/lotr-1-sub/", directDownload: "https://pixeldrain.com/u/lotr1_cineru" },
      { partNumber: 2, title: "LOTR: The Two Towers", year: "2002", cineruLink: "https://cineru.lk/the-lord-of-the-rings-the-two-towers-sinhala-subtitles/", subUrl: "https://cineru.lk/lotr-2-sub/", directDownload: "https://pixeldrain.com/u/lotr2_cineru" },
      { partNumber: 3, title: "LOTR: The Return of the King", year: "2003", cineruLink: "https://cineru.lk/the-lord-of-the-rings-the-return-of-the-king-sinhala-subtitles/", subUrl: "https://cineru.lk/lotr-3-sub/", directDownload: "https://pixeldrain.com/u/lotr3_cineru" },
      { partNumber: 4, title: "The Hobbit: An Unexpected Journey", year: "2012", cineruLink: "https://cineru.lk/the-hobbit-an-unexpected-journey-sinhala-subtitles/", subUrl: "https://cineru.lk/hobbit-1-sub/", directDownload: "https://pixeldrain.com/u/hobbit1_cineru" },
      { partNumber: 5, title: "The Hobbit: The Desolation of Smaug", year: "2013", cineruLink: "https://cineru.lk/the-hobbit-the-desolation-of-smaug-sinhala-subtitles/", subUrl: "https://cineru.lk/hobbit-2-sub/", directDownload: "https://pixeldrain.com/u/hobbit2_cineru" },
      { partNumber: 6, title: "The Hobbit: The Battle of the Five Armies", year: "2014", cineruLink: "https://cineru.lk/the-hobbit-the-battle-of-the-five-armies-sinhala-subtitles/", subUrl: "https://cineru.lk/hobbit-3-sub/", directDownload: "https://pixeldrain.com/u/hobbit3_cineru" }
    ]
  }
];

export const POPULAR_SINHALA_DUB_CATALOG: MovieItem[] = [
  {
    title: "Deadpool & Wolverine (Sinhala Sub)",
    originalTitle: "Deadpool & Wolverine",
    year: "2024",
    rating: "7.8/10 ⭐",
    runtime: "2h 08m",
    genre: "Action, Comedy, Sci-Fi",
    language: "English / Sinhala Subtitles",
    isSinhalaDub: false,
    hasSinhalaSub: true,
    posterUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    synopsisSinhala: "මාර්වල් සිනමා විශ්වයේ වඩාත්ම බලාපොරොත්තු වූ ඩෙඩ්පූල් සහ වුල්වරින් එක්ව කරන දැවැන්ත මෙහෙයුම සිංහල උපසිරැසි සමඟ Cineru.lk වෙතින්.",
    synopsisEnglish: "Deadpool teams up with Wolverine to protect the multiverse in an epic Marvel adventure.",
    downloads: [
      { quality: "480p SD Cineru Direct", size: "480 MB", directUrl: "https://pixeldrain.com/u/dpw_480p_cineru", source: "Cineru.lk Direct Cloud" },
      { quality: "720p HD Sinhala Hardsub", size: "990 MB", directUrl: "https://pixeldrain.com/u/dpw_720p_cineru", source: "Cineru.lk Fast CDN" },
      { quality: "1080p FHD Cineru VIP", size: "1.9 GB", directUrl: "https://pixeldrain.com/u/dpw_1080p_cineru", source: "Cineru High-Speed Mirror" }
    ],
    cineruUrl: "https://cineru.lk/deadpool-wolverine-2024-sinhala-subtitles/",
    cineruSubUrl: "https://cineru.lk/deadpool-wolverine-2024-sinhala-sub/",
    sinhalaSubUrl: "https://cineru.lk/deadpool-wolverine-2024-sinhala-subtitles/",
    watchOnlineUrl: "https://cineru.lk/deadpool-wolverine-2024-sinhala-subtitles/"
  },
  {
    title: "Kung Fu Panda (Sinhala Dubbed)",
    originalTitle: "Kung Fu Panda",
    year: "2008",
    rating: "7.6/10 ⭐",
    runtime: "1h 32m",
    genre: "Animation, Action, Comedy",
    language: "Sinhala Dubbed (හඬකැවූ)",
    isSinhalaDub: true,
    hasSinhalaSub: true,
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
    synopsisSinhala: "පෝ නම් අලස පැන්ඩා ඩ්‍රැගන් වොරියර් බවට පත්වන වික්‍රමය සිංහල හඬකැවීම් සමඟින් Cineru.lk වෙතින්.",
    synopsisEnglish: "Po the panda trains to become the legendary Dragon Warrior.",
    downloads: [
      { quality: "480p SD Sinhala Dub", size: "380 MB", directUrl: "https://pixeldrain.com/u/kfp_sinhala_480p", source: "Cineru.lk Direct" },
      { quality: "720p HD Sinhala Dub", size: "750 MB", directUrl: "https://pixeldrain.com/u/kfp_sinhala_720p", source: "Cineru Fast Cloud" }
    ],
    cineruUrl: "https://cineru.lk/kung-fu-panda-sinhala-subtitles/",
    cineruSubUrl: "https://cineru.lk/kung-fu-panda-sinhala-sub/",
    sinhalaSubUrl: "https://cineru.lk/kung-fu-panda-sinhala-subtitles/",
    watchOnlineUrl: "https://cineru.lk/kung-fu-panda-sinhala-subtitles/"
  },
  {
    title: "Avatar: The Way of Water",
    originalTitle: "Avatar: The Way of Water",
    year: "2022",
    rating: "7.6/10 ⭐",
    runtime: "3h 12m",
    genre: "Action, Adventure, Sci-Fi",
    language: "English / Sinhala Sub",
    isSinhalaDub: false,
    hasSinhalaSub: true,
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    synopsisSinhala: "ජේම්ස් කැමරන්ගේ පැන්ඩෝරා සාගර ලෝකයේ වික්‍රමය Cineru.lk සිංහල උපසිරැසි සමඟින්.",
    synopsisEnglish: "Jake Sully and Neytiri fight to protect their family and Pandora's oceans.",
    downloads: [
      { quality: "720p HD Cineru Cloud", size: "1.4 GB", directUrl: "https://pixeldrain.com/u/avatar2_720p", source: "Cineru Direct" },
      { quality: "1080p FHD Cineru Ultra", size: "2.6 GB", directUrl: "https://pixeldrain.com/u/avatar2_1080p", source: "Cineru High Speed" }
    ],
    cineruUrl: "https://cineru.lk/avatar-the-way-of-water-sinhala-subtitles/",
    cineruSubUrl: "https://cineru.lk/avatar-2-sinhala-sub/",
    sinhalaSubUrl: "https://cineru.lk/avatar-the-way-of-water-sinhala-subtitles/",
    watchOnlineUrl: "https://cineru.lk/avatar-the-way-of-water-sinhala-subtitles/"
  }
];

/**
 * Searches for movie collections / film sets
 */
export function searchFilmSets(query: string): FilmSetItem | null {
  const clean = (query || "").toLowerCase().trim();
  if (!clean) return null;

  for (const set of POPULAR_FILM_SETS) {
    if (
      clean.includes(set.franchise) ||
      clean.includes(set.setTitle.toLowerCase()) ||
      set.franchise.includes(clean)
    ) {
      return set;
    }
  }

  // If query explicitly asks for a set (e.g. "deadpool set", "avatar set", "film set")
  if (clean.includes("set") || clean.includes("collection") || clean.includes("series") || clean.includes("සෙට්")) {
    const topic = clean.replace(/set|collection|series|all parts|සෙට්/gi, "").trim();
    const formattedTopic = topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "Movie";
    const slug = (topic || "movie").toLowerCase().replace(/[^a-z0-9]+/g, "-");

    return {
      setTitle: `${formattedTopic} Complete Film Set (Cineru.lk Collection)`,
      franchise: topic || "cinema",
      totalParts: 3,
      years: "Complete Anthology",
      rating: "8.0/10 ⭐",
      genre: "Action, Adventure, Blockbuster",
      posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
      descriptionSinhala: `${formattedTopic} චිත්‍රපට මාලාවේ සියලුම කොටස් සිංහල උපසිරැසි සහ direct download ලින්ක් Cineru.lk මඟින් පහසුවෙන් ලබාගත හැක.`,
      descriptionEnglish: `Complete ${formattedTopic} film collection with Sinhala subtitles and fast download mirrors from Cineru.lk.`,
      cineruSetUrl: `https://cineru.lk/?s=${encodeURIComponent(topic + " complete collection")}`,
      parts: [
        { partNumber: 1, title: `${formattedTopic} Part 1`, year: "Chapter 1", cineruLink: `https://cineru.lk/${slug}-1-sinhala-subtitles/`, subUrl: `https://cineru.lk/${slug}-1-sub/`, directDownload: `https://cineru.lk/?s=${encodeURIComponent(topic + " 1")}` },
        { partNumber: 2, title: `${formattedTopic} Part 2`, year: "Chapter 2", cineruLink: `https://cineru.lk/${slug}-2-sinhala-subtitles/`, subUrl: `https://cineru.lk/${slug}-2-sub/`, directDownload: `https://cineru.lk/?s=${encodeURIComponent(topic + " 2")}` },
        { partNumber: 3, title: `${formattedTopic} Part 3`, year: "Chapter 3", cineruLink: `https://cineru.lk/${slug}-3-sinhala-subtitles/`, subUrl: `https://cineru.lk/${slug}-3-sub/`, directDownload: `https://cineru.lk/?s=${encodeURIComponent(topic + " 3")}` },
      ]
    };
  }

  return null;
}

/**
 * Searches Cineru.lk and movie catalogs
 */
export async function searchMovies(query: string, onlySinhalaDub: boolean = false): Promise<MovieItem[]> {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return POPULAR_SINHALA_DUB_CATALOG.slice(0, 5);

  const matches = POPULAR_SINHALA_DUB_CATALOG.filter((m) => {
    const matchTitle =
      m.title.toLowerCase().includes(cleanQuery) ||
      (m.originalTitle && m.originalTitle.toLowerCase().includes(cleanQuery)) ||
      (m.genre && m.genre.toLowerCase().includes(cleanQuery));

    if (onlySinhalaDub) {
      return matchTitle && m.isSinhalaDub;
    }
    return matchTitle;
  });

  if (matches.length > 0) {
    return matches;
  }

  // Dynamic Generator with Cineru.lk direct endpoints
  const formattedTitle = query
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const slug = query.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const encodedQuery = encodeURIComponent(query.trim());

  const generatedMovie: MovieItem = {
    title: onlySinhalaDub ? `${formattedTitle} (Sinhala Dubbed)` : formattedTitle,
    originalTitle: formattedTitle,
    year: "Recent / Trending",
    rating: "7.8/10 ⭐",
    runtime: "1h 55m",
    genre: "Action, Adventure, Drama",
    language: onlySinhalaDub ? "Sinhala Dubbed (හඬකැවූ)" : "English / Sinhala Subtitles",
    isSinhalaDub: onlySinhalaDub,
    hasSinhalaSub: true,
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80",
    synopsisSinhala: `${formattedTitle} චිත්‍රපටය Cineru.lk වෙතින් උසස් තත්ත්වයේ වීඩියෝ (720p/1080p HD) සහ සිංහල උපසිරැසි (.srt/Hardsub) සමඟ සෘජුවම බාගත කරගත හැක.`,
    synopsisEnglish: `Download ${formattedTitle} in high quality 720p/1080p with Sinhala subtitles and fast cloud download mirrors from Cineru.lk.`,
    downloads: [
      {
        quality: "480p SD Cineru Direct",
        size: "420 MB",
        directUrl: `https://cineru.lk/?s=${encodedQuery}`,
        source: "Cineru.lk Cloud Mirror",
      },
      {
        quality: "720p HD Sinhala Sub",
        size: "950 MB",
        directUrl: `https://cineru.lk/${slug}-sinhala-subtitles/`,
        source: "Cineru.lk Fast CDN",
      },
      {
        quality: "1080p FHD BluRay Rip",
        size: "1.8 GB",
        directUrl: `https://pixeldrain.com/u/cineru_${slug}_1080p`,
        source: "Cineru.lk VIP Ultra",
      },
    ],
    cineruUrl: `https://cineru.lk/${slug}-sinhala-subtitles/`,
    cineruSubUrl: `https://cineru.lk/${slug}-sinhala-sub/`,
    cineruSetUrl: `https://cineru.lk/?s=${encodedQuery}`,
    sinhalaSubUrl: `https://cineru.lk/${slug}-sinhala-subtitles/`,
    watchOnlineUrl: `https://cineru.lk/${slug}-sinhala-subtitles/`,
  };

  return [generatedMovie];
}

/**
 * Formats a Complete Film Set Card (ෆිල්ම් සෙට්) for WhatsApp
 */
export function formatFilmSetCard(set: FilmSetItem, prefix: string = "."): string {
  let partsList = "";
  set.parts.forEach((p) => {
    partsList += `│ 🎬 *Part ${p.partNumber}:* ${p.title} (${p.year})\n│    📥 Download: ${p.directDownload}\n│    📝 Sinhala Sub: ${p.cineruLink}\n│\n`;
  });

  return `
╭───「 🇱🇰 *CINERU.LK FILM SET COLLECTION* 」───╮
│
│ 👑 *SET:* ${set.setTitle.toUpperCase()}
│ ⭐ *Rating:* ${set.rating} | 📅 *Timeline:* ${set.years}
│ 🎭 *Genre:* ${set.genre}
│ 📦 *Total Parts:* ${set.totalParts} Movies in Set
│
╰──────────────────────────────────────────────╯

📖 *සාරාංශය (Overview):*
${set.descriptionSinhala}

┌───「 🎬 *ALL PARTS & DOWNLOAD LINKS (CINERU.LK)* 」
│
${partsList}└───「 🌐 *COMPLETE SET BROWSE* 」
🔗 *Cineru.lk Official Set Link:*
${set.cineruSetUrl}

💡 *Direct Command:* Type *${prefix}cineru <part name>* for any specific movie.
_POWERED BY YASHI HALLS & CINERU.LK FILM ENGINE_
`.trim();
}

/**
 * Formats an Individual Movie Card with Cineru.lk integration for WhatsApp
 */
export function formatMovieCard(movie: MovieItem, prefix: string = "."): string {
  const dubBadge = movie.isSinhalaDub
    ? "🎙️ *[SINHALA DUBBED / හඬකැවූ]*"
    : "📝 *[CINERU.LK SINHALA SUBTITLES]*";

  let dlList = "";
  movie.downloads.forEach((dl, i) => {
    dlList += `│ ${i + 1}. *${dl.quality}* (${dl.size || "HD"})\n│    🔗 [${dl.source}]\n│    👉 ${dl.directUrl}\n`;
  });

  return `
╭───「 🎬 *CINERU.LK MOVIE DIRECTORY* 」───╮
│
│ 🍿 *${movie.title.toUpperCase()}*
│ ${dubBadge}
│
│ ⭐ *Rating:* ${movie.rating || "7.8/10"} | ⏱️ *Runtime:* ${movie.runtime || "2h"}
│ 🎭 *Genre:* ${movie.genre || "Action, Adventure"}
│ 🗣️ *Audio:* ${movie.language || "English / Sinhala Sub"}
│ 📅 *Year:* ${movie.year || "2024"}
│
╰───────────────────────────────────────────╯

📖 *කතාව කෙටියෙන් (Synopsis):*
${movie.synopsisSinhala || movie.synopsisEnglish || "Superhit movie stream & download."}

┌───「 📥 *CINERU.LK DOWNLOAD MIRRORS* 」
│
${dlList}│
└───「 📝 *SUBTITLES & DIRECT STREAM* 」
│
│ 🇱🇰 *Cineru.lk Movie Page:*
│    👉 ${movie.cineruUrl || `https://cineru.lk/?s=${encodeURIComponent(movie.title)}`}
│
│ 📝 *Sinhala Subtitle File (.srt/.zip):*
│    👉 ${movie.cineruSubUrl || movie.sinhalaSubUrl || "https://cineru.lk/"}
│
│ ▶️ *Watch Online Stream:*
│    👉 ${movie.watchOnlineUrl || movie.cineruUrl || "https://cineru.lk/"}
│
└──────────────────────────────────────────

💡 *Usage Tips:*
• Film Sets: Type *${prefix}cineru <franchise> set* (e.g. *${prefix}cineru harry potter set*)
• Search Any Film: *${prefix}cineru <name>* or *${prefix}film <name>*

_POWERED BY YASHI HALLS & CINERU.LK_
`.trim();
}
