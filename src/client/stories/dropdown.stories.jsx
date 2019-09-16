import React from 'react';
import { storiesOf } from '@storybook/react';
import { Dropdown } from '../components/dropdown';
// import { action } from '@storybook/addon-actions';



storiesOf('Dropdown', module)
    .add('slide dropdown no title', () => {
        const values = ['Context', 'Anticipate', 'Enact', 'Reflect'];
        return <Dropdown values={values} />
    })
    // .add('with some emoji', () => (
    //     <Button onClick={action('clicked')}>
    //         <span role="img" aria-label="so cool">
    //             😀 😎 👍 💯
    //         </span>
    //     </Button>
    // ));