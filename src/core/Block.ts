import { EventBus } from "./EventBus";

export interface BlockProps {
  [key: string]: unknown;
}

export class Block<P extends BlockProps = {}> {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render"
  } as const;

  private _element: HTMLElement;
  private _meta: { tagName: string; props: P };
  private eventBus: EventBus<{
    [Block.EVENTS.INIT]: [];
    [Block.EVENTS.FLOW_CDM]: [];
    [Block.EVENTS.FLOW_CDU]: [P, P];
    [Block.EVENTS.FLOW_RENDER]: [];
  }>;

  public props: P;

  constructor(tagName: string = "div", props: P) {
    this.eventBus = new EventBus();
    this._meta = { tagName, props };

    this.props = this._makePropsProxy(props);
    this._element = this._createDocumentElement(tagName);

    this._registerEvents();
    this.eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(): void {
    this.eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    this.eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    this.eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    this.eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  private _createResources(): void {
    this._element = this._createDocumentElement(this._meta.tagName);
  }

  protected init(): void {
    this._createResources();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
  }

  protected componentDidMount(): void {}

  public dispatchComponentDidMount(): void {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: P, newProps: P): void {
    if (this.componentDidUpdate(oldProps, newProps)) {
      this._render();
    }
  }

  protected componentDidUpdate(oldProps: P, newProps: P): boolean {
    return true;
  }

  public setProps(nextProps: Partial<P>): void {
    if (!nextProps) {
      return;
    }
    const oldProps = { ...this.props };
    Object.assign(this.props, nextProps);
    this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, this.props);
  }

  public get element(): HTMLElement {
    return this._element;
  }

  private _render(): void {
    const block = this.render();
    this._element.innerHTML = block;
  }

  protected render(): string {
    return "";
  }

  public getContent(): HTMLElement {
    return this.element;
  }

  private _makePropsProxy(props: P): P {
    const self = this;
  
    return new Proxy(props, {
      get(target, prop: string | symbol) {
        if (typeof prop === "string") {
          return target[prop as keyof P];
        }
      },
      set(target, prop: string | symbol, value: any) {
        if (typeof prop === "string") {
          target[prop as keyof P] = value;
          self.eventBus.emit(Block.EVENTS.FLOW_CDU, { ...target }, target);
        }
        return true;
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      }
    });
  }
  

  public show(): void {
    this.getContent().style.display = "block";
  }

  public hide(): void {
    this.getContent().style.display = "none";
  }
}
