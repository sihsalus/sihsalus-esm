import { ClickableTile } from '@carbon/react';
import { Report } from '@carbon/react/icons';
import React from 'react';
import styles from './item.scss';

const Item = () => {
  // items
  const openmrsSpaBase = window['getOpenmrsSpaBase']();

  return (
    <ClickableTile className={styles.customTile} id="menu-item" href={`${openmrsSpaBase}stock-management`}>
      <div className="customTileTitle">{<Report size={24} />}</div>
      <div>Stock Management</div>
    </ClickableTile>
  );
};
export default Item;
