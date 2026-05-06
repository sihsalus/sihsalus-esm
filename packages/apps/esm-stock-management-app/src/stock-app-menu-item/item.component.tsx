import { ClickableTile } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './item.scss';
import { Report } from '@carbon/react/icons';

const Item = () => {
  const { t } = useTranslation();
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`${openmrsSpaBase}stock-management`}>
      <div className="customTileTitle">{<Report size={24} />}</div>
      <div>{t('stockManagement', 'Stock Management')}</div>
    </ClickableTile>
  );
};
export default Item;
