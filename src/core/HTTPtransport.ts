type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface HTTPOptions {
  data?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  timeout?: number;
}

const METHODS: Record<HTTPMethod, HTTPMethod> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

function queryStringify(data: Record<string, unknown>, prefix = ''): string {
  if (!data || typeof data !== 'object') return '';

  return Object.entries(data)
    .flatMap(([key, value]) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(value)) {
        return value.map(item => `${fullKey}[]=${encodeURIComponent(String(item))}`);
      }

      if (typeof value === 'object' && value !== null) {
        return queryStringify(value as Record<string, unknown>, fullKey);
      }

      return `${fullKey}=${encodeURIComponent(String(value))}`;
    })
    .join('&');
}

export class HTTPTransport {
  private apiUrl: string;

  constructor(baseUrl: string = '') {
    this.apiUrl = baseUrl;
  }

  public get(url: string, options: HTTPOptions = {}): Promise<XMLHttpRequest> {
    return this.request(`${this.apiUrl}${url}`, { ...options, method: METHODS.GET }, options.timeout);
  }

  public post(url: string, options: HTTPOptions = {}): Promise<XMLHttpRequest> {
    return this.request(`${this.apiUrl}${url}`, { ...options, method: METHODS.POST }, options.timeout);
  }

  public put(url: string, options: HTTPOptions = {}): Promise<XMLHttpRequest> {
    return this.request(`${this.apiUrl}${url}`, { ...options, method: METHODS.PUT }, options.timeout);
  }

  public delete(url: string, options: HTTPOptions = {}): Promise<XMLHttpRequest> {
    return this.request(`${this.apiUrl}${url}`, { ...options, method: METHODS.DELETE }, options.timeout);
  }

  private request(url: string, options: HTTPOptions & { method: HTTPMethod }, timeout = 5000): Promise<XMLHttpRequest> {
    const { method, data, headers = {} } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;
      const urlWithQuery = isGet && data && !(data instanceof FormData) ? `${url}?${queryStringify(data as Record<string, unknown>)}` : url;

      xhr.open(method, urlWithQuery);
      xhr.timeout = timeout;

      Object.entries(headers).forEach(([header, value]) => {
        xhr.setRequestHeader(header, value);
      });

      xhr.onload = () => resolve(xhr);
      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Request timed out'));

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
