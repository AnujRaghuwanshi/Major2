const statusOptions = ["all", "pending", "accepted", "collected", "completed", "rejected"];

function getActionButtons(request, onStatusChange) {
  const actions = [];

  if (request.status === "pending") {
    actions.push(
      <button key="accept" className="table-action" onClick={() => onStatusChange(request.id, "accepted")}>
        Accept
      </button>,
    );
    actions.push(
      <button key="reject" className="table-action muted" onClick={() => onStatusChange(request.id, "rejected")}>
        Reject
      </button>,
    );
  }

  if (request.status === "accepted") {
    actions.push(
      <button key="collect" className="table-action" onClick={() => onStatusChange(request.id, "collected")}>
        Mark collected
      </button>,
    );
  }

  if (request.status === "collected") {
    actions.push(
      <button key="complete" className="table-action" onClick={() => onStatusChange(request.id, "completed")}>
        Mark completed
      </button>,
    );
  }

  return actions.length ? actions : <span className="no-action">No actions available</span>;
}

export default function RequestManagement({
  requests,
  filter,
  onFilterChange,
  onStatusChange,
}) {
  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((request) => request.status === filter);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Core Feature</p>
          <h2>Request management</h2>
        </div>
        <div className="filter-group">
          {statusOptions.map((option) => (
            <button
              key={option}
              className={filter === option ? "chip active" : "chip"}
              onClick={() => onFilterChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>User / Location</th>
              <th>Service</th>
              <th>Contact</th>
              <th>Schedule</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>
                  <strong>{request.requester}</strong>
                  <span>{request.address}</span>
                </td>
                <td>{request.category}</td>
                <td>{request.contact}</td>
                <td>
                  <strong>{request.scheduledDate}</strong>
                </td>
                <td>{request.quantity}</td>
                <td>
                  <span className={`status-badge ${request.status}`}>{request.status}</span>
                </td>
                <td className="action-cell">{getActionButtons(request, onStatusChange)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
