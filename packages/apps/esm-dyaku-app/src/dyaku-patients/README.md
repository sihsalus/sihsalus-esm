# Funcionalidad de Búsqueda de Pacientes DYAKU

## Descripción

Se ha implementado una funcionalidad de búsqueda por DNI con debounce para los pacientes del sistema FHIR DYAKU del MINSA. Esta funcionalidad permite buscar pacientes específicos por su número de documento de identidad (DNI) de manera eficiente.

## Componentes Implementados

### 1. `DyakuPatientsOverview`
- **Ubicación**: `src/dyaku-patients/dyaku-patients-overview.component.tsx`
- **Propósito**: Componente principal que incluye la búsqueda y la tabla de pacientes
- **Características**:
  - Campo de búsqueda con debounce de 500ms
  - Integración con la tabla de pacientes existente
  - Indicador visual de búsqueda activa

### 2. `DyakuPatientsTable` (Actualizado)
- **Ubicación**: `src/dyaku-patients/dyaku-patients-table.component.tsx`
- **Propósito**: Tabla de pacientes con soporte para búsqueda por DNI
- **Características**:
  - Acepta parámetro `searchDni` opcional
  - Cambia automáticamente entre vista completa y resultados de búsqueda
  - Títulos y subtítulos dinámicos según el modo de visualización

### 3. `useDyakuPatientsByDni` Hook
- **Ubicación**: `src/dyaku-patients/dyaku-patients.resource.ts`
- **Propósito**: Hook personalizado para búsqueda por DNI
- **Características**:
  - Solo ejecuta búsqueda si el DNI tiene al menos 8 caracteres
  - Utiliza SWR para cache y optimización
  - Búsqueda por identificador FHIR

## Funcionalidades

### Búsqueda por DNI
- **Mínimo**: 8 dígitos requeridos para activar la búsqueda
- **Debounce**: 500ms para evitar búsquedas excesivas
- **Limpieza**: Botón para limpiar la búsqueda
- **Responsive**: Diseño adaptativo para dispositivos móviles

### Validación de DNI Peruano
- Incluye algoritmo de validación para DNI peruano con dígito verificador
- Corrección automática del dígito verificador si es necesario
- Soporte para DNI de 8 y 9 dígitos

### Estados de la Interfaz
- **Búsqueda activa**: Muestra términos de búsqueda actuales
- **Resultados**: Contador de pacientes encontrados
- **Sin resultados**: Mensaje apropiado si no se encuentran pacientes
- **Error**: Manejo de errores de conectividad o API

## Estilos

### `dyaku-patients-overview.scss`
- **Container**: Diseño principal con fondo gris claro
- **Search Container**: Área de búsqueda con fondo blanco y sombra
- **Search Info**: Indicador visual de búsqueda activa
- **Responsive**: Adaptación para tablets y móviles

## Traducciones

### Español (`es.json`)
```json
{
  "dyakuPatientsSearchTitle": "Resultados de búsqueda - Pacientes FHIR Dyaku MINSA",
  "dyakuPatientsSearchSubtitle": "Resultados para DNI: {{dni}} ({{total}} paciente(s) encontrado(s))",
  "searchByDni": "Buscar por DNI",
  "searchByDniPlaceholder": "Ingrese el DNI del paciente (mínimo 8 dígitos)",
  "searchingFor": "Buscando por DNI:"
}
```

### Inglés (`en.json`)
```json
{
  "dyakuPatientsSearchTitle": "Search Results - Dyaku MINSA FHIR Patients",
  "dyakuPatientsSearchSubtitle": "Results for DNI: {{dni}} ({{total}} patient(s) found)",
  "searchByDni": "Search by DNI",
  "searchByDniPlaceholder": "Enter patient's DNI (minimum 8 digits)",
  "searchingFor": "Searching by DNI:"
}
```

## Integración

### Actualización del Punto de Entrada
El componente `testeo.component.tsx` ha sido actualizado para usar `DyakuPatientsOverview` en lugar de `DyakuPatientsTable` directamente.

### API FHIR
La búsqueda utiliza el parámetro `identifier` del API FHIR de DYAKU:
```
GET {fhirBaseUrl}/Patient?identifier={dni}
```

## Optimizaciones

- **SWR Cache**: Resultados en cache para mejorar rendimiento
- **Debounce**: Previene búsquedas excesivas mientras el usuario escribe
- **Lazy Loading**: Solo busca cuando hay suficientes caracteres
- **Error Handling**: Manejo robusto de errores de red y API

## Uso

```tsx
import DyakuPatientsOverview from './dyaku-patients-overview.component';

// Usar con tamaño de página personalizado
<DyakuPatientsOverview pageSize={20} />

// Usar con configuración por defecto
<DyakuPatientsOverview />
```

## Consideraciones de Rendimiento

1. **Debounce**: Evita llamadas API excesivas
2. **Validación local**: Verificación de DNI antes de hacer búsquedas
3. **Cache inteligente**: SWR maneja automáticamente el cache y revalidación
4. **Paginación**: Mantiene la paginación en los resultados de búsqueda

## Documentación DYAKU

La implementación sigue las especificaciones del perfil PacientePe de DYAKU:
- Estructura de identificadores conforme a FHIR R4
- Búsqueda por identifier según estándares FHIR
- Manejo de telecomunicaciones (email, teléfono)
- Procesamiento de nombres estructurados FHIR
