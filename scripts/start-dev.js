#!/usr/bin/env node
'use strict';

require('dotenv').config({ quiet: true });
const { execSync } = require('child_process');

const backend =
  process.env.SIHSALUS_BACKEND_URL || 'http://hii1sc-dev.inf.pucp.edu.pe';

execSync(`openmrs develop --backend ${backend}`, { stdio: 'inherit' });
