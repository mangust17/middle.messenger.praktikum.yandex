// import { expect } from 'chai';
// import sinon from 'sinon';
// import { HTTPTransport } from './HTTPtransport.ts';

// interface HTTPResponse {
//   status: number;
//   responseText: string;
// }

// type SinonFakeXMLHttpRequest = InstanceType<ReturnType<typeof sinon['useFakeXMLHttpRequest']>>;

// describe('HTTPTransport', () => {
//   let xhr: ReturnType<typeof sinon['useFakeXMLHttpRequest']>;
//   let requests: SinonFakeXMLHttpRequest[] = [];
//   let transport: HTTPTransport;

//   beforeEach(() => {
//     xhr = sinon.useFakeXMLHttpRequest();
//     requests = [];
//     xhr.onCreate = (req) => requests.push(req);
//     transport = new HTTPTransport();
//   });

//   afterEach(() => {
//     xhr.restore();
//   });

//   it('должен выполнять GET-запрос с параметрами в строке запроса', async () => {
//     const data = { a: 1, b: 2 };
//     const promise = transport.get('/test', { data });

//     requests[0].respond(200, {}, 'ok');
//     const response = (await promise) as { status: number };

//     expect(requests[0].method).to.equal('GET');
//     expect(requests[0].url).to.include('?a=1&b=2');
//     expect(response.status).to.equal(200);
//   });

//   it('должен отправлять POST-запрос с JSON-данными', async () => {
//     const data = { a: 'abc' };
//     const promise = transport.post('/submit', { data });

//     requests[0].respond(200, { 'Content-Type': 'application/json' }, 'created');
//     const response = (await promise) as HTTPResponse;

//     expect(requests[0].method).to.equal('POST');
//     expect(JSON.parse(requests[0].requestBody)).to.deep.equal(data);
//     expect(response.status).to.equal(200);
//   });

//   it('должен отправлять PUT-запрос', async () => {
//     const data = { id: 1 };
//     const promise = transport.put('/update', { data });

//     requests[0].respond(200, {}, 'updated');
//     const response = (await promise) as HTTPResponse;

//     expect(requests[0].method).to.equal('PUT');
//     expect(JSON.parse(requests[0].requestBody)).to.deep.equal(data);
//     expect(response.status).to.equal(200);
//   });

//   it('должен отправлять PATCH-запрос', async () => {
//     const data = { name: 'test' };
//     const promise = transport.patch('/edit', { data });

//     requests[0].respond(200, {}, 'patched');
//     const response = (await promise) as HTTPResponse;

//     expect(requests[0].method).to.equal('PATCH');
//     expect(JSON.parse(requests[0].requestBody)).to.deep.equal(data);
//     expect(response.status).to.equal(200);
//   });

//   it('должен отправлять DELETE-запрос', async () => {
//     const data = { id: 5 };
//     const promise = transport.delete('/remove', { data });

//     requests[0].respond(200, {}, 'deleted');
//     const response = (await promise) as HTTPResponse;

//     expect(requests[0].method).to.equal('DELETE');
//     expect(requests[0].url).to.include('/remove');
//     expect(response.status).to.equal(200);
//   });

//   it('должен устанавливать заголовки', async () => {
//     const headers = { 'X-Test': 'value' };
//     const promise = transport.get('/header', { headers });

//     requests[0].respond(200, {}, 'ok');
//     const response = (await promise) as HTTPResponse;

//     expect(requests[0].requestHeaders['X-Test']).to.equal('value');
//     expect(response.status).to.equal(200);
//   });
// });
