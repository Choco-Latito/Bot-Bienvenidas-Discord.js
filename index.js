const { Client } = require("discord.js"); // Importa la clase Client de discord.js.
const fs = require("fs"); // Importa el módulo fs para manejar archivos.
const path = require("path"); // Importa el módulo path para manejar rutas.
require("dotenv").config(); // Carga las variables de entorno desde .env.

const client = new Client({ intents: 53608447 }); // Crea una instancia del cliente de Discord con los intents.

fs.readdirSync("Events") // Lee la carpeta "Events" y filtra archivos .js.
  .filter((filename) => filename.endsWith(".js")) // Filtra solo archivos .js.
  .forEach((filename) => {
    // Itera sobre cada archivo filtrado.
    try {
      const listener = require(`./Events/${filename}`); // Requiere el archivo de evento.
      client.on(path.basename(filename, ".js"), listener); // Registra el listener en el cliente.
    } catch (error) {
      console.log(`Error al cargar el evento ${filename}`, error); // Muestra error si no se puede cargar.
    }
  });

client.login(process.env.TOKEN); // Inicia sesión en Discord con el token de las variables de entorno.
