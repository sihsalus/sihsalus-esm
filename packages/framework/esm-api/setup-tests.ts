import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

expect.extend(matchers);

vi.mock('@openmrs/esm-config', () => import('@openmrs/esm-config/mock'));
