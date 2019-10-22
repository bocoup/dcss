import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';

const AudioResponseCard = () => (
    <Popup
        content="An audio recorder for users to record responses."
        header="Audio Response"
        trigger={
            <Icon
                name="question circle outline"
                aria-label="Audio Response Component"
            />
        }
    />
);

export default React.memo(AudioResponseCard);