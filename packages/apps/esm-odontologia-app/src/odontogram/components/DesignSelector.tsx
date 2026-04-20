import React from 'react';
import { Modal } from '@carbon/react';
import { CheckmarkFilled } from '@carbon/react/icons';
import Tooth from './Tooth';
import type { FindingColor, FindingDesign, ToothFinding } from '../types/odontogram';
import {
  Finding8Design1,
  Finding8Design2,
  Finding8Design3,
  Finding37Design1,
  Finding37Design2,
  Finding37Design3,
  Finding37Design4,
  Finding37Design5,
  Finding36Design1,
  Finding36Design2,
  Finding10Design1,
  Finding10Design2,
  Finding10Design3,
  Finding10Design4,
  Finding10Design5,
  Finding10Design6,
  Finding10Design7,
  Finding10Design8,
  Finding5Design1,
  Finding5Design2,
  Finding5Design3,
  Finding5Design4,
  Finding5Design5,
  Finding5Design6,
  Finding5Design7,
  Finding5Design8,
  Finding5Design9,
  Finding5Design10,
  Finding5Design11,
  Finding5Design12,
  Finding5Design13,
  Finding5Design14,
  Finding27Design9,
  Finding35Design1,
  Finding35Design2,
  Finding35Design3,
  Finding35Design4,
  Finding35Design5,
  Finding35Design6,
  Finding35Design7,
  Finding35Design8,
  Finding35Design9,
  Finding35Design10,
  Finding35Design11,
  Finding35Design12,
  Finding35Design13,
  Finding35Design14,
  Finding13Design1,
  Finding13Design2,
} from '../designs/figuras';

// Mapeo de nombres de componentes a componentes reales
const designComponentMap = {
  Finding8Design1: Finding8Design1,
  Finding8Design2: Finding8Design2,
  Finding8Design3: Finding8Design3,
  Finding37Design1: Finding37Design1,
  Finding37Design2: Finding37Design2,
  Finding37Design3: Finding37Design3,
  Finding37Design4: Finding37Design4,
  Finding37Design5: Finding37Design5,
  Finding36Design1: Finding36Design1,
  Finding36Design2: Finding36Design2,
  Finding10Design1: Finding10Design1,
  Finding10Design2: Finding10Design2,
  Finding10Design3: Finding10Design3,
  Finding10Design4: Finding10Design4,
  Finding10Design5: Finding10Design5,
  Finding10Design6: Finding10Design6,
  Finding10Design7: Finding10Design7,
  Finding10Design8: Finding10Design8,
  Finding5Design1: Finding5Design1,
  Finding5Design2: Finding5Design2,
  Finding5Design3: Finding5Design3,
  Finding5Design4: Finding5Design4,
  Finding5Design5: Finding5Design5,
  Finding5Design6: Finding5Design6,
  Finding5Design7: Finding5Design7,
  Finding5Design8: Finding5Design8,
  Finding5Design9: Finding5Design9,
  Finding5Design10: Finding5Design10,
  Finding5Design11: Finding5Design11,
  Finding5Design12: Finding5Design12,
  Finding5Design13: Finding5Design13,
  Finding5Design14: Finding5Design14,
  Finding16Design1: Finding5Design1,
  Finding16Design2: Finding5Design2,
  Finding16Design3: Finding5Design3,
  Finding16Design4: Finding5Design4,
  Finding16Design5: Finding5Design5,
  Finding16Design6: Finding5Design6,
  Finding16Design7: Finding5Design7,
  Finding16Design8: Finding5Design8,
  Finding16Design9: Finding5Design9,
  Finding16Design10: Finding5Design10,
  Finding16Design11: Finding5Design11,
  Finding16Design12: Finding5Design12,
  Finding16Design13: Finding5Design13,
  Finding16Design14: Finding5Design14,
  Finding27Design1: Finding5Design1,
  Finding27Design2: Finding5Design2,
  Finding27Design3: Finding5Design3,
  Finding27Design4: Finding5Design4,
  Finding27Design5: Finding5Design5,
  Finding27Design6: Finding5Design6,
  Finding27Design7: Finding5Design7,
  Finding27Design8: Finding5Design8,
  Finding27Design9: Finding27Design9,
  Finding34Design1: Finding5Design1,
  Finding34Design2: Finding5Design2,
  Finding34Design3: Finding5Design3,
  Finding34Design4: Finding5Design4,
  Finding34Design5: Finding5Design5,
  Finding34Design6: Finding5Design6,
  Finding34Design7: Finding5Design7,
  Finding34Design8: Finding5Design8,
  Finding34Design9: Finding5Design9,
  Finding34Design10: Finding5Design10,
  Finding34Design11: Finding5Design11,
  Finding34Design12: Finding5Design12,
  Finding34Design13: Finding5Design13,
  Finding34Design14: Finding5Design14,
  Finding35Design1: Finding35Design1,
  Finding35Design2: Finding35Design2,
  Finding35Design3: Finding35Design3,
  Finding35Design4: Finding35Design4,
  Finding35Design5: Finding35Design5,
  Finding35Design6: Finding35Design6,
  Finding35Design7: Finding35Design7,
  Finding35Design8: Finding35Design8,
  Finding35Design9: Finding35Design9,
  Finding35Design10: Finding35Design10,
  Finding35Design11: Finding35Design11,
  Finding35Design12: Finding35Design12,
  Finding35Design13: Finding35Design13,
  Finding35Design14: Finding35Design14,
  Finding13Design1: Finding13Design1,
  Finding13Design2: Finding13Design2,
};

interface DesignSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  designs: FindingDesign[];
  selectedColor: FindingColor | null;
  findingName: string;
  toothId: string | number;
  toothZones: number;
  onDesignSelect: (design: FindingDesign) => void;
  existingFindings?: ToothFinding[];
  /** When true, the modal stays open after selecting a design (for multi-design findings). */
  keepOpen?: boolean;
  /** Suboptions config to show Tipo label on applied designs */
  suboptions?: { id: number; nombre: string }[];
}

const DesignSelector: React.FC<DesignSelectorProps> = ({
  isOpen,
  onClose,
  designs,
  selectedColor,
  findingName,
  toothId,
  toothZones,
  onDesignSelect,
  existingFindings = [],
  keepOpen = false,
  suboptions,
}) => {
  const handleDesignClick = (design: FindingDesign) => {
    onDesignSelect(design);
    if (!keepOpen) {
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onRequestClose={onClose}
      onRequestSubmit={onClose}
      modalHeading={`Seleccionar diseño para ${findingName}`}
      primaryButtonText="Cerrar"
      size="lg"
    >
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#525252' }}>
          <strong>Diente:</strong> {toothId} | <strong>Color:</strong> {selectedColor?.name || 'Negro'}
        </div>

        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#0066cc' }}>
          {keepOpen
            ? '💡 Selecciona los diseños que desees aplicar. Haz click en uno aplicado para quitarlo.'
            : '💡 Selecciona un diseño para aplicar o eliminar el hallazgo'}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            justifyContent: 'center',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '10px',
          }}
        >
          {designs.map((design) => {
            // Obtener el componente de diseño según su nombre
            const DesignComponent = designComponentMap[design.componente as keyof typeof designComponentMap];

            if (!DesignComponent) {
              return (
                <div key={design.number} style={{ color: 'red', padding: '10px' }}>
                  Componente no encontrado: {design.componente}
                </div>
              );
            }

            // Verificar si este diseño ya está aplicado en el diente
            const appliedFinding = existingFindings.find((finding) => finding.designNumber === design.number);
            const isApplied = !!appliedFinding;

            // Look up the suboption name for applied designs
            const appliedTipo =
              isApplied && suboptions && appliedFinding?.subOptionId != null
                ? suboptions.find((s) => s.id === appliedFinding.subOptionId)?.nombre
                : undefined;

            // Color para mostrar en la vista previa
            const previewColor = selectedColor?.name || 'black';

            return (
              <div
                key={design.number}
                onClick={() => handleDesignClick(design)}
                style={{
                  cursor: 'pointer',
                  padding: '15px',
                  border: isApplied ? `3px solid #24a148` : '2px solid #e0e0e0',
                  borderRadius: '12px',
                  backgroundColor: isApplied ? '#f0f8f0' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '120px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isApplied ? '0 4px 8px rgba(36, 161, 72, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!isApplied) {
                    e.currentTarget.style.borderColor = '#0066cc';
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isApplied) {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                <div style={{ height: '120px', width: '60px', marginBottom: '10px' }}>
                  <svg width="60" height="120">
                    <Tooth zones={toothZones} />
                    <DesignComponent strokeColor={previewColor} />
                  </svg>
                </div>

                <div style={{ fontSize: '12px', fontWeight: '500', color: '#262626', textAlign: 'center' }}>
                  Diseño {design.number}
                </div>

                {isApplied && (
                  <>
                    <CheckmarkFilled
                      size={20}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        color: '#24a148',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                      }}
                    />
                    <div
                      style={{
                        fontSize: '10px',
                        color: '#24a148',
                        fontWeight: '600',
                        marginTop: '5px',
                      }}
                    >
                      APLICADO
                    </div>
                    {appliedTipo && (
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#525252',
                          fontWeight: '600',
                          marginTop: '2px',
                          backgroundColor: '#e8e8e8',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        Tipo: {appliedTipo}
                      </div>
                    )}
                  </>
                )}

                {!isApplied && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#0066cc',
                      fontWeight: '500',
                      marginTop: '5px',
                    }}
                  >
                    Click para aplicar
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default DesignSelector;
