import '@testing-library/jest-dom';

// jsdom does not implement these browser APIs, which the app uses.
HTMLCanvasElement.prototype.getContext = () => ({
  fillRect() {},
  fillText() {},
});

window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.scrollTo = () => {};
