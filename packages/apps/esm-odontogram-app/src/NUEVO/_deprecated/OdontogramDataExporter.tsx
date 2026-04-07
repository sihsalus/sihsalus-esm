import React, { useState } from 'react';
import { useOdontogramDataStore } from '../store/odontogramDataStore';
import { useOdontogramInitialization } from '../hooks/useOdontogramData';

const OdontogramDataExporter: React.FC = () => {
  const [exportFormat, setExportFormat] = useState<'json' | 'openmrs'>('json');
  const [exportedData, setExportedData] = useState<string>('');
  
  const { initializeData } = useOdontogramInitialization();
  const store = useOdontogramDataStore();
  
  const handleInitialize = () => {
    initializeData();
  };
  
  const handleExport = () => {
    let data;
    if (exportFormat === 'openmrs') {
      data = store.exportForOpenMRS();
    } else {
      data = store.exportData();
    }
    
    setExportedData(JSON.stringify(data, null, 2));
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportedData);
    alert('Data copiada al portapapeles!');
  };
  
  const handleDownload = () => {
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `odontogram-data-${exportFormat}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Obtener estadísticas
  const stats = {
    totalTeeth: store.teeth.length,
    upperTeeth: store.teeth.filter(t => t.position === 'upper').length,
    lowerTeeth: store.teeth.filter(t => t.position === 'lower').length,
    totalSpaces: store.spaces.length,
    upperSpaces: store.spaces.filter(s => s.position === 'upper').length,
    lowerSpaces: store.spaces.filter(s => s.position === 'lower').length,
    totalFindings: store.teeth.reduce((sum, tooth) => sum + tooth.findings.length, 0) +
                   store.spaces.reduce((sum, space) => sum + space.findings.length, 0)
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Exportador de Data del Odontograma</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleInitialize}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Inicializar Data
        </button>
        
        <select 
          value={exportFormat} 
          onChange={(e) => setExportFormat(e.target.value as 'json' | 'openmrs')}
          style={{ 
            padding: '8px', 
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        >
          <option value="json">JSON Completo</option>
          <option value="openmrs">Formato OpenMRS</option>
        </select>
        
        <button 
          onClick={handleExport}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          Exportar Data
        </button>
        
        {exportedData && (
          <>
            <button 
              onClick={handleCopyToClipboard}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#ffc107', 
                color: 'black', 
                border: 'none', 
                borderRadius: '5px',
                marginRight: '10px'
              }}
            >
              Copiar al Portapapeles
            </button>
            
            <button 
              onClick={handleDownload}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#17a2b8', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px'
              }}
            >
              Descargar Archivo
            </button>
          </>
        )}
      </div>
      
      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '20px' 
      }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px', 
          border: '1px solid #dee2e6' 
        }}>
          <h4>Dientes</h4>
          <p>Total: {stats.totalTeeth}</p>
          <p>Superiores: {stats.upperTeeth}</p>
          <p>Inferiores: {stats.lowerTeeth}</p>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px', 
          border: '1px solid #dee2e6' 
        }}>
          <h4>Espacios</h4>
          <p>Total: {stats.totalSpaces}</p>
          <p>Superiores: {stats.upperSpaces}</p>
          <p>Inferiores: {stats.lowerSpaces}</p>
        </div>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px', 
          border: '1px solid #dee2e6' 
        }}>
          <h4>Hallazgos</h4>
          <p>Total: {stats.totalFindings}</p>
        </div>
      </div>
      
      {/* Vista previa de la data */}
      {exportedData && (
        <div>
          <h3>Data Exportada ({exportFormat.toUpperCase()})</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '5px', 
            border: '1px solid #dee2e6',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '12px'
          }}>
            {exportedData}
          </pre>
        </div>
      )}
      
      {/* Instrucciones */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e7f3ff', 
        borderRadius: '5px', 
        border: '1px solid #b3d9ff' 
      }}>
        <h4>Instrucciones:</h4>
        <ul>
          <li><strong>Inicializar Data:</strong> Crea la estructura inicial de dientes y espacios</li>
          <li><strong>JSON Completo:</strong> Exporta toda la data en formato JSON estándar</li>
          <li><strong>Formato OpenMRS:</strong> Exporta en formato compatible con OpenMRS</li>
          <li><strong>Copiar/Descargar:</strong> Guarda la data exportada</li>
        </ul>
        <p><strong>Nota:</strong> Para cambiar los IDs de los dientes y espacios, modifica el archivo <code>src/config/odontogramConfig.ts</code></p>
      </div>
    </div>
  );
};

export default OdontogramDataExporter; 