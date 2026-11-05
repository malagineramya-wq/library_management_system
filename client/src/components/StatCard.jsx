function StatCard({ title, value, color }) {
  return (
    <div className="stat-card" style={{ '--accent-color': color }}>
      <span className="stat-label">{title}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}

export default StatCard;
