export const decodeBase64 = (base64: string) => {
  const binaire = atob(base64);
  return decodeURIComponent(escape(binaire));
};

export const getContent = (id?: string, returnHtml: boolean = false, minified: boolean = false) => {
  const textEditor = document.getElementById(id || 'text-editor-document-text');

  if (textEditor) {
    // Récupère l'html de l'éditeur et génère une div pour lui appliquer les styles de base
    const html = textEditor.innerHTML;

    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

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

    const rawHtml = tempElement.innerHTML;

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
