/* eslint-disable */
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

  it('должен обрабатывать start() и создавать блок', () => {
    router.use('/', Block);
    router.start();
    const currentRoute = router['currentRoute'];
    expect(currentRoute.block).to.be.instanceOf(Block);
    expect(currentRoute.block.hide.called).to.be.false;
  });

  it('должен вызывать go() и скрывать предыдущий блок', () => {
    router.use('/page1', Block);
    router.use('/page2', Block);
    router.go('/page1');
    const firstBlock = router['currentRoute'].block;
    router.go('/page2');
    expect(firstBlock.hide.calledOnce).to.be.true;
  });

  it('должен переходить на маршрут "*" если совпадений нет', () => {
    router.use('*', Block);
    router.go('/non-existent');
    expect(router['currentRoute'].pathname).to.equal('*');
  });

  it('должен вызывать hide() при переходе между маршрутами', () => {
    router.use('/a', Block);
    router.use('/b', Block);

    router.go('/a');
    const firstBlock = router['currentRoute'].block;

    router.go('/b');
    expect(firstBlock.hide.calledOnce).to.be.true;
  });

  it('должен обрабатывать popstate', () => {
    router.use('/pop', Block);
    const originalRoute = router['currentRoute'];

    window.history.pushState({}, '', '/pop');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(originalRoute.block.hide.calledOnce).to.be.true;
  });
});
