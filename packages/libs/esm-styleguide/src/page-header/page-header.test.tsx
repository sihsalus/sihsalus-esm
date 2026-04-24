import { getConfig } from '@openmrs/esm-config';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PageHeaderContent } from './page-header.component';

const mockGetConfig = vi.mocked(getConfig);
const mockGetCoreTranslation = vi.mocked(getCoreTranslation);

vi.mock('@openmrs/esm-config', () => ({
  getConfig: vi.fn(),
}));

vi.mock('@openmrs/esm-translations', () => ({
  getCoreTranslation: vi.fn((key: string) => key),
}));

afterEach(() => {
  cleanup();
});

describe('PageHeaderContent', () => {
  const mockIllustration = <svg data-testid="mock-illustration" />;

  it('renders title and illustration', async () => {
    mockGetConfig.mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(screen.getByTestId('mock-illustration')).toBeTruthy();
  });

  it('renders implementation name when provided in config', async () => {
    mockGetConfig.mockResolvedValue({ implementationName: 'Test Clinic' });

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText('Test Clinic');
    expect(mockGetCoreTranslation).not.toHaveBeenCalled();
  });

  it('translates the default implementation name', async () => {
    mockGetCoreTranslation.mockReturnValueOnce('Cl\u00ednica');
    mockGetConfig.mockResolvedValue({ implementationName: 'Clinic' });

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText('Cl\u00ednica');
    expect(mockGetCoreTranslation).toHaveBeenCalledWith('Clinic');
  });

  it('does not render implementation name when not provided in config', async () => {
    mockGetConfig.mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(screen.queryByText('Test Clinic')).toBeNull();
  });

  it('applies custom className when provided', async () => {
    mockGetConfig.mockResolvedValue({});

    const { container } = render(
      <PageHeaderContent title="Test Title" illustration={mockIllustration} className="custom-class" />,
    );

    await screen.findByText(/test title/i);
    // eslint-disable-next-line testing-library/no-node-access
    expect((container.firstChild as HTMLElement)?.className).toContain('custom-class');
  });

  it('calls getConfig with correct module name', async () => {
    mockGetConfig.mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(getConfig).toHaveBeenCalledWith('@openmrs/esm-styleguide');
  });
});
