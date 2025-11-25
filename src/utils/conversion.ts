export const decodeBase64 = (base64: string) => {
  const binaire = atob(base64);
  return decodeURIComponent(escape(binaire));
};

// Fonction pour extraire l'URL de l'image de fond depuis le HTML
export const extractBackgroundImageUrl = (htmlContent: string): string | null => {
  // Méthode 1: Chercher dans le HTML brut avec une regex flexible
  // Gère: url('...'), url("..."), url(...), avec ou sans espaces
  const regexPatterns = [/background-image\s*:\s*url\(['"]([^'"]+)['"]\)/gi, /background-image\s*:\s*url\(([^)]+)\)/gi];

  for (const pattern of regexPatterns) {
    const match = htmlContent.match(pattern);
    if (match) {
      // Extraire l'URL du premier match trouvé
      const urlMatch = match[0].match(/url\(['"]?([^'")]+)['"]?\)/i);
      if (urlMatch && urlMatch[1]) {
        return urlMatch[1].trim();
      }
    }
  }

  // Méthode 2: Parser le HTML et chercher dans l'attribut style de #text-editor-wrapper
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const wrapper = tempDiv.querySelector('#text-editor-wrapper') as HTMLElement;

  if (wrapper) {
    // Chercher dans l'attribut style inline
    const styleAttr = wrapper.getAttribute('style');
    if (styleAttr) {
      const styleMatch = styleAttr.match(/background-image\s*:\s*url\(['"]?([^'")]+)['"]?\)/i);
      if (styleMatch && styleMatch[1]) {
        return styleMatch[1].trim();
      }
    }

    // Chercher dans le style calculé (si le HTML a déjà été injecté)
    if (wrapper.style.backgroundImage) {
      const bgImage = wrapper.style.backgroundImage;
      const urlMatch = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/i);
      if (urlMatch && urlMatch[1]) {
        return urlMatch[1].trim();
      }
    }
  }

  return null;
};

// Fonction pour retirer l'image de fond du HTML (utilisée lors du chargement de templates)
export const removeBackgroundImageFromHtml = (htmlContent: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const textEditorWrapper = tempDiv.querySelector('#text-editor-wrapper') as HTMLElement;

  if (textEditorWrapper) {
    // Retirer les propriétés d'image de fond du style
    textEditorWrapper.style.backgroundImage = '';
    textEditorWrapper.style.backgroundSize = '';
    textEditorWrapper.style.backgroundPosition = '';
    textEditorWrapper.style.backgroundRepeat = '';

    // Si le style est vide après suppression, retirer l'attribut style
    if (!textEditorWrapper.style.cssText || textEditorWrapper.style.cssText.trim() === '') {
      textEditorWrapper.removeAttribute('style');
    } else {
      // Sinon, mettre à jour l'attribut style sans les propriétés d'image de fond
      textEditorWrapper.setAttribute('style', textEditorWrapper.style.cssText);
    }

    return tempDiv.innerHTML;
  }

  // Si pas de wrapper, retirer l'image de fond via regex dans le HTML brut
  return htmlContent
    .replace(/background-image\s*:\s*url\([^)]+\)\s*;?/gi, '')
    .replace(/background-size\s*:[^;]+;?/gi, '')
    .replace(/background-position\s*:[^;]+;?/gi, '')
    .replace(/background-repeat\s*:[^;]+;?/gi, '');
};

export const getContent = (id?: string, returnHtml: boolean = false, minified: boolean = false) => {
  const textEditor = document.getElementById(id || 'text-editor-document-text');

  if (textEditor) {
    // Récupère l'html de l'éditeur et génère une div pour lui appliquer les styles de base
    const html = textEditor.innerHTML;

    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    tempElement.style.cssText = textEditor.style.cssText;

    const textEditorElement: HTMLDivElement | null = tempElement.querySelector('#text-editor-wrapper');

    // Applique les styles de base d'un mail
    if (textEditorElement) {
      textEditorElement.style.margin = 'auto';
      textEditorElement.style.width = '560px';
    }

    const tableHandles: NodeList = tempElement.querySelectorAll('.resize-handle');
    if (tableHandles) {
      tableHandles.forEach((element: any) => {
        element.remove();
      });
    }

    const styledClone = cloneWithInlineStyles(tempElement);
    const rawHtml = (styledClone as HTMLElement).outerHTML;

    const minifiedHtml = rawHtml
      .replace(/\s+/g, ' ') // Remplacer tous les espaces multiples par un seul espace
      .replace(/>\s+</g, '><') // Supprimer les espaces entre les balises
      .replace(/\s+>/g, '>') // Supprimer les espaces avant les balises fermantes
      .replace(/<\s+/g, '<') // Supprimer les espaces après les balises ouvrantes
      .trim(); // Supprimer les espaces en début et fin

    const finalHtml = minified ? minifiedHtml : rawHtml;

    // Si on demande le HTML brut, on le retourne directement
    if (returnHtml) {
      return finalHtml;
    }

    // Sinon, on retourne le contenu en base64
    const encoder = new TextEncoder();
    const uInt8Array = encoder.encode(finalHtml);

    let base64String = '';
    const chunkSize = 0x8000; // Taille des lots
    for (let i = 0; i < uInt8Array.length; i += chunkSize) {
      const chunk = uInt8Array.slice(i, i + chunkSize);
      base64String += String.fromCharCode(...chunk);
    }

    return btoa(base64String);
  }
};

const cloneWithInlineStyles = (element: HTMLElement) => {
  const clone = element.cloneNode(true) as HTMLElement;

  const applyInlineStyles = (source: HTMLElement, target: HTMLElement) => {
    const computedStyle = window.getComputedStyle(source);
    for (const key of computedStyle) {
      target.style.setProperty(key, computedStyle.getPropertyValue(key));
    }

    // Recurse sur les enfants
    for (let i = 0; i < source.children.length; i++) {
      const sourceChild = source.children[i];
      const targetChild = target.children[i];
      if (sourceChild instanceof HTMLElement && targetChild instanceof HTMLElement) {
        applyInlineStyles(sourceChild, targetChild);
      }
    }
  };

  applyInlineStyles(element, clone);
  return clone;
};
