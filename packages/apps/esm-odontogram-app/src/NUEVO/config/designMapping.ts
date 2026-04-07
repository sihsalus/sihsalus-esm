import {
  Finding1Design1,
  Finding1Design2,
  Finding1Design3,
  Finding1Design4,
  Finding1Design5,
  Finding1Design6,
  Finding2Design1,
  Finding2Design2,
  Finding24Design1,
  Finding24Design2,
  Finding25Design1,
  Finding25Design2,
  Finding26Design1,
  Finding30Design1,
  Finding30Design2,
  Finding30Design3,
  Finding30Design4,
  Finding30Design5,
  Finding30Design6,
  Finding30Design1Inverted,
  Finding30Design2Inverted,
  Finding30Design3Inverted,
  Finding30Design4Inverted,
  Finding30Design5Inverted,
  Finding30Design6Inverted,
  TwoHorizontalLines60x20,
  TwoHorizontalLines20x20,
  Finding13Design1,
  Finding13Design2,
  Finding13Design1Inverted,
  Finding13Design2Inverted,
  Finding39Design1,
  Finding39Design2,
  Finding39Design3,
  Finding39Design1Inverted,
  Finding39Design2Inverted,
  Finding39Design3Inverted,
} from "../designs/figuras";

export interface DesignMapping {
  [optionId: number]: {
    [designNumber: number]: React.ComponentType<{ strokeColor: string }>;
  };
}

export const DESIGN_MAPPING: DesignMapping = {
  1: {
    1: Finding1Design1,
    2: Finding1Design2,
    3: Finding1Design3,
  },
  2: {
    1: Finding2Design1,
    2: Finding2Design1,
    3: Finding2Design1,
  },
  13: {
    1: Finding13Design1,
    2: Finding13Design2,
  },
  24: {
    1: Finding24Design1,
    2: Finding24Design2,
  },
  25: {
    1: Finding25Design1,
    2: Finding25Design2,
  },
  26: {
    1: Finding26Design1,
  },
  30: {
    1: Finding30Design3,
    2: Finding30Design1,
    3: Finding30Design2,
  },
  31: {
    1: TwoHorizontalLines60x20,
    2: TwoHorizontalLines60x20,
    3: TwoHorizontalLines60x20,
  },
  32: {
    1: TwoHorizontalLines60x20,
    2: TwoHorizontalLines60x20,
    3: TwoHorizontalLines60x20,
  },
  39: {
    1: Finding39Design2,
    2: Finding39Design3,
    3: Finding39Design1,
  },
};

// Mapeo para dientes inferiores (diseños invertidos)
export const DESIGN_MAPPING_LOWER: DesignMapping = {
  1: {
    1: Finding1Design1,
    2: Finding1Design2,
    3: Finding1Design3,
  },
  2: {
    1: Finding2Design1,
    2: Finding2Design1,
    3: Finding2Design1,
  },
  13: {
    1: Finding13Design1Inverted,
    2: Finding13Design2Inverted,
  },
  24: {
    1: Finding24Design1,
    2: Finding24Design2,
  },
  25: {
    1: Finding25Design1,
    2: Finding25Design2,
  },
  26: {
    1: Finding26Design1,
  },
  30: {
    1: Finding30Design3Inverted,
    2: Finding30Design1Inverted,
    3: Finding30Design2Inverted,
  },
  31: {
    1: TwoHorizontalLines60x20,
    2: TwoHorizontalLines60x20,
    3: TwoHorizontalLines60x20,
  },
  32: {
    1: TwoHorizontalLines60x20,
    2: TwoHorizontalLines60x20,
    3: TwoHorizontalLines60x20,
  },
  39: {
    1: Finding39Design2Inverted,
    2: Finding39Design3Inverted,
    3: Finding39Design1Inverted,
  },
};

export const getDesignComponent = (optionId: number, designNumber: number) => {
  return DESIGN_MAPPING[optionId]?.[designNumber];
};

// Selecciona el diseño de 60px (tooth cells) según la posición
export const getDesignComponentByPosition = (optionId: number, designNumber: number, isLowerTeeth: boolean = false) => {
  const mapping = isLowerTeeth ? DESIGN_MAPPING_LOWER : DESIGN_MAPPING;
  return mapping[optionId]?.[designNumber];
};

// =============================================================================
// SPACING DESIGN MAPPING — 20px designs for spacing cells between teeth
// =============================================================================

/**
 * Mapeo de diseños para celdas de spacing (20px).
 * Estos son diferentes a los de 60px para findings 1, 2, 30, 31, 32, 39.
 */
export const SPACING_DESIGN_MAPPING: DesignMapping = {
  1: {
    1: Finding1Design5,  // line going left
    2: Finding1Design4,  // line going right
    3: Finding1Design6,  // straight through (both sides)
  },
  2: {
    1: Finding2Design2,
    2: Finding2Design2,
    3: Finding2Design2,
  },
  // 13: no 20px designs (empty placeholder)
  24: {
    1: Finding24Design1,
    2: Finding24Design2,
  },
  25: {
    1: Finding25Design1,
    2: Finding25Design2,
  },
  26: {
    1: Finding26Design1,
  },
  30: {
    1: Finding30Design4,
    2: Finding30Design6,
    3: Finding30Design5,
  },
  31: {
    1: TwoHorizontalLines20x20,
    2: TwoHorizontalLines20x20,
    3: TwoHorizontalLines20x20,
  },
  32: {
    1: TwoHorizontalLines20x20,
    2: TwoHorizontalLines20x20,
    3: TwoHorizontalLines20x20,
  },
  39: {
    1: Finding39Design1,
    2: Finding39Design1,
    3: Finding39Design1,
  },
};

export const SPACING_DESIGN_MAPPING_LOWER: DesignMapping = {
  1: {
    1: Finding1Design5,
    2: Finding1Design4,
    3: Finding1Design6,
  },
  2: {
    1: Finding2Design2,
    2: Finding2Design2,
    3: Finding2Design2,
  },
  24: {
    1: Finding24Design1,
    2: Finding24Design2,
  },
  25: {
    1: Finding25Design1,
    2: Finding25Design2,
  },
  26: {
    1: Finding26Design1,
  },
  30: {
    1: Finding30Design4Inverted,
    2: Finding30Design6Inverted,
    3: Finding30Design5Inverted,
  },
  31: {
    1: TwoHorizontalLines20x20,
    2: TwoHorizontalLines20x20,
    3: TwoHorizontalLines20x20,
  },
  32: {
    1: TwoHorizontalLines20x20,
    2: TwoHorizontalLines20x20,
    3: TwoHorizontalLines20x20,
  },
  39: {
    1: Finding39Design1Inverted,
    2: Finding39Design1Inverted,
    3: Finding39Design1Inverted,
  },
};

/** Selecciona el diseño de 20px (spacing cells) según la posición */
export const getSpacingDesignComponentByPosition = (optionId: number, designNumber: number, isLowerTeeth: boolean = false) => {
  const mapping = isLowerTeeth ? SPACING_DESIGN_MAPPING_LOWER : SPACING_DESIGN_MAPPING;
  return mapping[optionId]?.[designNumber];
};