"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _i18nFactory = _interopRequireDefault(require("i18n-factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var i18n = _i18nFactory["default"].create();

i18n.configure({
  locales: ['en', 'fr'],
  directory: "".concat(__dirname, "/../config/locales"),
  defaultLocale: 'en',
  logWarnFn: function logWarnFn(message) {
    return console.warn('warn', message);
  },
  // eslint-disable-line no-console
  logErrorFn: function logErrorFn(message) {
    return console.error('error', message);
  } // eslint-disable-line no-console

});
var _default = i18n;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaTE4bi5qcyJdLCJuYW1lcyI6WyJpMThuIiwiaTE4bkZhY3RvcnkiLCJjcmVhdGUiLCJjb25maWd1cmUiLCJsb2NhbGVzIiwiZGlyZWN0b3J5IiwiX19kaXJuYW1lIiwiZGVmYXVsdExvY2FsZSIsImxvZ1dhcm5GbiIsIm1lc3NhZ2UiLCJjb25zb2xlIiwid2FybiIsImxvZ0Vycm9yRm4iLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBRUEsSUFBTUEsSUFBSSxHQUFHQyx3QkFBWUMsTUFBWixFQUFiOztBQUVBRixJQUFJLENBQUNHLFNBQUwsQ0FBZTtBQUNiQyxFQUFBQSxPQUFPLEVBQUUsQ0FBQyxJQUFELEVBQU8sSUFBUCxDQURJO0FBRWJDLEVBQUFBLFNBQVMsWUFBS0MsU0FBTCx1QkFGSTtBQUdiQyxFQUFBQSxhQUFhLEVBQUUsSUFIRjtBQUliQyxFQUFBQSxTQUFTLEVBQUUsbUJBQUNDLE9BQUQ7QUFBQSxXQUFhQyxPQUFPLENBQUNDLElBQVIsQ0FBYSxNQUFiLEVBQXFCRixPQUFyQixDQUFiO0FBQUEsR0FKRTtBQUkwQztBQUN2REcsRUFBQUEsVUFBVSxFQUFFLG9CQUFDSCxPQUFEO0FBQUEsV0FBYUMsT0FBTyxDQUFDRyxLQUFSLENBQWMsT0FBZCxFQUF1QkosT0FBdkIsQ0FBYjtBQUFBLEdBTEMsQ0FLNkM7O0FBTDdDLENBQWY7ZUFTZVQsSSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpMThuRmFjdG9yeSBmcm9tICdpMThuLWZhY3RvcnknO1xuXG5jb25zdCBpMThuID0gaTE4bkZhY3RvcnkuY3JlYXRlKCk7XG5cbmkxOG4uY29uZmlndXJlKHtcbiAgbG9jYWxlczogWydlbicsICdmciddLFxuICBkaXJlY3Rvcnk6IGAke19fZGlybmFtZX0vLi4vY29uZmlnL2xvY2FsZXNgLFxuICBkZWZhdWx0TG9jYWxlOiAnZW4nLFxuICBsb2dXYXJuRm46IChtZXNzYWdlKSA9PiBjb25zb2xlLndhcm4oJ3dhcm4nLCBtZXNzYWdlKSwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gIGxvZ0Vycm9yRm46IChtZXNzYWdlKSA9PiBjb25zb2xlLmVycm9yKCdlcnJvcicsIG1lc3NhZ2UpLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbn0pO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGkxOG47XG4iXX0=