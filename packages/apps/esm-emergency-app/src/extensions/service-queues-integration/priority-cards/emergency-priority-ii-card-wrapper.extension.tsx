import { createPriorityCardExtension } from './create-priority-card-extension';

export default createPriorityCardExtension({
  level: 'II',
  code: 'PRIORITY_II',
  countKey: 'priorityII',
  tooltipKey: 'priorityIITooltip',
  tooltipDefault:
    'Pacientes portadores de cuadro súbito, agudo con riesgo de muerte o complicaciones serias, cuya atención debe realizarse en un tiempo de espera no mayor o igual de 10 minutos desde su ingreso.',
});
