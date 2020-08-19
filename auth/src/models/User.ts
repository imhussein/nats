import { model, Schema, Document, Model } from "mongoose";
import { Password } from "../services/password";

enum UserModelMessages {
  USER_EMAIL_IS_REQUIRED = "Email is required",
  USER_PASSWORD_IS_REQUIRED = "Password is required",
}

interface UserAttributes {
  email: string;
  password: string;
}

interface UserDocument extends Document {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDocument> {
  buildUser: (attrs: UserAttributes) => UserDocument;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, UserModelMessages.USER_EMAIL_IS_REQUIRED],
      trim: true,
      validate: {
        validator: (value: string) => {
          if (!value && value === "") {
            return false;
          } else {
            return true;
          }
        },
        message: UserModelMessages.USER_EMAIL_IS_REQUIRED,
      },
    },
    password: {
      type: String,
      required: [true, UserModelMessages.USER_PASSWORD_IS_REQUIRED],
      validate: {
        validator: (password: string) => {
          if (!password && password === "") return false;
          else return true;
        },
        message: UserModelMessages.USER_PASSWORD_IS_REQUIRED,
      },
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  next();
});

userSchema.statics.buildUser = async function (attrs: UserAttributes) {
  return new User(attrs);
};

const User = model<UserDocument, UserModel>("user", userSchema, "User");
export { User };
