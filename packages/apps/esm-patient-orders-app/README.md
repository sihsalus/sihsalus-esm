# esm-patient-orders-app

Provides the order basket for the OpenMRS 3 Patient Chart. It provides a hub for accessing
Medication orders, lab orders, and the like in the Patient Chart Workspace.

## TODO backend/permisos/auditoria

- Declarar `fhir2` en `routes.json` si los hooks `useOrderStockInfo` y `useOrderPrice` quedan habilitados con `InventoryItem` y `ChargeItemDefinition`.
- Probar Order Basket contra backend actualizado con medicamentos, laboratorios y ordenes generales reales.
- Validar que los nombres de child workspaces sigan siendo configurables para integraciones externas como Ward y Dispensing.
- Definir privilegios RBAC para ver ordenes, crear orden, modificar orden, descontinuar/cancelar orden y acceder a precio/stock.
- Agregar eventos auditables para crear/modificar/cancelar orden y para consultar precio/stock de insumos.
- Definir fallback cuando `billing`, `stockmanagement` o `fhirproxy` no estén instalados: ocultar extensiones, mostrar dato no disponible o desactivar accion.
