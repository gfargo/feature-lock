import fs from "node:fs";
import path from "node:path";
import config from "./registry.config.mjs";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, config.outDir);
const R_DIR = path.join(OUT_DIR, "r");

// Recursively list all files in the project
function listFiles(dir, skipDirs = []) {
  const results = [];
  let entries;
  
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    console.warn(`Warning: Cannot read directory ${dir}:`, err.message);
    return results;
  }
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip specified directories
    if (entry.isDirectory()) {
      const shouldSkip = skipDirs.some(skipDir => 
        fullPath.includes(skipDir) || entry.name.startsWith('.')
      );
      
      if (shouldSkip) continue;
      
      results.push(...listFiles(fullPath, skipDirs));
    } else if (entry.isFile()) {
      // Convert to relative path with forward slashes
      const relativePath = path.relative(ROOT, fullPath).split(path.sep).join("/");
      results.push(relativePath);
    }
  }
  return results;
}

// Build registry JSON for a single component
function buildComponentJSON(allFiles, componentConfig, allComponents) {
  const { include = [], exclude = [] } = componentConfig;
  const matchedFiles = new Set();

  // Find files matching include patterns but not exclude patterns
  for (const file of allFiles) {
    const isIncluded = include.some(pattern => pattern.test(file));
    if (!isIncluded) continue;
    
    const isExcluded = exclude.some(pattern => pattern.test(file));
    if (isExcluded) continue;
    
    matchedFiles.add(file);
  }

  // Transform files for registry format
  const files = [...matchedFiles].sort().map(sourcePath => {
    const targetPath = config.pathRewriter(sourcePath);
    
    // Determine file type based on path and extension
    let fileType = "registry:lib";
    if (sourcePath.endsWith(".tsx") && sourcePath.includes("/components/")) {
      fileType = "registry:ui";
    } else if (sourcePath.includes("/hooks/")) {
      fileType = "registry:hook";
    } else if (sourcePath.endsWith(".md")) {
      fileType = "registry:doc";
    }
    
    return {
      type: fileType,
      path: sourcePath,
      target: targetPath,
      content: ""
    };
  });

  // Merge dependencies
  const dependencies = {
    ...(config.defaults?.dependencies ?? {}),
    ...(componentConfig.dependencies ?? {})
  };

  // Resolve registry dependencies to full URLs
  const registryDependencies = (componentConfig.registryDependencies ?? [])
    .map(shortName => {
      const dep = allComponents.find(c => c.shortName === shortName);
      if (dep) {
        return `${config.baseUrl}/r/${dep.fileName.replace('.json', '')}`;
      }
      // If not found in our registry, assume it's a shadcn component
      return shortName;
    });

  return {
    name: componentConfig.name,
    type: componentConfig.type || "registry:ui",
    dependencies: Object.entries(dependencies).map(([name, version]) => `${name}@${version}`),
    registryDependencies,
    files
  };
}

// Main execution
function main() {
  console.log("🔨 Generating component registry...");
  
  // Ensure output directories exist
  fs.mkdirSync(R_DIR, { recursive: true });

  // Scan project files, skip common build/dependency directories
  const skipDirs = ['node_modules', '.next', 'registry', '.git', 'dist', 'build'];
  const allFiles = listFiles(ROOT, skipDirs);
  console.log(`📁 Found ${allFiles.length} files in project`);

  // Prepare component configs with short names for dependency resolution
  const components = config.items.map(item => ({
    ...item,
    shortName: item.fileName.replace(/\.json$/, "")
  }));

  // Generate each component JSON
  const generatedComponents = components.map(component => {
    const json = buildComponentJSON(allFiles, component, components);
    console.log(`  ✓ ${component.name} (${json.files.length} files)`);
    return json;
  });

  // Write individual component files
  generatedComponents.forEach((componentData, index) => {
    const fileName = components[index].fileName;
    const outputPath = path.join(R_DIR, fileName);
    fs.writeFileSync(outputPath, JSON.stringify(componentData, null, 2));
  });

  // Generate registry manifest
  const manifest = {
    registry: generatedComponents.map((component, index) => ({
      name: component.name,
      item: `${config.baseUrl}/r/${components[index].shortName}`,
      file: `r/${components[index].fileName}`,
      type: component.type
    }))
  };

  fs.writeFileSync(
    path.join(OUT_DIR, "registry.json"),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`✅ Generated ${generatedComponents.length} registry components`);
  console.log(`📦 Registry manifest: registry/registry.json`);
}

main();
