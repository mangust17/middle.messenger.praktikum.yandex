import Block from './block.ts';
import renderDOM from './renderDom.ts';

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

    document.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = link.getAttribute('href');
        if (path) {
          this.go(path);
        }
      }
    });
  }

  use(pathname: string, block: typeof Block) {
    const route = new Route(pathname, block);
    this.routes.push(route);
    return this;
  }

  start() {
    window.addEventListener('popstate', () => this._onRoute(window.location.pathname));
    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string) {
    console.log('Обработка пути:', pathname);
    const defaultRoute = this.routes.find(r => r.pathname === '*') || null;
    const route = this.routes.find(r => r.pathname === pathname) || defaultRoute;

    if (!route) {
      console.error('No route found and 404 not registered');
      return;
    }

    console.log('Найден маршрут:', route.pathname);

    if (this.currentRoute) {
      this.currentRoute.leave();
    }

    this.currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    console.log('Переход по пути:', pathname);
    if (this.currentRoute) {
      this.currentRoute.leave();
    }
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

const router = new Router();

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.router = router;
}

export default router;
