"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classes = _interopRequireDefault(require("./classes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_classes["default"].configure({
  global: {
    logo: 'http://placehold.it/230x70&text=logo',
    invoice_template: "".concat(__dirname, "/static/invoice.pug"),
    date: new Date(),
    date_format: 'YY/MM/DD',
    lang: 'en'
  }
});

var _default = _classes["default"];
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0b3IiLCJjb25maWd1cmUiLCJnbG9iYWwiLCJsb2dvIiwiaW52b2ljZV90ZW1wbGF0ZSIsIl9fZGlybmFtZSIsImRhdGUiLCJEYXRlIiwiZGF0ZV9mb3JtYXQiLCJsYW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFQUEsb0JBQVVDLFNBQVYsQ0FBb0I7QUFDbEJDLEVBQUFBLE1BQU0sRUFBRTtBQUNOQyxJQUFBQSxJQUFJLEVBQUUsc0NBREE7QUFFTkMsSUFBQUEsZ0JBQWdCLFlBQUtDLFNBQUwsd0JBRlY7QUFHTkMsSUFBQUEsSUFBSSxFQUFFLElBQUlDLElBQUosRUFIQTtBQUlOQyxJQUFBQSxXQUFXLEVBQUUsVUFKUDtBQUtOQyxJQUFBQSxJQUFJLEVBQUU7QUFMQTtBQURVLENBQXBCOztlQVVlVCxtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZW5lcmF0b3IgZnJvbSAnLi9jbGFzc2VzJztcblxuZ2VuZXJhdG9yLmNvbmZpZ3VyZSh7XG4gIGdsb2JhbDoge1xuICAgIGxvZ286ICdodHRwOi8vcGxhY2Vob2xkLml0LzIzMHg3MCZ0ZXh0PWxvZ28nLFxuICAgIGludm9pY2VfdGVtcGxhdGU6IGAke19fZGlybmFtZX0vc3RhdGljL2ludm9pY2UucHVnYCxcbiAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgIGRhdGVfZm9ybWF0OiAnWVkvTU0vREQnLFxuICAgIGxhbmc6ICdlbicsXG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0b3I7XG4iXX0=