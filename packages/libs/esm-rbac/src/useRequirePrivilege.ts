import { useSession, userHasAccess } from '@openmrs/esm-framework';

export type UseRequirePrivilegeResult =
  | { status: 'authorized' }
  | { status: 'unauthorized'; missingPrivilege: string | string[] }
  | { status: 'unauthenticated' };

export function useRequirePrivilege(privilege: string | string[], requireAll = true): UseRequirePrivilegeResult {
  const session = useSession();

  if (!session?.authenticated || !session.user) {
    return { status: 'unauthenticated' };
  }

  const privileges = Array.isArray(privilege) ? privilege : [privilege];
  const user = session.user;

  const hasAccess = requireAll
    ? privileges.every((p) => userHasAccess(p, user))
    : privileges.some((p) => userHasAccess(p, user));

  if (hasAccess) {
    return { status: 'authorized' };
  }

  return { status: 'unauthorized', missingPrivilege: privilege };
}
