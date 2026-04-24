import React, { type ReactNode, Suspense } from 'react';

import { useRequirePrivilege } from './useRequirePrivilege';

interface RequirePrivilegeProps {
  readonly privilege: string | string[];
  readonly requireAll?: boolean;
  readonly fallback?: ReactNode;
  readonly children: ReactNode;
}

function RequirePrivilegeInner({
  privilege,
  requireAll = true,
  fallback = null,
  children,
}: RequirePrivilegeProps): React.ReactElement {
  const result = useRequirePrivilege(privilege, requireAll);

  if (result.status === 'authorized') {
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
