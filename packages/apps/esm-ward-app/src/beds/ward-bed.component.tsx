import React, { type ReactNode } from 'react';

import { type Bed } from '../types';

import BedShareDivider from './bed-share-divider.component';
import EmptyBed from './empty-bed.component';
import styles from './ward-bed.scss';

export interface WardBedProps {
  patientCards: Array<ReactNode>;
  bed: Bed;
  isLoadingDivider?: boolean;
}

const WardBed: React.FC<WardBedProps> = (props) => {
  const { bed, patientCards } = props;
  return patientCards?.length > 0 ? <OccupiedBed {...props} /> : <EmptyBed bed={bed} />;
};

const OccupiedBed: React.FC<WardBedProps> = ({ patientCards, isLoadingDivider }) => {
  // interlace patient card with bed dividers between each of them
  const patientCardsWithDividers = patientCards.flatMap((patientCard, index) => {
    if (index === 0) {
      return [patientCard];
    }

    const dividerKey = React.isValidElement(patientCard) && patientCard.key != null ? patientCard.key : 'divider';
    return [<BedShareDivider key={`divider-${dividerKey}`} isLoading={isLoadingDivider} />, patientCard];
  });

  return <div className={styles.occupiedBed}>{patientCardsWithDividers}</div>;
};

export default WardBed;
