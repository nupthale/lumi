function hex2rgb(hex: string) {
    let color: any = hex;
  
    color = color.replace(/ |#/g, '');
    if (color.length === 3) {
      color = color.replace(/(.)/g, '$1$1');
    }
  
    // http://stackoverflow.com/a/6637537/1250044
    color = color.match(/../g) || [];
  
    return [
      parseInt(color[0], 16),
      parseInt(color[1], 16),
      parseInt(color[2], 16),
    ].join(',');
  }
  
  const colors = ['#1e80ff', '#0fbf60', '#ff8b07', '#10C3A9', '#FFCD2A', '#9747FF', '#13AD5C', '#F34821'];
  
  export const nameToGradientColor = (name: string = '') => {
    if (!name) {
      return 'rgb(208, 211, 214)';
    }
  
    // 根据名字生成一个0-colors.length范围的数字
    const index =
      parseInt(String(name.charCodeAt(name.length - 1)), 10) % colors.length;
  
    const hexColor = colors[index];
    const rgbColor = hex2rgb(`${hexColor}`);
  
    const startColor = `rgba(${rgbColor}, 0.6)`;
    const endColor = `rgba(${rgbColor}, 1)`;
  
    return `radial-gradient(circle at 18.7% 37.8%, ${startColor} 0%, ${endColor} 90%)`;
  };

  export const nameToColor = (name: string = '', alpha = 1) => {
    if (!name) {
      return 'rgb(208, 211, 214)';
    }
  
    // 根据名字生成一个0-colors.length范围的数字
    const index =
      parseInt(String(name.charCodeAt(name.length - 1)), 10) % colors.length;
  
    const hexColor = colors[index];
    const rgbColor = hex2rgb(`${hexColor}`);
  
    const endColor = `rgba(${rgbColor}, ${alpha})`;
  
    return endColor;
  };
  