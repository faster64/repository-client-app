import { RoutingConfig } from "../models/base/routing-config.model";

export class CommonConstant {
  public static MARK_KEY = "_mark";
  public static readonly ZERO_GUID = "00000000-0000-0000-0000-000000000000";
}

export class ErrorMessageConstant {
  public static readonly HAS_ERROR_MESSAGE = 'Đã xảy ra lỗi. Vui lòng thử lại sau!';
  public static readonly SESSION_EXPRIED = 'Phiên đăng nhập đã hết hạn';
  public static readonly ACCOUNT_NOT_VERIFIED = 'Tài khoản của bạn chưa được xác minh. Vui lòng xác minh tài khoản!';
}

export class PerrmisionConstant {
  public static readonly NOT_PERMISSION = 'Bạn không có quyền thực hiện chức năng này!';
  public static readonly UNDERSTOOD = 'Đã hiểu';
  public static readonly OK = 'OK!';
  public static readonly SESSION_EXPRIED = 'Phiên làm việc đã hết hạn';
}

/**
 * Danh sách routing
 */
export class Routing {
  public static readonly NOT_FOUND = new RoutingConfig('not-found', 'Không tìm thấy :(');
  public static readonly ACCESS_DENIED = new RoutingConfig('access-denied', 'Truy cập bị từ chối');
  public static readonly LOGIN = new RoutingConfig('login', 'Đăng nhập');
  public static readonly LOGOUT = new RoutingConfig('logout', 'Đăng xuất');
  public static readonly REGISTER = new RoutingConfig('register', 'Đăng ký');
  public static readonly VERIFY_REGISTER = new RoutingConfig('authentication/register-verification', 'Xác minh tài khoản');
  public static readonly VERIFY_LOGIN = new RoutingConfig('authentication/login-verification', 'Xác thực bảo mật');
  public static readonly ADMIN = new RoutingConfig('admin', 'Quản lý người dùng');
  public static readonly SETTING = new RoutingConfig('setting', 'Thiết lập');
  public static readonly DASHBOARD = new RoutingConfig('dashboard', 'Tổng quan');
  public static readonly REPOSITORY = new RoutingConfig('repository', 'Kho lưu trữ');
}

export const CommonRedirect = Routing.REPOSITORY.path;


export class BreakPoint {
  public static SM = 576;
  public static MD = 768;
  public static LG = 992;
  public static XL = 1200;
  public static XXL = 1400;
}

export const ColorSource = [
  "#14c9ff",
  "#198CE3",
  "#1bdf0f",
  "#3588C7",
  "rgb(56 97 128)",
  "rgb(56 59 216)",
  "rgb(218 51 204)",
  "rgb(120 14 111)",
  "rgb(10 160 24)",
  "rgb(239 100 34)",
  "rgb(237 152 112)",
  "rgb(213 210 14)",
  "rgb(213 14 86)",
  "rgb(62 161 191)",
  "rgb(12 133 169)",
  "rgb(179 33 114)",
  "rgb(137 169 41)",
  "rgb(167 167 167)",
  "rgb(173 119 74)",
  "rgb(255 118 0)",
]

export class SettingOption {
  public static readonly SECURITY = 'security';
  public static readonly COMMON = 'common';
  public static readonly PRIVACY = 'privacy';
}
