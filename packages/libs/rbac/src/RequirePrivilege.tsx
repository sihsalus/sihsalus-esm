import React, { Suspense, type ReactNode } from 'react';

import { useRequirePrivilege } from './useRequirePrivilege';

interface RequirePrivilegeProps {
  readonly privilege: string | string[];
  readonly requireAll?: boolean;
  readonly fallback?: ReactNode;
  readonly children: ReactNode;
}

function RequirePrivilegeInner({ privilege, requireAll = true, fallback = null, children }: RequirePrivilegeProps) {
  const result = useRequirePrivilege(privilege, requireAll);

  if (result.status === 'authorized') {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export function RequirePrivilege(props: RequirePrivilegeProps) {
  return (
    <Suspense fallback={null}>
      <RequirePrivilegeInner {...props} />
    </Suspense>
  );
}
