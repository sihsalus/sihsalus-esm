import { useEffect, useState } from 'react';
import { getRegisteredPostSubmissionAction } from '../registry/registry';
import { type PostSubmissionAction } from '../types';

export interface PostSubmissionActionMeta {
  postAction: PostSubmissionAction;
  actionId: string;
  config: Record<string, unknown>;
  enabled?: string;
}

export function usePostSubmissionActions(
  actionRefs: Array<{ actionId: string; enabled?: string; config?: Record<string, unknown> }>,
): Array<PostSubmissionActionMeta> {
  const [actions, setActions] = useState<Array<PostSubmissionActionMeta>>([]);

  useEffect(() => {
    if (!actionRefs?.length) {
      setActions([]);
      return;
    }

    void Promise.all(
      actionRefs.map(async (ref) => {
        const postAction = await getRegisteredPostSubmissionAction(ref.actionId);
        if (!postAction) {
          return null;
        }

        return {
          postAction,
          config: ref.config ?? {},
          actionId: ref.actionId,
          enabled: ref.enabled,
        } satisfies PostSubmissionActionMeta;
      }),
    ).then((loadedActions) => {
      const nextActions: PostSubmissionActionMeta[] = [];
      loadedActions.forEach((action) => {
        if (action) {
          nextActions.push(action);
        }
      });
      setActions(nextActions);
    });
  }, [actionRefs]);

  return actions;
}
