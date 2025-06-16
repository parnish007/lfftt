const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ✅ Generate PDF and return file path + name
function generatePDF(billData, outputDir = 'public/bills') {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `bill_${Date.now()}.pdf`;
    const filePath = path.join(outputDir, fileName);
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ✅ Header: Logo and Company Info
    const logoPath = path.join(__dirname, '../../public/logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 80 });
    }
    doc.fontSize(20).fillColor('#004a99').text('Life For Fun Travel & Tours Pvt. Ltd.', 150, 50);
    doc.fontSize(10).fillColor('black').text('Tilottama, Rupandehi, Nepal', 150, 72);
    doc.fontSize(10).text('Email: info@lifeforfuntravels.com | Phone: +977-9844757889', 150, 86);
    doc.moveDown(2);

    // ✅ Customer & Package Info
    doc.fontSize(14).text(`Bill To: ${billData.customerName}`);
    doc.text(`Email: ${billData.customerEmail}`);
    doc.text(`Package Type: ${billData.packageType}`);
    doc.text(`Package Name: ${billData.packageName}`);
    if (billData.origin) doc.text(`From: ${billData.origin}`);
    if (billData.destination) doc.text(`To: ${billData.destination}`);
    doc.text(`Issued On: ${new Date(billData.dateIssued).toLocaleDateString()}`);
    doc.moveDown();

    // ✅ Price
    const symbol = getCurrencySymbol(billData.price.currency);
    doc.fontSize(16).fillColor('black').text(
      `Total: ${symbol} ${billData.price.amount}`,
      { underline: true }
    );
    doc.moveDown();

    // ✅ Optional Notes
    if (billData.notes) {
      doc.fontSize(12).text(`Notes: ${billData.notes}`, {
        width: 400,
        align: 'left'
      });
    }

    // ✅ Footer
    doc.moveDown(4);
    doc.fontSize(10).fillColor('#777').text(
      'This is a system-generated invoice. For queries, contact support.',
      { align: 'center' }
    );

    doc.end();

    stream.on('finish', () => resolve({ fileName, filePath }));
    stream.on('error', reject);
  });
}

function getCurrencySymbol(code) {
  const symbols = {
    NPR: '₨',
    INR: '₹',
    USD: '$',
    EUR: '€',
    DKK: 'kr'
  };
  return symbols[code] || '₨';
}

module.exports = generatePDF;
