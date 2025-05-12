import { expect } from 'chai';
import sinon from 'sinon';
import jsdomGlobal from 'jsdom-global';
import Router from './router.ts';

class Block {
  hide = sinon.spy();
  getContent = sinon.stub().returns(document.createElement('div'));
  constructor(_: any) {}
}

class Route {
  pathname: string;
  block: typeof Block;
  render = sinon.spy();
  leave = sinon.spy();
  constructor(pathname: string, block: typeof Block) {
    this.pathname = pathname;
    this.block = block;
  }
}

describe('Роутер', () => {
  let cleanup: () => void;
  let router: any;

  before(() => {
    cleanup = jsdomGlobal(undefined, { url: 'http://localhost' });
    (global as any).Block = Block;
    (global as any).Route = Route;
  });

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    router = Router;
  });

  after(() => {
    cleanup();
  });

  it('должен регистрировать маршруты через use()', () => {
    router.use('/test', Block);
    expect(router['routes']).to.have.lengthOf(1);
    expect(router['routes'][0].pathname).to.equal('/test');
  });

  it('должен обрабатывать start() и вызывать render()', () => {
    router.use(window.location.pathname, Block);
    router.start();
    expect(router['currentRoute']).to.exist;
    expect(router['currentRoute'].render.called).to.be.true;
  });

  it('должен вызывать go() и отображать правильный маршрут', () => {
    router.use('/page1', Block);
    router.use('/page2', Block);
    router.go('/page1');
    expect(router['currentRoute'].pathname).to.equal('/page1');
    expect(router['currentRoute'].render.called).to.be.true;
  });

  it('должен переходить на маршрут по умолчанию "*" если совпадений нет', () => {
    router.use('*', Block);
    router.go('/non-existent');
    expect(router['currentRoute'].pathname).to.equal('*');
    expect(router['currentRoute'].render.called).to.be.true;
  });

  it('должен вызывать leave() на текущем маршруте перед отображением нового', () => {
    router.use('/a', Block);
    router.use('/b', Block);
    router.go('/a');
    const first = router['currentRoute'];
    router.go('/b');
    expect(first.leave.called).to.be.true;
  });

  it('должен отслеживать popstate и обрабатывать смену маршрута', () => {
    router.use('/pop', Block);
    const onRouteStub = sinon.stub(router as any, '_onRoute');
    window.history.pushState({}, '', '/pop');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(onRouteStub.calledOnceWith('/pop')).to.be.true;
    onRouteStub.restore();
  });
});