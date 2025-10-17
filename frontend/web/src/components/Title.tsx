import React from 'react';

interface TitleProps {
    className?: string;
}

const Title: React.FC<TitleProps> = ({ className }) => {
    return <h1 className={className}>Life BSO</h1>;
};

export default Title;
