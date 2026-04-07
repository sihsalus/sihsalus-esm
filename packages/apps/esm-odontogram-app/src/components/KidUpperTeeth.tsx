import React from 'react';

import MainSectionOnTheCanvas from './MainSectionOnTheCanvas';
import ToothDetails from './ToothDetails';
import ToothVisualization from './ToothVisualization';

const kidUpperTeeth = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
};

const findingRows = [1, 2, 24, 25, 13];

export default function KidUpperTeeth() {
  return (
    <>
      <div style={rowStyle}>
        {kidUpperTeeth.map((toothId) => (
          <ToothDetails key={`kid-upper-details-${toothId}`} idTooth={toothId} initialText="" legend={toothId} />
        ))}
      </div>

      {findingRows.map((optionId) => (
        <div key={`kid-upper-finding-${optionId}`} style={rowStyle}>
          {kidUpperTeeth.map((toothId) => (
            <MainSectionOnTheCanvas key={`kid-upper-finding-${optionId}-${toothId}`} idTooth={toothId} optionId={optionId} />
          ))}
        </div>
      ))}

      <div style={rowStyle}>
        {kidUpperTeeth.map((toothId) => (
          <ToothVisualization key={`kid-upper-visual-${toothId}`} idTooth={toothId} zones={6} design="default" />
        ))}
      </div>
    </>
  );
}