import React, { FC } from 'react';
import styled from 'styled-components';

export interface NotificationProps {
    message: string;
    variant: 'error' | 'info';
}

const StyledNotification = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 500;
    padding: 12px 15px;

    &.error {
        background-color: ${params => params.theme.colors.error};
    }

    &.info {
        background-color: ${params => params.theme.colors.green};
    }
`;

export const Notification: FC<NotificationProps> = ({ message, variant }) => {
    return <StyledNotification className={variant}>{message}</StyledNotification>;
};
