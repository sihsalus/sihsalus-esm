/**
 * Botón para exportar / simular envío de datos del odontograma.
 * Usa el context en vez de stores Zustand.
 */

import React, { useState } from "react";
import { Button, InlineNotification } from "@carbon/react";
import { Send, Analytics, CloudUpload } from "@carbon/react/icons";
import { useOdontogramContext } from "../providers/OdontogramProvider";
import {
  buildExportPayload,
  getOdontogramStats,
  downloadAsJson,
  copyToClipboard,
} from "../services/odontogramExportService";

const OdontogramSendButton: React.FC = () => {
  const { data, config } = useOdontogramContext();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const handleSendData = async () => {
    setIsLoading(true);
    setNotification(null);

    try {
      const payload = buildExportPayload(data, config);

      // Simular delay de red
      await new Promise((r) => setTimeout(r, 500));

      console.log("📋 DATOS DEL ODONTOGRAMA:");
      console.log(JSON.stringify(payload, null, 2));

      // También copiar al portapapeles
      await copyToClipboard(payload);

      setNotification({
        type: "success",
        message: `Datos exportados. Session: ${payload.metadata.sessionId.substring(0, 8)}… (copiados al portapapeles)`,
      });
    } catch {
      setNotification({
        type: "error",
        message: "Error inesperado al procesar los datos.",
      });
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => setNotification(null), 8000);
  };

  const handleShowStats = () => {
    const stats = getOdontogramStats(data);
    console.table(stats);
    setNotification({
      type: "info",
      message: `${stats.totalTeeth} dientes, ${stats.totalFindings} hallazgos registrados. Ver consola.`,
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDownload = () => {
    const payload = buildExportPayload(data, config);
    downloadAsJson(payload);
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '20px',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ 
          margin: '0 0 8px 0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '8px' 
        }}>
          <CloudUpload size={20} />
          Simulador de Envío a Base de Datos
        </h3>
        <p style={{ 
          margin: 0, 
          color: '#6f6f6f', 
          fontSize: '14px' 
        }}>
          Reúne los datos del odontograma para exportación o envío
        </p>
      </div>

      {notification && (
        <InlineNotification
          kind={notification.type}
          title={notification.type === 'success' ? '¡Éxito!' : notification.type === 'error' ? 'Error' : 'Info'}
          subtitle={notification.message}
          onCloseButtonClick={() => setNotification(null)}
          style={{ marginBottom: '16px', textAlign: 'left' }}
        />
      )}

      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Button
          kind="primary"
          onClick={handleSendData}
          disabled={isLoading}
          renderIcon={Send}
          size="md"
        >
          {isLoading ? 'Enviando...' : 'Enviar a BD (Simular)'}
        </Button>

        <Button
          kind="secondary"
          onClick={handleShowStats}
          renderIcon={Analytics}
          size="md"
        >
          Ver Estadísticas
        </Button>

        <Button
          kind="tertiary"
          onClick={handleDownload}
          renderIcon={CloudUpload}
          size="md"
        >
          Descargar JSON
        </Button>
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f4f4f4',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#6f6f6f'
      }}>
        💡 <strong>Instrucciones:</strong> Abre las herramientas de desarrollador (F12) 
        y ve a la pestaña "Console" para ver los datos que se enviarían a la base de datos.
      </div>
    </div>
  );
};

export default OdontogramSendButton;
