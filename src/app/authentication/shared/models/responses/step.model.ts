import { RegisterStep } from "../../enumerations/register-step.enum";

export class Step {
  public currentStep = RegisterStep.RequiredInformation;

  public refId = "";

  public isCompleted = false;
}
