const https = require('https');

async function testUrl() {
  const res = await fetch('https://itsvg.in');
  const html = await res.text();
  const match = html.match(/property="og:image"\s+content="([^"]+)"/i) ||
                html.match(/name="twitter:image"\s+content="([^"]+)"/i) ||
                html.match(/content="([^"]+)"\s+property="og:image"/i);

  console.log('OG IMAGE FOUND:', match ? match[1] : 'NONE');

  // Test mShots status
  const mshots = await fetch('https://s0.wp.com/mshots/v1/https%3A%2F%2Fitsvg.in%2F?w=640&h=400');
  console.log('MSHOTS STATUS:', mshots.status, mshots.headers.get('content-type'));
}

testUrl().catch(console.error);
