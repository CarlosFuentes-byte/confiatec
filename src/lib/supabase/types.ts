export type City = "San Pedro Sula" | "Tegucigalpa";

export type ServiceCategory = {
  id: number;
  name: string;
  icon_slug: string;
};

export type Profile = {
  id: string;
  role: "client" | "technician";
  full_name: string;
  phone: string | null;
  city: City | null;
  accepted_terms_at: string | null;
  avatar_url: string | null;
  wallet_balance: number;
};

export type WalletTransactionType = "topup" | "payment_sent" | "payment_received" | "premium";

export type WalletTransaction = {
  id: string;
  profile_id: string;
  amount: number;
  type: WalletTransactionType;
  service_request_id: string | null;
  description: string | null;
  created_at: string;
};

export type TechnicianProfile = {
  profile_id: string;
  category_id: number;
  bio: string | null;
  verified: boolean;
  featured: boolean;
  rating_avg: number;
  completed_count: number;
  police_record_url: string | null;
  criminal_record_url: string | null;
  verification_submitted_at: string | null;
};

export type TechnicianListItem = TechnicianProfile & {
  profiles: Pick<Profile, "full_name" | "city" | "avatar_url">;
  service_categories: Pick<ServiceCategory, "name" | "icon_slug">;
};

export type Review = {
  id: string;
  service_request_id: string;
  client_id: string;
  technician_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: Pick<Profile, "full_name">;
};

export type RequestStatus = "pending" | "accepted" | "completed" | "cancelled";

export type ServiceRequest = {
  id: string;
  client_id: string;
  technician_id: string | null;
  category_id: number;
  address_text: string;
  status: RequestStatus;
  created_at: string;
  technician_lat: number | null;
  technician_lng: number | null;
  location_updated_at: string | null;
  client_lat: number | null;
  client_lng: number | null;
};

export type Message = {
  id: string;
  service_request_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type ClientRequestRow = ServiceRequest & {
  technician: Pick<Profile, "full_name"> | null;
  service_categories: Pick<ServiceCategory, "name">;
  reviews: Pick<Review, "id" | "rating" | "comment">[];
};

export type TechnicianRequestRow = ServiceRequest & {
  client: Pick<Profile, "full_name">;
  service_categories: Pick<ServiceCategory, "name">;
};
