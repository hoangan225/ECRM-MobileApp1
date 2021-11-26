import colors from '../constants/color';

export function convertColorNameToHex(color) {
    if (colors[color]) {
        return colors[color];
    }
    return colors.Default;
}

export function formatColor(color) {
    if (parseInt(color.a) === 1) {
        let componentToHex = (c) => {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
    } else {
        return `rgba(${color.r},${color.g},${color.b},${color.a})`;
    }
}


