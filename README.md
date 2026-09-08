# OPE Template

Les scripts et styles des sites **Opération Programmée d'Amélioration de l'Habitat**
de Villes Vivantes, compilés en un bundle autonome par ville et chargés depuis
Webflow.

Ce dépôt est né du [Finsweet Developer Starter](https://github.com/finsweet/developer-starter)
et en a conservé l'outillage, mais il s'en écarte sur deux points structurants :
`dist` y est versionné, et les bundles sont servis par jsDelivr depuis GitHub
plutôt que publiés sur npm.

## Sommaire

- [Outils inclus](#outils-inclus)
- [Prérequis](#prérequis)
- [Démarrer](#démarrer)
  - [Installation](#installation)
  - [Compiler](#compiler)
    - [Servir les fichiers en développement](#servir-les-fichiers-en-développement)
    - [Compiler plusieurs fichiers](#compiler-plusieurs-fichiers)
    - [Compiler des fichiers CSS](#compiler-des-fichiers-css)
    - [Définir un alias de chemin](#définir-un-alias-de-chemin)
- [Hébergement des bundles (jsDelivr)](#hébergement-des-bundles-jsdelivr)
  - [Publier une nouvelle version](#publier-une-nouvelle-version)
  - [Build automatique de `dist`](#build-automatique-de-dist)
- [Tests](#tests)
- [Guide de contribution](#guide-de-contribution)
- [Scripts disponibles](#scripts-disponibles)
- [CI/CD](#cicd)
  - [Intégration continue](#intégration-continue)
  - [Déploiement continu](#déploiement-continu)

## Outils inclus

- [TypeScript](https://www.typescriptlang.org/) : sur-couche de JavaScript qui ajoute
  une couche de typage, pour plus de sûreté et d'efficacité.
- [Prettier](https://prettier.io/) : formatage automatique du code.
- [ESLint](https://eslint.org/) : analyse statique, via la
  [configuration Finsweet](https://github.com/finsweet/eslint-config).
- [esbuild](https://esbuild.github.io/) : compile, bundle et minifie les sources
  TypeScript.
- [Playwright](https://playwright.dev/) : tests end-to-end. Installé mais actuellement
  inutilisé, voir [Tests](#tests).
- [Changesets](https://github.com/changesets/changesets) : gestion des versions et du
  changelog. La partie publication npm n'est plus utilisée, voir
  [Déploiement continu](#déploiement-continu).
- [Finsweet TypeScript Utils](https://github.com/finsweet/ts-utils) : utilitaires pour
  le développement Webflow.
- [GSAP](https://gsap.com/) : animations. Depuis le rachat par Webflow, tous les
  plugins sont gratuits — ce projet utilise `ScrollTrigger`, `Flip`, `ScrollToPlugin`
  et `SplitText`.

## Prérequis

Ce projet nécessite [pnpm](https://pnpm.io/) :

```bash
npm i -g pnpm
```

## Démarrer

### Installation

Clone le dépôt, puis installe les dépendances :

```bash
pnpm install
```

Il est recommandé d'installer ces extensions dans VSCode :

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Compiler

Deux scripts sont disponibles :

- `pnpm dev` : compile et lance un serveur local qui sert tous les fichiers (voir
  [Servir les fichiers en développement](#servir-les-fichiers-en-développement)).
- `pnpm build` : compile vers le dossier de production (`dist`).

### Servir les fichiers en développement

`pnpm dev` fait deux choses :

- esbuild passe en mode `watch` : le projet est recompilé à chaque sauvegarde.
- Un serveur local démarre sur `http://localhost:3000` et sert tous les fichiers du
  projet. Tu peux les charger dans Webflow ainsi :

```html
<script defer src="http://localhost:3000/{CHEMIN_DU_FICHIER}.js"></script>
```

Le rechargement à chaud est actif par défaut : le site sur lequel tu travailles se
recharge à chaque sauvegarde. Tu peux le désactiver dans `bin/build.js`.

### Compiler plusieurs fichiers

Pour produire plusieurs sorties, modifie le tableau `ENTRY_POINTS` dans
[`bin/build.js`](bin/build.js) :

```javascript
const ENTRY_POINTS = [
  'src/plombieres/index.ts',
  'src/aurillac/index.ts',
  'src/ruffec/index.ts',
];
```

esbuild compile chacun de ces fichiers vers `dist` en production, et vers
`http://localhost:3000` en développement.

> [!TIP]
> **Ajouter une ville** : copie [`src/template.ts`](src/template.ts) dans
> `src/<ville>/index.ts`, crée son `<ville>.css` à côté, adapte l'URL du KML et
> l'appel à `initAnimations`, puis ajoute l'entrypoint à `ENTRY_POINTS`.
>
> `src/template.ts` n'est volontairement **pas** un entrypoint : c'est un modèle,
> pas un bundle à publier. Il l'a été par le passé et poussait 242 Ko inutiles
> sur le CDN, pour un contenu identique à celui de Plombières.

### Compiler des fichiers CSS

Le bundler gère aussi le CSS : un fichier déclaré comme point d'entrée est minifié
dans le dossier de sortie.

Tu peux déclarer un point d'entrée CSS de deux façons :

- en l'ajoutant manuellement à `bin/build.js` (voir
  [section précédente](#compiler-plusieurs-fichiers)) ;
- ou en l'important depuis un fichier JavaScript / TypeScript :

```typescript
// src/plombieres/index.ts
import './plombieres.css';
```

Les sorties CSS sont également servies sur `localhost` en
[mode développement](#servir-les-fichiers-en-développement).

### Définir un alias de chemin

Les alias évitent ce genre d'import :

```typescript
import example from '../../../../utils/example';
```

Au profit de :

```typescript
import example from '$utils/example';
```

Ils se configurent via `paths` dans [`tsconfig.json`](tsconfig.json). Un alias est
déjà défini :

```json
{
  "paths": {
    "$utils/*": ["src/utils/*"]
  }
}
```

Prends le temps de parcourir les options activées dans le [tsconfig](tsconfig.json)
pour éviter les surprises.

## Hébergement des bundles (jsDelivr)

Les bundles compilés ne sont **pas** consommés comme une dépendance npm : ce dépôt
n'est pas une librairie (il n'exporte rien et n'a pas de point d'entrée importable).
Chaque fichier de `dist` est un script autonome, chargé par une balise `<script>`
dans le custom code Webflow.

Ils sont donc servis directement depuis GitHub via **jsDelivr**, qui expose
n'importe quel dépôt public sous `/gh/{owner}/{repo}@{ref}/{chemin}` :

```html
<script defer src="https://cdn.jsdelivr.net/gh/Vaaaaal/ope-template@v0.24.0/dist/plombieres/index.js"></script>
```

C'est pour cette raison que le dossier `dist` est **versionné dans git** (contrairement
au starter Finsweet d'origine) : sans lui, jsDelivr n'aurait rien à servir.

> [!IMPORTANT]
> Cible toujours un **tag** (`@v0.24.0`), jamais une branche. Une URL taguée est
> immuable et mise en cache indéfiniment par jsDelivr. Une URL de branche est
> recachée toutes les 12 h : une correction peut mettre une demi-journée à
> apparaître, et un site en production peut changer de comportement sans
> qu'aucun déploiement n'ait eu lieu.

Pour obtenir les URLs de tous les fichiers de la version courante :

```bash
pnpm urls
```

Le script affiche, pour chaque fichier de `dist`, la balise prête à coller dans
Webflow. Il avertit si le tag correspondant n'existe pas encore (les URLs
renverraient alors 404). Pour tester avant de taguer, vise un commit précis :

```bash
pnpm urls --ref 3aff4b8
```

Chaque bundle affiche sa version dans la console du navigateur — pratique pour
vérifier qu'un site charge bien la version attendue :

```
Bundle ope-template v0.24.0
```

### Publier une nouvelle version

`dist` est recompilé par la CI (voir la section suivante). Une release consiste
donc à pousser, laisser la CI committer `dist`, puis taguer :

```bash
git push origin master          # la CI recompile et commite dist
git pull                        # récupère le commit "build: recompile dist"
git tag v0.25.0                 # le tag fige les URLs jsDelivr
git push origin v0.25.0         # sans ça, jsDelivr renvoie 404
pnpm urls                       # les balises à coller dans Webflow
```

Il n'y a pas de purge à faire côté jsDelivr : chaque version ayant sa propre URL,
un nouveau tag n'invalide jamais l'ancienne. Les sites déjà en ligne continuent de
pointer vers leur version, et sont migrés un par un en changeant leur balise.

### Build automatique de `dist`

`dist` étant versionné, il doit rester synchrone avec `src`. Le workflow
[`build-dist.yml`](.github/workflows/build-dist.yml) s'en charge : à chaque push sur
`master` touchant `src/`, `bin/`, `package.json` ou `pnpm-lock.yaml`, il recompile et
commite `dist` s'il a changé.

Tu n'as donc pas à lancer `pnpm build` avant de taguer — mais tu dois **attendre que
le workflow ait poussé son commit** avant de créer le tag, sinon celui-ci figerait un
`dist` périmé.

> [!NOTE]
> Ce build en CI n'a longtemps pas été possible : le projet dépendait de GSAP
> Business via une archive `gsap-bonus.tgz` sous licence payante, exclue du dépôt,
> sans laquelle `pnpm install` échouait sur un runner. Depuis le rachat de GSAP par
> Webflow, tous les plugins sont gratuits et publiés sur le npm public — dont
> `SplitText`, le seul plugin premium que ce projet utilisait.

## Tests

> [!NOTE]
> **Ce projet n'a aucun test pour l'instant.** La spec de démo du starter, qui
> interrogeait `https://playwright.dev/`, a été supprimée : elle ne testait rien
> de ce code et échouait dès que ce site externe changeait. Le job `Tests` est
> commenté dans [`ci.yml`](.github/workflows/ci.yml).

Playwright reste installé. Pour remettre des tests en place :

1. écris tes specs dans `/tests` ;
2. remonte `@playwright/test` — la version épinglée (1.42.1) ne s'installe plus sur
   les runners Ubuntu 24.04 ;
3. installe les navigateurs avec `pnpm playwright install` ;
4. décommente le job `Tests` dans `ci.yml`.

Par défaut, Playwright lance aussi `pnpm dev` en arrière-plan pendant les tests, afin
que [les fichiers servis](#servir-les-fichiers-en-développement) sur `localhost:3000`
soient disponibles. Ce comportement se désactive dans
[`playwright.config.ts`](playwright.config.ts).

## Guide de contribution

Le déroulé habituel :

1. Crée une branche pour la fonctionnalité ou le correctif.
2. Ouvre une Pull Request et attends la fin des
   [workflows CI](#intégration-continue). Si quelque chose échoue, corrige avant de
   fusionner — lancer `pnpm lint` et `pnpm check` en local est toujours plus rapide
   que d'attendre GitHub.
3. Fusionne la Pull Request. Le workflow `build-dist.yml` recompile et commite `dist`,
   puis tu crées le tag qui fige les URLs jsDelivr — voir
   [Publier une nouvelle version](#publier-une-nouvelle-version).

## Scripts disponibles

- `pnpm dev` : compile et lance le serveur local (voir
  [Servir les fichiers en développement](#servir-les-fichiers-en-développement)).
- `pnpm build` : compile vers `dist`.
- `pnpm urls` : affiche les URLs jsDelivr et les balises `<script>` / `<link>` de la
  version courante, prêtes à coller dans Webflow (voir
  [Hébergement des bundles](#hébergement-des-bundles-jsdelivr)).
- `pnpm lint` : analyse le code avec ESLint et vérifie le formatage avec Prettier.
- `pnpm lint:fix` : corrige automatiquement ce qui peut l'être.
- `pnpm check` : vérifie les erreurs TypeScript.
- `pnpm format` : formate tout le code avec Prettier. Inutile si ton éditeur formate
  déjà à la sauvegarde.
- `pnpm test` : lance les tests du dossier `/tests` (voir [Tests](#tests)).
- `pnpm test:ui` : lance les tests dans l'interface graphique de Playwright.
- `pnpm update` : passe en revue les dépendances et propose de les mettre à jour.

## CI/CD

### Intégration continue

À l'ouverture d'une Pull Request, un workflow d'intégration continue analyse et
vérifie le code, via `pnpm lint` et `pnpm check`.

Si le job échoue, un avertissement apparaît sur la Pull Request et il faut corriger
avant de fusionner.

Le job `Tests` est désactivé — voir [Tests](#tests).

### Déploiement continu

Ce dépôt **ne publie plus sur npm**. Les bundles sont servis depuis GitHub via
jsDelivr — voir [Hébergement des bundles](#hébergement-des-bundles-jsdelivr) pour
le flux de release.

Le workflow [`build-dist.yml`](.github/workflows/build-dist.yml) recompile et
commite `dist` à chaque push sur `master` ; il ne reste plus qu'à taguer.

> [!NOTE]
> Les versions `0.19.0` à `0.22.0` restent publiées sur npm et continuent d'être
> servies par jsDelivr sous `cdn.jsdelivr.net/npm/@villes-vivantes/ope-template@…`.
> Les sites Webflow qui pointent encore vers ces URLs **fonctionnent toujours**,
> mais ne recevront plus de mise à jour : il faut les migrer une par une vers une
> URL `/gh/` taguée.
>
> Concrètement, `@changesets/cli` reste installé pour gérer versions et changelog,
> mais `changeset publish`, le workflow `release.yml`, le secret `NPM_TOKEN` et
> le fichier `.npmrc` ne servent plus à rien. Le paquet est marqué `private` pour
> empêcher toute publication accidentelle.
