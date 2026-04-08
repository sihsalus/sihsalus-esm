import { useEffect, useState } from 'react';

const useFormState = (formUuid) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.formUuid === formUuid) {
        setState(e.detail?.state);
      }
    };

    globalThis.addEventListener('ampath-form-state', handler);

    return () => {
      globalThis.removeEventListener('ampath-form-state', handler);
    };
  }, [formUuid]);

  return state;
};

export default useFormState;
