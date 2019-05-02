# invoice-generator

Generate your orders and you invoices and export them easily.
If you want some examples, check tests.

## Install
```
$ npm install invoice-generator --save
```

## Features

- Generate invoice
- Export to HTML / PDF / Stream
- Easy to use it


## Usage


### Importation

**From import**
```javascript
import invoiceGenerator from 'invoice-generator';
```

**From require**
```javascript
const invoiceGenerator = require('invoice-generator');
```

**If you want to export your invoice in PDF, you must install the *html-pdf (v2.2.0)* peer dependence**
```bash
$ npm i -S html-pdf@2.2.0
```

### Invoice

To generate an invoice:

```js
const invoiceGenerator = require('invoice-generator');

invoiceGenerator.configure({
  global: {
    logo:"https://vehiclesolutions.com.au/wp-content/uploads/2017/03/Vehicle-Solutions-logo.png",
    invoice_template: `${__dirname}/static/invoice.pug`,
    date: new Date(),
    date_format: "YY/MM/DD",
    lang: "en"
  }
});

const invoice = invoiceGenerator.create();

invoice.recipient = {
  title: "Ms",
  first_name: "Anne",
  last_name: "Haworth",
  street1: "3/288 Glen Osmond Road",
  street2: "FULLARTON SA 5063"
};
invoice.statement_conclusion = {
  Employee: "1409",
  "Payroll Id": "001409",
  Phone: "8338 4427",
  Email: "anne@vehiclesolutions.com.au"
};
invoice.statement_heading = {
  subject: "Activity Statement",
  subtitle: "Salary Packaging Statement for the period FBT year to date"
};
invoice.article_headers = [
  "Name",
  "Date",
  "Ref",
  "Inst#",
  "Description",
  "Debit",
  "Credit",
  "Balance"
];
invoice.articles = [
  [
    "Payroll Deduction",
    "24/08/2017",
    "144102894",
    "1",
    "Deduction",
    "525.20",
    "",
    "526.21 Cr"
  ]
];
```

Return invoice object
```js
invoice.getInvoice();
```

Return html invoice
```js
invoice.getInvoice().toHTML();
```

Save html invoice into file (default filepath: 'invoice.html')
```js
invoice.getInvoice().toHTML().toFile('./invoice.html')
  .then(() => {
      console.log('HTML file created.');
  });
```

Save html invoice into file (default filepath: 'invoice.pdf')
```js
const options = {
  timeout: "90000",
  border: {
    top: "10px",
    right: "10px",
    bottom: "10px",
    left: "10px"
  },
  header: {
    height: "10mm",
    contents:
      '<div style="padding:5px 10px 5px 10px;"><div style="float:left;">Activity Statement</div><div style="float:right;"><span style="color:#444;font-size: 50%;">Print No.: ' +
      require("uuid/v4")() +
      "</span></div></div>"
  },
  footer: {
    height: "10mm",
    contents: {
      default:
        '<div style="padding:5px 10px 5px 10px;"><div style="float:left;"><span>Page {{page}}</span> of <span>{{pages}}</span>  <span style="color:#444;font-size: 50%;">Generated ' +
        new Date() +
        "</span></div></div>"
    }
  }
};

invoice.getInvoice().toPDF(options).toFile('./invoice.pdf')
  .then(() => {
      console.log('PDF file created.');
  });
```

### i18n

To add more language:

```js
const invoiceGenerator = require('invoice-generator');

invoiceIt.configure({
  language: {
    locales: ['en', 'pl'],
    directory: `${__dirname}/path/to/locales`,
    defaultLocale: 'en'
  }
});
```

## Scripts

Run using npm run <script> command.

    clean - remove coverage data, Jest cache and transpiled files,
    test - run tests with coverage,
    test:watch - interactive watch mode to automatically re-run tests,
    build - compile source files,
    build:watch - interactive watch mode, compile sources on change.
