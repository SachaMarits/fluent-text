# Système de traduction pour FluentText

Ce système de traduction interne permet de traduire facilement les strings de l'interface utilisateur de votre éditeur de texte.

## Utilisation de base

### 1. Utilisation simple avec langue par défaut (français)

```tsx
import FluentText from './FluentText';

function MonComposant() {
  return (
    <FluentText
      defaultValue="<p>Votre contenu ici</p>"
      options={['text', 'color', 'image']}
      textOptions={['style', 'alignment', 'link']}
    />
  );
}
```

### 2. Utilisation avec une langue spécifique

```tsx
import FluentText from './FluentText';

function MonComposant() {
  return (
    <FluentText
      language="en" // ou "fr"
      defaultValue="<p>Your content here</p>"
      options={['text', 'color', 'image']}
      textOptions={['style', 'alignment', 'link']}
    />
  );
}
```

### 3. Utilisation avec sélecteur de langue

```tsx
import FluentText, { LanguageSwitcher } from './FluentText';

function MonComposant() {
  return (
    <div>
      <LanguageSwitcher />
      <FluentText
        defaultValue="<p>Votre contenu ici</p>"
        options={['text', 'color', 'image']}
        textOptions={['style', 'alignment', 'link']}
      />
    </div>
  );
}
```

## Langues supportées

- **Français (fr)** : Langue par défaut
- **Anglais (en)** : Traduction complète

## Ajout de nouvelles traductions

### 1. Ajouter une nouvelle clé de traduction

Dans `src/translations/fr.ts` :
```typescript
export const fr = {
  // ... traductions existantes
  nouvelleCle: 'Nouvelle traduction',
};
```

Dans `src/translations/en.ts` :
```typescript
export const en = {
  // ... traductions existantes
  nouvelleCle: 'New translation',
};
```

### 2. Utiliser la nouvelle traduction

```tsx
import { useTranslation } from './translations';

function MonComposant() {
  const { t } = useTranslation();
  
  return <span>{t('nouvelleCle')}</span>;
}
```

## Ajout d'une nouvelle langue

### 1. Créer le fichier de traduction

Créez `src/translations/es.ts` (pour l'espagnol par exemple) :

```typescript
export const es = {
  texte: 'Texto',
  couleur: 'Color',
  element: 'Elemento',
  // ... autres traductions
};
```

### 2. Mettre à jour le système

Dans `src/translations/index.ts` :

```typescript
import { es } from './es';

export type Language = 'fr' | 'en' | 'es';

const translations = {
  fr,
  en,
  es,
};
```

### 3. Mettre à jour le sélecteur de langue

Dans `src/components/LanguageSwitcher.tsx` :

```typescript
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
] as const;
```

## Clés de traduction disponibles

### Textes généraux
- `texte`, `couleur`, `element`, `image`, `miseEnPage`

### Styles de texte
- `gras`, `italique`, `souligner`

### Alignement
- `alignerAGauche`, `alignerAuCentre`, `alignerADroite`, `justifier`

### Couleurs
- `couleurDeLaPolice`, `couleurDeSurlignage`

### Polices
- `taillePolice`, `police`, `plusPetit`, `petit`, `moyen`, `grand`, `plusGrand`, `extraGrand`

### Liens
- `lien`, `ajouter`, `fermer`

### Éléments
- `ajouterLigneHorizontale`, `ajouterVariable`, `explicationVariable`

### Images
- `ajouterImage`, `redimensionnerImage`, `supprimerImage`

### Tableaux
- `ajouterTableau`, `lignes`, `colonnes`

### Boutons
- `bouton`, `texteDuBouton`, `lienDuBouton`

### Messages d'erreur
- `erreurChargementImage`, `erreurFormatImage`
