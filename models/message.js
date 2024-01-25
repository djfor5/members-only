import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minLength: 3,
  },
  text: {
    type: String,
    required: true,
    minLength: 3,
  },
},
{
  timestamp: true,
});

const Message = mongoose.model('Message', MessageSchema);
export default Message;