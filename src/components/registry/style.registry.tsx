'use client';
import { StyleRegistry } from 'styled-jsx';

const StyleWrapper = ({ children }: { children: React.ReactNode }) => {
    return <StyleRegistry>{children}</StyleRegistry>;
};

export default StyleWrapper;
