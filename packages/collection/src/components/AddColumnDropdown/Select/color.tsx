const colors: string[] = [];
const colorBase = ['G', 'T', 'W', 'R', 'O', 'Y', 'L', 'B', 'C', 'P', 'N'];

for (let i = 0; i < colorBase.length; i++) {
    for (let j = 0; j < 5; j++) {
        colors[j * 11 + i] = `--${colorBase[i]}${j + 1}00`;
    }
}

export {
    colors
};