import express, { request } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import admin from 'firebase-admin';
import FirebaseStorage from 'multer-firebase-storage';
import { uuid } from 'uuidv4';

import { fileURLToPath } from "url";
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from "./middleware/auth.js";
import { changeAvatar } from "./controllers/users.js";




//CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
//For local file saving (change to firebase)
//app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

//FIREBASE 
const serviceAccount = "./socialize.json";
export const fbInstance = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://socialize-5496f.appspot.com'
});
//Set firabase storage bucket
//const bucket = admin.storage().bucket();


//FILE STORAGE
/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });*/


//Set up multer for handling file uploads
const upload = multer({
  storage: FirebaseStorage({bucketName: 'socialize', public: true}, fbInstance)
});
//const storage = multer.memoryStorage();
//const upload = multer({ storage });


//Routes with files
//app.post('/auth/register', upload.single('picture'), register);
app.post('/auth/register', upload.single('picture'), async (req, res, next) => {
  req.body.imageUrl = req.file.publicUrl;
  req.body.imageName = req.file.originalname;
  next();
}, register);

app.post('/posts', verifyToken, upload.single('picture'), async(req, res, next) => {
  console.log(req.file.originalname)
  req.body.imageName = req.file.originalname;
  req.body.imageUrl = req.file.publicUrl;
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


//Set MongoDB
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  app.listen(PORT, () => console.log(`Server running on Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));