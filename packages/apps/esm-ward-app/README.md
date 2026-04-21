# esm-ward-app

App para la gestión operativa de sala/hospitalización.

Terminología de dominio: visita = consulta, encounter = atención, appointment = cita.

## Marco normativo
- Ley N.° 26842, Ley General de Salud (Perú).

## Límites funcionales
- Presenta la sala, camas, pacientes internados y acciones operativas del ward.
- Facilita la navegación por vista de sala, tarjetas de paciente y selección de ubicación.
- No gestiona urgencias, consulta externa ni facturación.
- No sustituye el módulo de admisión completa ni el alta hospitalaria global.

## Integraciones
- APIs de ward, camas, ubicaciones y pacientes internados.
- Componentes de vista de sala, header y selector de ubicación.
- Rutas y recursos propios del contexto de hospitalización.
