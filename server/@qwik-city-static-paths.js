const staticPaths = new Set(["/","/.DS_Store","/about/","/contact/","/favicon.ico","/favicon.svg","/images/.DS_Store","/images/headshot.svg","/images/placeholder.svg","/js_resume_25.2.pdf","/manifest.json","/portfolio/","/portfolio/brand-evolution/","/portfolio/caribbean-drone/","/portfolio/caribbeanpools-redesign/","/portfolio/deckhand-prototype/","/portfolio/email-marketing/","/portfolio/formstack-integration/","/portfolio/ivr-system/","/portfolio/mindforge/","/portfolio/personal-drone/","/portfolio/print-studio/","/q-manifest.json","/resume/","/sitemap.xml"]);
function isStaticPath(method, url) {
  if (method.toUpperCase() !== 'GET') {
    return false;
  }
  const p = url.pathname;
  if (p.startsWith("/build/")) {
    return true;
  }
  if (p.startsWith("/assets/")) {
    return true;
  }
  if (staticPaths.has(p)) {
    return true;
  }
  if (p.endsWith('/q-data.json')) {
    const pWithoutQdata = p.replace(/\/q-data.json$/, '');
    if (staticPaths.has(pWithoutQdata + '/')) {
      return true;
    }
    if (staticPaths.has(pWithoutQdata)) {
      return true;
    }
  }
  return false;
}
export { isStaticPath };