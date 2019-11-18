import { type } from './type';
export { type };
export const defaultValue = () => ({
    type,
    html: '<h1>Slide Heading</h1><p>Type your slide content</p>'
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
