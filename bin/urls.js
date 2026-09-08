import { execSync } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import { join, sep } from 'path';

// Génère les URLs jsDelivr à coller dans le custom code Webflow.
// Les bundles sont servis depuis GitHub (pas depuis npm) : jsDelivr expose
// n'importe quel dépôt public sous /gh/{owner}/{repo}@{ref}/{chemin}.

const BUILD_DIRECTORY = 'dist';
const CDN_BASE = 'https://cdn.jsdelivr.net/gh';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// "git+https://github.com/Vaaaaal/ope-template.git" -> "Vaaaaal/ope-template"
const repoMatch = pkg.repository?.url?.match(/github\.com[/:]([^/]+\/[^/.]+)/);
if (!repoMatch) {
  console.error('❌ Impossible de déduire le dépôt GitHub depuis package.json > repository.url');
  process.exit(1);
}
const REPO = repoMatch[1];

// Par défaut on cible le tag de la version courante (URL immuable, cache
// permanent chez jsDelivr). `--ref <ref>` permet de viser un commit ou une
// branche pour tester avant de taguer.
const refFlagIndex = process.argv.indexOf('--ref');
const REF = refFlagIndex !== -1 ? process.argv[refFlagIndex + 1] : `v${pkg.version}`;

/**
 * Récupère récursivement tous les fichiers d'un dossier.
 * @param {string} dirPath
 * @returns {string[]} Les chemins des fichiers.
 */
const getFiles = (dirPath) => {
  const files = readdirSync(dirPath, { withFileTypes: true }).map((dirent) => {
    const path = join(dirPath, dirent.name);
    return dirent.isDirectory() ? getFiles(path) : path;
  });

  return files.flat();
};

let files;
try {
  files = getFiles(BUILD_DIRECTORY);
} catch {
  console.error(`❌ Dossier "${BUILD_DIRECTORY}" introuvable. Lance d'abord : pnpm build`);
  process.exit(1);
}

// Avertit si le tag visé n'existe pas encore : les URLs seraient en 404.
if (refFlagIndex === -1 && !tagExists(REF)) {
  console.warn(`⚠️  Le tag ${REF} n'existe pas encore — ces URLs renverront 404.`);
  console.warn(`   Crée-le avec : git tag ${REF} && git push origin ${REF}\n`);
}

const entries = files
  .filter((file) => !file.endsWith('.map'))
  .sort()
  .map((file) => {
    // dist/plombieres/index.js -> https://cdn.jsdelivr.net/gh/{repo}@{ref}/dist/plombieres/index.js
    const location = `${CDN_BASE}/${REPO}@${REF}/${file.split(sep).join('/')}`;

    const tag = location.endsWith('.css')
      ? `<link href="${location}" rel="stylesheet" type="text/css"/>`
      : `<script defer src="${location}"></script>`;

    return { file, tag };
  });

console.log(`\n📦 ${REPO} @ ${REF} — ${entries.length} fichiers\n`);
for (const { file, tag } of entries) {
  console.log(`${file}\n  ${tag}\n`);
}

/**
 * Vérifie qu'un tag git existe localement.
 * @param {string} ref
 * @returns {boolean}
 */
function tagExists(ref) {
  try {
    execSync(`git rev-parse --verify --quiet "refs/tags/${ref}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}
