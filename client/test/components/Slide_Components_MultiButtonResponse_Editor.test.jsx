import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

let scenario;
let slideIndex;
let value;

import Editor from '../../components/Slide/Components/MultiButtonResponse/Editor.jsx';

const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  scenario = {
    author: {
      id: 999,
      username: 'super',
      personalname: 'Super User',
      email: 'super@email.com',
      is_anonymous: false,
      roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
      is_super: true
    },
    categories: [],
    consent: { id: 57, prose: '' },
    description: "This is the description of 'A Multiplayer Scenario'",
    finish: {
      id: 1,
      title: '',
      components: [
        { html: '<h2>Thanks for participating!</h2>', type: 'Text' }
      ],
      is_finish: true
    },
    lock: {
      scenario_id: 42,
      user_id: 999,
      created_at: '2020-02-31T23:54:19.934Z',
      ended_at: null
    },
    slides: [
      {
        id: 1,
        title: '',
        components: [
          { html: '<h2>Thanks for participating!</h2>', type: 'Text' }
        ],
        is_finish: true
      },
      {
        id: 2,
        title: '',
        components: [
          {
            id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
            html: '<p>paragraph</p>',
            type: 'Text'
          },
          {
            id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
            type: 'TextResponse',
            header: 'TextResponse-1',
            prompt: '',
            timeout: 0,
            recallId: '',
            required: true,
            responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
            placeholder: 'Your response'
          },
          {
            id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
            html: '<p>?</p>',
            type: 'Text'
          }
        ],
        is_finish: false
      }
    ],
    status: 1,
    title: 'Multiplayer Scenario 2',
    users: [
      {
        id: 999,
        email: 'super@email.com',
        username: 'super',
        personalname: 'Super User',
        roles: ['super'],
        is_super: true,
        is_author: true,
        is_reviewer: false
      }
    ],
    id: 42,
    created_at: '2020-08-31T17:50:28.089Z',
    updated_at: null,
    deleted_at: null,
    labels: ['a', 'b'],
    personas: [
      {
        id: 1,
        name: 'Participant',
        description:
          'The default user participating in a single person scenario.',
        color: '#FFFFFF',
        created_at: '2020-12-01T15:49:04.962Z',
        updated_at: null,
        deleted_at: null,
        author_id: 3,
        is_read_only: true,
        is_shared: true
      }
    ]
  };
  slideIndex = 0;
  value = {
    id: 'XYZ',
    buttons: [
      { color: '#ff00ff', display: 'Yes', value: 'Yes' },
      { color: '#ff0000', display: 'No', value: 'No' }
    ],
    header: 'xyz-header',
    prompt: 'xyz-prompt',
    recallId: 'xyz-recallId',
    required: true,
    responseId: 'xyz-responseId',
    type: 'MultiButtonResponse'
  };

  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('Editor', () => {
  expect(Editor).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = Editor;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

/* INJECTION STARTS HERE */

test('Missing props', async done => {
  const Component = Editor;

  value.buttons = undefined;
  value.header = undefined;
  value.prompt = undefined;
  value.recallId = undefined;
  value.responseId = undefined;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Buttons empty', async done => {
  const Component = Editor;

  value.buttons = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Save single button', async done => {
  const Component = Editor;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const saveButtons = await screen.findAllByLabelText('Save button');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(saveButtons[0]);

  jest.advanceTimersByTime(1000);

  expect(asFragment()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "color": "#ff00ff",
            "display": "Yes",
            "value": "Yes",
          },
          Object {
            "color": "#ff0000",
            "display": "No",
            "value": "No",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  done();
});

test('Delete single button', async done => {
  const Component = Editor;

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const deleteButtons = await screen.findAllByLabelText('Delete this button');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(deleteButtons[0]);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(await screen.findByRole('button', { name: /Yes/ }));
  expect(asFragment()).toMatchSnapshot();

  jest.advanceTimersByTime(1000);

  expect(asFragment()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "color": "#ff0000",
            "display": "No",
            "value": "No",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  done();
});

test('Add a button empty fields', async done => {
  const Component = Editor;

  value.buttons = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const add = await screen.findByLabelText('Add a button');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(add);
  expect(asFragment()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "",
            "value": "",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  const displayInput = await screen.findByLabelText(
    'Enter the display for button 1'
  );
  const valueInput = await screen.findByLabelText(
    'Enter the value of button 1'
  );

  userEvent.type(displayInput, 'Yes');
  expect(asFragment()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  userEvent.click(valueInput);
  expect(asFragment()).toMatchSnapshot();

  // BLUR & FOCUS
  expect(props.onChange).toHaveBeenCalledTimes(4);

  // BLUR
  expect(props.onChange.mock.calls[2]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  // FOCUS
  expect(props.onChange.mock.calls[3]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  userEvent.click(await screen.findByLabelText('Save button'));
  expect(asFragment()).toMatchSnapshot();

  // BLUR & FOCUS
  expect(props.onChange).toHaveBeenCalledTimes(6);
  expect(props.onChange.mock.calls[4]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  expect(props.onChange.mock.calls[5]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  done();
});

test('Prevent empty fields', async done => {
  const Component = Editor;

  value.buttons = [];

  const props = {
    ...commonProps,
    scenario,
    slideIndex,
    onChange: jest.fn(),
    value
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const add = await screen.findByLabelText('Add a button');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(add);
  expect(asFragment()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "",
            "value": "",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  const displayInput = await screen.findByLabelText(
    'Enter the display for button 1'
  );
  const valueInput = await screen.findByLabelText(
    'Enter the value of button 1'
  );

  userEvent.type(valueInput, 'Yes');
  expect(asFragment()).toMatchSnapshot();
  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  userEvent.click(displayInput);
  expect(asFragment()).toMatchSnapshot();

  // BLUR & FOCUS
  expect(props.onChange).toHaveBeenCalledTimes(4);

  // BLUR
  expect(props.onChange.mock.calls[2]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  // FOCUS
  expect(props.onChange.mock.calls[3]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  userEvent.click(await screen.findByLabelText('Save button'));
  expect(asFragment()).toMatchSnapshot();
  // BLUR & FOCUS
  expect(props.onChange).toHaveBeenCalledTimes(6);
  expect(props.onChange.mock.calls[4]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  expect(props.onChange.mock.calls[5]).toMatchInlineSnapshot(`
    Array [
      Object {
        "buttons": Array [
          Object {
            "display": "Yes",
            "value": "Yes",
          },
        ],
        "header": "xyz-header",
        "prompt": "xyz-prompt",
        "recallId": "xyz-recallId",
        "responseId": "xyz-responseId",
        "type": "MultiButtonResponse",
      },
    ]
  `);

  done();
});
