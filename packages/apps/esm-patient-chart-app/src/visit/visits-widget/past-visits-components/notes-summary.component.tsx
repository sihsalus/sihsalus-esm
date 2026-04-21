import { EmptyState } from '@openmrs/esm-patient-common-lib';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../visit-detail-overview.scss';
import type { Note } from '../visit.resource';

interface NotesSummaryProps {
  notes: Array<Note>;
}

const NotesSummary: React.FC<NotesSummaryProps> = ({ notes }) => {
  const { t } = useTranslation();

  if (notes.length === 0) {
    return <EmptyState displayText={t('notes__lower', 'notes')} headerTitle={t('notes', 'Notes')} />;
  }

  return (
    <>
      {notes.map((note: Note) => (
        <div className={styles.notesContainer} key={`${note.time}-${note.note}`}>
          <p className={classNames(styles.noteText, styles.bodyLong01)}>{note.note}</p>
          <p className={styles.metadata}>
            {note.time} {note.provider.name ? <span>&middot; {note.provider.name} </span> : null}
            {note.provider.role ? <span>&middot; {note.provider.role}</span> : null}
          </p>
        </div>
      ))}
    </>
  );
};

export default NotesSummary;
