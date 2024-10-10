import React, { useEffect, useState } from 'react';
import './Particle.css';

const Particle = ({ distance, angle, xOffset, yOffset }) => {
    const [position, setPosition] = useState({ left: 0, top: 0 });

    useEffect(() => {
        const x = xOffset + distance * Math.cos(angle);
        const y = yOffset + distance * Math.sin(angle);
        setPosition({ left: `${x}px`, top: `${y}px` });
    }, [distance, angle, xOffset, yOffset]);

    return <div className="particle" style={{ left: position.left, top: position.top }} />;
};

export default Particle;
