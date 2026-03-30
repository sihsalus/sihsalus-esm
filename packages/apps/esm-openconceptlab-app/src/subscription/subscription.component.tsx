import React, { useCallback, useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import {
  Button,
  ButtonSkeleton,
  Checkbox,
  CheckboxSkeleton,
  Column,
  Form,
  FormGroup,
  Grid,
  Layer,
  Stack,
  SkeletonText,
  TextInput,
  TextInputSkeleton,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@openmrs/esm-framework';
import { deleteSubscription, updateSubscription, useSubscription } from './subscription.resource';
import { isVersionDefinedInUrl } from '../utils';
import styles from './subscription.scss';

const Subscription: React.FC = () => {
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const [subscriptionUrl, setSubscriptionUrl] = useState('');
  const [token, setToken] = useState('');
  const [isSubscribedToSnapshot, setIsSubscribedToSnapshot] = useState(false);
  const [validationType, setValidationType] = useState<'NONE' | 'FULL'>('FULL');
  const [isSnapshotOptionDisabled, setIsSnapshotOptionDisabled] = useState(false);

  const { data: subscription, isLoading, error } = useSubscription();

  useEffect(() => {
    if (!isLoading && !error) {
      setSubscriptionUrl(subscription?.url || '');
      setToken(subscription?.token || '');
      setIsSubscribedToSnapshot(subscription?.subscribedToSnapshot || false);
      setValidationType(subscription?.validationType || 'FULL');
      setIsSnapshotOptionDisabled(subscription ? isVersionDefinedInUrl(subscription.url) : false);
    }
  }, [isLoading, error, subscription]);

  const handleChangeSubscriptionUrl = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSubscriptionUrl(event.target.value);
    if (isVersionDefinedInUrl(event.target.value)) {
      setIsSnapshotOptionDisabled(true);
      setIsSubscribedToSnapshot(false);
    } else {
      setIsSnapshotOptionDisabled(false);
    }
  }, []);

  const handleChangeToken = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  }, []);

  const handleChangeValidationType = useCallback((event, { checked, id }) => {
    setValidationType(checked ? 'NONE' : 'FULL');
  }, []);

  const handleChangeSubscriptionType = useCallback((event, { checked, id }) => {
    setIsSubscribedToSnapshot(checked);
  }, []);

  const handleSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();

      if (isSnapshotOptionDisabled && isSubscribedToSnapshot) {
        showNotification({
          kind: 'error',
          description: t(
            'snapshotDisabledError',
            "You cannot subscribe to a SNAPSHOT if you've provided the collection version",
          ),
        });
        return;
      }

      const abortController = new AbortController();

      const updatedSubscription = {
        ...subscription,
        url: subscriptionUrl,
        token: token,
        validationType: validationType,
        subscribedToSnapshot: isSubscribedToSnapshot,
      };
      mutate('/ws/rest/v1/openconceptlab/subscription?v=full', updatedSubscription, false);

      const response = await updateSubscription(updatedSubscription, abortController);
      mutate('/ws/rest/v1/openconceptlab/subscription?v=full');

      if (response.ok) {
        showNotification({
          kind: 'success',
          description: t(
            response.status === 201 ? 'subscriptionCreated' : 'subscriptionUpdated',
            response.status === 201 ? 'Subscription created successfully' : 'Subscription updated successfully',
          ),
        });
      } else {
        showNotification({
          title: t('errorSavingSubscription', 'Error occured while saving the subscription'),
          kind: 'error',
          critical: true,
          description: JSON.stringify(response.data),
        });
      }

      return () => abortController.abort();
    },
    [subscriptionUrl, token, validationType, isSubscribedToSnapshot, isSnapshotOptionDisabled, subscription, t, mutate],
  );

  const handleCancel = useCallback(() => {
    setSubscriptionUrl(subscription?.url || '');
    setToken(subscription?.token || '');
    setIsSubscribedToSnapshot(subscription?.subscribedToSnapshot || false);
    setValidationType(subscription?.validationType || 'FULL');
    setIsSnapshotOptionDisabled(subscription ? isVersionDefinedInUrl(subscription.url) : false);

    showNotification({
      kind: 'info',
      description: t('cancelledChanges', 'Cancelled changes successfully'),
    });
  }, [subscription, t]);

  const handleUnsubscribe = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      evt.stopPropagation();
      const abortController = new AbortController();

      const response = await deleteSubscription(subscription, abortController);
      mutate('/ws/rest/v1/openconceptlab/subscription?v=full');

      if (response.status === 204) {
        setSubscriptionUrl('');
        setToken('');
        setIsSubscribedToSnapshot(false);
        setValidationType('FULL');
        setIsSnapshotOptionDisabled(false);
        showNotification({
          kind: 'success',
          description: t('subscriptionDeleted', 'Successfully unsubscribed'),
        });
      } else {
        showNotification({
          title: t('errorDeletingSubscription', 'Error occured while deleting the subscription'),
          kind: 'error',
          critical: true,
          description: JSON.stringify(response.data),
        });
      }

      return () => abortController.abort();
    },
    [subscription, t, mutate],
  );

  if (isLoading) {
    return (
      <Grid className={styles.grid}>
        <Column sm={4} md={8} lg={10}>
          <Form>
            <SkeletonText className={styles.productiveHeading03} />
            <Stack gap={5}>
              <TextInputSkeleton />
              <TextInputSkeleton />
              <FormGroup legendText={<SkeletonText width="75px" />} className={styles.formGroup}>
                <CheckboxSkeleton />
                <CheckboxSkeleton />
              </FormGroup>
            </Stack>
            <ButtonSkeleton />
            <ButtonSkeleton />
          </Form>
          <Form className={styles.unsubscribeForm}>
            <SkeletonText className={styles.productiveHeading03} />
            <SkeletonText className={styles.unsubscribeText} />
            <ButtonSkeleton />
          </Form>
        </Column>
      </Grid>
    );
  }

  if (error) {
    showNotification({
      kind: 'error',
      description: t('subscriptionError', 'Error occured while fetching the subscription'),
    });
  }

  return (
    <Grid className={styles.grid}>
      <Column sm={4} md={8} lg={10}>
        <Form onSubmit={handleSubmit}>
          <h3 className={styles.productiveHeading03}>{t('setupSubscription', 'Setup Subscription')}</h3>
          <Stack gap={5}>
            <Layer>
              <TextInput
                id="subscriptionUrl"
                type="url"
                labelText={t('subscriptionUrl', 'Subscription URL')}
                placeholder="https://api.openconceptlab.org/orgs/organization-name/collections/dictionary-name"
                value={subscriptionUrl}
                onChange={handleChangeSubscriptionUrl}
                required
              />
            </Layer>
            <Layer>
              <TextInput
                id="apiToken"
                type="password"
                placeholder="••••••••••••••••••••••••••••••••••••••••••••••••"
                labelText={t('apiToken', 'Token')}
                value={token}
                onChange={handleChangeToken}
                required
              />
            </Layer>
            <FormGroup legendText={t('advancedOptions', 'Advanced Options')} className={styles.formGroup}>
              <Checkbox
                checked={isSubscribedToSnapshot}
                onChange={handleChangeSubscriptionType}
                labelText={t('subscribeToSnapshotText', 'Subscribe to SNAPSHOT versions (not recommended)')}
                id="isSubscribedToSnapshot"
                disabled={isSnapshotOptionDisabled}
              />
              <Checkbox
                checked={validationType === 'NONE'}
                onChange={handleChangeValidationType}
                labelText={t(
                  'disableValidationText',
                  'Disable validation (should be used with care for well curated collections or sources)',
                )}
                id="isValidationDisabled"
              />
            </FormGroup>
          </Stack>
          <Button kind="secondary" onClick={handleCancel}>
            {t('cancelButton', 'Cancel changes')}
          </Button>
          <Button kind="primary" type="submit">
            {t('subscribeButton', 'Save changes')}
          </Button>
        </Form>
        <Form onSubmit={handleUnsubscribe} className={styles.unsubscribeForm}>
          <h3 className={styles.productiveHeading03}>{t('unsubscribe', 'Unsubscribe')}</h3>
          <p className={styles.unsubscribeText}>
            {t(
              'unsubscribeInfo',
              'If you unsubscribe, no concepts will be deleted nor changed. All information about subscription will be deleted from your system.',
            )}
          </p>
          <Button kind="danger" type="submit" disabled={!subscription}>
            {t('unsubscribeButton', 'Unsubscribe')}
          </Button>
        </Form>
      </Column>
    </Grid>
  );
};

export default Subscription;
