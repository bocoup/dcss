import { type } from './type';
export { type };
export const defaultValue = ({ responseId }) => ({
    placeholder: 'Placeholder Text',
    prompt: 'Prompt (displayed before input field as label)',
    recallId: '',
    required: true,
    responseId,
    type
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
