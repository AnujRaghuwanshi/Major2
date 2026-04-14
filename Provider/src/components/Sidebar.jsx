const navItems = [
  { id: "overview", label: "Overview" },
  { id: "requests", label: "Request Management" },
  { id: "services", label: "Service Management" },
];

export default function Sidebar({ activeView, onChangeView, onLogout, profile }) {
  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Provider Dashboard</p>
        <h2>{profile.name}</h2>
        {/* <p className="sidebar-meta">{profile.role}</p> */}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activeView === item.id ? "nav-item active" : "nav-item"}
            onClick={() => onChangeView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>{profile.name}</p>
        <span>{profile.email}</span>
        <button className="secondary-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
