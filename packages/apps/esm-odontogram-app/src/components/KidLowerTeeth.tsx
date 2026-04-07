import React from 'react';

import MainSectionOnTheCanvas from './MainSectionOnTheCanvas';
import ToothDetails from './ToothDetails';
import ToothVisualization from './ToothVisualization';

const kidLowerTeeth = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
};

const lowerVisualizationStyle: React.CSSProperties = {
  ...rowStyle,
  alignItems: 'flex-start',
};

const findingRows = [13, 25, 24, 2, 1];

export default function KidLowerTeeth() {
  return (
    <>
      <div style={lowerVisualizationStyle}>
        {kidLowerTeeth.map((toothId) => (
          <ToothVisualization
            key={`kid-lower-visual-${toothId}`}
            idTooth={toothId}
            zones={6}
            design="default"
            position="lower"
          />
        ))}
      </div>

      {findingRows.map((optionId) => (
        <div key={`kid-lower-finding-${optionId}`} style={rowStyle}>
          {kidLowerTeeth.map((toothId) => (
            <MainSectionOnTheCanvas key={`kid-lower-finding-${optionId}-${toothId}`} idTooth={toothId} optionId={optionId} />
          ))}
        </div>
      ))}

      <div style={rowStyle}>
        {kidLowerTeeth.map((toothId) => (
          <ToothDetails key={`kid-lower-details-${toothId}`} idTooth={toothId} initialText="" legend={toothId} />
        ))}
      </div>
    </>
  );
}