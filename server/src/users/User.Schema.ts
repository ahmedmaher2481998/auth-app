import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { HydratedDocument } from 'mongoose';

export interface IUserMethods {
  validatePassword(password: string): Promise<boolean>;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @Prop({
    type: String,
    default: null
  })
  hashedRT: string | null;

  @Prop({ default: Date.now })
  @IsDate()
  lastLogin: Date;

  @Prop({ default: Date.now })
  @IsDate()
  createdAt: Date;

  @Prop({ default: Date.now })
  @IsDate()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 
        10
      );
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Add method to validate password
UserSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
UserSchema.index({ email: 1 });
export type UserDocument = HydratedDocument<User> & IUserMethods;