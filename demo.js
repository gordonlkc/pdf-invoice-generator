const invoiceGenerator = require("./src/index");

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

invoice.template_configuration = {
  subject: "Activity Statement",
  subtitle: "Salary Packaging Statement for the period FBT year to date"
  };

console.log(invoice);

invoice
.getInvoice()
.toPDF(options)
.toBuffer()
.then((result) => {
  console.log(result);
})
.catch((error)=>{
  console.log(error);
})

invoice
.getInvoice()
.toHTML()
.toFile("./invoice.html")
.then(() => {
  console.log("file created.");
});
