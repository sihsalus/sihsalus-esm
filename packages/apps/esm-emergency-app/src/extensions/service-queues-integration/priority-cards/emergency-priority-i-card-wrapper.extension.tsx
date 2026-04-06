import { createPriorityCardExtension } from './create-priority-card-extension';

export default createPriorityCardExtension({
  level: 'I',
  code: 'PRIORITY_I',
  countKey: 'priorityI',
  tooltipKey: 'priorityITooltip',
  tooltipDefault:
    'Pacientes con alteración súbita y crítica del estado de salud, en riesgo inminente de muerte y que requieren atención inmediata en la Sala de Reanimación - Shock Trauma.',
});
