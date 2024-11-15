const { createCanvas, GlobalFonts, loadImage } = require("@napi-rs/canvas"); // Importa las funciones necesarias para crear y gestionar un canvas, fuentes y cargar imágenes.

const backgroundPath = "./Assets/Image/background.png"; // Especifica la ruta de la imagen de fondo que se usará en la bienvenida.
const fontPath = "./Assets/Fonts/Quicksand_Bold.otf"; // Especifica la ruta de la fuente que se utilizará en la bienvenida.
const subTitulo = "Bienvenid@ al Servidor"; // Define el subtítulo que se mostrará en la pantalla de bienvenida.
const avatarRadius = 150; // Define el radio del círculo en el que se mostrará el avatar del usuario que ingresa.

GlobalFonts.registerFromPath(fontPath, "Quicksand"); // Registra la fuente 'Quicksand' para su uso en el canvas.

module.exports = async (member) => {
  // Exporta una función asíncrona que recibe un objeto 'member'.
  const username = member.user.username; // Obtiene el nombre de usuario del miembro que acaba de unirse.
  const avatar = member.user.displayAvatarURL({ size: 256, extension: "png" }); // Obtiene la URL del avatar del usuario en formato PNG con tamaño de 256x256.

  const canvas = createCanvas(1200, 600); // Crea un canvas de 1200 píxeles de ancho por 600 píxeles de alto.
  const ctx = canvas.getContext("2d"); // Obtiene el contexto 2D del canvas para realizar dibujos.

  // Configuración de la sombra para el fondo.
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Establece el color de la sombra en negro con 50% de opacidad.
  ctx.shadowBlur = 15; // Define el desenfoque de la sombra.
  ctx.shadowOffsetX = 5; // Desplaza la sombra 5 píxeles hacia la derecha en el eje X.
  ctx.shadowOffsetY = 5; // Desplaza la sombra 5 píxeles hacia abajo en el eje Y.

  const background = await loadImage(backgroundPath); // Carga la imagen de fondo de la ruta especificada en 'backgroundPath'.
  const margin = 20; // Define un margen de 20 píxeles para el fondo.
  ctx.drawImage(
    // Dibuja la imagen de fondo en el canvas.
    background,
    margin, // Posición X (margen desde el borde izquierdo).
    margin, // Posición Y (margen desde el borde superior).
    canvas.width - margin * 2, // Ancho ajustado del fondo restando dos márgenes.
    canvas.height - margin * 2 // Alto ajustado del fondo restando dos márgenes.
  );

  // Función para dibujar texto (nombre de usuario y subtítulo).
  const drawText = (text, fontSize, yOffset) => {
    ctx.font = `${fontSize}px Quicksand`; // Establece el tamaño y la fuente del texto a 'Quicksand'.
    ctx.fillStyle = "white"; // Establece el color del texto como blanco.
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)"; // Establece el color de la sombra para el texto en negro con 80% de opacidad.
    ctx.shadowBlur = 5; // Define el desenfoque de la sombra para el texto.

    const metrics = ctx.measureText(text); // Mide el ancho del texto para centrarlo.
    ctx.fillText(
      // Dibuja el texto en el canvas.
      text,
      canvas.width / 2 - metrics.width / 2, // Calcula la posición X para centrar el texto.
      (canvas.height * 3) / 4 + yOffset // Posición Y ajustada por yOffset.
    );
  };

  drawText(username, 80, 0); // Llama a la función drawText para dibujar el nombre de usuario con tamaño 80 y sin desplazamiento.
  drawText(subTitulo, 50, 60); // Llama a la función drawText para dibujar el subtítulo con tamaño 50 y desplazamiento de 60 píxeles.

  // Dibujo del avatar del usuario.
  const avatarImage = await loadImage(avatar); // Carga la imagen del avatar del usuario a partir de la URL.
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; // Establece la sombra para el borde del avatar en negro con 40% de opacidad.

  // Creación del borde del avatar.
  ctx.beginPath(); // Inicia un nuevo camino para poder dibujar una figura.
  ctx.arc(canvas.width / 2, canvas.height / 3, avatarRadius, 0, Math.PI * 2); // Dibuja un círculo para el borde del avatar.
  ctx.closePath(); // Cierra el camino actual.
  ctx.fill(); // Rellena el círculo del borde con el color de relleno actual, incluyendo la sombra.

  ctx.shadowColor = "transparent"; // Elimina la sombra para el dibujo del avatar en sí.

  ctx.beginPath(); // Inicia un nuevo camino para el recorte del avatar.
  ctx.arc(
    // Dibuja un círculo más pequeño para el área de recorte del avatar.
    canvas.width / 2,
    canvas.height / 3,
    avatarRadius - 5, // Usa un radio ligeramente menor para que se ajuste al círculo del borde.
    0,
    Math.PI * 2 // Dibuja un círculo completo.
  );
  ctx.closePath(); // Cierra el camino actual.
  ctx.clip(); // Recorta el canvas a la forma del círculo dibujado.

  ctx.drawImage(
    // Dibuja la imagen del avatar en el canvas.
    avatarImage,
    canvas.width / 2 - (avatarRadius - 5), // Posición X para centrar la imagen del avatar.
    canvas.height / 3 - (avatarRadius - 5), // Posición Y para centrar la imagen del avatar.
    avatarRadius * 2, // Ancho del avatar (diámetro del círculo).
    avatarRadius * 2 // Altura del avatar (diámetro del círculo).
  );

  return canvas.toBuffer("image/png"); // Convierte el contenido del canvas a un buffer en formato PNG y lo devuelve.
};
