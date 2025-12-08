const staticPaths = new Set(["/","/.DS_Store","/about/","/contact/","/favicon.ico","/favicon.svg","/images/.DS_Store","/images/headshot.svg","/images/placeholder.svg","/js_resume_25.2.pdf","/manifest.json","/portfolio/","/portfolio/brand-evolution/","/portfolio/caribbeanpools-redesign/","/portfolio/drone-media/","/portfolio/generative-ai/","/portfolio/mixed-media/","/portfolio/motion-systems/","/portfolio/print-studio/","/q-manifest.json","/resume/","/sitemap.xml"]);
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