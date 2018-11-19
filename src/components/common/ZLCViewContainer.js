import React from 'react';
import styled from 'styled-components';

export const StyledViewContainer = styled.View`
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: white;
`;

export const ZLCViewContainer = ({ children }: { children?: React.Element<*> }) => (
    <StyledViewContainer>{children}</StyledViewContainer>
);

ZLCViewContainer.defaultProps = {
    children: null,
};
