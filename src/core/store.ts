type Indexed = Record<string, any>;

function set(object: Indexed, path: string, value: unknown): Indexed {
  if (typeof path !== 'string') {
    throw new Error('path must be string');
  }

  const pathArray = path.split('.');
  const result = { ...object };

  let current = result;
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  current[pathArray[pathArray.length - 1]] = value;
  return result;
}

class Store {
  private static _instance: Store;
  private state: Indexed = {};

  private constructor() {}

  public static getInstance(): Store {
    if (!Store._instance) {
      Store._instance = new Store();
    }
    return Store._instance;
  }

  public getState(): Indexed {
    return this.state;
  }

  public set(path: string, value: unknown): void {
    this.state = set(this.state, path, value);
  }
}

export default Store.getInstance();