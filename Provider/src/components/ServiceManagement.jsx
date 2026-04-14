export default function ServiceManagement({
  services,
  availability,
  onToggleService,
  onAvailabilityChange,
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Operations Setup</p>
          <h2>Service management</h2>
        </div>
      </div>

      <div className="service-layout">
        <div className="service-list">
          {services.map((service) => (
            <article key={service.id} className="service-card">
              <div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
              <button
                className={service.active ? "toggle active" : "toggle"}
                onClick={() => onToggleService(service.id)}
              >
                {service.active ? "Active" : "Inactive"}
              </button>
            </article>
          ))}
        </div>

        <form className="availability-card">
          <h3>Availability settings</h3>
          <label className="field">
            <span>Working days</span>
            <input
              name="weekdays"
              value={availability.weekdays}
              onChange={onAvailabilityChange}
            />
          </label>
          <label className="field">
            <span>Working hours</span>
            <input
              name="hours"
              value={availability.hours}
              onChange={onAvailabilityChange}
            />
          </label>
          <label className="field">
            <span>Service areas</span>
            <input
              name="serviceAreas"
              value={availability.serviceAreas.join(", ")}
              onChange={onAvailabilityChange}
              placeholder="Noida, Delhi, Ghaziabad"
            />
          </label>
          {/* <p className="availability-hint">
            These settings are stored in local state for now and are ready to be
            connected to your backend when you share the APIs.
          </p> */}
        </form>
      </div>
    </section>
  );
}
