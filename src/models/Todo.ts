import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  userId: string;
  title: string;
  status: string;
  parentTodoId?: string | null;
  isDeleted: boolean;
  createdAt: Date;
  childrenIds:string[]
}

const TodoSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  parentTodoId: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  childrenIds: [{ type: Schema.Types.ObjectId, ref: 'Todo' }],
});

export default mongoose.model<ITodo>("Todo", TodoSchema);
