import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    {
                      "border-primary bg-primary text-primary-foreground":
                        isCompleted,
                      "border-primary bg-background text-primary": isCurrent,
                      "border-muted-foreground/25 bg-background text-muted-foreground":
                        isUpcoming,
                    },
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <div
                  className={cn("mt-2 text-xs font-medium transition-colors", {
                    "text-primary": isCompleted || isCurrent,
                    "text-muted-foreground": isUpcoming,
                  })}
                >
                  {step}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn("h-0.5 flex-1 transition-colors", {
                    "bg-primary": stepNumber < currentStep,
                    "bg-muted-foreground/25": stepNumber >= currentStep,
                  })}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
