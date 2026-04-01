import { Button } from '@carbon/react';
import React from 'react';

import styles from './reports.scss';

interface ReportOverviewButtonProps {
  shouldBeDisplayed: boolean;
  label: string;
  icon: React.ElementType;
  reportRequestUuid: string;
  onClick: () => void;
}

const ReportOverviewButton: React.FC<ReportOverviewButtonProps> = ({ shouldBeDisplayed, label, icon, onClick }) => {
  if (shouldBeDisplayed) {
    return (
      <div className={styles.actionButtonsWrapperDiv}>
        <Button kind="ghost" renderIcon={icon} iconDescription={label} onClick={onClick} className={styles.actionButon}>
          {label}
        </Button>
      </div>
    );
  } else {
    return null;
  }
};

export default ReportOverviewButton;
