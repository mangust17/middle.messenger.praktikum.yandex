 
import EventBus from './eventBus';
import Handlebars from 'handlebars';
import { nanoid } from 'nanoid';

class Block<TProps extends Record<string, any> = {}, TState extends Record<string, any> = {}> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  _id = nanoid(6);

  private _element: HTMLElement | null = null;

  protected props: TProps;
  protected children: Record<string, Block>;
  private eventBus: () => EventBus;
  protected state: TState;

  /** JSDoc
   * @param {Object} props
   *
   * @returns {void}
   */

  constructor(propsAndChildren: any = {}, initialState?: TState) {
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;

    const { props, children } = this.getChildren(propsAndChildren);

    this.children = children;

    this.props = this._makePropsProxy(props);
    this.state = this._makeStateProxy(initialState || ({} as TState));

    this.initChildren();

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  protected init() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidMount() {
    this.componentDidMount();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  protected componentDidMount() {
    return;
  }

  private _componentDidUpdate(oldProps: any, newProps: any) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  protected componentDidUpdate(oldProps: any, newProps: any) {
    return JSON.stringify(oldProps) !== JSON.stringify(newProps);
  }

  public setProps = (nextProps: any) => {
    if (!nextProps) return;

    Object.assign(this.props, nextProps);
    this.eventBus().emit(Block.EVENTS.FLOW_CDU, this.props, nextProps);
  };

  public setState(update: Partial<TState> | ((prevState: TState) => Partial<TState>)) {
    const newState = typeof update === 'function' ? update(this.state) : update;

    const updatedState = Object.keys(newState).reduce((acc, key) => {
      const value = newState[key as keyof TState];

      if (Array.isArray(value)) {
        acc[key as keyof TState] = [...value] as TState[keyof TState];
      } else if (typeof value === 'object' && value !== null) {
        acc[key as keyof TState] = { ...value } as TState[keyof TState];
      } else {
        acc[key as keyof TState] = value;
      }

      return acc;
    }, {} as Partial<TState>);

    Object.assign(this.state, updatedState);

    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  get element(): HTMLElement | null {
    return this._element;
  }

  private _render() {
    const fragment = this.render();
    const newElement = fragment.firstElementChild as HTMLElement;

    if (this._element) {
      this._removeEvents();

      this._element.replaceWith(newElement);
    }

    this._element = newElement;

    this._addEvents();
  }

  protected render(): DocumentFragment {
    return new DocumentFragment();
  }

  getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: TProps) {
    return new Proxy(props, {
      get: (target, prop) => target[prop as keyof TProps],
      set: (target, prop, value) => {
        const oldProps = { ...target };
        target[prop as keyof TProps] = value;
        this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
    });
  }

  private _makeStateProxy(state: TState) {
    return new Proxy(state, {
      get: (target, prop) => target[prop as keyof TState],
      set: (target, prop, value) => {
        const oldState = { ...target };
        target[prop as keyof TState] = value;
        this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldState, target);
        return true;
      },
    });
  }

  private _removeEvents() {
    const events: Record<string, () => void> = (this.props as any).events;

    if (!events || !this._element) return;

    Object.entries(events).forEach(([event, listener]) => {
      this._element?.removeEventListener(event, listener);
    });
  }

  private _addEvents() {
    const events: Record<string, () => void> = (this.props as any).events;

    if (!events || !this._element) return;

    Object.entries(events).forEach(([event, listener]) => {
      this._element?.addEventListener(event, listener);
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  public show() {
    const el = this.getContent();

    if (el) el.style.display = 'block';
  }

  public hide() {
    const el = this.getContent();

    if (el) el.style.display = 'none';
  }

  protected getChildren(propsAndChildren: any) {
    const children: any = {};
    const props: any = {};

    Object.entries(propsAndChildren).map(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { props, children };
  }

  protected initChildren() {
    return;
  }

  protected compile(templateString: string, context: any, additionalData: any = {}) {
    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
    Object.entries(this.children).forEach(([key, child]) => {
      context[key] = `<div data-id="id-${child._id}"></div>`;
    });

    Object.entries(additionalData).forEach(([key, value]) => {
      context[key] = value;
    });

    const template = Handlebars.compile(templateString);

    const htmlString = template(context);

    fragment.innerHTML = htmlString;
    Object.entries(this.children).forEach(([, child]) => {
      const stub = fragment.content.querySelector(`[data-id="id-${child._id}"]`);
      if (!stub) return;
      stub.replaceWith(child.getContent() as HTMLElement);
    });

    return fragment.content;
  }
}

export default Block;
