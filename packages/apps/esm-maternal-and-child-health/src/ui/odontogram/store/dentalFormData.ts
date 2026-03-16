import { create } from 'zustand';
import { opciones as initialOpciones } from '../data/optionsData.json';

interface DentalColor {
  id: number;
  name: string;
}

interface DentalSuboption {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface DentalDesign {
  number: number;
  nombre: string;
  componente: string;
}

interface DentalOption {
  id: number;
  nombre: string;
  identificador?: string;
  colores?: DentalColor[];
  subopciones?: DentalSuboption[];
  designs?: DentalDesign[];
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

  // Estado para el diseño seleccionado
  selectedDesign: null,

  setSelectedOption: (optionId: number) => {
    const selectedItem = get().opciones.find((op) => op.id === optionId);
    let autoSelectedColor = null;
    let autoSelectedDesign = null;
    let autoIsComplete = false;

    // Autocompletado de color si solo hay uno disponible y no hay subopciones
    if (
      selectedItem &&
      (!selectedItem.subopciones || selectedItem.subopciones.length === 0) &&
      selectedItem.colores?.length === 1
    ) {
      autoSelectedColor = selectedItem.colores[0];

      // Si también solo hay un diseño disponible, se selecciona automáticamente
      if (selectedItem.designs?.length === 1) {
        autoSelectedDesign = selectedItem.designs[0];
        // Solo está completo si hay color y diseño seleccionados (o no se requieren)
        autoIsComplete = !!autoSelectedDesign;
      } else {
        // Si hay varios diseños, no está completo hasta que se seleccione uno
        autoIsComplete = !selectedItem.designs || selectedItem.designs.length === 0;
      }
    } else {
      // Si no hay colores pero hay un solo diseño
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

      // Autocompletado de diseño si solo hay uno disponible después de seleccionar color
      let autoSelectedDesign = null;
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
      let autoSelectedColor = null;
      if (
        selectedItem &&
        selectedItem.subopciones?.length > 0 &&
        selectedItem.colores?.length === 1 &&
        !state.selectedColor
      ) {
        autoSelectedColor = selectedItem.colores[0];
      }

      // Autocompletado de diseño si hay un solo diseño disponible
      let autoSelectedDesign = null;
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

  // Nueva función para establecer el diseño seleccionado
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

  // Resetear toda la selección
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
