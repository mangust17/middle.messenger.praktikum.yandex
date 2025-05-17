import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost'
});

global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;
global.HTMLElement = dom.window.HTMLElement;
global.DocumentFragment = dom.window.DocumentFragment;
global.XMLHttpRequest = dom.window.XMLHttpRequest;
global.ProgressEvent = dom.window.ProgressEvent;
global.PopStateEvent = dom.window.PopStateEvent;
global.MouseEvent = dom.window.MouseEvent;
global.history = dom.window.history;
