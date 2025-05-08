import express from "express"
import { ENV_VARS } from './config/envVars.js'

import userRoutes from './Routes/user.route.js'
import postRoutes from './Routes/post.route.js'
import { setupCache } from "./service/cacheService.js"

const app = express()
const PORT = ENV_VARS.PORT

setupCache();

app.use('/users', userRoutes)
app.use('/posts', postRoutes)


app.get('/', (req, res) => {
    res.json({
        message: 'Social Media Analytics API',
        endpoints: {
            users: '/users',
            posts: '/posts?type=popular|latest'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});