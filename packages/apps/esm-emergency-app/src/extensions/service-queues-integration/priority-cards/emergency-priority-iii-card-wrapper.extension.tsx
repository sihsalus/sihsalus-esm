import { createPriorityCardExtension } from './create-priority-card-extension';

export default createPriorityCardExtension({
  level: 'III',
  code: 'PRIORITY_III',
  countKey: 'priorityIII',
  tooltipKey: 'priorityIIITooltip',
  tooltipDefault:
    'Pacientes que no presentan riesgo de muerte ni secuelas invalidantes. Amerita atención en el Tópico de Emergencia, teniendo prioridad la atención de casos I y II.',
});
