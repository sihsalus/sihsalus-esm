import React from 'react';
import FormDentalClinicalFindings from './FormDentalClinicalFindings';
import AdultUpperTeeth from './AdultUpperTeeth';
import AdultLowerTeeth from './AdultLowerTeeth';
import FormComponent from './FormComponent';
import OdontogramSendButton from './OdontogramSendButton';
import './AdultOdontogram.css';

/**
 * Componente principal del Odontograma para Adultos
 * Encapsula todos los componentes relacionados con el odontograma de 32 dientes
 */
const AdultOdontogram: React.FC = () => {
  return (
    <div className="adult-odontogram-container">
      <div className="odontogram-header">
        <h2>Odontograma Adulto</h2>
        <p>Sistema completo de 32 dientes permanentes</p>
      </div>

      <div className="odontogram-content">
        {/* Formulario de hallazgos clínicos */}
        <div className="form-section">
          <FormDentalClinicalFindings />
        </div>

        {/* Visualización del odontograma */}
        <div className="teeth-visualization">
          <div className="upper-teeth-section">
            <AdultUpperTeeth />
          </div>

          <div className="lower-teeth-section">
            <AdultLowerTeeth />
          </div>
        </div>

        {/* Formulario adicional */}
        <div className="additional-form-section">
          <FormComponent />
        </div>

        {/* Botones de acción */}
        <div className="actions-section">
          <OdontogramSendButton />
        </div>
      </div>
    </div>
  );
};

export default AdultOdontogram;
