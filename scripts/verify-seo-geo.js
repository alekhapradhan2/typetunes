const http = require('http');

const BASE_DEV = 'http://localhost:3000';

function fetchText(path, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const url = path.startsWith('http') ? path : `${BASE_DEV}${path}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          url,
        });
      });
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('====================================================');
  console.log('🚀 TYPETUNES.IN — SEO & GEO FULL VERIFICATION SUITE');
  console.log('====================================================\n');

  const results = [];

  // Helper
  function record(category, testName, passed, details) {
    results.push({ category, testName, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} [${category}] ${testName}`);
    if (details) console.log(`   ↳ ${details}`);
  }

  // 1. Robots.txt Validation
  try {
    const robotsRes = await fetchText('/robots.txt');
    const robotsBody = robotsRes.body;
    const hasGPTBot = robotsBody.includes('User-Agent: GPTBot') || robotsBody.includes('userAgent: GPTBot') || robotsBody.includes('GPTBot');
    const hasClaudeBot = robotsBody.includes('ClaudeBot');
    const hasPerplexity = robotsBody.includes('PerplexityBot');
    const hasGoogleExt = robotsBody.includes('Google-Extended');
    const hasSitemap = robotsBody.includes('https://typetunes.in/sitemap.xml');
    const noUndesiredDisallow = !robotsBody.includes('Disallow: /_next');

    record(
      'A2/B1: Robots.txt',
      'Robots.txt syntax & AI crawler access',
      robotsRes.statusCode === 200 && hasGPTBot && hasClaudeBot && hasPerplexity && hasGoogleExt && hasSitemap && noUndesiredDisallow,
      `Status: ${robotsRes.statusCode} | GPTBot: ${hasGPTBot} | ClaudeBot: ${hasClaudeBot} | PerplexityBot: ${hasPerplexity} | Google-Extended: ${hasGoogleExt} | Sitemap Ref: ${hasSitemap}`
    );
  } catch (err) {
    record('A2/B1: Robots.txt', 'Robots.txt fetch', false, err.message);
  }

  // 2. Sitemap.xml Validation
  let sitemapUrls = [];
  try {
    const sitemapRes = await fetchText('/sitemap.xml');
    const matches = sitemapRes.body.match(/<loc>(.*?)<\/loc>/g) || [];
    sitemapUrls = matches.map((m) => m.replace(/<\/?loc>/g, ''));

    const allInDomain = sitemapUrls.every((u) => u.startsWith('https://typetunes.in'));
    const hasHome = sitemapUrls.includes('https://typetunes.in');
    const hasFaq = sitemapUrls.includes('https://typetunes.in/faq');
    const hasBlog = sitemapUrls.includes('https://typetunes.in/blog');
    const hasAbout = sitemapUrls.includes('https://typetunes.in/about');
    const hasContact = sitemapUrls.includes('https://typetunes.in/contact');
    const hasPrivacy = sitemapUrls.includes('https://typetunes.in/privacy-policy');
    const hasTerms = sitemapUrls.includes('https://typetunes.in/terms');

    record(
      'A2: Sitemap.xml',
      'Sitemap URL compilation & canonical domain',
      sitemapRes.statusCode === 200 && sitemapUrls.length >= 15 && allInDomain && hasHome && hasFaq && hasBlog && hasAbout && hasContact && hasPrivacy && hasTerms,
      `Total URLs in sitemap: ${sitemapUrls.length} | All on https://typetunes.in: ${allInDomain}`
    );
  } catch (err) {
    record('A2: Sitemap.xml', 'Sitemap fetch', false, err.message);
  }

  // 3. llms.txt Validation (GEO B3)
  try {
    const llmsRes = await fetchText('/llms.txt');
    const hasSummary = llmsRes.body.includes('https://typetunes.in') && llmsRes.body.includes('TypeTunes');
    const hasBenchmarks = llmsRes.body.includes('WPM Calculation') || llmsRes.body.includes('Benchmarks');
    record(
      'B3: llms.txt',
      'llms.txt content & directory listing',
      llmsRes.statusCode === 200 && hasSummary && hasBenchmarks,
      `Status: ${llmsRes.statusCode} | Byte size: ${llmsRes.body.length} bytes`
    );
  } catch (err) {
    record('B3: llms.txt', 'llms.txt fetch', false, err.message);
  }

  // 4. Page-by-Page HTML, Canonical, Metadata, OG, Schema Validation
  const pagesToTest = [
    { path: '/', label: 'Homepage', schemaType: 'WebApplication' },
    { path: '/faq', label: 'FAQ Page', schemaType: 'FAQPage' },
    { path: '/about', label: 'About Page', schemaType: null },
    { path: '/contact', label: 'Contact Page', schemaType: null },
    { path: '/privacy-policy', label: 'Privacy Policy', schemaType: null },
    { path: '/terms', label: 'Terms of Service', schemaType: null },
    { path: '/blog', label: 'Blog Library', schemaType: null },
    { path: '/blog/what-is-a-good-wpm', label: 'Blog Post: What is a Good WPM', schemaType: 'BlogPosting' },
    { path: '/blog/how-to-improve-typing-speed', label: 'Blog Post: Improve Speed', schemaType: 'BlogPosting' },
    { path: '/test/60s', label: 'Test Mode: 60s', schemaType: null },
    { path: '/test/15s', label: 'Test Mode: 15s', schemaType: null },
    { path: '/test/zen', label: 'Test Mode: Zen', schemaType: null },
  ];

  const titles = new Set();
  const descriptions = new Set();

  for (const p of pagesToTest) {
    try {
      const res = await fetchText(p.path);
      const html = res.body;

      // Extract Title
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : '';

      // Extract Meta Description
      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                        html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
      const description = descMatch ? descMatch[1] : '';

      // Extract Canonical
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                            html.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
      const canonical = canonicalMatch ? canonicalMatch[1] : '';

      // Extract OpenGraph tags
      const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
      const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
      const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);

      // Check noindex absence
      const hasNoindex = html.includes('content="noindex"') || html.includes("content='noindex'");

      // Check JSON-LD
      const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["']>([^<]*)<\/script>/gi) || [];
      let parsedSchemas = [];
      for (const tag of jsonLdMatches) {
        const rawJson = tag.replace(/<\/?script[^>]*>/gi, '');
        try {
          parsedSchemas.push(JSON.parse(rawJson));
        } catch (e) {}
      }

      // Assertions
      const titleUnique = !titles.has(title);
      titles.add(title);
      const titleValid = title.length >= 35 && title.length <= 80;

      const descUnique = !descriptions.has(description);
      descriptions.add(description);
      const descValid = description.length >= 100 && description.length <= 180;

      const expectedCanonicalEnd = p.path === '/' ? '' : p.path;
      const expectedCanonical = `https://typetunes.in${expectedCanonicalEnd}`;
      const canonicalValid = canonical === expectedCanonical || canonical === `https://typetunes.in${p.path}`;

      let schemaValid = true;
      if (p.schemaType) {
        schemaValid = parsedSchemas.some((s) => s['@type'] === p.schemaType || (s['@graph'] && s['@graph'].some(g => g['@type'] === p.schemaType)));
      }

      const ogValid = Boolean(ogTitle && ogDesc && ogImage && ogImage[1].startsWith('https://typetunes.in'));

      const allGood = res.statusCode === 200 && titleValid && descValid && canonicalValid && !hasNoindex && schemaValid && ogValid;

      record(
        `A1/A3/A4: ${p.label}`,
        `Metadata, Canonical, OG & Schema`,
        allGood,
        `Status: ${res.statusCode} | Canonical: "${canonical}" | Title (${title.length}c): "${title}" | Desc (${description.length}c) | OG Image: "${ogImage ? ogImage[1] : 'none'}" | Schema @type: ${p.schemaType ? (schemaValid ? p.schemaType + ' (OK)' : 'MISSING') : 'N/A'}`
      );
    } catch (err) {
      record(`A1/A3/A4: ${p.label}`, 'Fetch page', false, err.message);
    }
  }

  // 5. Semantic Table & Formatting Extraction Validation (GEO B4)
  try {
    const blogRes = await fetchText('/blog/what-is-a-good-wpm');
    const hasRealTable = blogRes.body.includes('<table') && blogRes.body.includes('<thead') && blogRes.body.includes('<tbody') && blogRes.body.includes('<th');
    const hasOrderedOrUnorderedList = blogRes.body.includes('<ul') || blogRes.body.includes('<ol');
    const hasAuthor = blogRes.body.includes('TypeTunes Editorial Team');

    record(
      'B3/B4: GEO Extraction',
      'Semantic <table> markup, lists & editorial authority on guides',
      hasRealTable && hasOrderedOrUnorderedList && hasAuthor,
      `Semantic <table>: ${hasRealTable} | Lists: ${hasOrderedOrUnorderedList} | Author attribution: ${hasAuthor}`
    );
  } catch (err) {
    record('B3/B4: GEO Extraction', 'Check blog extraction elements', false, err.message);
  }

  // 6. Redirects Validation
  const redirectTests = [
    { from: '/test', expectedLocation: '/test/60s' },
    { from: '/test/60', expectedLocation: '/test/60s' },
    { from: '/test/15', expectedLocation: '/test/15s' },
    { from: '/test/30', expectedLocation: '/test/30s' },
    { from: '/test/120', expectedLocation: '/test/120s' },
    { from: '/privacy', expectedLocation: '/privacy-policy' },
  ];

  for (const r of redirectTests) {
    try {
      const res = await fetchText(r.from);
      const isRedirect = res.statusCode === 307 || res.statusCode === 308 || res.statusCode === 301;
      const location = res.headers['location'];
      const passed = isRedirect && location === r.expectedLocation;
      record(
        'A1: 301/308 Redirects',
        `Redirect from ${r.from} -> ${r.expectedLocation}`,
        passed,
        `Status: ${res.statusCode} | Location Header: ${location}`
      );
    } catch (err) {
      record('A1: 301/308 Redirects', `Redirect test for ${r.from}`, false, err.message);
    }
  }

  console.log('\n====================================================');
  console.log(`SUMMARY: ${results.filter(r => r.passed).length} / ${results.length} CHECKS PASSED`);
  console.log('====================================================\n');
}

runVerification();
