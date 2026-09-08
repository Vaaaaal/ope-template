import { execSync } from 'child_process';

// Empêche une publication npm depuis un répertoire de travail non commité.
// Cause racine : les versions 0.14.0 à 0.22.0 ont été publiées sans jamais
// être versionnées, les sources n'existaient que sur cette machine.

const ALLOW = process.env.ALLOW_DIRTY_PUBLISH === '1';

if (ALLOW) {
  console.log('⚠️  ALLOW_DIRTY_PUBLISH=1 — vérification git ignorée.');
  process.exit(0);
}

let status;
try {
  status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
} catch {
  console.error('❌ Impossible de lire l’état git. Publication annulée.');
  process.exit(1);
}

if (status) {
  console.error('❌ Publication annulée : des changements ne sont pas commités.\n');
  console.error(status);
  console.error('\nCommite (et pousse) avant de publier, sinon les sources de');
  console.error('cette version n’existeront que sur cette machine.');
  console.error('\nPour forcer malgré tout : ALLOW_DIRTY_PUBLISH=1 pnpm release');
  process.exit(1);
}

console.log('✅ Répertoire de travail propre.');
