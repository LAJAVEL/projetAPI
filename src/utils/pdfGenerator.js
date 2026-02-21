const PDFDocument = require('pdfkit');

const generateConfigPDF = (configuration, res) => {
  const doc = new PDFDocument();

  // Pipe to response
  doc.pipe(res);

  // Header
  doc.fontSize(25).text('Configuration PC', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`Nom: ${configuration.name}`);
  doc.fontSize(14).text(`Utilisateur: ${configuration.user.name}`);
  doc.text(`Date: ${new Date(configuration.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  // Components List
  doc.fontSize(16).text('Composants:', { underline: true });
  doc.moveDown();

  let total = 0;

  configuration.components.forEach((item, index) => {
    const component = item.component;
    const price = item.priceAtTime;
    const quantity = item.quantity || 1;
    const lineTotal = price * quantity;
    total += lineTotal;

    doc.fontSize(12).text(`${index + 1}. ${component.brand} ${component.title}`);
    doc.fontSize(10).text(`   Prix unitaire: ${price.toFixed(2)} € | Quantité: ${quantity} | Total: ${lineTotal.toFixed(2)} €`);
    doc.moveDown(0.5);
  });

  // Total
  doc.moveDown();
  doc.fontSize(18).text(`Coût Total: ${total.toFixed(2)} €`, { align: 'right' });

  // Footer
  doc.end();
};

module.exports = generateConfigPDF;
