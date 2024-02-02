import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
//import helmet from "helmet";
import morgan from "morgan";


import admin from 'firebase-admin';
import FirebaseStorage from 'multer-firebase-storage';


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from "./middleware/auth.js";
import { changeAvatar } from "./controllers/users.js";

//for build
import path from 'path';


const __dirname = path.resolve();

//CONFIGURATION
dotenv.config();
const app = express();
app.use(express.json());
//app.use(helmet());
/*app.use(
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://unpkg.com'],
        connectSrc: ["'self'", 'https://reqres.in']
      }
  })
  ));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));*/
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


//FIREBASE 
const serviceAccount = "./socialize.json";
export const fbInstance = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://socialize-5496f.appspot.com'
});


//Set up multer for handling file uploads
const upload = multer({
  storage: FirebaseStorage({bucketName: 'socialize', public: true}, fbInstance)
});


//Routes with files
app.post('/auth/register', upload.single('picture'), async (req, res, next) => {
  req.body.imageUrl = req.file.publicUrl;
  req.body.imageName = req.file.originalname;
  next();
}, register);


app.post('/posts', verifyToken, upload.single('picture'), async(req, res, next) => {
  if(typeof(req.file) !== 'undefined') {
    req.body.imageName = req.file.originalname;
    req.body.imageUrl = req.file.publicUrl;
  }
  next();
}, createPost);


app.patch('/users/:id/changeAvatar', verifyToken, upload.single('picture'), async(req, res, next) => {
  req.body.newImageUrl = req.file.publicUrl;
  req.body.imageName = req.file.originalname;
  next();
}, changeAvatar);


//Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

//for build
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})


//Set MongoDB
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));
