import { Tile } from '@carbon/react';
import { Locked } from '@carbon/react/icons';
import React from 'react';

interface UnauthorizedStateProps {
  readonly privilege: string | string[];
  readonly description?: string;
}

export function UnauthorizedState({ privilege, description }: UnauthorizedStateProps): React.ReactElement {
  const privilegeLabel = Array.isArray(privilege) ? privilege.join(', ') : privilege;
  const body = description ?? `You need the "${privilegeLabel}" privilege to access this section.`;

  return (
    <Tile>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Locked size={20} />
        <strong>Access Denied</strong>
      </div>
      <p>{body}</p>
    </Tile>
  );
}
