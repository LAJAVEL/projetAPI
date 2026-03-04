const PDFDocument = require('pdfkit');

const generateConfigPDF = (configuration, res) => {
  const doc = new PDFDocument();

  // Pipe to response
  doc.pipe(res);

  // Use standard font to avoid issues
  doc.font('Helvetica');

  // Header
  doc.fontSize(25).text('Configuration PC', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Nom: ${configuration.name}`);
  // Check if user exists before accessing name
  const userName = configuration.user ? configuration.user.name : 'Inconnu';
  doc.text(`Utilisateur: ${userName}`);
  doc.text(`Date: ${new Date(configuration.createdAt).toLocaleDateString()}`);
  doc.moveDown();

  // Components List
  doc.fontSize(16).text('Composants:', { underline: true });
  doc.moveDown();

  let total = 0;

  if (configuration.components && configuration.components.length > 0) {
    configuration.components.forEach((item, index) => {
      // Check if component exists (it might have been deleted)
      const component = item.component;
      if (component) {
        const price = item.priceAtTime || 0;
        const quantity = item.quantity || 1;
        const lineTotal = price * quantity;
        total += lineTotal;

        doc.fontSize(12).text(`${index + 1}. ${component.brand || ''} ${component.title || 'Composant inconnu'}`);
        doc.fontSize(10).text(`   Prix unitaire: ${price.toFixed(2)} € | Quantité: ${quantity} | Total: ${lineTotal.toFixed(2)} €`);
        doc.moveDown(0.5);
      } else {
        doc.fontSize(12).text(`${index + 1}. Composant supprimé ou indisponible`);
        doc.moveDown(0.5);
      }
    });
  } else {
    doc.fontSize(12).text("Aucun composant dans cette configuration.");
  }

  // Total
  doc.moveDown();
  doc.fontSize(18).text(`Coût Total: ${total.toFixed(2)} €`, { align: 'right' });

  // Footer
  doc.end();
};

module.exports = generateConfigPDF;
