#!/usr/bin/env node

/**
 * Registry Integrity Test Script
 *
 * Validates the component registry by checking:
 * - JSON validity
 * - Source file existence
 * - Dependency consistency
 * - API endpoint responses (requires dev server)
 */

import fs from 'fs';
import path from 'path';

const REGISTRY_DIR = 'registry/r';
const MANIFEST_PATH = 'registry/registry.json';
const PORT = process.env.PORT || 3001;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
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

console.log('\n🔍 Registry Integrity Tests\n');

// Test 1: Registry manifest exists and is valid JSON
console.log('📄 Registry Manifest:');
test('Manifest file exists', () => {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('registry.json not found');
  }
});

let manifest;
test('Manifest is valid JSON', () => {
  const content = fs.readFileSync(MANIFEST_PATH, 'utf8');
  manifest = JSON.parse(content);
});

test('Manifest has registry array', () => {
  if (!Array.isArray(manifest?.registry)) {
    throw new Error('manifest.registry is not an array');
  }
});

console.log(`\n📦 Component Files (${manifest?.registry?.length || 0} components):\n`);

// Test 2: Each component JSON is valid
const componentFiles = fs.readdirSync(REGISTRY_DIR).filter(f => f.endsWith('.json'));

componentFiles.forEach(file => {
  const filePath = path.join(REGISTRY_DIR, file);
  console.log(`${file}:`);

  let componentData;
  test('Valid JSON structure', () => {
    const content = fs.readFileSync(filePath, 'utf8');
    componentData = JSON.parse(content);

    if (!componentData.name) throw new Error('Missing name field');
    if (!componentData.type) throw new Error('Missing type field');
    if (!Array.isArray(componentData.dependencies)) {
      throw new Error('dependencies must be array');
    }
    if (!Array.isArray(componentData.files)) {
      throw new Error('files must be array');
    }
  });

  test('All source files exist', () => {
    componentData.files.forEach(fileEntry => {
      if (!fs.existsSync(fileEntry.path)) {
        throw new Error(`Source file not found: ${fileEntry.path}`);
      }
    });
  });

  test('Has at least one file', () => {
    if (componentData.files.length === 0) {
      throw new Error('No files in component');
    }
  });

  console.log('');
});

// Test 3: Dependency validation
console.log('🔗 Dependencies:\n');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

componentFiles.forEach(file => {
  const filePath = path.join(REGISTRY_DIR, file);
  const componentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  console.log(`${file}:`);

  test('All dependencies in package.json', () => {
    componentData.dependencies.forEach(depString => {
      const match = depString.match(/^(@?[^@]+)@(.+)$/);
      if (match) {
        const [_, name] = match;
        if (!installedDeps[name]) {
          throw new Error(`${name} not in package.json`);
        }
      }
    });
  });

  console.log('');
});

// Test 4: Manifest integrity
console.log('🔗 Manifest Integrity:\n');

test('All component files referenced in manifest', () => {
  const manifestNames = manifest.registry.map(c => c.name);
  const fileNames = componentFiles.map(f => f.replace('.json', ''));

  fileNames.forEach(name => {
    if (!manifestNames.includes(name)) {
      throw new Error(`${name} not in manifest`);
    }
  });
});

test('All manifest items have matching files', () => {
  manifest.registry.forEach(item => {
    const fileName = item.file.replace('r/', '');
    if (!componentFiles.includes(fileName)) {
      throw new Error(`${fileName} referenced in manifest but not found`);
    }
  });
});

test('Manifest URLs use /r/ format', () => {
  manifest.registry.forEach(item => {
    if (!item.item.includes('/r/')) {
      throw new Error(`${item.name} URL doesn't use /r/ format: ${item.item}`);
    }
  });
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Results:\n`);
console.log(`  Total:  ${totalTests}`);
console.log(`  Passed: ${passedTests} ✓`);
console.log(`  Failed: ${failedTests} ${failedTests > 0 ? '✗' : ''}\n`);

if (failedTests > 0) {
  console.log('❌ Registry integrity check failed\n');
  process.exit(1);
} else {
  console.log('✅ All registry integrity checks passed\n');
  console.log('💡 To test API endpoints, ensure dev server is running on port ' + PORT);
  console.log('   Then run: npm run test:registry:api\n');
  process.exit(0);
}
