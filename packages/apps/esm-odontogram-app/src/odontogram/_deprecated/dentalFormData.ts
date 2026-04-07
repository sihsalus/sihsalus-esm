import { create } from "zustand";
import type { DentalFormState, Option, Color, Suboption, Design } from "../types";
import { opciones as initialOpciones } from "../data/optionsData.json";

const useDentalFormStore = create<DentalFormState>((set, get) => ({
  opciones: initialOpciones as Option[],
  selectedOption: null,
  selectedColor: null,
  selectedSuboption: null,
  isComplete: false,
  selectedDesign: null,

  setSelectedOption: (optionId: number | null) => {
    const selectedItem = get().opciones.find((op) => op.id === optionId);
    let autoSelectedColor: Color | null = null;
    let autoIsComplete = false;

    // Autocompletado de color si solo hay uno disponible y no hay subopciones
    if (
      selectedItem &&
      (!selectedItem.subopciones || selectedItem.subopciones.length === 0) &&
      selectedItem.colores?.length === 1
    ) {
      autoSelectedColor = selectedItem.colores[0];
      autoIsComplete = true;
    } else {
      // Si no hay colores, está completo si no hay subopciones
      if (
        selectedItem && 
        (!selectedItem.colores || selectedItem.colores.length === 0) &&
        (!selectedItem.subopciones || selectedItem.subopciones.length === 0)
      ) {
        autoIsComplete = true;
      }
    }

    set({
      selectedOption: optionId,
      selectedColor: autoSelectedColor,
      selectedSuboption: null,
      selectedDesign: null,
      isComplete: autoIsComplete
    });
  },

  setSelectedColor: (color: Color | null) => {
    set((state) => {
      const selectedItem = get().opciones.find((op) => op.id === state.selectedOption);
      
      const isCompleteNow = 
        !!state.selectedOption &&
        (!selectedItem?.colores?.length || !!color) &&
        (!selectedItem?.subopciones?.length || !!state.selectedSuboption);
      
      return {
        selectedColor: color,
        selectedDesign: null,
        isComplete: isCompleteNow
      };
    });
  },

  setSelectedSuboption: (suboption: Suboption | null) => {
    set((state) => {
      const selectedItem = get().opciones.find((op) => op.id === state.selectedOption);
      
      let autoSelectedColor: Color | null = null;
      if (
        selectedItem &&
        selectedItem.subopciones?.length &&
        selectedItem.colores?.length === 1 &&
        !state.selectedColor
      ) {
        autoSelectedColor = selectedItem.colores[0];
      }

      const isCompleteNow = 
        !!state.selectedOption &&
        (!selectedItem?.colores?.length || !!autoSelectedColor || !!state.selectedColor) &&
        (!selectedItem?.subopciones?.length || !!suboption);
      
      return {
        selectedSuboption: suboption,
        selectedColor: autoSelectedColor || state.selectedColor,
        selectedDesign: null,
        isComplete: isCompleteNow
      };
    });
  },
  
  setSelectedDesign: (design: Design | null) => {
    set({
      selectedDesign: design
    });
  },
  
  resetSelection: () => set({
    selectedOption: null,
    selectedSuboption: null,
    selectedColor: null,
    selectedDesign: null,
    isComplete: false
  }),
}));

export default useDentalFormStore;