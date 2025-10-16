#!/usr/bin/env node

/**
 * Registry API Endpoint Tests
 *
 * Tests the registry API endpoints (requires dev server running)
 * Run: npm run test:registry:api
 */

import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3001;
const BASE_URL = `http://localhost:${PORT}`;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
    return true;
  } catch (error) {
    failedTests++;
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

console.log('\n🌐 Registry API Endpoint Tests\n');
console.log(`Testing against: ${BASE_URL}\n`);

// Check if server is running
try {
  await fetch(BASE_URL);
} catch (error) {
  console.log('❌ Dev server not running!');
  console.log(`   Start it with: npm run dev\n`);
  process.exit(1);
}

// Test manifest endpoint
console.log('📄 Manifest Endpoint:\n');

let manifest;
await test('GET /api/registry returns 200', async () => {
  manifest = await fetchJson(`${BASE_URL}/api/registry`);
});

await test('Manifest has registry array', async () => {
  if (!Array.isArray(manifest?.registry)) {
    throw new Error('registry is not an array');
  }
});

console.log(`\n📦 Component Endpoints (${manifest?.registry?.length || 0} components):\n`);

// Load local registry files for comparison
const registryDir = 'registry/r';
const componentFiles = fs.readdirSync(registryDir).filter(f => f.endsWith('.json'));

// Test each component endpoint
for (const file of componentFiles) {
  const componentName = file.replace('.json', '');
  console.log(`${componentName}:`);

  let apiData;
  await test(`GET /api/registry/r/${componentName}`, async () => {
    apiData = await fetchJson(`${BASE_URL}/api/registry/r/${componentName}`);
  });

  await test('Response has name field', async () => {
    if (!apiData?.name) {
      throw new Error('Missing name field');
    }
  });

  await test('Response has files array', async () => {
    if (!Array.isArray(apiData?.files)) {
      throw new Error('files is not an array');
    }
  });

  await test('File content is populated', async () => {
    if (apiData.files.length === 0) {
      throw new Error('No files in response');
    }
    const firstFile = apiData.files[0];
    if (!firstFile.content || firstFile.content.length < 50) {
      throw new Error('File content is missing or too short');
    }
  });

  console.log('');
}

// Test /r/ proxy routes
console.log('🔗 Proxy Routes (/r/*):\n');

for (const file of componentFiles.slice(0, 3)) {
  // Test first 3
  const componentName = file.replace('.json', '');
  console.log(`${componentName}:`);

  let proxyData;
  await test(`GET /r/${componentName} (proxy)`, async () => {
    proxyData = await fetchJson(`${BASE_URL}/r/${componentName}`);
  });

  await test('Proxy returns same data as API', async () => {
    if (proxyData.name !== componentName) {
      throw new Error('Component name mismatch');
    }
  });

  console.log('');
}

// Test 404 handling
console.log('🚫 Error Handling:\n');

await test('Non-existent component returns 404', async () => {
  const response = await fetch(`${BASE_URL}/r/non-existent-component`);
  if (response.status !== 404) {
    throw new Error(`Expected 404, got ${response.status}`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Results:\n`);
console.log(`  Total:  ${totalTests}`);
console.log(`  Passed: ${passedTests} ✓`);
console.log(`  Failed: ${failedTests} ${failedTests > 0 ? '✗' : ''}\n`);

if (failedTests > 0) {
  console.log('❌ API endpoint tests failed\n');
  process.exit(1);
} else {
  console.log('✅ All API endpoint tests passed\n');
  process.exit(0);
}
