import https from 'https';
import { writeFileSync } from 'fs';

const PRODUCTION_URL = 'https://www.jpstas.com';

console.log(`🌐 Checking production site: ${PRODUCTION_URL}\n`);

https.get(PRODUCTION_URL, (res) => {
  let html = '';
  
  res.on('data', (chunk) => {
    html += chunk;
  });
  
  res.on('end', () => {
    console.log('📊 Production Analysis:\n');
    console.log(`   Status Code: ${res.statusCode}`);
    console.log(`   Content-Type: ${res.headers['content-type']}`);
    console.log(`   Content-Length: ${html.length} bytes\n`);
    
    // Check for required elements
    const checks = {
      'QwikLoader script': html.includes('__q_context__') || html.includes('qwikloader'),
      'Stylesheet': /<link rel="stylesheet"/.test(html),
      'Module script (preloader)': /<script type="module" src="\/build\/q-.*\.js">/.test(html),
      'Nomodule script (core)': /<script nomodule src="\/build\/q-.*\.js">/.test(html),
      'Root div with qwik comment': html.includes('<!--qwik-->'),
      'Meta viewport': html.includes('name="viewport"'),
    };
    
    console.log('🔍 Element Check:');
    let allPassed = true;
    for (const [name, passed] of Object.entries(checks)) {
      console.log(`   ${passed ? '✅' : '❌'} ${name}`);
      if (!passed) allPassed = false;
    }
    
    console.log('\n');
    
    // Extract script references
    const scriptMatches = html.matchAll(/<script[^>]*src="([^"]+)"/g);
    const scripts = Array.from(scriptMatches).map(m => m[1]);
    
    if (scripts.length > 0) {
      console.log('📜 Script References:');
      scripts.forEach(script => {
        console.log(`   - ${script}`);
      });
      console.log('');
    }
    
    // Check for inline scripts
    const inlineScriptCount = (html.match(/<script>[\s\S]*?<\/script>/g) || []).length;
    console.log(`📝 Inline Scripts: ${inlineScriptCount}`);
    
    if (inlineScriptCount > 0) {
      const inlineScripts = html.match(/<script>([\s\S]{0,200})/g) || [];
      inlineScripts.forEach((script, i) => {
        const preview = script.substring(8, 208).replace(/\s+/g, ' ');
        console.log(`   Script ${i + 1}: ${preview}...`);
      });
    }
    
    console.log('\n');
    
    // Summary
    if (allPassed) {
      console.log('✅ PRODUCTION CHECK PASSED: All required elements are present!\n');
      process.exit(0);
    } else {
      console.error('❌ PRODUCTION CHECK FAILED: Missing critical elements!\n');
      console.error('Possible issues:');
      console.error('   - Build artifacts not deployed correctly');
      console.error('   - Post-build script not running on Cloudflare Pages');
      console.error('   - Caching issues (try hard refresh: Ctrl+Shift+R)\n');
      
      // Save HTML for debugging
      console.error('💾 Saving production HTML for debugging...');
      writeFileSync('production-output.html', html);
      console.error('   Saved to: production-output.html\n');
      
      process.exit(1);
    }
  });
  
}).on('error', (err) => {
  console.error(`❌ Error fetching production site: ${err.message}\n`);
  process.exit(1);
});

