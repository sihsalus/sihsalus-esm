import {
  Button,
  InlineLoading,
  ModalBody,
  ModalFooter,
  ModalHeader,
  RadioButton,
  RadioButtonGroup,
  Stack,
  Tag,
} from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSWRConfig } from 'swr';
import { usePriorityConfig } from '../hooks/usePriorityConfig';
import { type EmergencyQueueEntry, transitionEmergencyQueueEntry, useQueues } from '../resources/emergency.resource';
import styles from './move-queue-entry.modal.scss';

interface MoveQueueEntryModalProps {
  queueEntry: EmergencyQueueEntry;
  closeModal: () => void;
}

const MoveQueueEntryModal: React.FC<MoveQueueEntryModalProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const { priorityConfigs } = usePriorityConfig();
  const { queues, isLoading: isLoadingQueues } = useQueues();

  const patientName = queueEntry.patient.person?.display || queueEntry.patient.display;
  const currentQueueUuid = queueEntry.queue?.uuid;

  const [selectedQueue, setSelectedQueue] = useState(currentQueueUuid || '');
  const [selectedPriority, setSelectedPriority] = useState(queueEntry.priority?.uuid || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUnchanged = selectedQueue === currentQueueUuid && selectedPriority === queueEntry.priority?.uuid;

  const selectedQueueObj = useMemo(() => queues.find((q) => q.uuid === selectedQueue), [queues, selectedQueue]);

  const getPriorityTagProps = (color?: string) => {
    if (color === 'red') return { type: 'red' as const, className: styles.boldTag };
    if (color === 'orange') return { type: undefined, className: styles.orangeTag };
    if (color === 'yellow') return { type: undefined, className: styles.yellowTag };
    if (color === 'green') return { type: 'green' as const, className: '' };
    return { type: 'gray' as const, className: '' };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await transitionEmergencyQueueEntry({
        queueEntryToTransition: queueEntry.uuid,
        newQueue: selectedQueue,
        newPriority: selectedPriority,
        newStatus: queueEntry.status?.uuid,
      });

      showSnackbar({
        isLowContrast: true,
        title: t('moveSuccess', 'Paciente movido'),
        kind: 'success',
        subtitle: t('moveSuccessMessage', 'El paciente ha sido movido a {{queue}}', {
          queue: selectedQueueObj?.display || '',
        }),
      });

      mutate((key) => typeof key === 'string' && key.includes('/queue-entry'));
      closeModal();
    } catch (error: unknown) {
      showSnackbar({
        title: t('moveError', 'Error al mover paciente'),
        kind: 'error',
        subtitle:
          error instanceof Error
            ? error.message
            : t('moveErrorGeneric', 'Ocurrió un error al mover la entrada de cola'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ModalHeader closeModal={closeModal} title={t('movePatient', 'Mover {{patient}}', { patient: patientName })} />
      <ModalBody>
        <div className={styles.modalBody}>
          <Stack gap={4}>
            {/* Queue picker */}
            <section>
              <div className={styles.sectionTitle}>{t('selectQueue', 'Seleccionar cola')}</div>
              {isLoadingQueues ? (
                <InlineLoading description={t('loading', 'Cargando...')} />
              ) : (
                <RadioButtonGroup
                  className={styles.radioButtonGroup}
                  name="queue"
                  valueSelected={selectedQueue}
                  orientation="vertical"
                  onChange={(uuid: string) => setSelectedQueue(uuid)}
                >
                  {queues.map((queue) => (
                    <RadioButton
                      key={queue.uuid}
                      labelText={
                        queue.uuid === currentQueueUuid
                          ? t('currentValueFormatted', '{{value}} (Actual)', { value: queue.display })
                          : queue.display
                      }
                      value={queue.uuid}
                    />
                  ))}
                </RadioButtonGroup>
              )}
            </section>

            {/* Priority picker */}
            <section>
              <div className={styles.sectionTitle}>{t('priority', 'Prioridad')}</div>
              <RadioButtonGroup
                className={styles.radioButtonGroup}
                name="priority"
                valueSelected={selectedPriority}
                orientation="horizontal"
                onChange={(uuid: string) => setSelectedPriority(uuid)}
              >
                {priorityConfigs.map((priority) => {
                  const tagProps = getPriorityTagProps(priority.color);
                  return (
                    <RadioButton
                      key={priority.conceptUuid}
                      labelText={
                        <Tag type={tagProps.type} size="sm" className={tagProps.className}>
                          {priority.label}
                        </Tag>
                      }
                      value={priority.conceptUuid}
                    />
                  );
                })}
              </RadioButtonGroup>
            </section>
          </Stack>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal} disabled={isSubmitting}>
          {t('cancel', 'Cancelar')}
        </Button>
        <Button kind="primary" onClick={handleSubmit} disabled={isSubmitting || isUnchanged}>
          {isSubmitting ? t('moving', 'Moviendo...') : t('move', 'Mover')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default MoveQueueEntryModal;
