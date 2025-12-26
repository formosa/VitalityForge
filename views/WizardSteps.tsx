
import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  currentStep: number; // 1: Details, 2: Identity, 3: Visage, 4: States, 5: Ritual
  onStepClick?: (stepId: number) => void;
}

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Identity" },
  { id: 3, label: "Visage" },
  { id: 4, label: "States" },
  { id: 5, label: "Ritual" },
];

const WizardSteps: React.FC<Props> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full flex justify-center mb-4 md:mb-8 px-2">
      <div className="flex items-center gap-1 md:gap-4">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = idx === steps.length - 1;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-1 md:gap-2">
                <button 
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  type="button"
                  className={`
                    w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all border font-cinzel
                    ${isActive 
                      ? 'bg-red-900 border-red-500 text-white shadow-[0_0_15px_rgba(153,27,27,0.6)] cursor-default' 
                      : isCompleted 
                        ? 'bg-stone-900 border-green-900 text-green-700 hover:bg-stone-800 hover:text-green-500 hover:border-green-700 cursor-pointer' 
                        : 'bg-stone-950 border-stone-800 text-stone-700 cursor-default'}
                  `}
                >
                  {isCompleted ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : step.id}
                </button>
                <span className={`text-[10px] md:text-xs font-cinzel font-bold tracking-wider hidden sm:block ${isActive ? 'text-red-400' : isCompleted ? 'text-stone-500' : 'text-stone-700'}`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`h-[1px] w-4 sm:w-8 md:w-16 transition-colors ${isCompleted ? 'bg-stone-700' : 'bg-stone-900'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WizardSteps;
