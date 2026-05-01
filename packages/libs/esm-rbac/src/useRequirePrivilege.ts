import { userHasAccess, useSession } from '@openmrs/esm-framework';

export type UseRequirePrivilegeResult =
  | { status: 'authorized' }
  | { status: 'unauthorized'; missingPrivilege: string[] }
  | { status: 'unauthenticated' };

export function useRequirePrivilege(
  privileges: string[],
  privilegesRequired: string[] | undefined,
  requireAll = true,
): UseRequirePrivilegeResult {
  const session = useSession();

  if (!session?.authenticated || !session.user) {
    return { status: 'unauthenticated' };
  }

  if (!privilegesRequired || privilegesRequired.length === 0) {
    return { status: 'authorized' };
  }

  const missing = privilegesRequired.filter((p) => !privileges.includes(p));

  const hasAccess = requireAll ? missing.length === 0 : missing.length < privilegesRequired.length;

  if (hasAccess) {
    return { status: 'authorized' };
  }

  return { status: 'unauthorized', missingPrivilege: missing };
}
