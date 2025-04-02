import Block from './block';
import Handlebars, { HelperOptions } from 'handlebars';

interface BlockConstructable<P = Record<string, unknown>> {
  new (props: P): Block;
  componentName: string;
}

export default function registerComponent<P extends Record<string, unknown>>(
  Component: BlockConstructable<P>,
) {
  Handlebars.registerHelper(
    Component.componentName || Component.name,
    function (this: P, { hash: { ref, ...hash }, data, fn }: HelperOptions) {
      if (!data.root.children) {
        data.root.children = {};
      }

      if (!data.root.refs) {
        data.root.refs = {};
      }

      const { children, refs } = data.root;

      (Object.keys(hash) as (keyof P)[]).forEach(key => {
        if (typeof this[key] === 'string' && typeof hash[key] === 'string') {
          hash[key] = (hash[key] as string).replace(
            new RegExp(`{{${String(key)}}}`, 'gi'),
            this[key] as string,
          );
        }
      });

      const component = new Component(hash);
      children[component._id] = component;

      if (ref) {
        refs[ref] = component;
      }

      const contents = fn ? fn(this) : '';

      return new Handlebars.SafeString(`<div data-id="${component._id}">${contents}</div>`);
    },
  );
}
