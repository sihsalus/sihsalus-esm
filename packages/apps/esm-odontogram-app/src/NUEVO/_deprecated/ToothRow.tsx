import React from "react";
import MainSectionOnTheCanvas from "./MainSectionOnTheCanvas";
import { useUpperTeeth, useLowerTeeth } from "../hooks/useTeethByPosition";

interface ToothRowProps {
  optionId: number;
  spacingComponent: React.ComponentType<{ id: any; odontogramType?: string }>;
  spacingData: any[];
  spaceBetweenLegends: any[];
  position?: 'upper' | 'lower';
}

const ToothRow: React.FC<ToothRowProps> = ({
  optionId,
  spacingComponent: SpacingComponent,
  spacingData,
  spaceBetweenLegends,
  position = 'upper'
}) => {
  const upperTeeth = useUpperTeeth();
  const lowerTeeth = useLowerTeeth();
  const teeth = position === 'lower' ? lowerTeeth : upperTeeth;

  if (!spacingData || spacingData.length === 0) {
    console.warn(`ToothRow: No spacing data provided for optionId ${optionId}`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
      {teeth.map((tooth, index) => {
        const spacingItem = spacingData[index];
        const shouldRenderSpacing = index < spaceBetweenLegends.length && spacingItem;
        
        return (
          <React.Fragment key={tooth.id}>
            <MainSectionOnTheCanvas
              idTooth={tooth.id}
              optionId={optionId}
            />
            {shouldRenderSpacing && (
              <SpacingComponent
                id={spacingItem.id}
                odontogramType="adult"
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ToothRow; 