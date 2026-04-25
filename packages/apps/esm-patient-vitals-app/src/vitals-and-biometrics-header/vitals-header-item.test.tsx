import { render, screen } from '@testing-library/react';

import VitalsHeaderItem from './vitals-header-item.component';

const testProps = { unitName: 'Temp', value: '36.5', unitSymbol: '°C' };

describe('VitalsHeaderItem', () => {
  it('renders a vital sign in the vitals header', () => {
    render(<VitalsHeaderItem {...testProps} />);

    expect(screen.getByText('Temp')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
    expect(screen.getByText('36.5')).toBeInTheDocument();
  });

  it('handles empty unit symbol gracefully', () => {
    const propsWithEmptyUnit = { ...testProps, unitSymbol: '' };
    render(<VitalsHeaderItem {...propsWithEmptyUnit} />);

    expect(screen.getByText('Temp')).toBeInTheDocument();
    expect(screen.getByText('36.5')).toBeInTheDocument();
  });

  it('handles undefined unit symbol gracefully', () => {
    const propsWithUndefinedUnit = { ...testProps, unitSymbol: undefined };
    render(<VitalsHeaderItem {...propsWithUndefinedUnit} />);

    expect(screen.getByText('Temp')).toBeInTheDocument();
    expect(screen.getByText('36.5')).toBeInTheDocument();
  });

  it('renders zero as a valid value instead of not available', () => {
    render(<VitalsHeaderItem unitName="Pulse" value={0} unitSymbol="beats/min" />);

    expect(screen.getByText('Pulse')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('beats/min')).toBeInTheDocument();
    expect(screen.queryByText(/not available/i)).not.toBeInTheDocument();
  });
});
