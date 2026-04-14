export default function StatCard({ label, value, hint, trend }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <h3>{value}</h3>
      <span>{hint}</span>
      {trend && <span className={`trend ${trend}`}>{trend === 'up' ? '↗' : '↘'} 12%</span>}
    </article>
  );
}

