import { useEffect, useMemo, useState } from "react";
import AuthCard from "./components/AuthCard";
import RequestManagement from "./components/RequestManagement";
import ServiceManagement from "./components/ServiceManagement";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import {
  initialAvailability,
  initialProviderProfile,
  initialRequests,
  initialServices,
} from "./data/mockData";

const loginSeed = {
  email: "",
  password: "",
};

const signupSeed = {
  name: "",
  address: "",
  phone_no: "",
  email: "",
  password: "",
  website: "",
  dist: "",
  state: "",
  country: "",
  pincode: "",
  city: "",
};

const signupUrl = "http://localhost:4000/api/recycling-centers";
const loginUrl = "http://localhost:4000/api/recycling-centers/login";
const authStorageKey = "provider-dashboard-auth";
const profileStorageKey = "provider-dashboard-profile";
const servicesStorageKey = "provider-dashboard-services";

function readStoredJson(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function saveStoredJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeProfileData(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  return {
    ...initialProviderProfile,
    ...data,
    name: data.name || initialProviderProfile.name,
    email: data.email || initialProviderProfile.email,
    phone_no: data.phone_no || initialProviderProfile.phone_no,
    address: data.address || initialProviderProfile.address,
    city: data.city || initialProviderProfile.city,
    dist: data.dist || initialProviderProfile.dist,
    state: data.state || initialProviderProfile.state,
    country: data.country || initialProviderProfile.country,
    pincode: data.pincode || initialProviderProfile.pincode,
    website: data.website || initialProviderProfile.website,
    role: data.role || initialProviderProfile.role,
  };
}

function Overview({ requests, services, availability }) {
  const total = requests.length;
  const pending = requests.filter((item) => item.status === "pending").length;
  const accepted = requests.filter((item) => item.status === "accepted").length;
  const completed = requests.filter(
    (item) => item.status === "completed",
  ).length;
  const activeServices = services.filter((service) => service.active).length;

  return (
    <section className="overview-stack">
      <div className="stats-grid">
        <StatCard
          label="Total requests"
          value={total}
          hint="Scheduled pickups assigned to this center"
        />
        <StatCard
          label="Pending requests"
          value={pending}
          hint="Awaiting provider action"
        />
        <StatCard
          label="Accepted requests"
          value={accepted}
          hint="Ready for collection"
        />
        <StatCard
          label="Completed pickups"
          value={completed}
          hint="Closed successfully"
        />
      </div>

      <div className="overview-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live Snapshot</p>
              <h2>Operations summary</h2>
            </div>
          </div>
          <div className="summary-list">
            <div className="summary-item">
              <span>Active services</span>
              <strong>{activeServices}</strong>
            </div>
            <div className="summary-item">
              <span>Service days</span>
              <strong>{availability.weekdays}</strong>
            </div>
            <div className="summary-item">
              <span>Working hours</span>
              <strong>{availability.hours}</strong>
            </div>
            <div className="summary-item">
              <span>Coverage areas</span>
              <strong>{availability.serviceAreas.join(", ")}</strong>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Pickup Flow</p>
              <h2>Status journey</h2>
            </div>
          </div>
          <div className="timeline">
            <div className="timeline-step">
              <strong>1. Pending</strong>
              <p>Incoming request is assigned to the provider.</p>
            </div>
            <div className="timeline-step">
              <strong>2. Accepted</strong>
              <p>The center confirms the pickup and prepares fulfillment.</p>
            </div>
            <div className="timeline-step">
              <strong>3. Collected</strong>
              <p>Materials are picked up and recorded by the provider.</p>
            </div>
            <div className="timeline-step">
              <strong>4. Completed</strong>
              <p>The request is finished and visible in history and reports.</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default function App() {
  const [authMode, setAuthMode] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    readStoredJson(authStorageKey, false),
  );
  const [loginForm, setLoginForm] = useState(loginSeed);
  const [signupForm, setSignupForm] = useState(signupSeed);
  const [authState, setAuthState] = useState({
    loading: false,
    type: "",
    message: "",
  });
  const [activeView, setActiveView] = useState("overview");
  const [requestFilter, setRequestFilter] = useState("all");
  const [profile, setProfile] = useState(() =>
    readStoredJson(profileStorageKey, initialProviderProfile),
  );
  const [requests, setRequests] = useState(initialRequests);
  const [services, setServices] = useState(() => readStoredJson(servicesStorageKey, initialServices));
  const [availability, setAvailability] = useState(initialAvailability);

  useEffect(() => {
    saveStoredJson(servicesStorageKey, services);
  }, [services]);

  // Fetch real requests data
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const controller = new AbortController();

        const provider = JSON.parse(
          localStorage.getItem("provider-dashboard-profile"),
        );

        const centerId = provider._id;

        const response = await fetch(
          `http://localhost:4000/api/provider?center=${centerId}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const apiData = await response.json();
        const mappedRequests = apiData.map((item, index) => ({
          id: item._id,
          requester: item.name,
          address: `${item.address}${item.pincode ? `, ${item.pincode}` : ""}`,
          category: item.wasteType,
          contact: item.contact,
          scheduledDate: item.date,
          quantity: `${item.quantity} kg`,
          status:
            item.status === "Scheduled" ? "pending" : item.status.toLowerCase(),
        }));
        setRequests(mappedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setRequests(initialRequests); // Fallback to mock
      }
    };
    fetchRequests();
  }, []);

  const activeAuthForm = authMode === "login" ? loginForm : signupForm;

  function resetLoginForm() {
    setLoginForm(loginSeed);
  }

  function resetSignupForm() {
    setSignupForm(signupSeed);
  }

  function handleSwitchMode() {
    setAuthState({ loading: false, type: "", message: "" });
    resetLoginForm();
    resetSignupForm();
    setAuthMode((current) => (current === "login" ? "signup" : "login"));
  }

  const welcomeTitle = useMemo(() => {
    const hours = new Date().getHours();

    if (hours < 12) {
      return "Good morning";
    }

    if (hours < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  }, []);

  useEffect(() => {
    saveStoredJson(authStorageKey, isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    saveStoredJson(profileStorageKey, profile);
  }, [profile]);

  function handleAuthChange(event) {
    const { name, value } = event.target;

    if (authMode === "login") {
      setLoginForm((current) => ({ ...current, [name]: value }));
      return;
    }

    setSignupForm((current) => ({ ...current, [name]: value }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();

    setAuthState({ loading: true, type: "", message: "" });

    if (authMode === "login") {
      if (!loginForm.email || !loginForm.password) {
        setAuthState({
          loading: false,
          type: "error",
          message: "Email and password are required for login.",
        });
        return;
      }

      try {
        const response = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginForm.email,
            password: loginForm.password,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Invalid email or password.");
        }

        const profileData =
          normalizeProfileData(data?.center) ||
          normalizeProfileData(data?.user) ||
          normalizeProfileData(data?.data) ||
          normalizeProfileData(data?.recyclingCenter) ||
          normalizeProfileData(data);

        if (!profileData) {
          throw new Error(
            "Login succeeded but no profile data was returned by the server.",
          );
        }

        setProfile(profileData);
        setIsAuthenticated(true);
        resetLoginForm();
        setAuthState({ loading: false, type: "", message: "" });
        return;
      } catch (error) {
        setAuthState({
          loading: false,
          type: "error",
          message:
            error.message || "Login failed. Please check your backend server.",
        });
        return;
      }
    }

    if (
      !signupForm.name ||
      !signupForm.address ||
      !signupForm.password ||
      !signupForm.state
    ) {
      setAuthState({
        loading: false,
        type: "error",
        message:
          "Please fill the required fields: name, address, password, and state.",
      });
      return;
    }

    const payload = {
      name: signupForm.name,
      address: signupForm.address,
      phone_no: signupForm.phone_no,
      email: signupForm.email,
      password: signupForm.password,
      website: signupForm.website,
      dist: signupForm.dist,
      state: signupForm.state,
      country: signupForm.country,
      pincode: signupForm.pincode,
      city: signupForm.city,
    };

    try {
      const response = await fetch(signupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create recycling center account.",
        );
      }

      setProfile((current) => ({
        ...current,
        ...payload,
      }));

      setLoginForm({
        email: signupForm.email || loginForm.email,
        password: signupForm.password,
      });
      resetSignupForm();
      setAuthState({
        loading: false,
        type: "success",
        message: "Account created successfully. You are now logged in.",
      });
      setIsAuthenticated(true);
    } catch (error) {
      setAuthState({
        loading: false,
        type: "error",
        message:
          error.message || "Signup failed. Please check your backend server.",
      });
      return;
    }
  }

  async function handleStatusChange(requestId, nextStatus) {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId ? { ...request, status: nextStatus } : request,
      ),
    );
    try {
    
      await fetch(`http://localhost:4000/api/pickups/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleToggleService(serviceId) {
    setServices((current) =>
      current.map((service) =>
        service.id === serviceId
          ? { ...service, active: !service.active }
          : service,
      ),
    );
  }

  function handleAvailabilityChange(event) {
    const { name, value } = event.target;

    setAvailability((current) => ({
      ...current,
      [name]:
        name === "serviceAreas"
          ? value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : value,
    }));
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setActiveView("overview");
    resetLoginForm();
    resetSignupForm();
    setAuthState({ loading: false, type: "", message: "" });
    localStorage.removeItem(authStorageKey);
    localStorage.removeItem(profileStorageKey);
    localStorage.removeItem("provider-center-id");
    setProfile(initialProviderProfile);
  }

  if (!isAuthenticated) {
    return (
      <main className="auth-shell">
        <AuthCard
          mode={authMode}
          form={activeAuthForm}
          onChange={handleAuthChange}
          onSubmit={handleAuthSubmit}
          authState={authState}
          onSwitchMode={handleSwitchMode}
        />
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
        onLogout={handleLogout}
        profile={profile}
      />

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Operations Center</p>
            <h1>
              {welcomeTitle}, {profile.name}
            </h1>
            <p>
              View assigned recycling pickups, update their status in real time,
              and manage the services your center offers.
            </p>
          </div>
        </header>

        {activeView === "overview" && (
          <Overview
            requests={requests}
            services={services}
            availability={availability}
          />
        )}

        {activeView === "requests" && (
          <RequestManagement
            requests={requests}
            filter={requestFilter}
            onFilterChange={setRequestFilter}
            onStatusChange={handleStatusChange}
          />
        )}

        {activeView === "services" && (
          <ServiceManagement
            services={services}
            availability={availability}
            onToggleService={handleToggleService}
            onAvailabilityChange={handleAvailabilityChange}
          />
        )}
      </section>
    </main>
  );
}
