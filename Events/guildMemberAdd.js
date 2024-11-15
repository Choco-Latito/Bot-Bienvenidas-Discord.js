const { EmbedBuilder, AttachmentBuilder } = require("discord.js"); // Importamos clases de discord.js para crear embeds y archivos adjuntos.
const generateImage = require("../Utils/Canvas/welcomeImage"); // Importamos la función para generar la imagen de bienvenida.
require("dotenv").config(); // Cargamos las variables de entorno desde el archivo .env.

module.exports = async (member) => {
  // Generamos la imagen de bienvenida y la adjuntamos como archivo.
  const attachment = new AttachmentBuilder(await generateImage(member), {
    name: "generated-image.png",
  });

  // Creamos y configuramos el embed con la información del nuevo miembro.
  const embed = new EmbedBuilder()
    .setAuthor({
      name: member.client.user.username,
      iconURL: member.client.user.displayAvatarURL(),
    }) // Agregamos el autor del embed con la imagen del bot.
    .setTitle(`${member.user.displayName} bienvenido a la comunidad ✨`) // Establecemos el título del embed.
    .setThumbnail(member.user.displayAvatarURL()) // Establecemos el thumbnail como la foto de perfil del nuevo miembro.
    .setColor("Random") // Definimos el color del embed.
    .setDescription(
      `¡Bienvenido a la comunidad! Asegúrate de revisar las $NORMAS y los canales de verificación.\n\n¡Disfruta tu estancia!`
    ) // Añadimos una descripción al embed.
    .setImage("attachment://generated-image.png") // Agregamos la imagen generada como parte del embed.
    .setFooter({
      text: `Miembros en la comunidad: ${member.guild.memberCount}`,
      iconURL: member.guild.iconURL(),
    }); // Añadimos el pie de página con la cantidad de miembros y el icono del servidor.

  // Obtenemos el canal donde se enviará el mensaje, usando la variable de entorno para el ID del canal.
  const channel = member.guild.channels.cache.get(process.env.CHANNEL_ID);

  // Enviamos el mensaje al canal con el contenido, embed e imagen adjunta.
  await channel.send({
    content: `${member}`, // Mencionamos al nuevo miembro en el mensaje.
    embeds: [embed], // Incluimos el embed creado.
    files: [attachment], // Adjuntamos la imagen generada.
  });
};
