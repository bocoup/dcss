import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  id: '',
  persona: null,
  placeholder: 'Your response',
  prompt: '',
  recallId: '',
  required: true,
  responseId,
  timeout: 0,
  type
});
