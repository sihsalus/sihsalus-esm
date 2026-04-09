import { Layer, ClickableTile } from '@carbon/react';
import { ArrowRight } from '@carbon/react/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

function getSpaBase(): string {
  const value = (globalThis as { getOpenmrsSpaBase?: () => string }).getOpenmrsSpaBase?.();
  return typeof value === 'string' ? value : '';
}

const BedManagementAdminCardLink: React.FC = () => {
  const { t } = useTranslation();
  const header = t('manageBeds', 'Manage beds');

  return (
    <Layer>
      <ClickableTile href={`${getSpaBase()}bed-management`} rel="noopener noreferrer">
        <div>
          <div className="heading">{header}</div>
          <div className="content">{t('bedManagement', 'Bed management')}</div>
        </div>
        <div className="iconWrapper">
          <ArrowRight size={16} />
        </div>
      </ClickableTile>
    </Layer>
  );
};

export default BedManagementAdminCardLink;
