const fs = require('fs');
const cheerio = require('cheerio');

// Validar argumento (nombre de archivo sin extensión)
const fileBaseName = process.argv[2];
if (!fileBaseName) {
  console.error('❌ Debes indicar un nombre de archivo (sin extensión). Ejemplo:\nnode extract-reviews.js reviews');
  process.exit(1);
}

const outputFile = `${fileBaseName}.json`;

// Cargar HTML
const html = fs.readFileSync('reviews.html', 'utf8');
const $ = cheerio.load(html);

const reviews = [];

$('div.RHo1pe').each((_, el) => {
  const $el = $(el);

  // USER: buscar el primer div con una imagen y extraer el siguiente div con texto
  const user = $el.find('header div img').first().parent().next().text().trim();

  // DATE: está en el <span> justo después del bloque de estrellas
  const date = $el.find('header [role="img"]').parent().find('span').last().text().trim();

  // STARS: contar cuántos <svg> hay dentro del bloque de estrellas
  const stars = $el.find('header [role="img"] svg').length;

  // COMMENT: primer <div> después de <header>
  const comment = $el.children('header').next('div').text().trim();

  reviews.push({ user, date, stars, comment });
});

fs.writeFileSync(outputFile, JSON.stringify(reviews, null, 2), 'utf8');
console.log(`✅ Reviews guardadas en ${outputFile}`);
