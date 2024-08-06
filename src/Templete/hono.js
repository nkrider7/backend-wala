export const honojsTemplate = () => `
import { Hono } from "hono";
import { prettyJSON } from 'hono/pretty-json';
// For security purposes, use the .env file.
// Ensure that the .env file is available in the root directory, next to package.json.
// Download the dotenv package from npmjs.com.
// Use the import statement: "import dotenv from 'dotenv';"
// Then call dotenv.config(); to load environment variables.

const app = new Hono();
const port = process.env.PORT || 3000;

// Use the prettyJSON middleware for all routes.
app.use('*', prettyJSON());

// Starting endpoint of API.
app.get('/', (c) => c.text("Hello World from backend-wala"));

// Dynamic route to hit an endpoint of the API.
app.get('/:id', (c) => {
    const id = c.req.param('id');
    return c.json({
        id: id,
        success: true,
        message: "You successfully hit the /:id route"
    });
});

// Start the server.
app.listen(port, () => {
    try {
        console.log(\`Server listening at http://localhost:\${port}\`);
    } catch (error) {
        console.log('Server error:', error);
    }
});

export default app;
`;
