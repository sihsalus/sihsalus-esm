import React from 'react';
import { getPolygonPoints } from '../poligonPoints/ToothPolygonDesigns';
import './Tooth.css';

interface ToothProps {
  zones: number;
}

const Tooth: React.FC<ToothProps> = ({ zones }) => {
  return (
    <svg x="0" y="60" width="60" height="60" viewBox="0 0 20 20" className="tooth">
      {getPolygonPoints(zones).map((points: string, index: number) => (
        <polygon
          key={index}
          points={points}
          fill="white"
          strokeWidth="0.15"
          stroke="black"
          style={{ transition: 'fill 0.3s ease' }}
        />
      ))}
    </svg>
  );
};

export default Tooth;
