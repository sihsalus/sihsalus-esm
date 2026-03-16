# Encounter Date Time Component

This directory contains components for handling encounter date and time selection with encounter validation and references to existing encounter data.

## Components

### `EncounterDateTimeSection`

A comprehensive component for selecting encounter date and time with built-in validation and encounter data display.

#### Features

- **Encounter Data Integration**: Fetches and displays existing encounters for the patient
- **Date/Time Validation**: Validates selected dates against existing encounters
- **Encounter Statistics**: Shows total encounter count and date range
- **Recent Encounters Display**: Lists the 5 most recent encounters
- **Responsive Design**: Adapts to different screen sizes
- **Internationalization**: Supports Spanish translations

#### Props

```typescript
interface EncounterDateTimeProps {
  control: Control<any, any>;           // React Hook Form control object
  patientUuid: string;                  // UUID of the patient
  encounterTypeUuid?: string;           // Optional encounter type filter
  showEncounterValidation?: boolean;    // Whether to show validation messages
}
```

#### Usage Example

```tsx
import { EncounterDateTimeSection } from './encounter-date-time.component';
import { useForm } from 'react-hook-form';

const MyForm = ({ patientUuid }) => {
  const { control } = useForm({
    defaultValues: {
      encounterDate: new Date(),
      encounterTime: '10:00',
      encounterTimeFormat: 'AM',
    },
  });

  return (
    <EncounterDateTimeSection
      control={control}
      patientUuid={patientUuid}
      encounterTypeUuid="optional-encounter-type-uuid"
      showEncounterValidation={true}
    />
  );
};
```

### `VisitDateTimeSection` (Legacy)

The original component for visit date/time management. Still available for backward compatibility.

## Resource Functions

### `usePatientEncounters(patientUuid, encounterTypeUuid?)`

Hook to fetch encounters for a specific patient.

**Returns:**
- `encounters`: Array of encounter data
- `isLoading`: Loading state
- `error`: Error state
- `mutate`: Function to refetch data

### `useEncounterDateBoundaries(patientUuid, encounterTypeUuid?)`

Hook to get the first and last encounter dates for validation.

**Returns:**
- `firstEncounterDateTime`: Timestamp of first encounter
- `lastEncounterDateTime`: Timestamp of last encounter
- `isLoading`: Loading state
- `error`: Error state

### `validateEncounterDate(selectedDate, encounters)`

Validates a selected encounter date against existing encounters.

**Parameters:**
- `selectedDate`: Date to validate
- `encounters`: Array of existing encounters

**Returns:**
- `isValid`: Whether the date is valid
- `message`: Validation message (if any)

### `getEncountersInDateRange(encounters, startDate?, endDate?)`

Filters encounters within a specific date range.

## Form Field Names

The component expects these form field names:

- `encounterDate`: Date field for encounter date
- `encounterTime`: String field for encounter time (HH:MM format)
- `encounterTimeFormat`: String field for AM/PM format

## Styling

The component uses SCSS modules with the following classes:

### Encounter-specific styles:
- `.encounterInfo`: Information panel styling
- `.encounterCount`: Encounter count display
- `.dateRange`: Date range display
- `.validationMessage`: Validation message styling
- `.recentEncounters`: Recent encounters section
- `.encounterList`: Encounter list styling
- `.encounterItem`: Individual encounter item
- `.encounterDate`: Encounter date display
- `.encounterType`: Encounter type display
- `.encounterLocation`: Encounter location display

## Translation Keys

Spanish translations are provided for:

- `encounterDateTime`: "Fecha y Hora del Encuentro"
- `encounterDate`: "Fecha del encuentro"
- `encounterTime`: "Hora del encuentro"
- `encounterTimeFormat`: "Formato de hora"
- `encounterDateRange`: "Rango de fechas: {{first}} - {{last}}"
- `recentEncounters`: "Encuentros Recientes"
- `totalEncounters`: "Total de encuentros: {{count}}"
- `ongoing`: "En curso"

## Data Flow

1. **Component Mount**: Fetches existing encounters for the patient
2. **Date Selection**: User selects encounter date and time
3. **Validation**: System validates against existing encounters
4. **Display**: Shows encounter statistics and recent encounters
5. **Form Submission**: Parent component handles form submission with validated data

## Error Handling

The component handles various error states:

- **Loading States**: Shows loading indicators while fetching data
- **Network Errors**: Displays error messages for failed API calls
- **Validation Errors**: Shows validation messages for invalid dates
- **No Data**: Gracefully handles cases with no existing encounters

## Accessibility

- Proper ARIA labels for form elements
- Keyboard navigation support
- Screen reader friendly
- High contrast validation messages

## Performance Considerations

- Uses SWR for efficient data fetching and caching
- Debounced validation to prevent excessive API calls
- Memoized calculations for date boundaries
- Optimized re-renders with React Hook Form

## Testing

Example usage can be found in `encounter-date-time.example.tsx` which demonstrates:

- Form integration
- Data handling
- Error display
- Debug information

## Future Enhancements

Potential improvements:
- Add encounter type filtering in UI
- Implement encounter conflict detection
- Add bulk encounter operations
- Enhance mobile responsiveness
- Add more detailed encounter information display
