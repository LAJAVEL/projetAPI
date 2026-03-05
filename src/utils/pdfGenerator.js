const PDFDocument = require('pdfkit');
const http = require('http');
const https = require('https');

const downloadImageBuffer = (urlString, { timeoutMs = 2500, maxBytes = 1_000_000 } = {}) => {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(urlString);
    } catch {
      reject(new Error('invalid url'));
      return;
    }

    const client = parsed.protocol === 'https:' ? https : parsed.protocol === 'http:' ? http : null;
    if (!client) {
      reject(new Error('unsupported protocol'));
      return;
    }

    const req = client.get(parsed, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        downloadImageBuffer(res.headers.location, { timeoutMs, maxBytes }).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error('bad status'));
        return;
      }

      const chunks = [];
      let total = 0;
      res.on('data', (chunk) => {
        total += chunk.length;
        if (total > maxBytes) {
          req.destroy(new Error('too large'));
          return;
        }
        chunks.push(chunk);
      });
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });

    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
};

const generateConfigPDF = async (configuration, res) => {
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
    for (const [index, item] of configuration.components.entries()) {
      const component = item.component;
      if (component) {
        const price = item.priceAtTime || 0;
        const quantity = item.quantity || 1;
        const lineTotal = price * quantity;
        total += lineTotal;

        const startX = doc.x;
        const startY = doc.y;
        let textX = startX;
        let imageHeight = 0;

        if (component.image) {
          try {
            const buffer = await downloadImageBuffer(component.image);
            doc.image(buffer, startX, startY, { fit: [72, 72] });
            textX = startX + 84;
            imageHeight = 72;
          } catch {
          }
        }

        doc.fontSize(12).text(
          `${index + 1}. ${component.brand || ''} ${component.title || 'Composant inconnu'}`,
          textX,
          startY
        );
        doc.fontSize(10).text(
          `Prix unitaire: ${price.toFixed(2)} € | Quantité: ${quantity} | Total: ${lineTotal.toFixed(2)} €`,
          textX
        );

        const endY = Math.max(doc.y, startY + imageHeight);
        doc.y = endY + 6;
        doc.x = startX;
      } else {
        doc.fontSize(12).text(`${index + 1}. Composant supprimé ou indisponible`);
        doc.moveDown(0.5);
      }
    }
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
