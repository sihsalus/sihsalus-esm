import React, { type ReactNode, Suspense } from 'react';

import { useRequirePrivilege } from './useRequirePrivilege';

interface RequirePrivilegeProps {
  readonly privileges:          string[] | undefined;
  readonly privilegesRequired:  string[] | undefined;
  readonly requireAll?:         boolean;
  readonly fallback?:           ReactNode;
  readonly children:            ReactNode;
}

function RequirePrivilegeInner({
  privileges,
  privilegesRequired,
  requireAll = true,
  fallback = null,
  children,
}: RequirePrivilegeProps): React.ReactElement {
  const result = useRequirePrivilege(privileges ?? [], privilegesRequired ,requireAll);

  if (!privileges || privileges.length === 0 || result.status === 'authorized') {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export function RequirePrivilege(props: RequirePrivilegeProps): React.ReactElement {
  return (
    <Suspense fallback={null}>
      <RequirePrivilegeInner {...props} />
    </Suspense>
  );
}
