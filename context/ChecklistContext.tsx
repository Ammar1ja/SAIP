import type { InlineAlertContent } from '@/components/molecules/InlineAlert';
import type { PropsWithChildren, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect } from 'react';
import { useAlert } from './AlertContext';
import { useRouter } from '@/i18n/navigation';
import { notFound, usePathname, useSearchParams } from 'next/navigation';

export type ChecklistStep = {
  content: ReactNode;
  onYes: ChecklistAction;
  onNo: ChecklistAction;
};

type ChecklistContextType = {
  steps: ChecklistStep[];
  currentStep: number;
  onAnswer: (action: ChecklistAction) => void;
};

type ChecklistProviderType = {
  steps: ChecklistStep[];
} & PropsWithChildren;

// Types of each possible checklist action
type NextStepAction = { type: 'nextStep' };
type ShowAlertAction = { type: 'showAlert'; content: InlineAlertContent };
type RedirectAction = { type: 'redirect'; content?: InlineAlertContent; href: string };

export type ChecklistAction = NextStepAction | ShowAlertAction | RedirectAction;

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

// Helper function to validate number param in range (0 < param <= max)
const isParamValid = (param: string, max: number) => {
  const paramAsNumber = Number(param);

  return (
    !isNaN(paramAsNumber) &&
    Number.isInteger(paramAsNumber) &&
    paramAsNumber > 0 &&
    paramAsNumber <= max
  );
};

export function ChecklistProvider({ children, steps }: ChecklistProviderType) {
  const { closeAlert, setAlert } = useAlert();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const param = 'question';
  const question = searchParams.get(param);

  // Guard clause to prevent invalid parameter
  if (question && !isParamValid(question, steps.length)) {
    return notFound();
  }

  const currentStep = Number(question) || 1;

  // Helper function to create new path with provided search param
  const createQueryString = useCallback(
    (param: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(param, value);
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  // Set initial search param
  useEffect(() => {
    if (question) return;
    router.replace(createQueryString(param, '1'));
  }, [question, router, createQueryString]);

  const onNextStep = () => {
    console.log('onNextStep called', { currentStep, stepsLength: steps.length, question });
    closeAlert();

    // currentStep is 1-based (from URL query param)
    // If we're on step 1 and there are more steps, we can go to step 2
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      const newUrl = createQueryString(param, `${nextStep}`);
      console.log('Navigating to next step', { nextStep, newUrl });
      router.push(newUrl);
    } else {
      console.log('Cannot go to next step - already at last step', {
        currentStep,
        stepsLength: steps.length,
      });
    }
  };

  const onShowAlert = (content: InlineAlertContent) => {
    setAlert(content);
  };

  const onRedirect = (href: string, content?: InlineAlertContent) => {
    if (content) {
      setAlert(content, { persist: true });
    }
    router.push(href);
  };

  const onAnswer = (action: ChecklistAction) => {
    console.log('onAnswer called', { action, actionType: action.type, currentStep, question });
    switch (action.type) {
      case 'nextStep':
        console.log('Handling nextStep action');
        return onNextStep();
      case 'showAlert':
        console.log('Handling showAlert action', action.content);
        return onShowAlert(action.content);
      case 'redirect':
        console.log('Handling redirect action', action.href);
        return onRedirect(action.href, action.content);
      default:
        console.warn('Unknown action type', action);
        return null;
    }
  };

  return (
    <ChecklistContext.Provider value={{ steps, currentStep: currentStep - 1, onAnswer }}>
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist() {
  const context = useContext(ChecklistContext);

  if (context === undefined)
    throw new Error('ChecklistContext was used outside of ChecklsitProvider');

  return context;
}
