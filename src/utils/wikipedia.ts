export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  extract?: string;
  url: string;
}

/**
 * Clean up HTML tags returned by Wikipedia snippet
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'");
}

/**
 * Searches Russian Wikipedia for articles relevant to the query,
 * with strict filtering to ensure context belongs to Neftegorsk, Samara Oblast (not Sakhalin/Okha).
 */
export async function fetchWikipediaInfo(query: string): Promise<WikipediaSearchResult | null> {
  try {
    const lowerQuery = query.toLowerCase();

    // Prepare specialized search query for Samara region
    let searchQuery = query;
    if (!lowerQuery.includes('самар')) {
      if (lowerQuery.includes('нефтегорск')) {
        searchQuery = 'Нефтегорск Самарская область';
      } else {
        searchQuery = `${query} Самарская область`;
      }
    }

    // 1. First attempt: Direct REST summary if query is specific
    if (lowerQuery.includes('нефтегорск') && !lowerQuery.includes('сахалин')) {
      const restDirectUrl = `https://ru.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent('Нефтегорск (Самарская область)')}`;
      const restRes = await fetch(restDirectUrl);
      if (restRes.ok) {
        const restData = await restRes.json();
        if (restData.type === 'standard' && restData.extract && !restData.extract.includes('Сахалин')) {
          return {
            title: restData.title,
            snippet: restData.extract,
            extract: restData.extract,
            url: restData.content_urls?.desktop?.page || `https://ru.wikipedia.org/wiki/${encodeURIComponent(restData.title)}`
          };
        }
      }
    }

    // 2. Search Wikipedia via Action API
    const searchUrl = `https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&utf8=1&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);

    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    let hits: any[] = searchData?.query?.search || [];

    if (!hits || hits.length === 0) {
      // Fallback search specifically for Samara Oblast region
      const fallbackSearchUrl = `https://ru.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent('Нефтегорский район Самарская область')}&utf8=1&format=json&origin=*`;
      const fallbackRes = await fetch(fallbackSearchUrl);
      if (!fallbackRes.ok) return null;
      const fallbackData = await fallbackRes.json();
      hits = fallbackData?.query?.search || [];
      if (hits.length === 0) return null;
    }

    // Filter hits to exclude Sakhalin / Okha / 1995 earthquake articles unless requested
    const validHit = hits.find((h: any) => {
      const text = (h.title + ' ' + h.snippet).toLowerCase();
      const isSakhalin = text.includes('сахалин') || text.includes('оха') || (text.includes('1995') && text.includes('землетрясение'));
      return !isSakhalin;
    }) || hits[0];

    if (!validHit) return null;

    // Check if hit is Sakhalin, if so force query "Нефтегорск (Самарская область)"
    const hitText = (validHit.title + ' ' + validHit.snippet).toLowerCase();
    if (hitText.includes('сахалин') || hitText.includes('оха')) {
      return await getPageExtract('Нефтегорск (Самарская область)', 'Город в Самарской области Российской Федерации, административный центр Нефтегорского района.');
    }

    return await getPageExtract(validHit.title, validHit.snippet);
  } catch (err) {
    console.warn('Wikipedia API fetch error:', err);
    return null;
  }
}

/**
 * Fetch detailed extract for a specific article title
 */
async function getPageExtract(title: string, defaultSnippet: string): Promise<WikipediaSearchResult> {
  try {
    const pageUrl = `https://ru.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(title)}&format=json&origin=*`;
    const pageRes = await fetch(pageUrl);
    if (pageRes.ok) {
      const pageData = await pageRes.json();
      const pages = pageData?.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId && pageId !== '-1' && pages[pageId].extract) {
          return {
            title,
            snippet: stripHtml(defaultSnippet),
            extract: pages[pageId].extract,
            url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
          };
        }
      }
    }
  } catch (e) {
    console.warn('Wikipedia page extract error:', e);
  }

  return {
    title,
    snippet: stripHtml(defaultSnippet),
    extract: stripHtml(defaultSnippet),
    url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
  };
}
