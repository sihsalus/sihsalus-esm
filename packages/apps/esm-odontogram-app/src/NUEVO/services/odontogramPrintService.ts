/**
 * Servicio para exportar y formatear datos del odontograma
 * Reúne la información de los stores Zustand para persistencia
 */

import type { Color, Design, Suboption, Tooth, SpaceData } from '../types';
import useDentalDataStore from '../store/adultDentalData';
import useDentalFormStore from '../store/dentalFormData';
import useSpaceBetweenLegendsDataStore from '../store/adultSpaceBetweenMainSectionsOnTheCanvasData';

/**
 * Metadata del odontograma
 */
export interface OdontogramMetadata {
  uuid: string;
  type: 'adult_odontogram' | 'child_odontogram';
  description: string;
  lastModified: string;
  sessionId: string;
  formState: FormStateSnapshot;
}

/**
 * Estado del formulario en un momento dado
 */
export interface FormStateSnapshot {
  selectedOption: number | null;
  selectedColor: Color | null;
  selectedSuboption: Suboption | null;
  selectedDesign: Design | null;
  isComplete: boolean;
}

/**
 * Datos de espacios organizados por posición
 */
export interface SpacingDataStructure {
  upper: {
    spaceBetweenLegends: SpaceData[];
    findingSpaces: Record<string, SpaceData[]>;
  };
  lower: {
    spaceBetweenLegends: SpaceData[];
    findingSpaces: Record<string, SpaceData[]>;
  };
}

/**
 * Estructura completa de datos del odontograma para exportación
 */
export interface OdontogramDataToSend {
  metadata: OdontogramMetadata;
  teeth: Tooth[];
  spacingData: SpacingDataStructure;
}

/**
 * Función que reúne toda la información actual de los stores Zustand
 * y la formatea en el formato estándar de odontogramData.json
 */
export const gatherOdontogramDataForDB = (): OdontogramDataToSend => {
  // Obtener datos de los stores
  const dentalDataState = useDentalDataStore.getState();
  const dentalFormState = useDentalFormStore.getState();
  const spacingDataState = useSpaceBetweenLegendsDataStore.getState();

  // Generar un ID único para la sesión
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  // Estructura de datos para enviar
  const dataToSend: OdontogramDataToSend = {
    metadata: {
      uuid: `uuid_${Math.random().toString(36).substring(2, 11)}`,
      type: 'adult_odontogram',
      description: 'Odontogram data gathered from Zustand stores',
      lastModified: new Date().toISOString(),
      sessionId,
      formState: {
        selectedOption: dentalFormState.selectedOption,
        selectedColor: dentalFormState.selectedColor,
        selectedSuboption: dentalFormState.selectedSuboption,
        selectedDesign: dentalFormState.selectedDesign,
        isComplete: dentalFormState.isComplete,
      },
    },
    teeth: dentalDataState.teeth || [],
    spacingData: {
      upper: {
        spaceBetweenLegends: spacingDataState.spaceBetweenLegends || [],
        findingSpaces: {
          finding1: spacingDataState.intermediateSpaceOnTheCanvasOfFinding1 || [],
          finding2: spacingDataState.intermediateSpaceOnTheCanvasOfFinding2 || [],
          finding6: spacingDataState.intermediateSpaceOnTheCanvasOfFinding6 || [],
          finding7: spacingDataState.intermediateSpaceOnTheCanvasOfFinding7 || [],
          finding13: spacingDataState.intermediateSpaceOnTheCanvasOfFinding13 || [],
          finding24: spacingDataState.intermediateSpaceOnTheCanvasOfFinding24 || [],
          finding25: spacingDataState.intermediateSpaceOnTheCanvasOfFinding25 || [],
          finding26: spacingDataState.intermediateSpaceOnTheCanvasOfFinding26 || [],
          finding30: spacingDataState.intermediateSpaceOnTheCanvasOfFinding30 || [],
          finding31: spacingDataState.intermediateSpaceOnTheCanvasOfFinding31 || [],
          finding32: spacingDataState.intermediateSpaceOnTheCanvasOfFinding32 || [],
          finding39: spacingDataState.intermediateSpaceOnTheCanvasOfFinding39 || [],
        },
      },
      lower: {
        spaceBetweenLegends: spacingDataState.spaceBetweenLegendsLower || [],
        findingSpaces: {
          finding1: spacingDataState.intermediateSpaceOnTheCanvasOfFinding1Lower || [],
          finding2: spacingDataState.intermediateSpaceOnTheCanvasOfFinding2Lower || [],
          finding6: spacingDataState.intermediateSpaceOnTheCanvasOfFinding6Lower || [],
          finding7: spacingDataState.intermediateSpaceOnTheCanvasOfFinding7Lower || [],
          finding13: spacingDataState.intermediateSpaceOnTheCanvasOfFinding13Lower || [],
          finding24: spacingDataState.intermediateSpaceOnTheCanvasOfFinding24Lower || [],
          finding25: spacingDataState.intermediateSpaceOnTheCanvasOfFinding25Lower || [],
          finding26: spacingDataState.intermediateSpaceOnTheCanvasOfFinding26Lower || [],
          finding30: spacingDataState.intermediateSpaceOnTheCanvasOfFinding30Lower || [],
          finding31: spacingDataState.intermediateSpaceOnTheCanvasOfFinding31Lower || [],
          finding32: spacingDataState.intermediateSpaceOnTheCanvasOfFinding32Lower || [],
          finding39: spacingDataState.intermediateSpaceOnTheCanvasOfFinding39Lower || [],
        },
      },
    },
  };

  // console.log('✅ Datos recopilados exitosamente');
  return dataToSend;
};

/**
 * Función que simula el envío de datos a la base de datos
 * Solo imprime la información por consola
 */
export const simulateSendToDatabase = async (): Promise<{ success: boolean; sessionId: string }> => {
  try {
    console.log('📡 SIMULANDO ENVÍO A BASE DE DATOS...');
    console.log('=' .repeat(60));

    // Recopilar datos
    const dataToSend = gatherOdontogramDataForDB();

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Imprimir información resumida
    console.log('📊 RESUMEN DE DATOS A ENVIAR:');
    console.log('Session ID:', dataToSend.metadata.sessionId);
    console.log('Timestamp:', dataToSend.metadata.lastModified);
    console.log('Total de dientes:', dataToSend.teeth.length);
    
    // Contar hallazgos en dientes
    const teethWithFindings = dataToSend.teeth.filter(tooth => 
      tooth.findings && tooth.findings.length > 0
    );
    console.log('Dientes con hallazgos:', teethWithFindings.length);

    // Contar hallazgos totales
    const totalFindings = dataToSend.teeth.reduce((total, tooth) => {
      return total + (tooth.findings ? tooth.findings.length : 0);
    }, 0);
    console.log('Total de hallazgos:', totalFindings);

    // Estado del formulario
    console.log('Estado del formulario:', {
      opcionSeleccionada: dataToSend.metadata.formState.selectedOption,
      colorSeleccionado: dataToSend.metadata.formState.selectedColor?.nombre || 'ninguno',
      completo: dataToSend.metadata.formState.isComplete
    });

    console.log('=' .repeat(60));
    console.log('📋 DATOS COMPLETOS PARA LA BASE DE DATOS:');
    console.log(JSON.stringify(dataToSend, null, 2));
    console.log('=' .repeat(60));

    console.log('✅ ENVÍO SIMULADO EXITOSO');
    console.log(`💾 En un sistema real, estos datos se enviarían a: POST /api/odontogram`);
    console.log(`📡 Session ID generado: ${dataToSend.metadata.sessionId}`);

    return {
      success: true,
      sessionId: dataToSend.metadata.sessionId
    };

  } catch (error) {
    console.error('❌ ERROR EN SIMULACIÓN DE ENVÍO:', error);
    return {
      success: false,
      sessionId: ''
    };
  }
};

/**
 * Función de utilidad para imprimir solo las estadísticas básicas
 */
export const printBasicStats = (): void => {
  // console.log('📊 ESTADÍSTICAS BÁSICAS DEL ODONTOGRAMA:');
  
  const data = gatherOdontogramDataForDB();
  
  const stats = {
    totalDientes: data.teeth.length,
    dientesConHallazgos: data.teeth.filter(t => t.findings?.length > 0).length,
    totalHallazgos: data.teeth.reduce((total, t) => total + (t.findings?.length || 0), 0),
    formularioCompleto: data.metadata.formState.isComplete,
    ultimaModificacion: data.metadata.lastModified
  };
  
  // console.table(stats);
};

export default {
  gatherOdontogramDataForDB,
  simulateSendToDatabase,
  printBasicStats
};
