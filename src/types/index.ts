// ─── Enums ────────────────────────────────────────────────────────────────────

export type BookingStatus = "received" | "in_progress" | "done" | "cancelled";
export type ServiceType = "lab" | "technician";
export type LeadStatus = "new" | "contacted" | "converted" | "closed";
export type PhotoType = "before" | "after";
export type DeviceLine = "iphone" | "ipad" | "samsung";

// ─── Catalog ──────────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Model {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  brand?: Brand;
}

export interface RepairType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  created_at: string;
}

export interface ModelRepair {
  id: string;
  model_id: string;
  repair_type_id: string;
  price: number;
  duration_min: number;
  is_active: boolean;
  created_at: string;
  model?: Model;
  repair_type?: RepairType;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  modelRepairId: string;
  modelId: string;
  modelName: string;
  brandName: string;
  repairName: string;
  price: number;
}

export interface CartState {
  items: CartItem[];
  serviceType: ServiceType;
  technicianFee: number;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  device_info: string | null;
  service_type: ServiceType;
  technician_fee: number;
  scheduled_at: string | null;
  status: BookingStatus;
  notes: string | null;
  total_price: number;
  gcal_event_id: string | null;
  created_at: string;
  updated_at: string;
  items?: BookingItem[];
}

export interface BookingItem {
  id: string;
  booking_id: string;
  model_repair_id: string;
  price_at_booking: number;
  model_name: string;
  repair_name: string;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: object; // Tiptap JSON
  excerpt: string | null;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  source: string;
  fb_lead_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  form_data: object | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface ReviewCache {
  id: string;
  source: string;
  author_name: string;
  rating: number;
  text: string;
  time: string;
  profile_photo: string | null;
  fetched_at: string;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export interface CalendarBlock {
  id: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  created_at: string;
}

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
}

// ─── Photos ───────────────────────────────────────────────────────────────────

export interface RepairPhoto {
  id: string;
  model_repair_id: string;
  image_url: string;
  photo_type: PhotoType;
  created_at: string;
}

// ─── Line FAQs ────────────────────────────────────────────────────────────────

export interface LineFaq {
  id: string;
  device_line: DeviceLine;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Shop ────────────────────────────────────────────────────────────────────

export interface ShopCategory {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}
