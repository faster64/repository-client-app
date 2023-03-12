import { HttpStatusCode } from "@angular/common/http";

export class BaseMessageResponse {
  /// Http status code trả về
  public code: number = HttpStatusCode.Ok;

  // Success
  public success = true;

  // Message
  public message = "";

  /// Time hệ thống
  public serverTime = "";
}
