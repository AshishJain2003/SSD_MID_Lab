import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true,index : true },
  password: { type: String, required: true },
  classroom_id: {type: String, required:true,unique:true}
}); 

// Hash password before saving
teacherSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

teacherSchema.set("toJSON",{
  transform: (doc,ret)=>{
    delete ret.password;
    return ret;
  }
});

export default mongoose.model("Teacher", teacherSchema);
