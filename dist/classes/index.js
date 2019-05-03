"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonOverride = _interopRequireDefault(require("json-override"));

var _generator = _interopRequireDefault(require("./generator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var configuration;
var _default = {
  /**
   * @description Configure invoiceIt with object config
   * @param config
   */
  configure: function configure(config) {
    return configuration = (0, _jsonOverride["default"])(configuration, config);
  },

  /**
   * @description Generate invoiceIt with configuration
   * @returns {Generator}
   */
  create: function create() {
    var generator = new _generator["default"](configuration);
    return generator;
  }
};
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2luZGV4LmpzIl0sIm5hbWVzIjpbImNvbmZpZ3VyYXRpb24iLCJjb25maWd1cmUiLCJjb25maWciLCJjcmVhdGUiLCJnZW5lcmF0b3IiLCJHZW5lcmF0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUVBLElBQUlBLGFBQUo7ZUFFZTtBQUViOzs7O0FBSUFDLEVBQUFBLFNBQVMsRUFBRSxtQkFBQ0MsTUFBRDtBQUFBLFdBQVlGLGFBQWEsR0FBRyw4QkFBYUEsYUFBYixFQUE0QkUsTUFBNUIsQ0FBNUI7QUFBQSxHQU5FOztBQVFiOzs7O0FBSUFDLEVBQUFBLE1BQU0sRUFBRSxrQkFBTTtBQUNaLFFBQU1DLFNBQVMsR0FBRyxJQUFJQyxxQkFBSixDQUFjTCxhQUFkLENBQWxCO0FBQ0EsV0FBT0ksU0FBUDtBQUNEO0FBZlksQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqc29uT3ZlcnJpZGUgZnJvbSAnanNvbi1vdmVycmlkZSc7XG5pbXBvcnQgR2VuZXJhdG9yIGZyb20gJy4vZ2VuZXJhdG9yJztcblxubGV0IGNvbmZpZ3VyYXRpb247XG5cbmV4cG9ydCBkZWZhdWx0IHtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIENvbmZpZ3VyZSBpbnZvaWNlSXQgd2l0aCBvYmplY3QgY29uZmlnXG4gICAqIEBwYXJhbSBjb25maWdcbiAgICovXG4gIGNvbmZpZ3VyZTogKGNvbmZpZykgPT4gY29uZmlndXJhdGlvbiA9IGpzb25PdmVycmlkZShjb25maWd1cmF0aW9uLCBjb25maWcpLFxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gR2VuZXJhdGUgaW52b2ljZUl0IHdpdGggY29uZmlndXJhdGlvblxuICAgKiBAcmV0dXJucyB7R2VuZXJhdG9yfVxuICAgKi9cbiAgY3JlYXRlOiAoKSA9PiB7XG4gICAgY29uc3QgZ2VuZXJhdG9yID0gbmV3IEdlbmVyYXRvcihjb25maWd1cmF0aW9uKTtcbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9LFxuXG59O1xuIl19