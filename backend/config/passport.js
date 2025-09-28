import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Teacher from "../models/Teacher.js";
import TeachingAssistant from "../models/TeachingAssistant.js";
import bcrypt from "bcryptjs";

export const initPassport = () => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // First try to find a teacher
        const teacher = await Teacher.findOne({ username });
        if (teacher) {
          const isMatch = await teacher.comparePassword(password);
          if (isMatch) {
            return done(null, { ...teacher.toObject(), role: 'teacher' });
          }
        }

        // If not a teacher, try to find a TA
        const teachingAssistant = await TeachingAssistant.findOne({
          $or: [{ username }, { email: username }],
          isActive: true
        });
        
        if (teachingAssistant) {
          const isMatch = await bcrypt.compare(password, teachingAssistant.password);
          if (isMatch) {
            return done(null, { ...teachingAssistant.toObject(), role: 'ta' });
          }
        }

        return done(null, false, { message: "Incorrect username or password" });
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.role });
  });

  passport.deserializeUser(async (serializedUser, done) => {
    try {
      let user;
      if (serializedUser.role === 'teacher') {
        user = await Teacher.findById(serializedUser.id);
        if (user) user.role = 'teacher';
      } else if (serializedUser.role === 'ta') {
        user = await TeachingAssistant.findById(serializedUser.id);
        if (user) user.role = 'ta';
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
