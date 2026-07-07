import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

const blogSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true }, // rich text HTML format
    featuredImage: { type: String, default: '' }, // absolute URL or base64 data-URI
    category: { type: String, required: true, trim: true },
    tags: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    isPublished: { type: Boolean, default: true, index: true },
  },
  baseOpts
);

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

export const Blog = mongoose.model('Blog', blogSchema);
