import mongoose from 'mongoose';
import { baseOpts } from './_base.js';

// Singleton document (key: "site"). Mixed map so the admin's data-setting/
// data-toggle fields persist verbatim without schema churn.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'site', unique: true },
    // Public-facing
    siteTitle: String, tagline: String, metaDesc: String,
    logo: String,
    address: String, email: String,
    phone1: String, phone2: String, phone3: String, whatsapp: String,
    port: String, airfreight: String,
    fb: String, ig: String, linkedin: String,
    stat1: String, stat2: String,
    // Admin-only profile
    adminName: String, adminEmail: String, adminPhone: String,
    // Toggles
    twofa: Boolean, loginAlerts: Boolean,
    notifyInquiries: Boolean, notifyOrders: Boolean,
    notifyStock: Boolean, notifyWeekly: Boolean, notifyMarketing: Boolean,
  },
  { ...baseOpts, minimize: false, strict: false }
);

// Fields the public website is allowed to read.
settingsSchema.statics.PUBLIC_FIELDS = [
  'siteTitle', 'tagline', 'metaDesc', 'logo', 'address', 'email',
  'phone1', 'phone2', 'phone3', 'whatsapp', 'port', 'airfreight',
  'fb', 'ig', 'linkedin', 'stat1', 'stat2',
];

export const Settings = mongoose.model('Settings', settingsSchema);
