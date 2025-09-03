export const createZeroWidthSpace = () => {
    const zeroWidthSpace = document.createElement('span');
    zeroWidthSpace.innerHTML = '\u200B';
    return zeroWidthSpace;
}