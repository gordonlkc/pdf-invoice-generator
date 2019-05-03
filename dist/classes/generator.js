"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _pug = _interopRequireDefault(require("pug"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _common = _interopRequireDefault(require("./common"));

var _i18n = _interopRequireDefault(require("../lib/i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Generator =
/*#__PURE__*/
function (_Common) {
  _inherits(Generator, _Common);

  function Generator(config) {
    var _this;

    _classCallCheck(this, Generator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Generator).call(this));
    _this._recipient = {};
    _this._statement_heading = {};
    _this._reference_info = {};
    _this._statement_conclusion = {};
    _this._article_headers = [];
    _this._articles = [];
    _this._template_configuration = {};

    _this._i18nConfigure(config.language);

    _this.hydrate(config.global, _this._itemsToHydrate());

    return _this;
  }

  _createClass(Generator, [{
    key: "deleteArticles",

    /**
     * @description Reinitialize articles attribute
     */
    value: function deleteArticles() {
      this._total_inc_taxes = 0;
      this._total_taxes = 0;
      this._total_exc_taxes = 0;
      this._articles = [];
    }
  }, {
    key: "_itemsToHydrate",

    /**
     * @description Hydrate from configuration
     * @returns {[string,string,string,string]}
     */
    value: function _itemsToHydrate() {
      return ['logo', 'invoice_template', 'date_format', 'date', 'invoice_reference_pattern', 'invoice_note', 'lang'];
    }
    /**
     * @description Precompile translation to merging glabal with custom translations
     * @returns {{logo: *, header_date: *, fromto_phone, fromto_mail, moment: (*|moment.Moment)}}
     * @private
     */

  }, {
    key: "_preCompileCommonTranslations",
    value: function _preCompileCommonTranslations() {
      return {
        logo: this.logo,
        header_date: this.date,
        fromto_phone: _i18n["default"].__({
          phrase: 'fromto_phone',
          locale: this.lang
        }),
        fromto_mail: _i18n["default"].__({
          phrase: 'fromto_mail',
          locale: this.lang
        }),
        recipient: this._recipient,
        statement_heading: this._statement_heading,
        statement_conclusion: this._statement_conclusion,
        article_headers: this.article_headers,
        articles: this._articles,
        template_configuration: this._template_configuration,
        moment: (0, _moment["default"])()
      };
    }
    /**
     * @description Compile pug template to HTML
     * @param keys
     * @returns {*}
     * @private
     */

  }, {
    key: "_compile",
    value: function _compile(keys) {
      var template = this.invoice_template;

      var compiled = _pug["default"].compileFile(_path["default"].resolve(template));

      return compiled(keys);
    }
    /**
     * @description Return invoice translation keys object
     * @returns {*}
     */

  }, {
    key: "getInvoice",
    value: function getInvoice() {
      var _this2 = this;

      var keys = {
        invoice_header_title: _i18n["default"].__({
          phrase: 'invoice_header_title',
          locale: this.lang
        }),
        invoice_header_subject: _i18n["default"].__({
          phrase: 'invoice_header_subject',
          locale: this.lang
        }),
        table_note_content: this.invoice_note,
        note: function note(_note) {
          return _note ? _this2.invoice_note = _note : _this2.invoice_note;
        },
        filename: 'invoice'
      };
      return Object.assign(keys, {
        toHTML: function toHTML() {
          return _this2._toHTML(keys);
        },
        toPDF: function toPDF(options) {
          return _this2._toPDF(keys, options);
        }
      }, this._preCompileCommonTranslations());
    }
    /**
     * @description Return reference from pattern
     * @param type
     * @return {*}
     */

  }, {
    key: "getReferenceFromPattern",
    value: function getReferenceFromPattern(type) {
      if (!['invoice'].includes(type)) throw new Error('Type have to be "invoice"');
      if (this.reference) return this.reference;
      return this.setReferenceFromPattern(this.invoice_reference_pattern);
    }
    /**
     * @description Set reference
     * @param pattern
     * @return {*}
     * @private
     * @todo optimize it
     */

  }, {
    key: "setReferenceFromPattern",
    value: function setReferenceFromPattern(pattern) {
      var tmp = pattern.split('$').slice(1);
      var output = ''; // eslint-disable-next-line no-restricted-syntax

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = tmp[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          if (!item.endsWith('}')) throw new Error('Wrong pattern type');
          if (item.startsWith('prefix{')) output += item.replace('prefix{', '').slice(0, -1);else if (item.startsWith('separator{')) output += item.replace('separator{', '').slice(0, -1);else if (item.startsWith('date{')) output += (0, _moment["default"])().format(item.replace('date{', '').slice(0, -1));else if (item.startsWith('id{')) {
            var id = item.replace('id{', '').slice(0, -1);
            if (!/^\d+$/.test(id)) throw new Error("Id must be an integer (".concat(id, ")"));
            output += this._id ? this.pad(this._id, id.length) : this.pad(0, id.length);
          } else throw new Error("".concat(item, " pattern reference unknown"));
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

      return output;
    }
    /**
     * @description Export object with html content and exportation functions
     * @returns {{html: *, toFile: (function(*): *)}}
     * @private
     */

  }, {
    key: "_toHTML",
    value: function _toHTML(keys) {
      var _this3 = this;

      var html = this._compile(this.getInvoice());

      return {
        html: html,
        toFile: function toFile(filepath) {
          return _this3._toFileFromHTML(html, filepath || "".concat(keys.filename, ".html"));
        }
      };
    }
    /**
     * @description Save content to pdf file
     * @returns {*}
     * @private
     */

  }, {
    key: "_toPDF",
    value: function _toPDF(keys, options) {
      var _this4 = this;

      var htmlToPdf = this._loadHtmlToPdf();

      var pdf = htmlToPdf.create(this._toHTML(keys).html, options);
      return {
        pdf: pdf,
        toFile: function toFile(filepath) {
          return _this4._toFileFromPDF(pdf, filepath || "".concat(keys.filename, ".pdf"));
        },
        toBuffer: function toBuffer() {
          return _this4._toBufferFromPDF(pdf);
        },
        toStream: function toStream(filepath) {
          return _this4._toStreamFromPDF(pdf, filepath || "".concat(keys.filename, ".pdf"));
        }
      };
    }
    /**
     * @description Save content into file from toHTML() method
     * @param content
     * @param filepath
     * @returns {Promise}
     * @private
     */

  }, {
    key: "_toFileFromHTML",
    value: function _toFileFromHTML(content, filepath) {
      return new Promise(function (resolve, reject) {
        return _fs["default"].writeFile(filepath, content, function (err) {
          if (err) reject(err);
          return resolve();
        });
      });
    }
    /**
     * @description Save content into file from toPDF() method
     * @param content
     * @param filepath
     * @returns {Promise}
     * @private
     */

  }, {
    key: "_toFileFromPDF",
    value: function _toFileFromPDF(content, filepath) {
      return new Promise(function (resolve, reject) {
        return content.toFile(filepath, function (err, res) {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    }
    /**
     * @description Export PDF to buffer
     * @param content
     * @returns {*}
     * @private
     */

  }, {
    key: "_toBufferFromPDF",
    value: function _toBufferFromPDF(content) {
      return new Promise(function (resolve, reject) {
        return content.toBuffer(function (err, buffer) {
          if (err) return reject(err);
          return resolve(buffer);
        });
      });
    }
    /**
     * @description Export PDF to file using stream
     * @param content
     * @param filepath
     * @returns {*}
     * @private
     */

  }, {
    key: "_toStreamFromPDF",
    value: function _toStreamFromPDF(content, filepath) {
      return content.toStream(function (err, stream) {
        return stream.pipe(_fs["default"].createWriteStream(filepath));
      });
    }
    /**
     * @description Overrides i18n configuration
     * @param config
     * @private
     */

  }, {
    key: "_i18nConfigure",
    value: function _i18nConfigure(config) {
      this._defaultLocale = config && config.defaultLocale ? config.defaultLocale : 'en';
      this._availableLocale = config && config.locales ? config.locales : ['en', 'fr'];
      if (config) _i18n["default"].configure(config);
    }
    /**
     * @description Loads html-pdf module if available
     * @returns {*}
     * @private
     */

  }, {
    key: "_loadHtmlToPdf",
    value: function _loadHtmlToPdf() {
      try {
        /* eslint import/no-unresolved: [2, { ignore: ['html-pdf'] }] */
        return require('html-pdf'); // eslint-disable-line global-require
      } catch (err) {
        throw new Error('Cannot load html-pdf. Try installing it: npm i -S html-pdf@2.2.0');
      }
    }
  }, {
    key: "template",
    get: function get() {
      return this._template;
    },
    set: function set(value) {
      this._template = value;
    }
  }, {
    key: "lang",
    get: function get() {
      return !this._lang ? this._defaultLocale : this._lang;
    },
    set: function set(value) {
      var tmp = value.toLowerCase();
      if (!this._availableLocale.includes(tmp)) throw new Error("Wrong lang, please set one of ".concat(this._availableLocale.join(', ')));
      this._lang = tmp;
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    },
    set: function set(value) {
      this._id = value;
    }
  }, {
    key: "invoice_reference_pattern",
    get: function get() {
      return !this._invoice_reference_pattern ? '$prefix{IN}$date{YYMM}$separator{-}$id{00000}' : this._invoice_reference_pattern;
    },
    set: function set(value) {
      this._invoice_reference_pattern = value;
    }
  }, {
    key: "reference",
    get: function get() {
      return this._reference;
    },
    set: function set(value) {
      this._reference = value;
    }
  }, {
    key: "logo",
    get: function get() {
      return this._logo;
    },
    set: function set(value) {
      this._logo = value;
    }
  }, {
    key: "invoice_template",
    get: function get() {
      return this._invoice_template;
    },
    set: function set(value) {
      this._invoice_template = value;
    }
  }, {
    key: "date_format",
    get: function get() {
      return !this._date_format ? 'YYYY/MM/DD' : this._date_format;
    },
    set: function set(value) {
      this._date_format = value;
    }
  }, {
    key: "date",
    get: function get() {
      return !this._date ? (0, _moment["default"])().format(this.date_format) : this._date;
    },
    set: function set(value) {
      if (!(0, _moment["default"])(value).isValid()) throw new Error('Date not valid');
      this._date = (0, _moment["default"])(value).format(this.date_format);
    }
  }, {
    key: "statement_heading",
    get: function get() {
      return this._statement_heading;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._statement_heading = value;
    }
  }, {
    key: "reference_info",
    get: function get() {
      return this._reference_info;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._reference_info = value;
    }
  }, {
    key: "statement_conclusion",
    get: function get() {
      return this._statement_conclusion;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._statement_conclusion = value;
    }
  }, {
    key: "recipient",
    get: function get() {
      return this._recipient;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._recipient = value;
    }
  }, {
    key: "article_headers",
    get: function get() {
      return this._article_headers;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      var tmp = value;
      this._article_headers = this._article_headers ? this._article_headers.concat(tmp) : [].concat(tmp);
    }
  }, {
    key: "articles",
    get: function get() {
      return this._articles;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      var tmp = value;
      this._articles = this._articles ? this._articles.concat(tmp) : [].concat(tmp);
    }
  }, {
    key: "template_configuration",
    get: function get() {
      return this._template_configuration;
    }
    /**
     * @description Set
     * @param value
     */
    ,
    set: function set(value) {
      this._template_configuration = value;
    }
  }]);

  return Generator;
}(_common["default"]);

exports["default"] = Generator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL2dlbmVyYXRvci5qcyJdLCJuYW1lcyI6WyJHZW5lcmF0b3IiLCJjb25maWciLCJfcmVjaXBpZW50IiwiX3N0YXRlbWVudF9oZWFkaW5nIiwiX3JlZmVyZW5jZV9pbmZvIiwiX3N0YXRlbWVudF9jb25jbHVzaW9uIiwiX2FydGljbGVfaGVhZGVycyIsIl9hcnRpY2xlcyIsIl90ZW1wbGF0ZV9jb25maWd1cmF0aW9uIiwiX2kxOG5Db25maWd1cmUiLCJsYW5ndWFnZSIsImh5ZHJhdGUiLCJnbG9iYWwiLCJfaXRlbXNUb0h5ZHJhdGUiLCJfdG90YWxfaW5jX3RheGVzIiwiX3RvdGFsX3RheGVzIiwiX3RvdGFsX2V4Y190YXhlcyIsImxvZ28iLCJoZWFkZXJfZGF0ZSIsImRhdGUiLCJmcm9tdG9fcGhvbmUiLCJpMThuIiwiX18iLCJwaHJhc2UiLCJsb2NhbGUiLCJsYW5nIiwiZnJvbXRvX21haWwiLCJyZWNpcGllbnQiLCJzdGF0ZW1lbnRfaGVhZGluZyIsInN0YXRlbWVudF9jb25jbHVzaW9uIiwiYXJ0aWNsZV9oZWFkZXJzIiwiYXJ0aWNsZXMiLCJ0ZW1wbGF0ZV9jb25maWd1cmF0aW9uIiwibW9tZW50Iiwia2V5cyIsInRlbXBsYXRlIiwiaW52b2ljZV90ZW1wbGF0ZSIsImNvbXBpbGVkIiwicHVnIiwiY29tcGlsZUZpbGUiLCJwYXRoIiwicmVzb2x2ZSIsImludm9pY2VfaGVhZGVyX3RpdGxlIiwiaW52b2ljZV9oZWFkZXJfc3ViamVjdCIsInRhYmxlX25vdGVfY29udGVudCIsImludm9pY2Vfbm90ZSIsIm5vdGUiLCJmaWxlbmFtZSIsIk9iamVjdCIsImFzc2lnbiIsInRvSFRNTCIsIl90b0hUTUwiLCJ0b1BERiIsIm9wdGlvbnMiLCJfdG9QREYiLCJfcHJlQ29tcGlsZUNvbW1vblRyYW5zbGF0aW9ucyIsInR5cGUiLCJpbmNsdWRlcyIsIkVycm9yIiwicmVmZXJlbmNlIiwic2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4iLCJpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuIiwicGF0dGVybiIsInRtcCIsInNwbGl0Iiwic2xpY2UiLCJvdXRwdXQiLCJpdGVtIiwiZW5kc1dpdGgiLCJzdGFydHNXaXRoIiwicmVwbGFjZSIsImZvcm1hdCIsImlkIiwidGVzdCIsIl9pZCIsInBhZCIsImxlbmd0aCIsImh0bWwiLCJfY29tcGlsZSIsImdldEludm9pY2UiLCJ0b0ZpbGUiLCJmaWxlcGF0aCIsIl90b0ZpbGVGcm9tSFRNTCIsImh0bWxUb1BkZiIsIl9sb2FkSHRtbFRvUGRmIiwicGRmIiwiY3JlYXRlIiwiX3RvRmlsZUZyb21QREYiLCJ0b0J1ZmZlciIsIl90b0J1ZmZlckZyb21QREYiLCJ0b1N0cmVhbSIsIl90b1N0cmVhbUZyb21QREYiLCJjb250ZW50IiwiUHJvbWlzZSIsInJlamVjdCIsImZzIiwid3JpdGVGaWxlIiwiZXJyIiwicmVzIiwiYnVmZmVyIiwic3RyZWFtIiwicGlwZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwiX2RlZmF1bHRMb2NhbGUiLCJkZWZhdWx0TG9jYWxlIiwiX2F2YWlsYWJsZUxvY2FsZSIsImxvY2FsZXMiLCJjb25maWd1cmUiLCJyZXF1aXJlIiwiX3RlbXBsYXRlIiwidmFsdWUiLCJfbGFuZyIsInRvTG93ZXJDYXNlIiwiam9pbiIsIl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuIiwiX3JlZmVyZW5jZSIsIl9sb2dvIiwiX2ludm9pY2VfdGVtcGxhdGUiLCJfZGF0ZV9mb3JtYXQiLCJfZGF0ZSIsImRhdGVfZm9ybWF0IiwiaXNWYWxpZCIsImNvbmNhdCIsIkNvbW1vbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRXFCQSxTOzs7OztBQUNuQixxQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUFBOztBQUNsQjtBQUNBLFVBQUtDLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxVQUFLQyxrQkFBTCxHQUEwQixFQUExQjtB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TyxLQUFLMUcsZUFBWjtBQUNEO0FBRUQ7Ozs7O3NCQUltQjBHLEssRUFBTztBQUN4QixXQUFLMUcsZUFBTCxHQUF1QjBHLEtBQXZCO0FBQ0Q7Ozt3QkFFMEI7QUFDekIsYUFBTyxLQUFLekcscUJBQVo7QUFDRDtBQUVEOzs7OztzQkFJeUJ5RyxLLEVBQU87QUFDOUIsV0FBS3pHLHFCQUFMLEdBQTZCeUcsS0FBN0I7QUFDRDs7O3dCQUVlO0FBQ2QsYUFBTyxLQUFLNUcsVUFBWjtBQUNEO0FBRUQ7Ozs7O3NCQUljNEcsSyxFQUFPO0FBQ25CLFdBQUs1RyxVQUFMLEdBQWtCNEcsS0FBbEI7QUFDRDs7O3dCQUVxQjtBQUNwQixhQUFPLEtBQUt4RyxnQkFBWjtBQUNEO0FBRUQ7Ozs7O3NCQUlvQndHLEssRUFBTztBQUN6QixVQUFNL0MsR0FBRyxHQUFHK0MsS0FBWjtBQUNBLFdBQUt4RyxnQkFBTCxHQUF5QixLQUFLQSxnQkFBTixHQUEwQixLQUFLQSxnQkFBTCxDQUFzQm9ILE1BQXRCLENBQTZCM0QsR0FBN0IsQ0FBMUIsR0FBOEQsR0FBRzJELE1BQUgsQ0FBVTNELEdBQVYsQ0FBdEY7QUFDRDs7O3dCQUdjO0FBQ2IsYUFBTyxLQUFLeEQsU0FBWjtBQUNEO0FBRUQ7Ozs7O3NCQUlhdUcsSyxFQUFPO0FBQ2xCLFVBQU0vQyxHQUFHLEdBQUcrQyxLQUFaO0FBQ0EsV0FBS3ZHLFNBQUwsR0FBa0IsS0FBS0EsU0FBTixHQUFtQixLQUFLQSxTQUFMLENBQWVtSCxNQUFmLENBQXNCM0QsR0FBdEIsQ0FBbkIsR0FBZ0QsR0FBRzJELE1BQUgsQ0FBVTNELEdBQVYsQ0FBakU7QUFDRDs7O3dCQVk0QjtBQUMzQixhQUFPLEtBQUt2RCx1QkFBWjtBQUNEO0FBRUQ7Ozs7O3NCQUkyQnNHLEssRUFBTztBQUNoQyxXQUFLdEcsdUJBQUwsR0FBK0JzRyxLQUEvQjtBQUNEOzs7O0VBeExvQ2Esa0IiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBwdWcgZnJvbSAncHVnJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBDb21tb24gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IGkxOG4gZnJvbSAnLi4vbGliL2kxOG4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHZW5lcmF0b3IgZXh0ZW5kcyBDb21tb24ge1xuICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3JlY2lwaWVudCA9IHt9O1xuICAgIHRoaXMuX3N0YXRlbWVudF9oZWFkaW5nID0ge307XG4gICAgdGhpcy5fcmVmZXJlbmNlX2luZm8gPSB7fTtcbiAgICB0aGlzLl9zdGF0ZW1lbnRfY29uY2x1c2lvbiA9IHt9O1xuICAgIHRoaXMuX2FydGljbGVfaGVhZGVycyA9IFtdO1xuICAgIHRoaXMuX2FydGljbGVzID0gW107XG4gICAgdGhpcy5fdGVtcGxhdGVfY29uZmlndXJhdGlvbiA9IHt9O1xuICAgIHRoaXMuX2kxOG5Db25maWd1cmUoY29uZmlnLmxhbmd1YWdlKTtcbiAgICB0aGlzLmh5ZHJhdGUoY29uZmlnLmdsb2JhbCwgdGhpcy5faXRlbXNUb0h5ZHJhdGUoKSk7XG4gIH1cblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlO1xuICB9XG5cbiAgc2V0IHRlbXBsYXRlKHZhbHVlKSB7XG4gICAgdGhpcy5fdGVtcGxhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBsYW5nKCkge1xuICAgIHJldHVybiAoIXRoaXMuX2xhbmcpID8gdGhpcy5fZGVmYXVsdExvY2FsZSA6IHRoaXMuX2xhbmc7XG4gIH1cblxuICBzZXQgbGFuZyh2YWx1ZSkge1xuICAgIGNvbnN0IHRtcCA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKCF0aGlzLl9hdmFpbGFibGVMb2NhbGUuaW5jbHVkZXModG1wKSkgdGhyb3cgbmV3IEVycm9yKGBXcm9uZyBsYW5nLCBwbGVhc2Ugc2V0IG9uZSBvZiAke3RoaXMuX2F2YWlsYWJsZUxvY2FsZS5qb2luKCcsICcpfWApO1xuICAgIHRoaXMuX2xhbmcgPSB0bXA7XG4gIH1cblxuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgc2V0IGlkKHZhbHVlKSB7XG4gICAgdGhpcy5faWQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBpbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuKCkge1xuICAgIHJldHVybiAoIXRoaXMuX2ludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4pID8gJyRwcmVmaXh7SU59JGRhdGV7WVlNTX0kc2VwYXJhdG9yey19JGlkezAwMDAwfScgOiB0aGlzLl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuO1xuICB9XG5cbiAgc2V0IGludm9pY2VfcmVmZXJlbmNlX3BhdHRlcm4odmFsdWUpIHtcbiAgICB0aGlzLl9pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcmVmZXJlbmNlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWZlcmVuY2U7XG4gIH1cblxuICBzZXQgcmVmZXJlbmNlKHZhbHVlKSB7XG4gICAgdGhpcy5fcmVmZXJlbmNlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbG9nbygpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9nbztcbiAgfVxuXG4gIHNldCBsb2dvKHZhbHVlKSB7XG4gICAgdGhpcy5fbG9nbyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGludm9pY2VfdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ludm9pY2VfdGVtcGxhdGU7XG4gIH1cblxuICBzZXQgaW52b2ljZV90ZW1wbGF0ZSh2YWx1ZSkge1xuICAgIHRoaXMuX2ludm9pY2VfdGVtcGxhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBkYXRlX2Zvcm1hdCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9kYXRlX2Zvcm1hdCkgPyAnWVlZWS9NTS9ERCcgOiB0aGlzLl9kYXRlX2Zvcm1hdDtcbiAgfVxuXG4gIHNldCBkYXRlX2Zvcm1hdCh2YWx1ZSkge1xuICAgIHRoaXMuX2RhdGVfZm9ybWF0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgZGF0ZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLl9kYXRlKSA/IG1vbWVudCgpLmZvcm1hdCh0aGlzLmRhdGVfZm9ybWF0KSA6IHRoaXMuX2RhdGU7XG4gIH1cblxuICBzZXQgZGF0ZSh2YWx1ZSkge1xuICAgIGlmICghbW9tZW50KHZhbHVlKS5pc1ZhbGlkKCkpIHRocm93IG5ldyBFcnJvcignRGF0ZSBub3QgdmFsaWQnKTtcbiAgICB0aGlzLl9kYXRlID0gbW9tZW50KHZhbHVlKS5mb3JtYXQodGhpcy5kYXRlX2Zvcm1hdCk7XG4gIH1cblxuICBnZXQgc3RhdGVtZW50X2hlYWRpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlbWVudF9oZWFkaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTZXRcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICBzZXQgc3RhdGVtZW50X2hlYWRpbmcodmFsdWUpIHtcbiAgICB0aGlzLl9zdGF0ZW1lbnRfaGVhZGluZyA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IHJlZmVyZW5jZV9pbmZvKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWZlcmVuY2VfaW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgc2V0IHJlZmVyZW5jZV9pbmZvKHZhbHVlKSB7XG4gICAgdGhpcy5fcmVmZXJlbmNlX2luZm8gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzdGF0ZW1lbnRfY29uY2x1c2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGVtZW50X2NvbmNsdXNpb247XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFNldFxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHNldCBzdGF0ZW1lbnRfY29uY2x1c2lvbih2YWx1ZSkge1xuICAgIHRoaXMuX3N0YXRlbWVudF9jb25jbHVzaW9uID0gdmFsdWU7XG4gIH1cbiAgXG4gIGdldCByZWNpcGllbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlY2lwaWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgc2V0IHJlY2lwaWVudCh2YWx1ZSkge1xuICAgIHRoaXMuX3JlY2lwaWVudCA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IGFydGljbGVfaGVhZGVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fYXJ0aWNsZV9oZWFkZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTZXRcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICBzZXQgYXJ0aWNsZV9oZWFkZXJzKHZhbHVlKSB7XG4gICAgY29uc3QgdG1wID0gdmFsdWU7XG4gICAgdGhpcy5fYXJ0aWNsZV9oZWFkZXJzID0gKHRoaXMuX2FydGljbGVfaGVhZGVycykgPyB0aGlzLl9hcnRpY2xlX2hlYWRlcnMuY29uY2F0KHRtcCkgOiBbXS5jb25jYXQodG1wKTtcbiAgfVxuXG5cbiAgZ2V0IGFydGljbGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9hcnRpY2xlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0XG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgc2V0IGFydGljbGVzKHZhbHVlKSB7XG4gICAgY29uc3QgdG1wID0gdmFsdWU7XG4gICAgdGhpcy5fYXJ0aWNsZXMgPSAodGhpcy5fYXJ0aWNsZXMpID8gdGhpcy5fYXJ0aWNsZXMuY29uY2F0KHRtcCkgOiBbXS5jb25jYXQodG1wKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gUmVpbml0aWFsaXplIGFydGljbGVzIGF0dHJpYnV0ZVxuICAgKi9cbiAgZGVsZXRlQXJ0aWNsZXMoKSB7XG4gICAgdGhpcy5fdG90YWxfaW5jX3RheGVzID0gMDtcbiAgICB0aGlzLl90b3RhbF90YXhlcyA9IDA7XG4gICAgdGhpcy5fdG90YWxfZXhjX3RheGVzID0gMDtcbiAgICB0aGlzLl9hcnRpY2xlcyA9IFtdO1xuICB9XG5cbiAgZ2V0IHRlbXBsYXRlX2NvbmZpZ3VyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlX2NvbmZpZ3VyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFNldFxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIHNldCB0ZW1wbGF0ZV9jb25maWd1cmF0aW9uKHZhbHVlKSB7XG4gICAgdGhpcy5fdGVtcGxhdGVfY29uZmlndXJhdGlvbiA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBIeWRyYXRlIGZyb20gY29uZmlndXJhdGlvblxuICAgKiBAcmV0dXJucyB7W3N0cmluZyxzdHJpbmcsc3RyaW5nLHN0cmluZ119XG4gICAqL1xuICBfaXRlbXNUb0h5ZHJhdGUoKSB7XG4gICAgcmV0dXJuIFsnbG9nbycsICdpbnZvaWNlX3RlbXBsYXRlJywgJ2RhdGVfZm9ybWF0JywgJ2RhdGUnLCAnaW52b2ljZV9yZWZlcmVuY2VfcGF0dGVybicsICdpbnZvaWNlX25vdGUnLCAnbGFuZyddO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBQcmVjb21waWxlIHRyYW5zbGF0aW9uIHRvIG1lcmdpbmcgZ2xhYmFsIHdpdGggY3VzdG9tIHRyYW5zbGF0aW9uc1xuICAgKiBAcmV0dXJucyB7e2xvZ286ICosIGhlYWRlcl9kYXRlOiAqLCBmcm9tdG9fcGhvbmUsIGZyb210b19tYWlsLCBtb21lbnQ6ICgqfG1vbWVudC5Nb21lbnQpfX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9wcmVDb21waWxlQ29tbW9uVHJhbnNsYXRpb25zKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2dvOiB0aGlzLmxvZ28sXG4gICAgICBoZWFkZXJfZGF0ZTogdGhpcy5kYXRlLFxuICAgICAgZnJvbXRvX3Bob25lOiBpMThuLl9fKHtwaHJhc2U6ICdmcm9tdG9fcGhvbmUnLCBsb2NhbGU6IHRoaXMubGFuZ30pLFxuICAgICAgZnJvbXRvX21haWw6IGkxOG4uX18oe3BocmFzZTogJ2Zyb210b19tYWlsJywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHJlY2lwaWVudDogdGhpcy5fcmVjaXBpZW50LFxuICAgICAgc3RhdGVtZW50X2hlYWRpbmc6IHRoaXMuX3N0YXRlbWVudF9oZWFkaW5nLFxuICAgICAgc3RhdGVtZW50X2NvbmNsdXNpb246IHRoaXMuX3N0YXRlbWVudF9jb25jbHVzaW9uLFxuICAgICAgYXJ0aWNsZV9oZWFkZXJzOiB0aGlzLmFydGljbGVfaGVhZGVycyxcbiAgICAgIGFydGljbGVzOiB0aGlzLl9hcnRpY2xlcyxcbiAgICAgIHRlbXBsYXRlX2NvbmZpZ3VyYXRpb246IHRoaXMuX3RlbXBsYXRlX2NvbmZpZ3VyYXRpb24sXG4gICAgICBtb21lbnQ6IG1vbWVudCgpLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIENvbXBpbGUgcHVnIHRlbXBsYXRlIHRvIEhUTUxcbiAgICogQHBhcmFtIGtleXNcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY29tcGlsZShrZXlzKSB7XG4gICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLmludm9pY2VfdGVtcGxhdGU7XG4gICAgY29uc3QgY29tcGlsZWQgPSBwdWcuY29tcGlsZUZpbGUocGF0aC5yZXNvbHZlKHRlbXBsYXRlKSk7XG4gICAgcmV0dXJuIGNvbXBpbGVkKGtleXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gaW52b2ljZSB0cmFuc2xhdGlvbiBrZXlzIG9iamVjdFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICovXG4gIGdldEludm9pY2UoKSB7XG4gICAgY29uc3Qga2V5cyA9IHtcbiAgICAgIGludm9pY2VfaGVhZGVyX3RpdGxlOiBpMThuLl9fKHtwaHJhc2U6ICdpbnZvaWNlX2hlYWRlcl90aXRsZScsIGxvY2FsZTogdGhpcy5sYW5nfSksXG4gICAgICBpbnZvaWNlX2hlYWRlcl9zdWJqZWN0OiBpMThuLl9fKHtwaHJhc2U6ICdpbnZvaWNlX2hlYWRlcl9zdWJqZWN0JywgbG9jYWxlOiB0aGlzLmxhbmd9KSxcbiAgICAgIHRhYmxlX25vdGVfY29udGVudDogdGhpcy5pbnZvaWNlX25vdGUsXG4gICAgICBub3RlOiAobm90ZSkgPT4gKChub3RlKSA/IHRoaXMuaW52b2ljZV9ub3RlID0gbm90ZSA6IHRoaXMuaW52b2ljZV9ub3RlKSxcbiAgICAgIGZpbGVuYW1lOiAnaW52b2ljZScsXG4gICAgfTtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihrZXlzLCB7XG4gICAgICB0b0hUTUw6ICgpID0+IHRoaXMuX3RvSFRNTChrZXlzKSxcbiAgICAgIHRvUERGOiAob3B0aW9ucykgPT4gdGhpcy5fdG9QREYoa2V5cyxvcHRpb25zKSxcbiAgICB9LCB0aGlzLl9wcmVDb21waWxlQ29tbW9uVHJhbnNsYXRpb25zKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm4gcmVmZXJlbmNlIGZyb20gcGF0dGVyblxuICAgKiBAcGFyYW0gdHlwZVxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4odHlwZSkge1xuICAgIGlmICghWydpbnZvaWNlJ10uaW5jbHVkZXModHlwZSkpIHRocm93IG5ldyBFcnJvcignVHlwZSBoYXZlIHRvIGJlIFwiaW52b2ljZVwiJyk7XG4gICAgaWYgKHRoaXMucmVmZXJlbmNlKSByZXR1cm4gdGhpcy5yZWZlcmVuY2U7XG4gICAgcmV0dXJuIHRoaXMuc2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4odGhpcy5pbnZvaWNlX3JlZmVyZW5jZV9wYXR0ZXJuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gU2V0IHJlZmVyZW5jZVxuICAgKiBAcGFyYW0gcGF0dGVyblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyBvcHRpbWl6ZSBpdFxuICAgKi9cbiAgc2V0UmVmZXJlbmNlRnJvbVBhdHRlcm4ocGF0dGVybikge1xuICAgIGNvbnN0IHRtcCA9IHBhdHRlcm4uc3BsaXQoJyQnKS5zbGljZSgxKTtcbiAgICBsZXQgb3V0cHV0ID0gJyc7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHRtcCkge1xuICAgICAgaWYgKCFpdGVtLmVuZHNXaXRoKCd9JykpIHRocm93IG5ldyBFcnJvcignV3JvbmcgcGF0dGVybiB0eXBlJyk7XG4gICAgICBpZiAoaXRlbS5zdGFydHNXaXRoKCdwcmVmaXh7JykpIG91dHB1dCArPSBpdGVtLnJlcGxhY2UoJ3ByZWZpeHsnLCAnJykuc2xpY2UoMCwgLTEpO1xuICAgICAgZWxzZSBpZiAoaXRlbS5zdGFydHNXaXRoKCdzZXBhcmF0b3J7JykpIG91dHB1dCArPSBpdGVtLnJlcGxhY2UoJ3NlcGFyYXRvcnsnLCAnJykuc2xpY2UoMCwgLTEpO1xuICAgICAgZWxzZSBpZiAoaXRlbS5zdGFydHNXaXRoKCdkYXRleycpKSBvdXRwdXQgKz0gbW9tZW50KCkuZm9ybWF0KGl0ZW0ucmVwbGFjZSgnZGF0ZXsnLCAnJykuc2xpY2UoMCwgLTEpKTtcbiAgICAgIGVsc2UgaWYgKGl0ZW0uc3RhcnRzV2l0aCgnaWR7JykpIHtcbiAgICAgICAgY29uc3QgaWQgPSBpdGVtLnJlcGxhY2UoJ2lkeycsICcnKS5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmICghL15cXGQrJC8udGVzdChpZCkpIHRocm93IG5ldyBFcnJvcihgSWQgbXVzdCBiZSBhbiBpbnRlZ2VyICgke2lkfSlgKTtcbiAgICAgICAgb3V0cHV0ICs9ICh0aGlzLl9pZCkgPyB0aGlzLnBhZCh0aGlzLl9pZCwgaWQubGVuZ3RoKSA6IHRoaXMucGFkKDAsIGlkLmxlbmd0aCk7XG4gICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKGAke2l0ZW19IHBhdHRlcm4gcmVmZXJlbmNlIHVua25vd25gKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gRXhwb3J0IG9iamVjdCB3aXRoIGh0bWwgY29udGVudCBhbmQgZXhwb3J0YXRpb24gZnVuY3Rpb25zXG4gICAqIEByZXR1cm5zIHt7aHRtbDogKiwgdG9GaWxlOiAoZnVuY3Rpb24oKik6ICopfX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0hUTUwoa2V5cykge1xuICAgIGNvbnN0IGh0bWwgPSB0aGlzLl9jb21waWxlKHRoaXMuZ2V0SW52b2ljZSgpKTtcbiAgICByZXR1cm4ge1xuICAgICAgaHRtbCxcbiAgICAgIHRvRmlsZTogKGZpbGVwYXRoKSA9PiB0aGlzLl90b0ZpbGVGcm9tSFRNTChodG1sLCAoZmlsZXBhdGgpIHx8IGAke2tleXMuZmlsZW5hbWV9Lmh0bWxgKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTYXZlIGNvbnRlbnQgdG8gcGRmIGZpbGVcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdG9QREYoa2V5cywgb3B0aW9ucykge1xuICAgIGNvbnN0IGh0bWxUb1BkZiA9IHRoaXMuX2xvYWRIdG1sVG9QZGYoKTtcbiAgICBjb25zdCBwZGYgPSBodG1sVG9QZGYuY3JlYXRlKHRoaXMuX3RvSFRNTChrZXlzKS5odG1sLCBvcHRpb25zXG4gICAgKTtcbiAgICByZXR1cm4ge1xuICAgICAgcGRmLFxuICAgICAgdG9GaWxlOiAoZmlsZXBhdGgpID0+IHRoaXMuX3RvRmlsZUZyb21QREYocGRmLCAoZmlsZXBhdGgpIHx8IGAke2tleXMuZmlsZW5hbWV9LnBkZmApLFxuICAgICAgdG9CdWZmZXI6ICgpID0+IHRoaXMuX3RvQnVmZmVyRnJvbVBERihwZGYpLFxuICAgICAgdG9TdHJlYW06IChmaWxlcGF0aCkgPT4gdGhpcy5fdG9TdHJlYW1Gcm9tUERGKHBkZiwgKGZpbGVwYXRoKSB8fCBgJHtrZXlzLmZpbGVuYW1lfS5wZGZgKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBTYXZlIGNvbnRlbnQgaW50byBmaWxlIGZyb20gdG9IVE1MKCkgbWV0aG9kXG4gICAqIEBwYXJhbSBjb250ZW50XG4gICAqIEBwYXJhbSBmaWxlcGF0aFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b0ZpbGVGcm9tSFRNTChjb250ZW50LCBmaWxlcGF0aCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiBmcy53cml0ZUZpbGUoZmlsZXBhdGgsIGNvbnRlbnQsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJlamVjdChlcnIpO1xuICAgICAgcmV0dXJuIHJlc29sdmUoKTtcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIFNhdmUgY29udGVudCBpbnRvIGZpbGUgZnJvbSB0b1BERigpIG1ldGhvZFxuICAgKiBAcGFyYW0gY29udGVudFxuICAgKiBAcGFyYW0gZmlsZXBhdGhcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdG9GaWxlRnJvbVBERihjb250ZW50LCBmaWxlcGF0aCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiBjb250ZW50LnRvRmlsZShmaWxlcGF0aCwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICByZXR1cm4gcmVzb2x2ZShyZXMpO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb24gRXhwb3J0IFBERiB0byBidWZmZXJcbiAgICogQHBhcmFtIGNvbnRlbnRcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdG9CdWZmZXJGcm9tUERGKGNvbnRlbnQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gY29udGVudC50b0J1ZmZlcigoZXJyLCBidWZmZXIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgIHJldHVybiByZXNvbHZlKGJ1ZmZlcik7XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBFeHBvcnQgUERGIHRvIGZpbGUgdXNpbmcgc3RyZWFtXG4gICAqIEBwYXJhbSBjb250ZW50XG4gICAqIEBwYXJhbSBmaWxlcGF0aFxuICAgKiBAcmV0dXJucyB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90b1N0cmVhbUZyb21QREYoY29udGVudCwgZmlsZXBhdGgpIHtcbiAgICByZXR1cm4gY29udGVudC50b1N0cmVhbSgoZXJyLCBzdHJlYW0pID0+IHN0cmVhbS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZpbGVwYXRoKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBPdmVycmlkZXMgaTE4biBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBjb25maWdcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pMThuQ29uZmlndXJlKGNvbmZpZykge1xuICAgIHRoaXMuX2RlZmF1bHRMb2NhbGUgPSAoY29uZmlnICYmIGNvbmZpZy5kZWZhdWx0TG9jYWxlKSA/IGNvbmZpZy5kZWZhdWx0TG9jYWxlIDogJ2VuJztcbiAgICB0aGlzLl9hdmFpbGFibGVMb2NhbGUgPSAoY29uZmlnICYmIGNvbmZpZy5sb2NhbGVzKSA/IGNvbmZpZy5sb2NhbGVzIDogWydlbicsICdmciddO1xuICAgIGlmIChjb25maWcpIGkxOG4uY29uZmlndXJlKGNvbmZpZyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uIExvYWRzIGh0bWwtcGRmIG1vZHVsZSBpZiBhdmFpbGFibGVcbiAgICogQHJldHVybnMgeyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbG9hZEh0bWxUb1BkZigpIHtcbiAgICB0cnkge1xuICAgICAgLyogZXNsaW50IGltcG9ydC9uby11bnJlc29sdmVkOiBbMiwgeyBpZ25vcmU6IFsnaHRtbC1wZGYnXSB9XSAqL1xuICAgICAgcmV0dXJuIHJlcXVpcmUoJ2h0bWwtcGRmJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxvYWQgaHRtbC1wZGYuIFRyeSBpbnN0YWxsaW5nIGl0OiBucG0gaSAtUyBodG1sLXBkZkAyLjIuMCcpO1xuICAgIH1cbiAgfVxufVxuIl19