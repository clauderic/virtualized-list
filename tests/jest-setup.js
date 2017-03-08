// Polyfill requestAnimationFrame()
global.requestAnimationFrame = callback => callback();
