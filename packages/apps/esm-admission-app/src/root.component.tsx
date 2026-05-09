import { AppErrorBoundary } from '@sihsalus/esm-rbac';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { basePath } from './constants';
import AdmissionHome from './pages/admission-home.component';
import PatientMerge from './pages/patient-merge.component';

export default function Root() {
  return (
    <AppErrorBoundary appName="esm-admission-app">
      <BrowserRouter basename={`${globalThis.getOpenmrsSpaBase().slice(0, -1)}${basePath}`}>
        <Routes>
          <Route index element={<AdmissionHome />} />
          <Route path="merge" element={<PatientMerge />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}
