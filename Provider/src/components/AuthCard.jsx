const loginDefaults = {
  email: "",
  password: "",
};

const signupDefaults = {
  name: "",
  address: "",
  phone_no: "",
  email: "",
  password: "",
  website: "",
  country: "",
  state: "",
  city: "",
  dist: "",
  pincode: "",
};

function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
}

export default function AuthCard({
  mode,
  form,
  onChange,
  onSubmit,
  onSwitchMode,
  authState,
}) {
  const isLogin = mode === "login";

  return (
    <div className="auth-card">
      <div className="auth-copy">
        <p className="eyebrow">Provider Portal</p>
        <h1>
          {isLogin
            ? "Log in to your dashboard"
            : "Create your provider account"}
        </h1>
        <p>
          Manage assigned pickups, update collection progress, and configure the
          services your center provides.
        </p>
        <div className="auth-note">
          <strong>Dashboard Insight:</strong> “From assignment to completion. Every
          update matters. Every action counts.”
        </div>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="auth-form-header">
          <h2>{isLogin ? "Login" : "Sign up"}</h2>
          <button type="button" className="text-button" onClick={onSwitchMode}>
            {isLogin ? "Need an account? Sign up" : "Already registered? Login"}
          </button>
        </div>

        {isLogin ? (
          <>
            <AuthInput
              label="Email"
              name="email"
              type="email"
              value={form.email ?? loginDefaults.email}
              onChange={onChange}
              placeholder="provider@example.com"
            />
            <AuthInput
              label="Password"
              name="password"
              type="password"
              value={form.password ?? loginDefaults.password}
              onChange={onChange}
              placeholder="Enter password"
            />
          </>
        ) : (
          <>
            <AuthInput
              label="Center name"
              name="name"
              value={form.name ?? signupDefaults.name}
              onChange={onChange}
              placeholder="Bhopal E-Waste Collector"
            />
            <AuthInput
              label="Address"
              name="address"
              value={form.address ?? signupDefaults.address}
              onChange={onChange}
              placeholder="Full address"
            />
            <AuthInput
              label="Phone number"
              name="phone_no"
              value={form.phone_no ?? signupDefaults.phone_no}
              onChange={onChange}
              placeholder="+91"
            />
            <AuthInput
              label="Email"
              name="email"
              type="email"
              value={form.email ?? signupDefaults.email}
              onChange={onChange}
              placeholder="center@example.com"
            />
            <AuthInput
              label="Password"
              name="password"
              type="password"
              value={form.password ?? signupDefaults.password}
              onChange={onChange}
              placeholder="Create password"
            />
            <AuthInput
              label="Website"
              name="website"
              type="url"
              value={form.website ?? signupDefaults.website}
              onChange={onChange}
              placeholder="https://example.org"
            />
            <AuthInput
              label="Country"
              name="country"
              value={form.country ?? signupDefaults.country}
              onChange={onChange}
              placeholder="India"
            />
            <AuthInput
              label="State"
              name="state"
              value={form.state ?? signupDefaults.state}
              onChange={onChange}
              placeholder="Madhya Pradesh"
            />
            <AuthInput
              label="City"
              name="city"
              value={form.city ?? signupDefaults.city}
              onChange={onChange}
              placeholder="Bhopal"
            />
            <AuthInput
              label="District"
              name="dist"
              value={form.dist ?? signupDefaults.dist}
              onChange={onChange}
              placeholder="Bhopal"
            />
            <AuthInput
              label="Pincode"
              name="pincode"
              value={form.pincode ?? signupDefaults.pincode}
              onChange={onChange}
              placeholder="462011"
            />
          </>
        )}

        {authState?.message ? (
          <p
            className={
              authState.type === "error"
                ? "form-message error"
                : "form-message success"
            }
          >
            {authState.message}
          </p>
        ) : null}

        <button
          className="primary-button"
          type="submit"
          disabled={authState?.loading}
        >
          {authState?.loading
            ? "Please wait..."
            : isLogin
              ? "Login to dashboard"
              : "Create account"}
        </button>
      </form>
    </div>
  );
}
