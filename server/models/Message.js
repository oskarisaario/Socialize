import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  text : {
    type: String
  },
}, { timestamps: true} 
);

const Message = mongoose.model("Message", MessageSchema);
export default Message