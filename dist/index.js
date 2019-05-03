"use strict";

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

module.exports = _classes["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0b3IiLCJjb25maWd1cmUiLCJnbG9iYWwiLCJsb2dvIiwiaW52b2ljZV90ZW1wbGF0ZSIsIl9fZGlybmFtZSIsImRhdGUiLCJEYXRlIiwiZGF0ZV9mb3JtYXQiLCJsYW5nIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUVBQSxvQkFBVUMsU0FBVixDQUFvQjtBQUNsQkMsRUFBQUEsTUFBTSxFQUFFO0FBQ05DLElBQUFBLElBQUksRUFBRSxzQ0FEQTtBQUVOQyxJQUFBQSxnQkFBZ0IsWUFBS0MsU0FBTCx3QkFGVjtBQUdOQyxJQUFBQSxJQUFJLEVBQUUsSUFBSUMsSUFBSixFQUhBO0FBSU5DLElBQUFBLFdBQVcsRUFBRSxVQUpQO0FBS05DLElBQUFBLElBQUksRUFBRTtBQUxBO0FBRFUsQ0FBcEI7O0FBVUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlgsbUJBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdlbmVyYXRvciBmcm9tICcuL2NsYXNzZXMnO1xuXG5nZW5lcmF0b3IuY29uZmlndXJlKHtcbiAgZ2xvYmFsOiB7XG4gICAgbG9nbzogJ2h0dHA6Ly9wbGFjZWhvbGQuaXQvMjMweDcwJnRleHQ9bG9nbycsXG4gICAgaW52b2ljZV90ZW1wbGF0ZTogYCR7X19kaXJuYW1lfS9zdGF0aWMvaW52b2ljZS5wdWdgLFxuICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgZGF0ZV9mb3JtYXQ6ICdZWS9NTS9ERCcsXG4gICAgbGFuZzogJ2VuJyxcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2VuZXJhdG9yO1xuIl19