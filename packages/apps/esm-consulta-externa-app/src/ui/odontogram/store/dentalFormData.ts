import { create } from 'zustand';
import { opciones as initialOpciones } from '../data/optionsData.json';

interface DentalColor {
  id: number;
  name: string;
}

interface DentalSuboption {
  id: number;
  nombre: string;
}

interface DentalDesign {
  number?: number;
  [key: string]: unknown;
}

interface DentalOption {
  id: number;
  nombre: string;
  colores?: DentalColor[];
  subopciones?: DentalSuboption[];
  designs?: DentalDesign[];
  [key: string]: unknown;
}

type DentalFormState = {
  opciones: DentalOption[];
  selectedOption: number | null;
  selectedColor: DentalColor | null;
  selectedSuboption: DentalSuboption | null;
  isComplete: boolean;
  selectedDesign: DentalDesign | null;
  setSelectedOption: (optionId: number) => void;
  setSelectedColor: (color: DentalColor) => void;
  setSelectedSuboption: (suboption: DentalSuboption) => void;
  setSelectedDesign: (design: DentalDesign) => void;
  resetSelection: () => void;
};

const useDentalFormStore = create<DentalFormState>((set, get) => ({
  opciones: (initialOpciones as DentalOption[]) || [],
  selectedOption: null,
  selectedColor: null,
  selectedSuboption: null,
  isComplete: false,

  // Estado para el diseno seleccionado
  selectedDesign: null,

  setSelectedOption: (optionId: number) => {
    const selectedItem = get().opciones.find((op) => op.id === optionId);
    let autoSelectedColor: DentalColor | null = null;
    let autoSelectedDesign: DentalDesign | null = null;
    let autoIsComplete = false;

    // Autocompletado de color si solo hay uno disponible y no hay subopciones
    if (
      selectedItem &&
      (!selectedItem.subopciones || selectedItem.subopciones.length === 0) &&
      selectedItem.colores?.length === 1
    ) {
      autoSelectedColor = selectedItem.colores[0];

      // Si tambien solo hay un diseno disponible, se selecciona automaticamente
      if (selectedItem.designs?.length === 1) {
        autoSelectedDesign = selectedItem.designs[0];
        // Solo esta completo si hay diseno seleccionado
        autoIsComplete = !!autoSelectedDesign;
      } else {
        // Si hay varios disenos, no esta completo hasta que se seleccione uno
        autoIsComplete = !selectedItem.designs || selectedItem.designs.length === 0;
      }
    } else {
      // Si no hay colores pero hay un solo diseno
      if (
        selectedItem &&
        (!selectedItem.colores || selectedItem.colores.length === 0) &&
        selectedItem.designs?.length === 1 &&
        (!selectedItem.subopciones || selectedItem.subopciones.length === 0)
      ) {
        autoSelectedDesign = selectedItem.designs[0];
        autoIsComplete = true;
      }
    }

    set({
      selectedOption: optionId,
      selectedColor: autoSelectedColor,
      selectedSuboption: null,
      selectedDesign: autoSelectedDesign,
      isComplete: autoIsComplete,
    });
  },

  setSelectedColor: (color: DentalColor) => {
    set((state) => {
      const selectedItem = get().opciones.find((op) => op.id === state.selectedOption);

      // Autocompletado de diseno si solo hay uno disponible despues de seleccionar color
      let autoSelectedDesign: DentalDesign | null = null;
      if (selectedItem && selectedItem.designs?.length === 1 && !state.selectedDesign) {
        autoSelectedDesign = selectedItem.designs[0];
      }

      // Verificar que se hayan seleccionado todos los elementos requeridos
      const isCompleteNow =
        !!state.selectedOption &&
        (!selectedItem?.colores?.length || !!color) &&
        (!selectedItem?.subopciones?.length || !!state.selectedSuboption) &&
        (!selectedItem?.designs?.length || !!autoSelectedDesign || !!state.selectedDesign);

      return {
        selectedColor: color,
        selectedDesign: autoSelectedDesign || state.selectedDesign,
        isComplete: isCompleteNow,
      };
    });
  },

  setSelectedSuboption: (suboption: DentalSuboption) => {
    set((state) => {
      const selectedItem = get().opciones.find((op) => op.id === state.selectedOption);

      // Autocompletado de color si hay un solo color disponible
      let autoSelectedColor: DentalColor | null = null;
      if (
        selectedItem &&
        selectedItem.subopciones?.length > 0 &&
        selectedItem.colores?.length === 1 &&
        !state.selectedColor
      ) {
        autoSelectedColor = selectedItem.colores[0];
      }

      // Autocompletado de diseno si hay un solo diseno disponible
      let autoSelectedDesign: DentalDesign | null = null;
      if (selectedItem && selectedItem.designs?.length === 1 && !state.selectedDesign) {
        autoSelectedDesign = selectedItem.designs[0];
      }

      // Verificar que se hayan seleccionado todos los elementos requeridos
      const isCompleteNow =
        !!state.selectedOption &&
        (!selectedItem?.colores?.length || !!autoSelectedColor || !!state.selectedColor) &&
        (!selectedItem?.subopciones?.length || !!suboption) &&
        (!selectedItem?.designs?.length || !!autoSelectedDesign || !!state.selectedDesign);

      return {
        selectedSuboption: suboption,
        selectedColor: autoSelectedColor || state.selectedColor,
        selectedDesign: autoSelectedDesign || state.selectedDesign,
        isComplete: isCompleteNow,
      };
    });
  },

  // Nueva funcion para establecer el diseno seleccionado
  setSelectedDesign: (design: DentalDesign) => {
    set((state) => {
      const selectedItem = get().opciones.find((op) => op.id === state.selectedOption);

      // Verificar que se hayan seleccionado todos los elementos requeridos
      const isCompleteNow =
        !!state.selectedOption &&
        (!selectedItem?.colores?.length || !!state.selectedColor) &&
        (!selectedItem?.subopciones?.length || !!state.selectedSuboption) &&
        (!selectedItem?.designs?.length || !!design);

      return {
        selectedDesign: design,
        isComplete: isCompleteNow,
      };
    });
  },

  // Resetear toda la seleccion
  resetSelection: () =>
    set({
      selectedOption: null,
      selectedSuboption: null,
      selectedColor: null,
      selectedDesign: null,
      isComplete: false,
    }),
}));

export default useDentalFormStore;
