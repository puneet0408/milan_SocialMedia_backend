import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePic: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    minLength: 5,
    required: true,
    select: false
  },
  Bio: {
    type: String,
  },
  token: String,
  gender: {
    type: String,
  },
  passwordChangedAt: Date
});

const User = mongoose.model('User', userSchema);
export { User };

userSchema.methods.isPasswordChanged = async function   (JWTTimestamp){
   if(this.passwordChangedat){
    const paswdChangedTimestamp = parseInt( this.passwordChangedat.getTime() / 1000);

    
console.log(paswdChangedTimestamp , JWTTimestamp);

return JWTTimestamp < paswdChangedTimestamp;
   }
   return false
}