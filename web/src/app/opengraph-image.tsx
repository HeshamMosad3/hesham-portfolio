import { ImageResponse } from "next/og";

export const alt = "Hesham Mosad | Full Stack .NET Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const cells = Array.from({ length: 12 * 6 });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a0a09", color: "#f0ece2", position: "relative" }}>
        <div style={{ position: "absolute", right: 60, top: 60, display: "flex", flexWrap: "wrap", width: 12 * 34, gap: 6 }}>
          {cells.map((_, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: (i * 7) % 11 === 0 ? "#ffb547" : (i * 5) % 13 === 0 ? "#3ce0c0" : "#1d1d19",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#a29d91" }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: "#ffb547", color: "#0a0a09", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>HM</div>
            Full Stack .NET Developer · Egypt
          </div>
          <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: -4, lineHeight: 1, marginTop: 28 }}>Hesham Mosad</div>
          <div style={{ fontSize: 34, marginTop: 22, color: "#ffb547" }}>C# · ASP.NET Core · SQL Server</div>
        </div>
      </div>
    ),
    size,
  );
}
