import generator from './classes';

generator.configure({
  global: {
    logo: 'http://placehold.it/230x70&text=logo',
    invoice_template: `${__dirname}/static/invoice.pug`,
    date: new Date(),
    date_format: 'YY/MM/DD',
    lang: 'en',
  }
});

module.exports = generator;
