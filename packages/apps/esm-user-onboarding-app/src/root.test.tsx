import React from 'react';
import { render, act } from '@testing-library/react';
import { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useDefineAppContext } from '@openmrs/esm-framework';
import RootComponent from './root.component';

const mockUseDefineAppContext = jest.mocked(useDefineAppContext);

let joyrideCallback: (data: any) => void;

jest.mock('react-joyride', () => {
  const actual = jest.requireActual('react-joyride');
  return {
    ...actual,
    __esModule: true,
    default: jest.fn((props: any) => {
      joyrideCallback = props.callback;
      return <div data-testid="joyride" data-run={props.run} data-step-index={props.stepIndex} />;
    }),
  };
});

function getTutorialContext() {
  const calls = mockUseDefineAppContext.mock.calls;
  const lastCall = calls[calls.length - 1];
  return lastCall[1] as {
    showTutorial: boolean;
    steps: any[];
    setShowTutorial: (show: boolean) => void;
    setSteps: (steps: any[]) => void;
  };
}

const mockSteps = [
  { target: '#step-1', content: 'Step 1' },
  { target: '#step-2', content: 'Step 2' },
  { target: '#step-3', content: 'Step 3' },
];

describe('RootComponent', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders ReactJoyride', () => {
    const { getByTestId } = render(<RootComponent />);
    expect(getByTestId('joyride')).toBeInTheDocument();
  });

  it('defines the tutorial app context', () => {
    render(<RootComponent />);

    expect(mockUseDefineAppContext).toHaveBeenCalledWith(
      'tutorial-context',
      expect.objectContaining({
        showTutorial: false,
        steps: [],
        setShowTutorial: expect.any(Function),
        setSteps: expect.any(Function),
      }),
    );
  });

  it('sets disableBeacon on all steps when setSteps is called', () => {
    render(<RootComponent />);
    const context = getTutorialContext();

    act(() => {
      context.setSteps(mockSteps);
    });

    const updatedContext = getTutorialContext();
    updatedContext.steps.forEach((step) => {
      expect(step.disableBeacon).toBe(true);
    });
  });

  it('advances the step index on STEP_AFTER with NEXT action', () => {
    const { getByTestId } = render(<RootComponent />);
    const context = getTutorialContext();

    act(() => {
      context.setSteps(mockSteps);
      context.setShowTutorial(true);
    });

    act(() => {
      joyrideCallback({
        action: ACTIONS.NEXT,
        index: 0,
        type: EVENTS.STEP_AFTER,
        status: STATUS.RUNNING,
      });
    });

    expect(getByTestId('joyride').getAttribute('data-step-index')).toBe('1');
  });

  it('decrements the step index on STEP_AFTER with PREV action', () => {
    const { getByTestId } = render(<RootComponent />);
    const context = getTutorialContext();

    act(() => {
      context.setSteps(mockSteps);
      context.setShowTutorial(true);
    });

    // Advance to step 1 first
    act(() => {
      joyrideCallback({
        action: ACTIONS.NEXT,
        index: 0,
        type: EVENTS.STEP_AFTER,
        status: STATUS.RUNNING,
      });
    });

    // Go back
    act(() => {
      joyrideCallback({
        action: ACTIONS.PREV,
        index: 1,
        type: EVENTS.STEP_AFTER,
        status: STATUS.RUNNING,
      });
    });

    expect(getByTestId('joyride').getAttribute('data-step-index')).toBe('0');
  });

  it('resets the step index and hides the tutorial on TOUR_END', () => {
    const { getByTestId } = render(<RootComponent />);
    const context = getTutorialContext();

    act(() => {
      context.setSteps(mockSteps);
      context.setShowTutorial(true);
    });

    act(() => {
      joyrideCallback({
        action: ACTIONS.NEXT,
        index: 0,
        type: EVENTS.STEP_AFTER,
        status: STATUS.RUNNING,
      });
    });

    act(() => {
      joyrideCallback({
        action: ACTIONS.RESET,
        index: 1,
        type: EVENTS.TOUR_END,
        status: STATUS.FINISHED,
      });
    });

    expect(getByTestId('joyride').getAttribute('data-step-index')).toBe('0');
    expect(getByTestId('joyride').getAttribute('data-run')).toBe('false');
  });

  it('polls for the target element on TOUR_START', () => {
    render(<RootComponent />);
    const context = getTutorialContext();

    act(() => {
      context.setSteps(mockSteps);
      context.setShowTutorial(true);
    });

    act(() => {
      joyrideCallback({
        action: ACTIONS.START,
        index: 0,
        type: EVENTS.TOUR_START,
        status: STATUS.RUNNING,
      });
    });

    // Tour should be hidden while waiting for target
    const updatedContext = getTutorialContext();
    expect(updatedContext.showTutorial).toBe(false);

    // Add the target element to the DOM
    const el = document.createElement('div');
    el.id = 'step-1';
    document.body.appendChild(el);

    // Advance the polling interval
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Tour should be visible again
    const finalContext = getTutorialContext();
    expect(finalContext.showTutorial).toBe(true);

    document.body.removeChild(el);
  });

  it('polls for the target element on TARGET_NOT_FOUND', () => {
    render(<RootComponent />);
    const context = getTutorialContext();

    act(() => {
      context.setSteps(mockSteps);
      context.setShowTutorial(true);
    });

    act(() => {
      joyrideCallback({
        action: ACTIONS.UPDATE,
        index: 1,
        type: EVENTS.TARGET_NOT_FOUND,
        status: STATUS.RUNNING,
      });
    });

    const updatedContext = getTutorialContext();
    expect(updatedContext.showTutorial).toBe(false);

    const el = document.createElement('div');
    el.id = 'step-2';
    document.body.appendChild(el);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const finalContext = getTutorialContext();
    expect(finalContext.showTutorial).toBe(true);

    document.body.removeChild(el);
  });

  it('clears polling intervals on TOUR_END', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    render(<RootComponent />);
    const context = getTutorialContext();

    act(() => {
      context.setSteps(mockSteps);
      context.setShowTutorial(true);
    });

    // Start a poll by triggering TARGET_NOT_FOUND
    act(() => {
      joyrideCallback({
        action: ACTIONS.UPDATE,
        index: 0,
        type: EVENTS.TARGET_NOT_FOUND,
        status: STATUS.RUNNING,
      });
    });

    // End the tour — should clear the polling interval
    act(() => {
      joyrideCallback({
        action: ACTIONS.RESET,
        index: 0,
        type: EVENTS.TOUR_END,
        status: STATUS.FINISHED,
      });
    });

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('clears all intervals on unmount', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = render(<RootComponent />);
    const context = getTutorialContext();

    act(() => {
      context.setSteps(mockSteps);
      context.setShowTutorial(true);
    });

    act(() => {
      joyrideCallback({
        action: ACTIONS.UPDATE,
        index: 0,
        type: EVENTS.TARGET_NOT_FOUND,
        status: STATUS.RUNNING,
      });
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
