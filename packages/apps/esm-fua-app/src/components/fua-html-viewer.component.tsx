import React, { useState, useEffect } from 'react';
import { InlineLoading } from '@carbon/react';
import { showSnackbar, useConfig } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import styles from './fua-html-viewer.scss';
import type { Config } from '../config-schema';

interface FuaHtmlViewerProps {
  fuaId?: string;
  endpoint?: string;
}

const FuaHtmlViewer: React.FC<FuaHtmlViewerProps> = ({ fuaId, endpoint }) => {
  const config = useConfig<Config>();
  const { t } = useTranslation();
  const fuaEndpoint = endpoint || config.fuaGeneratorEndpoint;
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchFuaHtml = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const url = fuaId ? `${fuaEndpoint}?fuaId=${fuaId}` : fuaEndpoint;

        const response = await fetch(url, { signal: abortController.signal });

        if (!response.ok) {
          throw new Error(`${t('errorLoadingFua', 'Error loading FUA')}: ${response.status}`);
        }

        const html = await response.text();
        setHtmlContent(html);
      } catch (err) {
        if (abortController.signal.aborted) return;
        const errorMessage = err instanceof Error ? err.message : t('unknownError', 'Unknown error');
        setError(errorMessage);
        showSnackbar({
          title: t('error', 'Error'),
          subtitle: errorMessage,
          kind: 'error',
        });
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchFuaHtml();

    return () => abortController.abort();
  }, [fuaId, fuaEndpoint, t]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <InlineLoading description={t('loadingFuaDocument', 'Loading FUA document...')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{t('couldNotLoadFuaDocument', 'Could not load FUA document')}</p>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <iframe
        srcDoc={htmlContent}
        title={t('fuaDocument', 'FUA Document')}
        className={styles.iframe}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default FuaHtmlViewer;
