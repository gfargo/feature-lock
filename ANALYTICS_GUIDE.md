# Analytics & Conversion Goals Guide

This guide explains the analytics implementation and conversion goals for the BlurWrapper project.

## 🎯 Conversion Goals

### Primary Goals

1. **Component Installation** (`component_installed`)
   - **Description**: User successfully fetches component from registry
   - **Value**: High - indicates actual adoption
   - **Properties**: component name, file count, dependencies
   - **Where**: API route `/api/registry/r/[name]`

2. **Install Command Copied** (`install_command_copied`)
   - **Description**: User copies the installation command
   - **Value**: High - strong intent to install
   - **Properties**: command, timestamp
   - **Where**: Documentation page

### Engagement Goals

3. **Documentation Scroll Depth**
   - `docs_scroll_25`: User scrolls past 25% of docs
   - `docs_scroll_50`: User scrolls past 50% of docs
   - `docs_scroll_75`: User scrolls past 75% of docs
   - **Description**: Measures documentation engagement
   - **Value**: Medium - indicates interest and learning
   - **Where**: Documentation page

4. **Code Snippet Copied** (`code_copied`)
   - **Description**: User copies example code
   - **Value**: Medium - indicates active learning
   - **Properties**: type, snippet_index
   - **Where**: Documentation page

5. **Demo Section Unlocked** (`demo_section_unlocked`)
   - **Description**: User tries the interactive demo
   - **Value**: Medium - hands-on exploration
   - **Properties**: section name
   - **Where**: Homepage demo

## 📊 All Tracked Events

### Page Views
- `home_viewed`: Homepage visited
- `docs_viewed`: Documentation viewed
- `blog_viewed`: Blog post viewed

### Navigation
- `hero_docs_clicked`: Docs button from hero
- `hero_blog_clicked`: Blog button from hero
- `hero_github_clicked`: GitHub button from hero
- `docs_back_clicked`: Back to home from docs
- `docs_github_clicked`: GitHub link from docs
- `docs_demo_clicked`: Demo link from docs
- `docs_blog_clicked`: Blog link from docs
- `blog_back_clicked`: Back to demo from blog
- `blog_github_clicked`: GitHub link from blog
- `blog_demo_clicked`: Demo link from blog
- `blog_demo_link_clicked`: Inline demo link from blog
- `footer_github_clicked`: GitHub link from footer

### Demo Interactions
- `demo_toggle_all`: Toggle all blur sections
- `demo_section_unlocked`: Unlock specific section

### Documentation Interactions
- `docs_tab_changed`: Switch between dialog/inline tabs
- `code_copied`: Copy code snippet
- `install_command_copied`: Copy install command
- `docs_scroll_25/50/75`: Scroll depth milestones

### Registry API
- `registry_manifest_requested`: Registry list requested
- `registry_manifest_served`: Registry list served successfully
- `registry_manifest_error`: Error serving registry
- `component_requested`: Specific component requested
- `component_installed`: Component successfully delivered
- `component_not_found`: Component not found
- `component_request_invalid`: Invalid component name
- `component_error`: Error serving component

## 🔧 Setting Up Conversion Goals in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click "Analytics" in the sidebar

2. **Create Custom Events**
   - Click "Custom Events" tab
   - Add these as conversion goals:

### Goal: Component Installed
\`\`\`
Event Name: component_installed
Description: User successfully installs BlurWrapper
Goal Value: High
\`\`\`

### Goal: Install Command Copied
\`\`\`
Event Name: install_command_copied
Description: User copies CLI install command
Goal Value: High
\`\`\`

### Goal: Documentation Engaged (75%)
\`\`\`
Event Name: docs_scroll_75
Description: User reads 75%+ of documentation
Goal Value: Medium
\`\`\`

### Goal: Demo Interaction
\`\`\`
Event Name: demo_section_unlocked
Description: User unlocks demo section
Goal Value: Medium
\`\`\`

3. **Set Up Funnel**

Create a funnel to track the user journey:

\`\`\`
Step 1: home_viewed (Entry)
Step 2: docs_viewed (Interest)
Step 3: install_command_copied (Intent)
Step 4: component_installed (Conversion)
\`\`\`

## 📈 Key Metrics to Track

### Conversion Rate
- **Formula**: (component_installed / docs_viewed) × 100
- **Target**: > 5%

### Documentation Engagement
- **Formula**: (docs_scroll_75 / docs_viewed) × 100
- **Target**: > 40%

### Install Intent
- **Formula**: (install_command_copied / docs_viewed) × 100
- **Target**: > 20%

### Demo Engagement
- **Formula**: (demo_section_unlocked / home_viewed) × 100
- **Target**: > 15%

## 🎨 Custom Dashboards

### Dashboard 1: Conversion Funnel
\`\`\`
1. Total page views (home_viewed)
2. Documentation visits (docs_viewed)
3. Install intent (install_command_copied)
4. Successful installations (component_installed)
5. Conversion rate
\`\`\`

### Dashboard 2: Engagement Quality
\`\`\`
1. Avg time on docs page
2. Scroll depth distribution
3. Code snippets copied
4. Demo interactions
5. Return visitors
\`\`\`

### Dashboard 3: API Performance
\`\`\`
1. Registry requests (component_requested)
2. Successful installs (component_installed)
3. Errors (component_error, component_not_found)
4. Response times
5. Popular components
\`\`\`

## 🔍 Analyzing Results

### Weekly Review Checklist
- [ ] Check conversion rate trend
- [ ] Review most copied code snippets
- [ ] Analyze drop-off points in funnel
- [ ] Monitor error rates in API
- [ ] Check scroll depth patterns
- [ ] Review popular traffic sources

### Monthly Deep Dive
- [ ] Compare conversion rates by traffic source
- [ ] Analyze time-to-install metrics
- [ ] Review documentation engagement by section
- [ ] Check component popularity trends
- [ ] Analyze user journey patterns
- [ ] Review error patterns and fixes

## 🚀 Optimization Ideas

### High Conversion
- A/B test installation command placement
- Optimize documentation load time
- Add video tutorials for low-engagement sections
- Improve code snippet discoverability

### High Engagement
- Add interactive code playground
- Create component templates
- Add more advanced examples
- Build community showcase

### Low Drop-off
- Simplify installation steps
- Add troubleshooting guide
- Improve error messages
- Add quick-start templates

## 📝 Event Properties Reference

### Component Installed
\`\`\`typescript
{
  component: string,          // e.g., "blur-wrapper"
  fileCount: number,          // Number of files installed
  dependencyCount: number,    // Number of npm dependencies
  registryDependencyCount: number, // Number of shadcn dependencies
  userAgent: string,          // Client user agent
  referer: string,           // Traffic source
  timestamp: string          // ISO timestamp
}
\`\`\`

### Code Copied
\`\`\`typescript
{
  type: string,              // e.g., "quickstart_dialog"
  snippet_index: number      // Position in page
}
\`\`\`

### Demo Interaction
\`\`\`typescript
{
  section: string,           // e.g., "analytics"
  blurred: boolean          // New blur state
}
\`\`\`

## 🎯 Success Criteria

### Launch Success (First 30 Days)
- ✓ 100+ component installations
- ✓ 1000+ documentation views
- ✓ 5%+ conversion rate
- ✓ < 1% API error rate

### Growth Success (90 Days)
- ✓ 500+ component installations
- ✓ 5000+ documentation views
- ✓ 10%+ conversion rate
- ✓ 50+ GitHub stars
- ✓ Community contributions

---

**Last Updated**: December 2024
**Maintainer**: Griffen Labs
**Questions?**: Open an issue on GitHub
