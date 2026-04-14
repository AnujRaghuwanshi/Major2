export const initialProviderProfile = {
  name: "GreenCycle NGO",
  email: "provider@example.com",
  phone_no: "+91 98765 43210",
  address: "Sector 21, Noida",
  city: "Noida",
  dist: "Gautam Buddha Nagar",
  state: "Uttar Pradesh",
  country: "India",
  pincode: "201301",
  website: "https://example.org",
  role: "NGO / Kabadiwala",
};

export const initialRequests = [
  {
    id: "REQ-201",
    requester: "Aarav Residency",
    category: "Plastic collection",
    contact: "+91 91234 56789",
    scheduledDate: "2026-04-12",
    address: "Sector 21, Noida",
    quantity: "18 kg",
    status: "pending",
  },
  {
    id: "REQ-202",
    requester: "Sunita Verma",
    category: "Clothes donation",
    contact: "+91 91234 56789",
    scheduledDate: "2026-04-12",
    address: "Dwarka, New Delhi",
    quantity: "4 bags",
    status: "accepted",
  },
  {
    id: "REQ-203",
    requester: "Bluebird Apartments",
    category: "Paper recycling",
    contact: "+91 91234 56789",
    scheduledDate: "2026-04-13",
    address: "Indirapuram, Ghaziabad",
    quantity: "11 kg",
    status: "collected",
  },
  {
    id: "REQ-204",
    requester: "Neha Jain",
    category: "E-waste pickup",
    contact: "+91 91234 56789",
    scheduledDate: "2026-04-11",
    address: "Rohini, Delhi",
    quantity: "2 boxes",
    status: "completed",
  },
];

export const initialServices = [
  { id: 1, name: "Clothes donation", active: true, description: "Pickup and route reusable clothes for donation." },
  { id: 2, name: "Plastic collection", active: true, description: "Collect sorted plastic waste for recycling." },
  { id: 3, name: "Paper recycling", active: true, description: "Handle newspapers, cartons, and office paper." },
  { id: 4, name: "E-waste pickup", active: true, description: "Receive old electronics for safe disposal." },
];

export const initialAvailability = {
  weekdays: "Mon - Sat",
  hours: "09:00 AM - 06:00 PM",
  serviceAreas: ["Bhopal", "Indore", "Delhi"],
};
