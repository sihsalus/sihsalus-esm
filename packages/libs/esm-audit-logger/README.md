# @sihsalus/esm-audit-logger

Libreria compartida para auditoria frontend de eventos sensibles y acceso a informacion clinica.

## TODO auditoria

- Definir el catalogo de eventos auditables por modulo: vista de paciente, busqueda, apertura de historia, creacion/edicion/eliminacion, descarga/impresion, cambios de permisos y errores de integracion.
- Integrar `useAuditLogger` en los flujos con PHI o acciones clinicas sensibles: registro de paciente, CRED, salud materna, vacunacion, ordenes, dispensing, FUA, VIH, ward, emergency, billing y stock.
- Alinear el payload de auditoria con el backend definitivo: usuario, paciente, visita/consulta, encounter, modulo, accion, timestamp, resultado y contexto offline.
- Definir politica de persistencia offline y reintento: cola local, cifrado, flush al reconectar y manejo de duplicados.
- Agregar pruebas de que los eventos sensibles se registran y de que no se filtra PHI innecesaria en payloads de auditoria.
- Documentar que eventos deben bloquear la accion si la auditoria falla y cuales pueden continuar con reintento posterior.
