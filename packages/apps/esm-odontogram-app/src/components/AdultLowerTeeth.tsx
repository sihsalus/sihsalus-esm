import React from 'react';

import MainSectionOnTheCanvas from './MainSectionOnTheCanvas';
import ToothDetails from './ToothDetails';
import ToothVisualization from './ToothVisualization';

const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
};

const lowerVisualizationStyle: React.CSSProperties = {
  ...rowStyle,
  alignItems: 'flex-start',
};

const findingRows = [13, 25, 24, 39, -1, 32, 31, 30, 2, 1];

export default function AdultLowerTeeth() {
  return (
    <>
      <div style={lowerVisualizationStyle}>
        {lowerTeeth.map((toothId) => (
          <ToothVisualization key={`lower-visual-${toothId}`} idTooth={toothId} zones={8} design="default" position="lower" />
        ))}
      </div>

      {findingRows.map((optionId) => (
        <div key={`lower-finding-${optionId}`} style={rowStyle}>
          {lowerTeeth.map((toothId) => (
            <MainSectionOnTheCanvas key={`lower-finding-${optionId}-${toothId}`} idTooth={toothId} optionId={optionId} />
          ))}
        </div>
      ))}

      <div style={rowStyle}>
        {lowerTeeth.map((toothId) => (
          <ToothDetails key={`lower-details-${toothId}`} idTooth={toothId} initialText="" legend={toothId} />
        ))}
      </div>
    </>
  );
}
