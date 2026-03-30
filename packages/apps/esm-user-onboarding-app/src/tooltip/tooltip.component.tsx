import React from 'react';
import { Button } from '@carbon/react';
import { ArrowLeft, ArrowRight, Close } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { type TooltipRenderProps } from 'react-joyride';
import { type ExtendedStep } from '../types';
import styles from './tooltip.scss';

interface CustomTooltipProps extends Omit<TooltipRenderProps, 'step'> {
  step: ExtendedStep;
  totalSteps: number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  continuous,
  index,
  step,
  backProps,
  primaryProps,
  skipProps,
  tooltipProps,
  totalSteps,
}) => {
  const { t } = useTranslation();
  const isLastStep = index === totalSteps - 1;

  return (
    <div {...tooltipProps} className={styles.tooltipcontainer}>
      <div className={styles.tooltipheader}>
        <div className={styles.container}>
          <h4 className={styles.tooltiptitle}>{step.title}</h4>
          <div className={styles.tooltipcontent}>{step.content}</div>
        </div>
        {!step.hideCloseButton && (
          <Button
            onClick={skipProps.onClick}
            aria-label={skipProps['aria-label']}
            size="sm"
            kind="ghost"
            className={styles.closeButton}
          >
            <Close />
          </Button>
        )}
      </div>
      {!step.hideFooter && (
        <div className={styles.tooltipfooter}>
          <span className={styles.tooltipstep}>{`${index + 1} of ${totalSteps}`}</span>
          <div className={styles.buttonContainer}>
            {!step.hideBackButton && index > 0 && (
              <Button
                onClick={backProps.onClick}
                aria-label={backProps['aria-label']}
                size="sm"
                kind="ghost"
                className={styles.buttonback}
              >
                <div className={styles.arrowLeft}>
                  <ArrowLeft />
                </div>
                {t('back', 'Back')}
              </Button>
            )}
            {continuous && !step.hideNextButton && (
              <Button
                onClick={primaryProps.onClick}
                aria-label={primaryProps['aria-label']}
                size="sm"
                className={styles.buttonnext}
              >
                {isLastStep ? (
                  <>{t('finish', 'Finish')}</>
                ) : (
                  <>
                    {t('next', 'Next')}
                    <div className={styles.arrowContainer}>
                      <ArrowRight />
                    </div>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
