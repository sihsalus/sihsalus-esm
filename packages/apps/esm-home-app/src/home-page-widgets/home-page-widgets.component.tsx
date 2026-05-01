import { ExtensionSlot } from '@openmrs/esm-framework';
import React from 'react';

import styles from './home-page-widgets.scss';

const HomePageWidgets: React.FC = () => {
  return <ExtensionSlot className={styles.homePageWidget} name="homepage-widgets-slot" />;
};

export default HomePageWidgets;
