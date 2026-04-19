import React from 'react';

import OdontologiaAttentionDashboard from '../dental-attention/odontologia-attention-dashboard.component';
import OdontogramDashboard from '../odontogram-dashboard/odontogram-dashboard.component';

type OdontologiaDashboardProps = {
  patientUuid: string;
};

const OdontologiaDashboard: React.FC<OdontologiaDashboardProps> = ({ patientUuid }) => {
  return (
    <div>
      <OdontologiaAttentionDashboard patientUuid={patientUuid} />
      <OdontogramDashboard patientUuid={patientUuid} />
    </div>
  );
};

export default OdontologiaDashboard;
