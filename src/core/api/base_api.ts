import { HTTPTransport } from '../HTTPtransport';

export class BaseAPI {
  protected http: HTTPTransport;
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HTTPTransport();
  }

  protected get(url: string, options = {}) {
    return this.http.get(`${this.baseUrl}${url}`, options);
  }

  protected post(url: string, options = {}) {
    return this.http.post(`${this.baseUrl}${url}`, options);
  }

  protected put(url: string, options = {}) {
    return this.http.put(`${this.baseUrl}${url}`, options);
  }

  protected delete(url: string, options = {}) {
    return this.http.delete(`${this.baseUrl}${url}`, options);
  }
}
