import express, { Application, Request, Response,NextFunction } from 'express'
import cors from 'cors';
import httpStatus from 'http-status';
import router from './app/Routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import cookieParser from 'cookie-parser'

const app: Application = express()

app.use(cors())
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api/v1", router)

// Testing route
// app.get('/', (req: Request, res: Response) => {
// res.send('Route is working!')
// })

//global error handler
app.use(globalErrorHandler);

// handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app