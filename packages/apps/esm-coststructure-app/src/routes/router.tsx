import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import CostStructureForm from '../components/form/costructure-form';
import CostStructureLayout from '../components/layout/layout.component';
import { baseName } from '../constants';
import CostStructureSearch from '../pages/cost-structure-home';

export const Router: React.FC = () => {
  return (
    <BrowserRouter basename={baseName}>
      <Routes>
        <Route path="/" element={<CostStructureLayout />}>
          <Route index element={<CostStructureSearch />} />
          <Route path="add" element={<CostStructureForm />} />
          <Route path="report" element={<div>Reportes</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
