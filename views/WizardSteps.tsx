
import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  currentStep: number; // 1: Details, 2: Identity, 3: Visage, 4: States, 5: Ritual
}

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Identity" },
  { id: 3, label: "Visage" },
  { id: 4, label: "States" },
  { id: 5, label: "Ritual" },
];

const WizardSteps: React.FC<Props> = ({ currentStep }) => {
  return (
    <div className="w-full flex justify-center mb-8">
      <div className="flex items-center gap-2 md:gap-4">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border font-cinzel
                    ${isActive 
                      ? 'bg-red-900 border-red-500 text-white shadow-[0_0_15px_rgba(153,27,27,0.6)]' 
                      : isCompleted 
                        ? 'bg-stone-900 border-green-900 text-green-700' 
                        : 'bg-stone-950 border-stone-800 text-stone-700'}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-xs font-cinzel font-bold tracking-wider hidden md:block ${isActive ? 'text-red-400' : isCompleted ? 'text-stone-500' : 'text-stone-700'}`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`h-[1px] w-8 md:w-16 transition-colors ${isCompleted ? 'bg-stone-700' : 'bg-stone-900'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WizardSteps;
