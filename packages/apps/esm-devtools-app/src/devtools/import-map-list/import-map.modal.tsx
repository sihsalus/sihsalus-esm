import { Button, Form, ModalBody, ModalFooter, ModalHeader, Stack, TextInput } from '@carbon/react';
import { addRoutesOverride, removeRoutesOverride } from '@openmrs/esm-framework/src/internal';
import React, { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { ImportMapOverridesApi } from '../import-map-overrides.types';
import type { Module } from './types';

type ImportMapModalProps = ({ module: Module; isNew: false } | { module: never; isNew: true }) & { close: () => void };

const isPortRegex = /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
const importMapOverrides = globalThis.importMapOverrides as unknown as ImportMapOverridesApi;

async function getUrlFromPort(moduleName: string, port: string) {
  const latestImportMap = await importMapOverrides.getNextPageMap();
  const moduleUrl = latestImportMap.imports[moduleName];

  if (!moduleUrl) {
    const fileName = moduleName.replace(/@/g, '').replace(/\//g, '-');
    return `${globalThis.location.protocol}//localhost:${port}/${fileName}.js`;
  }

  if (moduleUrl.endsWith('/')) {
    return `${globalThis.location.protocol}//localhost:${port}${moduleUrl}`;
  }

  return `${globalThis.location.protocol}//localhost:${port}/${moduleUrl.substring(moduleUrl.lastIndexOf('/') + 1)}`;
}

const ImportMapModal: React.FC<ImportMapModalProps> = ({ module, isNew, close }) => {
  const { t } = useTranslation();
  const [moduleName, setModuleName] = useState<string | undefined>(module?.moduleName);
  const moduleNameRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (evt: FormEvent<HTMLElement>) => {
      evt.preventDefault();

      if (!moduleName) {
        return;
      }

      if (importMapOverrides.isDisabled(moduleName)) {
        importMapOverrides.enableOverride(moduleName);
      }

      if (isNew) {
        let newUrl = inputRef.current?.value || null;
        if (newUrl) {
          if (isPortRegex.test(newUrl)) {
            newUrl = await getUrlFromPort(moduleName, newUrl);
          }

          importMapOverrides.addOverride(moduleName, newUrl);
          const baseUrl = newUrl.substring(0, newUrl.lastIndexOf('/'));
          addRoutesOverride(moduleName, new URL('routes.json', baseUrl));
        }
      } else {
        let newUrl = inputRef.current?.value || null;
        if (newUrl === null) {
          importMapOverrides.removeOverride(moduleName);
          removeRoutesOverride(moduleName);
        } else {
          if (isPortRegex.test(newUrl)) {
            newUrl = await getUrlFromPort(moduleName, newUrl);
          }

          importMapOverrides.addOverride(moduleName, newUrl);
          const baseUrl = newUrl.substring(0, newUrl.lastIndexOf('/'));
          addRoutesOverride(moduleName, new URL('routes.json', baseUrl));
        }
      }

      close();
    },
    [moduleName, isNew, close],
  );

  useEffect(
    () => (isNew ? moduleNameRef.current?.focus() : inputRef.current?.focus()),
    // Only fired on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onSubmit = (evt: FormEvent<HTMLElement>) => {
    void handleSubmit(evt);
  };

  return (
    <>
      <ModalHeader
        closeModal={close}
        title={
          isNew
            ? t('addModule', 'Add Module')
            : t('editModule', 'Edit Module {{- moduleName}}', {
                moduleName: moduleName,
              })
        }
      />
      <Form onSubmit={onSubmit}>
        <ModalBody>
          <Stack gap={5}>
            {isNew && (
              <TextInput
                id="module-name"
                ref={moduleNameRef}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                  evt.preventDefault();
                  setModuleName(evt.target.value);
                }}
                labelText={t('moduleName', 'Module Name')}
              />
            )}
            {!isNew && (
              <TextInput
                id="default-url"
                labelText={t('defaultUrl', 'Default URL')}
                value={module.defaultUrl}
                readOnly
              />
            )}
            <TextInput id="override-url" ref={inputRef} labelText={t('overrideUrl', 'Override URL')} />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={close}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button type="submit">{t('apply', 'Apply')}</Button>
        </ModalFooter>
      </Form>
    </>
  );
};

export default ImportMapModal;
