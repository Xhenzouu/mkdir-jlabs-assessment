import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Card from "../components/Card";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker for current IP
const currentIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconSize: [25, 41],
  className: "current-marker",
});

// Map updater component
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position && position.length === 2) map.setView(position, 13);
  }, [position]);
  return null;
}

export default function Home({ onLogout }) {
  const [geo, setGeo] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [ip, setIp] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const mapRef = useRef();

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
    else {
      fetchGeo();
      fetchHistory();
    }
  }, [token, navigate]);

  const fetchGeo = async (targetIp = "") => {
    setError("");
    try {
      const url = targetIp
        ? `${api.defaults.baseURL}/geo/${targetIp}`
        : `${api.defaults.baseURL}/geo`;

      const res = await fetch(url, {
        headers: targetIp ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) throw new Error("Invalid IP");
      const data = await res.json();
      setGeo(data);

      if (data.loc) {
        const [lat, lng] = data.loc.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          // If targetIp is empty, it's current IP
          setMarkers((prev) =>
            targetIp
              ? [...prev, { lat, lng, ip: data.ip, current: false }]
              : [{ lat, lng, ip: data.ip, current: true }]
          );
        }
      }

      if (targetIp) {
        await fetch(`${api.defaults.baseURL}/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ip: targetIp }),
        });
        fetchHistory();
      }
    } catch {
      setError(
        targetIp ? "Invalid IP address" : "Unable to fetch IP geolocation"
      );
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${api.defaults.baseURL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data);
    } catch {
      setError("Unable to fetch history");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ip) return;
    fetchGeo(ip);
    setIp("");
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      await fetch(`${api.defaults.baseURL}/history`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: selectedIds }),
      });
      setSelectedIds([]);
      fetchHistory();
    } catch {
      setError("Unable to delete selected history");
    }
  };

  const handleHistoryClick = (itemIp) => fetchGeo(itemIp);

  const handleClear = () => {
    setMarkers([]);
    fetchGeo();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout?.();
    navigate("/login", { replace: true });
  };

  return (
    <div className="container">
      <Card>
        <h2>IP Geolocation</h2>

        {geo && (
          <div style={{ marginBottom: "1rem" }}>
            <p>
              <strong>IP:</strong> {geo.ip}
            </p>
            <p>
              <strong>City:</strong> {geo.city}
            </p>
            <p>
              <strong>Region:</strong> {geo.region}
            </p>
            <p>
              <strong>Country:</strong> {geo.country}
            </p>

            {geo.loc && (
              <MapContainer
                center={geo.loc.split(",").map(Number)}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "400px", width: "100%", marginTop: "1rem" }}
                ref={mapRef}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {markers
                  .filter((m) => m.lat != null && m.lng != null)
                  .map((m, i) => (
                    <Marker
                      key={i}
                      position={[m.lat, m.lng]}
                      icon={m.current ? currentIcon : new L.Icon.Default()}
                    >
                      <Popup>{m.ip}</Popup>
                    </Marker>
                  ))}
                <MapUpdater position={geo.loc.split(",").map(Number)} />
              </MapContainer>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Enter IP"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            style={{ flex: "1 1 60%" }}
          />
          <button type="submit">Search</button>
          <button
            type="button"
            onClick={handleClear}
            style={{ background: "#ff6464" }}
          >
            Clear
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        {history.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h3>Search History</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {history.map((item) => (
                <li
                  key={item.id}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                  />
                  <button
                    onClick={() => handleHistoryClick(item.ip)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#646cff",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    {item.ip}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
              style={{ background: "#ff6464" }}
            >
              Delete Selected
            </button>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{ background: "#646cff", width: "100%" }}
        >
          Logout
        </button>
      </Card>
    </div>
  );
}