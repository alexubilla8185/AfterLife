import React from 'react';
import Tour, { TourStep } from './Tour';

interface LoginTourProps {
    onClose: () => void;
}

const loginSteps: TourStep[] = [
    {
        title: 'Welcome to AfterLife!',
        content: 'This is an interactive space for remembrance. You can explore as a Visitor or craft a lasting digital story as a Creator. Let\'s quickly go over both roles.',
        position: 'center',
    },
    {
        title: 'For Creators',
        content: 'As a Creator, you build your own digital memorial. Share your bio, link to your work, and write special messages that visitors can receive when they interact with your profile.',
        position: 'center',
    },
    {
        title: 'For Visitors',
        content: 'As a Visitor, you can explore a memorial, leave a tribute for others to see, and have a conversation with the memory of a loved one through an interactive chat.',
        position: 'center',
    }
];

const LoginTour: React.FC<LoginTourProps> = ({ onClose }) => {
    return (
        <Tour 
            isOpen={true}
            onClose={onClose}
            steps={loginSteps}
        />
    );
};

export default LoginTour;
