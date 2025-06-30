const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const Vehicle = require('../models/Vehicle');
const Bill = require('../models/Bill');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const moment = require('moment');

const currencySymbols = {
  'NPR': '₨',
  'INR': '₹',
  'USD': '$',
  'EUR': '€',
  'DKK': 'kr'
};

// 📥 Get all accepted bookings not yet billed
exports.getBillableRequests = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'Confirmed', billed: { $ne: true } }); // ✅ Use 'Confirmed' for billing

    const result = await Promise.all(bookings.map(async (b) => {
      const dataSource = b.type === 'Vehicle' ? Vehicle : Tour;
      const item = await dataSource.findOne({ title: b.title });

      return {
        _id: b._id,
        name: b.name,
        email: b.email,
        phone: b.phone,
        type: b.type,
        title: b.title,
        currency: item?.currency || 'NPR',
        currencySymbol: currencySymbols[item?.currency] || '₨',
        price: item?.pricePerDay || item?.price || 0
      };
    }));

    res.json(result);
  } catch (err) {
    console.error("❌ Error in getBillableRequests:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📤 Send default PDF bill to user
exports.sendBillToUser = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.billed === true) {
      return res.status(404).json({ error: "Booking not found or already billed" });
    }

    const source = booking.type === 'Vehicle' ? Vehicle : Tour;
    const item = await source.findOne({ title: booking.title });

    const currency = item?.currency || 'NPR';
    const currencySymbol = currencySymbols[currency] || '₨';
    const price = item?.pricePerDay || item?.price || 0;

    const billId = `LFFTT-${booking._id}-${Date.now()}`;
    const pdfDir = path.join(__dirname, '../../public/bills'); // ✅ Save in public/bills so it's accessible
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `bill-${billId}.pdf`);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(22).fillColor('#004a99').text('Life For Fun Travel & Tours Pvt. Ltd.', { align: 'center' });
    doc.moveDown().fontSize(16).fillColor('black').text('Official Booking Bill', { align: 'center' });
    doc.moveDown().fontSize(12);

    doc.text(`Bill ID: ${billId}`);
    doc.text(`Date: ${moment().format("YYYY-MM-DD HH:mm")}`);
    doc.text(`Customer: ${booking.name}`);
    doc.text(`Email: ${booking.email}`);
    doc.text(`Phone: ${booking.phone || 'N/A'}`);
    doc.text(`Booking Type: ${booking.type}`);
    doc.text(`Package/Vehicle: ${booking.title}`);
    doc.text(`Amount: ${currencySymbol}${price}`);
    doc.moveDown().text(`Thank you for choosing Life For Fun Travel!`, { align: 'center' });

    doc.end();

    stream.on('finish', async () => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Life For Fun Travel" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: 'Your Travel Bill from Life For Fun Travel',
        text: 'Please find your attached bill below. Thank you!',
        attachments: [{ filename: `bill-${billId}.pdf`, path: pdfPath }]
      });

      await Bill.create({
        customerName: booking.name,
        customerEmail: booking.email,
        packageName: booking.title,
        price: { amount: price, currency: currency },
        billId: billId,
        packageType: booking.type,
        filePath: `/bills/bill-${billId}.pdf`
      });

      booking.billed = true;
      await booking.save();

      res.json({ message: "✅ Bill sent to customer!" });
    });

  } catch (err) {
    console.error("❌ Error sending bill:", err);
    res.status(500).json({ error: "Failed to send bill" });
  }
};

// 📤 Send custom bill
exports.sendCustomBill = async (req, res) => {
  try {
    const { customerName, customerEmail, packageName, amount, currency, description } = req.body;

    if (!customerName || !customerEmail || !packageName || !amount || !currency) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const currencySymbol = currencySymbols[currency] || '₨';
    const billId = `CUSTOM-${Date.now()}`;
    const pdfDir = path.join(__dirname, '../../public/bills');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    const pdfPath = path.join(pdfDir, `custom-bill-${billId}.pdf`);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(22).fillColor('#004a99').text('Life For Fun Travel & Tours Pvt. Ltd.', { align: 'center' });
    doc.moveDown().fontSize(16).fillColor('black').text('Custom Bill Receipt', { align: 'center' });
    doc.moveDown().fontSize(12);

    doc.text(`Bill ID: ${billId}`);
    doc.text(`Date: ${moment().format("YYYY-MM-DD HH:mm")}`);
    doc.text(`Customer: ${customerName}`);
    doc.text(`Email: ${customerEmail}`);
    doc.text(`Package: ${packageName}`);
    doc.text(`Amount: ${currencySymbol}${amount}`);
    if (description) {
      doc.moveDown().text(`Note: ${description}`);
    }

    doc.moveDown().text(`Generated by: Admin`, { align: 'right' });
    doc.moveDown().text(`Thank you for choosing Life For Fun Travel!`, { align: 'center' });

    doc.end();

    stream.on('finish', async () => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Life For Fun Travel" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: 'Custom Travel Bill - Life For Fun Travel',
        text: 'Attached is your custom bill. Thank you!',
        attachments: [{ filename: `custom-bill-${billId}.pdf`, path: pdfPath }]
      });

      await Bill.create({
        customerName,
        customerEmail,
        packageName,
        price: { amount, currency },
        billId,
        packageType: 'Custom',
        filePath: `/bills/custom-bill-${billId}.pdf`,
        adminEdited: true,
        isCustom: true,
        notes: description || ''
      });

      res.json({ message: "✅ Custom bill sent to customer!" });
    });

  } catch (err) {
    console.error("❌ Error sending custom bill:", err);
    res.status(500).json({ error: "Failed to send custom bill" });
  }
};
// 📥 Get only confirmed bookings (tours & vehicles) that are not yet billed
exports.getUnbilledConfirmedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'Confirmed', billed: { $ne: true } });

    const enriched = await Promise.all(bookings.map(async (b) => {
      const model = b.type === 'Vehicle' ? Vehicle : Tour;
      const matched = await model.findOne({ title: b.title });

      return {
        _id: b._id,
        name: b.name,
        email: b.email,
        type: b.type,
        title: b.title,
        currency: matched?.currency || 'NPR',
        currencySymbol: currencySymbols[matched?.currency] || '₨',
        price: matched?.pricePerDay || matched?.price || 'Negotiable',
        phone: b.phone || 'N/A'
      };
    }));

    res.json(enriched);
  } catch (err) {
    console.error("❌ Error in getUnbilledConfirmedBookings:", err);
    res.status(500).json({ error: "Failed to fetch unbilled bookings" });
  }
};
