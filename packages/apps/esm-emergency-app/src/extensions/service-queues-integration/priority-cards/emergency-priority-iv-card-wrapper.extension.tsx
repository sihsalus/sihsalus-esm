import { createPriorityCardExtension } from './create-priority-card-extension';

export default createPriorityCardExtension({
  level: 'IV',
  code: 'PRIORITY_IV',
  countKey: 'priorityIV',
  tooltipKey: 'priorityIVTooltip',
  tooltipDefault:
    'Pacientes sin compromiso de funciones vitales ni riesgo de complicación inmediata, que pueden ser atendidos en Consulta Externa o Consultorios Descentralizados.',
});
