import Block from './block';
import renderDOM from './renderDom';

class Route {
  public pathname: string;
  private blockClass: typeof Block;
  private block: Block | null = null;

  constructor(pathname: string, view: typeof Block) {
    this.pathname = pathname;
    this.blockClass = view;
  }

  navigate(path: string) {
    if (this.pathname === path) {
      this.render();
    }
  }

  leave() {
    if (this.block) {
      this.block.hide();
    }
  }

  render() {
    if (!this.block) {
      this.block = new this.blockClass({});
    }
    renderDOM('#app', this.block);
  }
}

class Router {
  private static _instance: Router;
  private routes: Route[] = [];
  private history = window.history;
  private currentRoute: Route | null = null;

  constructor() {
    if (Router._instance) {
      return Router._instance;
    }
    Router._instance = this;
    window.onpopstate = (event: PopStateEvent) => {
      this._onRoute((event.currentTarget as Window).location.pathname);
    };
  }

  use(pathname: string, block: typeof Block) {
    const route = new Route(pathname, block);
    this.routes.push(route);
    return this;
  }

  start() {
    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string) {
    const defaultRoute = this.routes.find(r => r.pathname === '*') || null;
    const route = this.routes.find(r => r.pathname === pathname) || defaultRoute;

    if (!route) {
      console.error('No route found and 404 not registered');
      return;
    }

    if (this.currentRoute) {
      this.currentRoute.leave();
    }

    this.currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }
}

export default new Router();
