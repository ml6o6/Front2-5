// frontend/src/components/map/AccidentMarker.jsx
// Возвращает цвет маркера по числу пострадавших.
export function markerColor(victimsCount) {
  if (victimsCount >= 3) return '#e74c3c'; // красный
  if (victimsCount >= 1) return '#f1c40f'; // жёлтый
  return '#27ae60';                         // зелёный
}

export default function AccidentMarker({ victimsCount = 0, size = 28 }) {
  const color = markerColor(victimsCount);
  return (
    <div
      className="map-marker"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        border: '2px solid #fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      <span style={{ transform: 'rotate(45deg)' }}>{victimsCount}</span>
    </div>
  );
}
