import { type Step } from 'react-joyride';

export interface ExtendedStep extends Step {
  hideBackButton?: boolean;
  hideNextButton?: boolean;
  hideFooter?: boolean;
  hideCloseButton?: boolean;
  data?: {
    autoNextOn?: string;
  };
}

export interface Tutorial {
  title: string;
  description: string;
  steps: ExtendedStep[];
}

export interface TutorialContext {
  showTutorial: boolean;
  steps: ExtendedStep[];
  setShowTutorial: (showTutorial: boolean) => void;
  setSteps: (steps: ExtendedStep[]) => void;
  [key: string | number | symbol]: unknown;
}
