/* eslint-disable */
import Block from './block.ts';
import { expect } from 'chai';
import jsdomGlobal from 'jsdom-global';

describe('Класс Block', () => {
  jsdomGlobal();

  class TestComponent extends Block<{ text: string }> {
    render() {
      const fragment = document.createElement('template');
      fragment.innerHTML = `<div>${this.props.text}</div>`;
      return fragment.content;
    }
  }

  it('должен инициализироваться с пропсами', () => {
    const block = new TestComponent({ text: 'Привет' });
    expect(block).to.be.instanceOf(Block);
    expect(block['props'].text).to.equal('Привет');
  });

  it('должен отображать корректный контент', () => {
    const block = new TestComponent({ text: 'Тестовый текст' });
    const el = block.getContent();
    expect(el?.textContent).to.equal('Тестовый текст');
  });

  it('должен обновлять пропсы и вызывать обновление', () => {
    const block = new TestComponent({ text: 'До обновления' });
    block.setProps({ text: 'После обновления' });
    expect(block['props'].text).to.equal('После обновления');
  });

  it('должен скрывать и показывать элемент', () => {
    const block = new TestComponent({ text: 'Видимый' });
    block.show();
    expect(block.getContent()?.style.display).to.equal('block');
    block.hide();
    expect(block.getContent()?.style.display).to.equal('none');
  });
});