import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['admin', 'member', 'guest'],
    default: 'guest',
  },
},
{
  timestamp: {
    createdAt: 'joinedAt',
  },
});

UserSchema.virtual("username").get(function () {
  return this.email;
});

const User = mongoose.model('User', UserSchema);
export default User;