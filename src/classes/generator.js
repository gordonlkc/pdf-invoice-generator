
import moment from 'moment';
import pug from 'pug';
import fs from 'fs';
import path from 'path';
import Common from './common';
import i18n from '../lib/i18n';

export default class Generator extends Common {
  constructor(config) {
    super();
    this._recipient = {};
    this._statement_heading = {};
    this._reference_info = {};
    this._statement_conclusion = {};
    this._article_headers = [];
    this._articles = [];
    this._template_configuration = {};
    this._i18nConfigure(config.language);
    this.hydrate(config.global, this._itemsToHydrate());
  }

  get template() {
    return this._template;
  }

  set template(value) {
    this._template = value;
  }

  get lang() {
    return (!this._lang) ? this._defaultLocale : this._lang;
  }

  set lang(value) {
    const tmp = value.toLowerCase();
    if (!this._availableLocale.includes(tmp)) throw new Error(`Wrong lang, please set one of ${this._availableLocale.join(', ')}`);
    this._lang = tmp;
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get invoice_reference_pattern() {
    return (!this._invoice_reference_pattern) ? '$prefix{IN}$date{YYMM}$separator{-}$id{00000}' : this._invoice_reference_pattern;
  }

  set invoice_reference_pattern(value) {
    this._invoice_reference_pattern = value;
  }

  get reference() {
    return this._reference;
  }

  set reference(value) {
    this._reference = value;
  }

  get logo() {
    return this._logo;
  }

  set logo(value) {
    this._logo = value;
  }

  get invoice_template() {
    return this._invoice_template;
  }

  set invoice_template(value) {
    this._invoice_template = value;
  }

  get date_format() {
    return (!this._date_format) ? 'YYYY/MM/DD' : this._date_format;
  }

  set date_format(value) {
    this._date_format = value;
  }

  get date() {
    return (!this._date) ? moment().format(this.date_format) : this._date;
  }

  set date(value) {
    if (!moment(value).isValid()) throw new Error('Date not valid');
    this._date = moment(value).format(this.date_format);
  }

  get statement_heading() {
    return this._statement_heading;
  }

  /**
   * @description Set
   * @param value
   */
  set statement_heading(value) {
    this._statement_heading = value;
  }

  get reference_info() {
    return this._reference_info;
  }

  /**
   * @description Set
   * @param value
   */
  set reference_info(value) {
    this._reference_info = value;
  }

  get statement_conclusion() {
    return this._statement_conclusion;
  }

  /**
   * @description Set
   * @param value
   */
  set statement_conclusion(value) {
    this._statement_conclusion = value;
  }
  
  get recipient() {
    return this._recipient;
  }

  /**
   * @description Set
   * @param value
   */
  set recipient(value) {
    this._recipient = value;
  }

  get article_headers() {
    return this._article_headers;
  }

  /**
   * @description Set
   * @param value
   */
  set article_headers(value) {
    const tmp = value;
    this._article_headers = (this._article_headers) ? this._article_headers.concat(tmp) : [].concat(tmp);
  }


  get articles() {
    return this._articles;
  }

  /**
   * @description Set
   * @param value
   */
  set articles(value) {
    const tmp = value;
    this._articles = (this._articles) ? this._articles.concat(tmp) : [].concat(tmp);
  }

  /**
   * @description Reinitialize articles attribute
   */
  deleteArticles() {
    this._total_inc_taxes = 0;
    this._total_taxes = 0;
    this._total_exc_taxes = 0;
    this._articles = [];
  }

  get template_configuration() {
    return this._template_configuration;
  }

  /**
   * @description Set
   * @param value
   */
  set template_configuration(value) {
    this._template_configuration = value;
  }

  /**
   * @description Hydrate from configuration
   * @returns {[string,string,string,string]}
   */
  _itemsToHydrate() {
    return ['logo', 'invoice_template', 'date_format', 'date', 'invoice_reference_pattern', 'invoice_note', 'lang'];
  }

  /**
   * @description Precompile translation to merging glabal with custom translations
   * @returns {{logo: *, header_date: *, fromto_phone, fromto_mail, moment: (*|moment.Moment)}}
   * @private
   */
  _preCompileCommonTranslations() {
    return {
      logo: this.logo,
      header_date: this.date,
      fromto_phone: i18n.__({phrase: 'fromto_phone', locale: this.lang}),
      fromto_mail: i18n.__({phrase: 'fromto_mail', locale: this.lang}),
      recipient: this._recipient,
      statement_heading: this._statement_heading,
      statement_conclusion: this._statement_conclusion,
      article_headers: this.article_headers,
      articles: this._articles,
      template_configuration: this._templateConfiguration,
      moment: moment(),
    };
  }

  /**
   * @description Compile pug template to HTML
   * @param keys
   * @returns {*}
   * @private
   */
  _compile(keys) {
    const template = this.invoice_template;
    const compiled = pug.compileFile(path.resolve(template));
    return compiled(keys);
  }

  /**
   * @description Return invoice translation keys object
   * @returns {*}
   */
  getInvoice() {
    const keys = {
      invoice_header_title: i18n.__({phrase: 'invoice_header_title', locale: this.lang}),
      invoice_header_subject: i18n.__({phrase: 'invoice_header_subject', locale: this.lang}),
      table_note_content: this.invoice_note,
      note: (note) => ((note) ? this.invoice_note = note : this.invoice_note),
      filename: 'invoice',
    };
    return Object.assign(keys, {
      toHTML: () => this._toHTML(keys),
      toPDF: (options) => this._toPDF(keys,options),
    }, this._preCompileCommonTranslations());
  }

  /**
   * @description Return reference from pattern
   * @param type
   * @return {*}
   */
  getReferenceFromPattern(type) {
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
  setReferenceFromPattern(pattern) {
    const tmp = pattern.split('$').slice(1);
    let output = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const item of tmp) {
      if (!item.endsWith('}')) throw new Error('Wrong pattern type');
      if (item.startsWith('prefix{')) output += item.replace('prefix{', '').slice(0, -1);
      else if (item.startsWith('separator{')) output += item.replace('separator{', '').slice(0, -1);
      else if (item.startsWith('date{')) output += moment().format(item.replace('date{', '').slice(0, -1));
      else if (item.startsWith('id{')) {
        const id = item.replace('id{', '').slice(0, -1);
        if (!/^\d+$/.test(id)) throw new Error(`Id must be an integer (${id})`);
        output += (this._id) ? this.pad(this._id, id.length) : this.pad(0, id.length);
      } else throw new Error(`${item} pattern reference unknown`);
    }
    return output;
  }

  /**
   * @description Export object with html content and exportation functions
   * @returns {{html: *, toFile: (function(*): *)}}
   * @private
   */
  _toHTML(keys) {
    const html = this._compile(this.getInvoice());
    return {
      html,
      toFile: (filepath) => this._toFileFromHTML(html, (filepath) || `${keys.filename}.html`),
    };
  }

  /**
   * @description Save content to pdf file
   * @returns {*}
   * @private
   */
  _toPDF(keys, options) {
    const htmlToPdf = this._loadHtmlToPdf();
    const pdf = htmlToPdf.create(this._toHTML(keys).html, options
    );
    return {
      pdf,
      toFile: (filepath) => this._toFileFromPDF(pdf, (filepath) || `${keys.filename}.pdf`),
      toBuffer: () => this._toBufferFromPDF(pdf),
      toStream: (filepath) => this._toStreamFromPDF(pdf, (filepath) || `${keys.filename}.pdf`),
    };
  }

  /**
   * @description Save content into file from toHTML() method
   * @param content
   * @param filepath
   * @returns {Promise}
   * @private
   */
  _toFileFromHTML(content, filepath) {
    return new Promise((resolve, reject) => fs.writeFile(filepath, content, (err) => {
      if (err) reject(err);
      return resolve();
    }));
  }

  /**
   * @description Save content into file from toPDF() method
   * @param content
   * @param filepath
   * @returns {Promise}
   * @private
   */
  _toFileFromPDF(content, filepath) {
    return new Promise((resolve, reject) => content.toFile(filepath, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    }));
  }

  /**
   * @description Export PDF to buffer
   * @param content
   * @returns {*}
   * @private
   */
  _toBufferFromPDF(content) {
    return new Promise((resolve, reject) => content.toBuffer((err, buffer) => {
      if (err) return reject(err);
      return resolve(buffer);
    }));
  }

  /**
   * @description Export PDF to file using stream
   * @param content
   * @param filepath
   * @returns {*}
   * @private
   */
  _toStreamFromPDF(content, filepath) {
    return content.toStream((err, stream) => stream.pipe(fs.createWriteStream(filepath)));
  }

  /**
   * @description Overrides i18n configuration
   * @param config
   * @private
   */
  _i18nConfigure(config) {
    this._defaultLocale = (config && config.defaultLocale) ? config.defaultLocale : 'en';
    this._availableLocale = (config && config.locales) ? config.locales : ['en', 'fr'];
    if (config) i18n.configure(config);
  }

  /**
   * @description Loads html-pdf module if available
   * @returns {*}
   * @private
   */
  _loadHtmlToPdf() {
    try {
      /* eslint import/no-unresolved: [2, { ignore: ['html-pdf'] }] */
      return require('html-pdf'); // eslint-disable-line global-require
    } catch (err) {
      throw new Error('Cannot load html-pdf. Try installing it: npm i -S html-pdf@2.2.0');
    }
  }
}
