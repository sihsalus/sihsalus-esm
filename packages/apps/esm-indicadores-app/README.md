# esm-indicadores-app

App para tableros e indicadores de gestión.

Terminología de dominio: visita = consulta, encounter = atención, appointment = cita.

## Marco normativo
- Ley N.° 26842, Ley General de Salud (Perú).

## Límites funcionales
- Construye vistas de indicadores, métricas y resúmenes analíticos.
- Consume datos agregados para monitoreo y toma de decisiones.
- No captura datos clínicos ni ejecuta workflows transaccionales.
- No modifica registros fuente; solo visualiza y organiza indicadores.

## Integraciones
- APIs de indicadores y datos agregados.
- Componentes de dashboard y configuración de filtros.
- Traducciones y estilos propios del tablero analítico.

## TODO backend/integración

- Confirmar si el backend actualizado incluye el OMOD de indicadores. El hook actual usa `/ws/module/indicators/api/indicators`, que responde `404` si el módulo no está instalado.
- Usar `indicatorsApiPath` de `config-schema.ts` dentro de `useIndicators.ts`; hoy el hook mantiene el endpoint hardcodeado.
- Definir fallback funcional si no habrá OMOD: ocultar la app, mostrar estado de integración no disponible o migrar a endpoints estándar.
- Agregar prueba de integración contra backend para listar indicadores y evaluar un indicador por ID.
