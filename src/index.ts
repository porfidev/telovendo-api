import { serve } from '@hono/node-server'
import {authRoutes} from './routes/auth.routes.js';
import {consolesRoutes} from './routes/consoles.routes.js';
import {gameGenresRoutes} from './routes/gameGenres.routes.js';
import {gamesRoutes} from './routes/games.routes.js';
import {imagesRoutes} from './routes/images.routes.js';
import {userRoutes} from './routes/user.routes.js';
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

const allowed = ['http://localhost:5173', 'https://localhost']

app.use(
  '*',
  cors({
    origin: (origin) => allowed.includes(origin) ? origin : '',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)

app.get('/', (c) => {
  return c.text('Made with ❤️ by porfi.dev!')
})

app.route('/auth', authRoutes);
app.route('/users',userRoutes);
app.route('/genres',gameGenresRoutes);
app.route('/consoles',consolesRoutes);
app.route('/games',gamesRoutes);
app.route('/image', imagesRoutes);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
