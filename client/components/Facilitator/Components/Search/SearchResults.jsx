import React from 'react';
import { Image, List } from 'semantic-ui-react';

export default ({ view, results }) => {
    if (!results.length) {
        return (
            <List.Item fluid="true" key="empty-results">
                <Image src="https://react.semantic-ui.com/images/wireframe/media-paragraph.png" />
            </List.Item>
        );
    }
    return results.map(record => {
        const {
            description,
            email,
            ended_at,
            id,
            title = '',
            username = ''
        } = record;
        return view === 'users' ? (
            <List.Item fluid="true" key={id}>
                <List.Header as="h3">{username}</List.Header>
                <List.Content>
                    {email}
                    <br />
                    Clicking (or not?) on this item should display controls for:
                    <ul>
                        <li>viewing this participant&apos;s runs.</li>
                        <li>initiating a session</li>
                    </ul>
                </List.Content>
            </List.Item>
        ) : (
            <List.Item fluid="true" key={id}>
                <List.Header as="h3">
                    {username} participated in &quot;{title}&quot; on {ended_at}
                </List.Header>
                <List.Content>
                    {description}
                    Clicking (or not?) on this item should display controls for:
                    <ul>
                        <li>viewing the responses collected for this run.</li>
                        <li>...</li>
                    </ul>
                </List.Content>
            </List.Item>
        );
    });
};
