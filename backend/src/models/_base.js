// Shared schema options: expose business `id`, hide _id/__v, keep virtuals.
export const baseOpts = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret) {
      delete ret._id;
      return ret;
    },
  },
  toObject: { virtuals: true, versionKey: false },
};
