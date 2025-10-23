# FluentText

Un composant React moderne et flexible pour le texte fluide, construit avec TypeScript et Vite.

## Installation

```bash
# Avec npm
npm install fluent-text

# Avec yarn
yarn add fluent-text

# Avec pnpm
pnpm add fluent-text
```

## Utilisation

### Importation de base

```tsx
import React from 'react';
import { FluentText } from 'fluent-text';

function App() {
  return (
    <div>
      <FluentText>Texte par défaut</FluentText>
      <FluentText variant="primary">Texte principal</FluentText>
      <FluentText variant="secondary">Texte secondaire</FluentText>
    </div>
  );
}
```

### Avec des styles personnalisés

```tsx
import React from 'react';
import { FluentText } from 'fluent-text';
import 'fluent-text/styles'; // Import des styles CSS

function App() {
  return (
    <FluentText 
      className="my-custom-class"
      variant="primary"
    >
      Texte avec styles personnalisés
    </FluentText>
  );
}
```

### Importation des styles CSS

```tsx
// Import des styles par défaut
import 'fluent-text/styles';

// Ou importez seulement les styles dont vous avez besoin
import 'fluent-text/dist/style.css';
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `children` | `React.ReactNode` | - | Le contenu texte à afficher |
| `className` | `string` | `''` | Classes CSS additionnelles |
| `variant` | `'default' \| 'primary' \| 'secondary'` | `'default'` | Variante du composant |

## Développement

### Prérequis

- Node.js 18+
- pnpm (recommandé) ou npm

### Installation des dépendances

```bash
pnpm install
```

### Scripts disponibles

```bash
# Compilation en mode développement (avec watch)
pnpm dev

# Compilation de production
pnpm build

# Vérification des types TypeScript
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatage du code
pnpm format
```

### Test local avec npm link

```bash
# Dans le dossier du package
pnpm build
pnpm link

# Dans votre projet de test
pnpm link fluent-text
```

## Structure du projet

```
fluent-text/
├── src/
│   ├── components/
│   │   └── index.ts
│   ├── styles.css
│   └── index.ts
├── dist/                 # Fichiers compilés (générés)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.json
├── .prettierrc.json
├── .gitignore
├── .npmignore
└── README.md
```

## Licence

MIT

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Changelog

### 1.0.0
- Version initiale avec composant FluentText de base
- Support TypeScript complet
- Styles CSS modulaires
- Configuration Vite pour la compilation
