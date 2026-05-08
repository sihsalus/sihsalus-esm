import { render, screen, within } from '@testing-library/react';
import React from 'react';
import StockCommodityTabs from './commodity-tabs.component';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback: string) =>
      ({
        stockItems: 'Artículos de inventario',
        stockOperations: 'Operaciones de inventario',
        userRoleScopes: 'Ámbitos de rol de usuario',
        sources: 'Fuentes',
      })[key] ?? fallback,
  }),
}));

jest.mock('../stock-items/stock-items.component', () => () => <div>stock items panel</div>);
jest.mock('../stock-operations/stock-operations-table.component', () => () => <div>stock operations panel</div>);
jest.mock('../stock-sources/stock-sources.component', () => () => <div>stock sources panel</div>);
jest.mock('../stock-user-role-scopes/stock-user-role-scopes.component', () => () => <div>user role scopes panel</div>);

describe('StockCommodityTabs', () => {
  it('renders localized tab labels', () => {
    render(<StockCommodityTabs />);

    const tabList = screen.getByRole('tablist');

    expect(within(tabList).getByRole('tab', { name: 'Artículos de inventario' })).toBeInTheDocument();
    expect(within(tabList).getByRole('tab', { name: 'Operaciones de inventario' })).toBeInTheDocument();
    expect(within(tabList).getByRole('tab', { name: 'Ámbitos de rol de usuario' })).toBeInTheDocument();
    expect(within(tabList).getByRole('tab', { name: 'Fuentes' })).toBeInTheDocument();
    expect(within(tabList).queryByRole('tab', { name: 'Items' })).not.toBeInTheDocument();
    expect(within(tabList).queryByRole('tab', { name: 'Operations' })).not.toBeInTheDocument();
    expect(within(tabList).queryByRole('tab', { name: 'User Roles' })).not.toBeInTheDocument();
  });
});
