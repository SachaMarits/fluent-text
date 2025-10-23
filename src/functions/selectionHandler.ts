export const saveSelection = (): Range => {
  const selection = window.getSelection();
  if (!selection) return document.createRange();
  if (selection.rangeCount === 0) return document.createRange();
  const range = selection?.getRangeAt(0);
  if (range) return range.cloneRange();
  return document.createRange();
};

export const restoreSelection = (savedSelection: Range): void => {
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(savedSelection);
};
