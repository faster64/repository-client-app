import { ErrorCode } from "../../enumerations/error.enum";

export class ValidateField {
  public fieldName: string = "";

  public code!: ErrorCode;

  public errorMessage: string = "";
}
