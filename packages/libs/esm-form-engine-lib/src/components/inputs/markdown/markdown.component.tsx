import React from 'react';
import { useTranslation } from 'react-i18next';
import { type FormFieldInputProps } from '../../../types';
import MarkdownWrapper from './markdown-wrapper.component';

const Markdown: React.FC<FormFieldInputProps> = ({ field }) => {
  const { t } = useTranslation();

  const translateMarkdown = (markdownContent: unknown): string => {
    if (Array.isArray(markdownContent)) {
      return markdownContent
        .filter((line): line is string => typeof line === 'string' && line.length > 0)
        .map((line) => t(line, { defaultValue: line, interpolation: { escapeValue: false } }))
        .join('\n\n');
    }

    if (typeof markdownContent === 'string') {
      return t(markdownContent, { defaultValue: markdownContent, interpolation: { escapeValue: false } });
    }

    return '';
  };

  const markdown = translateMarkdown(field.value);

  return !field.isHidden && markdown ? <MarkdownWrapper markdown={markdown} /> : null;
};

export default Markdown;
