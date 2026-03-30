import React from 'react';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { type FetchResponse, openmrsFetch, showNotification } from '@openmrs/esm-framework';
import { renderWithSwr } from '@tools/test-helpers';
import { mockSubscription } from '@mocks/openconceptlab.mock';
import { deleteSubscription, updateSubscription } from './subscription.resource';
import Subscription from './subscription.component';

const mockOpenmrsFetch = openmrsFetch as jest.Mock;
const mockUpdateSubscription = jest.mocked(updateSubscription);
const mockDeleteSubscription = jest.mocked(deleteSubscription);
const mockShowNotification = jest.mocked(showNotification);

jest.mock('./subscription.resource', () => {
  const originalModule = jest.requireActual('./subscription.resource');

  return {
    ...originalModule,
    updateSubscription: jest.fn(),
    deleteSubscription: jest.fn(),
  };
});

describe('Subscription component', () => {
  it('renders the empty forms', async () => {
    mockOpenmrsFetch.mockReturnValueOnce({ data: { results: [] } });
    renderWithSwr(<Subscription />);
    await waitForLoadingToFinish();

    expect(screen.getByText('Setup Subscription')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Unsubscribe' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'danger Unsubscribe' })).toBeDisabled();
  });

  it('renders the subscription if a subscription exists', async () => {
    mockOpenmrsFetch.mockReturnValueOnce({ data: { results: [mockSubscription] } });
    renderWithSwr(<Subscription />);
    await waitForLoadingToFinish();
    await waitForLoadingSubscription();

    expect(screen.getByLabelText('Subscription URL')).toHaveValue(mockSubscription.url);
    expect(screen.getByLabelText('Token')).toHaveValue(mockSubscription.token);
    expect(screen.getByLabelText('Subscribe to SNAPSHOT versions (not recommended)')).not.toBeChecked();
    expect(
      screen.getByLabelText('Disable validation (should be used with care for well curated collections or sources)'),
    ).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'danger Unsubscribe' })).toBeEnabled();
  });

  xit('allows adding a new subscription', async () => {
    const user = userEvent.setup();
    mockOpenmrsFetch.mockReturnValueOnce({ data: { results: [] } });
    renderWithSwr(<Subscription />);
    await waitForLoadingToFinish();

    const urlInputField = screen.getByLabelText('Subscription URL');
    const tokenInputField = screen.getByLabelText('Token');
    const saveButton = screen.getByRole('button', { name: 'Save changes' });

    mockUpdateSubscription.mockResolvedValueOnce({ status: 201, ok: true } as unknown as FetchResponse);

    await user.type(urlInputField, mockSubscription.url);
    await user.type(tokenInputField, mockSubscription.token);
    await user.click(saveButton);

    expect(mockUpdateSubscription).toHaveBeenCalledWith(
      expect.objectContaining(mockSubscription),
      new AbortController(),
    );
    expect(mockUpdateSubscription).toHaveBeenCalledTimes(1);

    expect(mockShowNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Subscription created successfully',
        kind: 'success',
      }),
    );
    expect(mockShowNotification).toHaveBeenCalledTimes(1);
  });

  xit('allows changing the saved subscription', async () => {
    const user = userEvent.setup();
    mockOpenmrsFetch.mockReturnValueOnce({ data: { results: [mockSubscription] } });
    renderWithSwr(<Subscription />);
    await waitForLoadingToFinish();
    await waitForLoadingSubscription();

    const urlInputField = screen.getByLabelText('Subscription URL');
    const tokenInputField = screen.getByLabelText('Token');
    const saveButton = screen.getByRole('button', { name: 'Save changes' });

    mockUpdateSubscription.mockResolvedValueOnce({ status: 200, ok: true } as unknown as FetchResponse);

    await user.clear(urlInputField);
    await user.clear(tokenInputField);
    await user.type(urlInputField, 'https://api.openconceptlab.org/orgs/openmrs/collections/DemoQueueConcepts/2');
    await user.type(tokenInputField, 'token123');
    await user.click(saveButton);

    expect(mockUpdateSubscription).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockSubscription,
        url: 'https://api.openconceptlab.org/orgs/openmrs/collections/DemoQueueConcepts/2',
        token: 'token123',
      }),
      new AbortController(),
    );
    expect(mockUpdateSubscription).toHaveBeenCalledTimes(1);

    expect(mockShowNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Subscription updated successfully',
        kind: 'success',
      }),
    );
    expect(mockShowNotification).toHaveBeenCalledTimes(1);
  });

  xit('allows removing the saved subscription', async () => {
    const user = userEvent.setup();
    mockOpenmrsFetch.mockReturnValueOnce({ data: { results: [mockSubscription] } });
    renderWithSwr(<Subscription />);
    await waitForLoadingToFinish();
    await waitForLoadingSubscription();

    const unsubscribeButton = screen.getByRole('button', { name: 'danger Unsubscribe' });

    mockDeleteSubscription.mockResolvedValueOnce({ status: 204 } as unknown as FetchResponse);

    await user.click(unsubscribeButton);

    expect(mockDeleteSubscription).toHaveBeenCalledWith(
      expect.objectContaining(mockSubscription),
      new AbortController(),
    );
    expect(mockDeleteSubscription).toHaveBeenCalledTimes(1);

    expect(mockShowNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Successfully unsubscribed',
        kind: 'success',
      }),
    );
    expect(mockShowNotification).toHaveBeenCalledTimes(1);
  });
});

function waitForLoadingToFinish() {
  return waitFor(() => {
    expect(screen.getByText('Setup Subscription')).toBeVisible(), { timeout: 2000 };
  });
}

function waitForLoadingSubscription() {
  return waitFor(() => {
    expect(screen.getByLabelText('Subscription URL')).not.toHaveValue(''), { timeout: 2000 };
  });
}
