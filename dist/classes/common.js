"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Common =
/*#__PURE__*/
function () {
  function Common() {
    _classCallCheck(this, Common);
  }

  _createClass(Common, [{
    key: "hydrate",

    /**
     * @description Hydrate current instance with obj attributes
     * @param obj
     * @param attributes
     * @todo optimize it
     */
    value: function hydrate(obj, attributes) {
      if (!obj) return; // eslint-disable-next-line no-restricted-syntax

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          this[item] = obj[item] ? obj[item] : '';
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /**
     * @description Return number with padding
     * @example if id = 10, return 0010
     * @param num
     * @param size
     * @return {string}
     */

  }, {
    key: "pad",
    value: function pad(num) {
      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
      var output = num.toString();

      while (output.length < size) {
        output = "0".concat(output);
      }

      return output;
    }
    /**
     * @description Check if is a number
     * @param n
     * @returns {boolean}
     */

  }, {
    key: "isNumeric",
    value: function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    /**
     * @description Round float with x decimals
     * @param num
     * @param decimals, default 2 decimals
     * @returns {number}
     */

  }, {
    key: "round",
    value: function round(num) {
      var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

      if (!"".concat(num).includes('e')) {
        return +"".concat(Math.round("".concat(num, "e+").concat(decimals)), "e-").concat(decimals);
      }

      var arr = "".concat(num).split('e');
      var sig = '';
      if (+arr[1] + decimals > 0) sig = '+';
      return +"".concat(Math.round("".concat(+arr[0], "e").concat(sig).concat(+arr[1] + decimals)), "e-").concat(decimals);
    }
    /**
     * @description Format number to return number with two decimals
     * @param num
     * @return {string}
     */

  }, {
    key: "formatOutputNumber",
    value: function formatOutputNumber(num) {
      var number = num.toString();

      if (number.includes('.')) {
        var split = number.split('.');
        if (split[1].length === 1) return "".concat(split[0], ".").concat(split[1], "0");
        if (split[1].length === 2) return number;
        return "".concat(split[0], ".").concat(split[1][0]).concat(split[1][1]);
      }

      return "".concat(number, ".00");
    }
  }]);

  return Common;
}();

exports["default"] = Common;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2NvbW1vbi5qcyJdLCJuYW1lcyI6WyJDb21tb24iLCJvYmoiLCJhdHRyaWJ1dGVzIiwiaXRlbSIsIm51bSIsInNpemUiLCJvdXRwdXQiLCJ0b1N0cmluZyIsImxlbmd0aCIsIm4iLCJpc05hTiIsInBhcnNlRmxvYXQiLCJpc0Zpbml0ZSIsImRlY2ltYWxzIiwiaW5jbHVkZXMiLCJNYXRoIiwicm91bmQiLCJhcnIiLCJzcGxpdCIsInNpZyIsIm51bWJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFxQkEsTTs7Ozs7Ozs7OztBQUNuQjs7Ozs7OzRCQU1RQyxHLEVBQUtDLFUsRUFBWTtBQUN2QixVQUFJLENBQUNELEdBQUwsRUFBVSxPQURhLENBRXZCOztBQUZ1QjtBQUFBO0FBQUE7O0FBQUE7QUFHdkIsNkJBQW1CQyxVQUFuQiw4SEFBK0I7QUFBQSxjQUFwQkMsSUFBb0I7QUFDN0IsZUFBS0EsSUFBTCxJQUFjRixHQUFHLENBQUNFLElBQUQsQ0FBSixHQUFjRixHQUFHLENBQUNFLElBQUQsQ0FBakIsR0FBMEIsRUFBdkM7QUFDRDtBQUxzQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTXhCO0FBRUQ7Ozs7Ozs7Ozs7d0JBT0lDLEcsRUFBZTtBQUFBLFVBQVZDLElBQVUsdUVBQUgsQ0FBRztBQUNqQixVQUFJQyxNQUFNLEdBQUdGLEdBQUcsQ0FBQ0csUUFBSixFQUFiOztBQUNBLGFBQU9ELE1BQU0sQ0FBQ0UsTUFBUCxHQUFnQkgsSUFBdkI7QUFBNkJDLFFBQUFBLE1BQU0sY0FBT0EsTUFBUCxDQUFOO0FBQTdCOztBQUNBLGFBQU9BLE1BQVA7QUFDRDtBQUVEOzs7Ozs7Ozs4QkFLVUcsQyxFQUFHO0FBQ1gsYUFBTyxDQUFDQyxLQUFLLENBQUNDLFVBQVUsQ0FBQ0YsQ0FBRCxDQUFYLENBQU4sSUFBeUJHLFFBQVEsQ0FBQ0gsQ0FBRCxDQUF4QztBQUNEO0FBRUQ7Ozs7Ozs7OzswQkFNTUwsRyxFQUFtQjtBQUFBLFVBQWRTLFFBQWMsdUVBQUgsQ0FBRzs7QUFDdkIsVUFBSSxDQUFDLFVBQUlULEdBQUosRUFBV1UsUUFBWCxDQUFvQixHQUFwQixDQUFMLEVBQStCO0FBQzdCLGVBQU8sV0FBS0MsSUFBSSxDQUFDQyxLQUFMLFdBQWNaLEdBQWQsZUFBc0JTLFFBQXRCLEVBQUwsZUFBMkNBLFFBQTNDLENBQVA7QUFDRDs7QUFDRCxVQUFNSSxHQUFHLEdBQUcsVUFBSWIsR0FBSixFQUFXYyxLQUFYLENBQWlCLEdBQWpCLENBQVo7QUFDQSxVQUFJQyxHQUFHLEdBQUcsRUFBVjtBQUNBLFVBQUksQ0FBQ0YsR0FBRyxDQUFDLENBQUQsQ0FBSixHQUFVSixRQUFWLEdBQXFCLENBQXpCLEVBQTRCTSxHQUFHLEdBQUcsR0FBTjtBQUM1QixhQUFPLFdBQUtKLElBQUksQ0FBQ0MsS0FBTCxXQUFjLENBQUNDLEdBQUcsQ0FBQyxDQUFELENBQWxCLGNBQXlCRSxHQUF6QixTQUErQixDQUFDRixHQUFHLENBQUMsQ0FBRCxDQUFKLEdBQVVKLFFBQXpDLEVBQUwsZUFBOERBLFFBQTlELENBQVA7QUFDRDtBQUVEOzs7Ozs7Ozt1Q0FLbUJULEcsRUFBSztBQUN0QixVQUFNZ0IsTUFBTSxHQUFHaEIsR0FBRyxDQUFDRyxRQUFKLEVBQWY7O0FBQ0EsVUFBSWEsTUFBTSxDQUFDTixRQUFQLENBQWdCLEdBQWhCLENBQUosRUFBMEI7QUFDeEIsWUFBTUksS0FBSyxHQUFHRSxNQUFNLENBQUNGLEtBQVAsQ0FBYSxHQUFiLENBQWQ7QUFDQSxZQUFJQSxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVNWLE1BQVQsS0FBb0IsQ0FBeEIsRUFBMkIsaUJBQVVVLEtBQUssQ0FBQyxDQUFELENBQWYsY0FBc0JBLEtBQUssQ0FBQyxDQUFELENBQTNCO0FBQzNCLFlBQUlBLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU1YsTUFBVCxLQUFvQixDQUF4QixFQUEyQixPQUFPWSxNQUFQO0FBQzNCLHlCQUFVRixLQUFLLENBQUMsQ0FBRCxDQUFmLGNBQXNCQSxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVMsQ0FBVCxDQUF0QixTQUFvQ0EsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTLENBQVQsQ0FBcEM7QUFDRDs7QUFDRCx1QkFBVUUsTUFBVjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbW9uIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBIeWRyYXRlIGN1cnJlbnQgaW5zdGFuY2Ugd2l0aCBvYmogYXR0cmlidXRlc1xuICAgKiBAcGFyYW0gb2JqXG4gICAqIEBwYXJhbSBhdHRyaWJ1dGVzXG4gICAqIEB0b2RvIG9wdGltaXplIGl0XG4gICAqL1xuICBoeWRyYXRlKG9iaiwgYXR0cmlidXRlcykge1xuICAgIGlmICghb2JqKSByZXR1cm47XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGF0dHJpYnV0ZXMpIHtcbiAgICAgIHRoaXNbaXRlbV0gPSAob2JqW2l0ZW1dKSA/IG9ialtpdGVtXSA6ICcnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJuIG51bWJlciB3aXRoIHBhZGRpbmdcbiAgICogQGV4YW1wbGUgaWYgaWQgPSAxMCwgcmV0dXJuIDAwMTBcbiAgICogQHBhcmFtIG51bVxuICAgKiBAcGFyYW0gc2l6ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBwYWQobnVtLCBzaXplID0gMykge1xuICAgIGxldCBvdXRwdXQgPSBudW0udG9TdHJpbmcoKTtcbiAgICB3aGlsZSAob3V0cHV0Lmxlbmd0aCA8IHNpemUpIG91dHB1dCA9IGAwJHtvdXRwdXR9YDtcbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBDaGVjayBpZiBpcyBhIG51bWJlclxuICAgKiBAcGFyYW0gblxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzTnVtZXJpYyhuKSB7XG4gICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KG4pKSAmJiBpc0Zpbml0ZShuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUm91bmQgZmxvYXQgd2l0aCB4IGRlY2ltYWxzXG4gICAqIEBwYXJhbSBudW1cbiAgICogQHBhcmFtIGRlY2ltYWxzLCBkZWZhdWx0IDIgZGVjaW1hbHNcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIHJvdW5kKG51bSwgZGVjaW1hbHMgPSAyKSB7XG4gICAgaWYgKCEoYCR7bnVtfWApLmluY2x1ZGVzKCdlJykpIHtcbiAgICAgIHJldHVybiArKGAke01hdGgucm91bmQoYCR7bnVtfWUrJHtkZWNpbWFsc31gKX1lLSR7ZGVjaW1hbHN9YCk7XG4gICAgfVxuICAgIGNvbnN0IGFyciA9IChgJHtudW19YCkuc3BsaXQoJ2UnKTtcbiAgICBsZXQgc2lnID0gJyc7XG4gICAgaWYgKCthcnJbMV0gKyBkZWNpbWFscyA+IDApIHNpZyA9ICcrJztcbiAgICByZXR1cm4gKyhgJHtNYXRoLnJvdW5kKGAkeythcnJbMF19ZSR7c2lnfSR7K2FyclsxXSArIGRlY2ltYWxzfWApfWUtJHtkZWNpbWFsc31gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gRm9ybWF0IG51bWJlciB0byByZXR1cm4gbnVtYmVyIHdpdGggdHdvIGRlY2ltYWxzXG4gICAqIEBwYXJhbSBudW1cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZm9ybWF0T3V0cHV0TnVtYmVyKG51bSkge1xuICAgIGNvbnN0IG51bWJlciA9IG51bS50b1N0cmluZygpO1xuICAgIGlmIChudW1iZXIuaW5jbHVkZXMoJy4nKSkge1xuICAgICAgY29uc3Qgc3BsaXQgPSBudW1iZXIuc3BsaXQoJy4nKTtcbiAgICAgIGlmIChzcGxpdFsxXS5sZW5ndGggPT09IDEpIHJldHVybiBgJHtzcGxpdFswXX0uJHtzcGxpdFsxXX0wYDtcbiAgICAgIGlmIChzcGxpdFsxXS5sZW5ndGggPT09IDIpIHJldHVybiBudW1iZXI7XG4gICAgICByZXR1cm4gYCR7c3BsaXRbMF19LiR7c3BsaXRbMV1bMF19JHtzcGxpdFsxXVsxXX1gO1xuICAgIH1cbiAgICByZXR1cm4gYCR7bnVtYmVyfS4wMGA7XG4gIH1cbn1cbiJdfQ==