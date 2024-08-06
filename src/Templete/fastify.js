export const fastifyTemplate = () => `
const fastify = require('fastify')({ logger: true });

/*
 * For better securety purpose use the .env file
 * you must be sure about .env is available in root directory of package.json file
 * download the dotenv package from npmjs.com
 * use the import statement "    import dotenv form 'dotenv'    "  
 * dotenv.config()
 * 
*/

const port = process.env.PORT || 3000;



// Declare a route
fastify.get('/', async (request, reply) => {
  return { message: 'Hello Backend Wala🍬 Fastify Server is running...' };
});

// Additional routes can be declared here

// Run the server
const start = async () => {
  try {
    await fastify.listen(port, '0.0.0.0');
    console.log(\`Server listening at http://localhost:\${port}\`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
`;
