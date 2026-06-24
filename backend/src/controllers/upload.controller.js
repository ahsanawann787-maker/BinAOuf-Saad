import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { fileUrl } from '../utils/upload.js';

// ADMIN — multipart single-file upload. Returns a servable absolute URL.
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file uploaded (field name: "file")');
  res.status(201).json({
    ok: true,
    data: {
      url: fileUrl(req.file.filename),
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});
