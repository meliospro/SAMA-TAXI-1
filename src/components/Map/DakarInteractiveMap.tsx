import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LocationPoint, RideStatus, Driver } from '../../types/vtc';
import { Compass, Navigation2, Plus, Minus, ShieldCheck, Car, Bike } from 'lucide-react';

interface Props {
  pickup: LocationPoint;
  dropoff: LocationPoint | null;
  status: RideStatus;
  driver?: Driver;
  onSelectMapLocation?: (loc: LocationPoint) => void;
  tripProgress?: number; // 0 to 1
}

interface MovingDriverPin {
  id: string;
  type: 'car' | 'moto';
  x: number;
  y: number;
  bearing: number;
  speed: number;
}

export const DakarInteractiveMap: React.FC<Props> = ({
  pickup,
  dropoff,
  status,
  driver,
  tripProgress = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showTraffic, setShowTraffic] = useState(true);

  // Dynamic nearby roaming drivers
  const [roamingDrivers, setRoamingDrivers] = useState<MovingDriverPin[]>([
    { id: '1', type: 'car', x: 260, y: 220, bearing: 45, speed: 0.6 },
    { id: '2', type: 'car', x: 310, y: 270, bearing: 190, speed: 0.8 },
    { id: '3', type: 'moto', x: 220, y: 310, bearing: 310, speed: 1.1 },
    { id: '4', type: 'car', x: 280, y: 360, bearing: 110, speed: 0.5 },
    { id: '5', type: 'moto', x: 190, y: 240, bearing: 20, speed: 0.9 },
  ]);

  // Convert lat/lng roughly to Dakar Peninsula Canvas Coordinate space
  // Dakar bounds roughly: Lat: 14.65 to 14.77, Lng: -17.54 to -17.40
  const projectCoords = useMemo(() => {
    return (lat: number, lng: number, width: number, height: number) => {
      const minLat = 14.65;
      const maxLat = 14.77;
      const minLng = -17.54;
      const maxLng = -17.40;

      // Inverted Y because latitude grows northward
      const normX = (lng - minLng) / (maxLng - minLng);
      const normY = 1 - (lat - minLat) / (maxLat - minLat);

      const padding = 40;
      const effectiveW = width - padding * 2;
      const effectiveH = height - padding * 2;

      return {
        x: padding + normX * effectiveW,
        y: padding + normY * effectiveH,
      };
    };
  }, []);

  // Update roaming cars
  useEffect(() => {
    const interval = setInterval(() => {
      setRoamingDrivers(prev =>
        prev.map(d => {
          const rad = (d.bearing * Math.PI) / 180;
          let nx = d.x + Math.cos(rad) * d.speed;
          let ny = d.y + Math.sin(rad) * d.speed;

          // Bounce if too far off
          let newBearing = d.bearing;
          if (nx < 80 || nx > 400 || ny < 80 || ny > 500) {
            newBearing = (d.bearing + 160 + Math.random() * 40) % 360;
          }

          return {
            ...d,
            x: nx,
            y: ny,
            bearing: newBearing,
          };
        })
      );
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      // Apply zoom & pan centered
      ctx.translate(width / 2 + offset.x, height / 2 + offset.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // 1. Water Background (Atlantic Ocean)
      ctx.fillStyle = '#0f172a'; // Deep oceanic slate
      ctx.fillRect(-200, -200, width + 400, height + 400);

      // Ocean subtle contours / waves
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(80, 260, 140 + i * 50, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Dakar Peninsula Landmass polygon
      ctx.fillStyle = '#1e293b'; // Slate landmass
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;

      ctx.beginPath();
      // West tip (Almadies)
      ctx.moveTo(70, 160);
      ctx.quadraticCurveTo(110, 130, 160, 120); // Ngor
      ctx.quadraticCurveTo(230, 140, 270, 170); // Yoff Plage
      ctx.quadraticCurveTo(340, 220, 390, 260); // Camberene / Parcelles
      ctx.quadraticCurveTo(430, 310, 480, 340); // Guédiawaye / Thiaroye
      ctx.lineTo(520, 460); // Towards Rufisque & Diamniadio
      ctx.lineTo(440, 520);
      ctx.quadraticCurveTo(380, 470, 340, 420); // Hann Bay
      ctx.quadraticCurveTo(310, 390, 290, 360); // Port
      ctx.lineTo(280, 460); // Dakar Plateau south tip
      ctx.quadraticCurveTo(250, 480, 220, 460); // Cap Manuel
      ctx.quadraticCurveTo(180, 390, 150, 330); // Corniche Ouest (Fann, Sea Plaza)
      ctx.quadraticCurveTo(110, 260, 80, 210); // Ouakam / Mamelles
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Islands (Ngor, Gorée)
      // Île de Ngor
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(135, 105, 14, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();
      // Île de Gorée
      ctx.beginPath();
      ctx.ellipse(345, 420, 12, 6, 0.6, 0, Math.PI * 2);
      ctx.fill();

      // 3. Roads / Boulevards Network
      // Corniche Ouest
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(85, 180);
      ctx.quadraticCurveTo(100, 240, 140, 300);
      ctx.quadraticCurveTo(170, 350, 230, 430);
      ctx.quadraticCurveTo(250, 460, 265, 440);
      ctx.stroke();

      // VDN (Voie de Dégagement Nord)
      ctx.beginPath();
      ctx.moveTo(110, 170);
      ctx.quadraticCurveTo(180, 230, 250, 280);
      ctx.quadraticCurveTo(320, 320, 410, 330);
      ctx.stroke();

      // Autoroute à péage (A1)
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(270, 410);
      ctx.quadraticCurveTo(310, 340, 370, 330);
      ctx.quadraticCurveTo(430, 330, 520, 350);
      ctx.stroke();

      // Traffic flow highlights if enabled
      if (showTraffic) {
        ctx.strokeStyle = '#10b981'; // Green fluid
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(90, 195);
        ctx.quadraticCurveTo(105, 245, 145, 305);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b'; // Orange moderate
        ctx.beginPath();
        ctx.moveTo(190, 240);
        ctx.quadraticCurveTo(240, 275, 290, 300);
        ctx.stroke();
      }

      // Secondary streets
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      for (let s = 0; s < 5; s++) {
        ctx.beginPath();
        ctx.moveTo(130 + s * 30, 180 + s * 25);
        ctx.lineTo(190 + s * 25, 340);
        ctx.stroke();
      }

      // 4. Dakar Landmark Labels (Minimal, sleek)
      ctx.font = '600 10px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('ALMADIES', 80, 150);
      ctx.fillText('NGOR', 150, 135);
      ctx.fillText('OUAKAM', 110, 230);
      ctx.fillText('SEA PLAZA', 135, 320);
      ctx.fillText('PLATEAU', 250, 450);
      ctx.fillText('ÎLE DE GORÉE', 335, 440);
      ctx.fillText('AUTOROUTE AIBD ➔', 420, 345);

      // 5. Draw Route Line if Dropoff exists
      const pPoint = projectCoords(pickup.lat, pickup.lng, width, height);
      const dPoint = dropoff ? projectCoords(dropoff.lat, dropoff.lng, width, height) : null;

      if (dropoff && dPoint) {
        // Draw Route Polyline with subtle glow
        ctx.shadowColor = '#E61E25';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#E61E25';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(pPoint.x, pPoint.y);

        // Control point for smooth curved route along Dakar roads
        const midX = (pPoint.x + dPoint.x) / 2 + 25;
        const midY = (pPoint.y + dPoint.y) / 2 - 15;
        ctx.quadraticCurveTo(midX, midY, dPoint.x, dPoint.y);
        ctx.stroke();

        ctx.shadowBlur = 0; // Reset shadow

        // Inner glowing dashes
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(pPoint.x, pPoint.y);
        ctx.quadraticCurveTo(midX, midY, dPoint.x, dPoint.y);
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Destination Marker (Red Flag Pin)
        ctx.fillStyle = '#E61E25';
        ctx.beginPath();
        ctx.arc(dPoint.x, dPoint.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Destination Label Bubble
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(dPoint.x - 36, dPoint.y - 34, 72, 22, 6);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(dropoff.name.slice(0, 12) + (dropoff.name.length > 12 ? '..' : ''), dPoint.x, dPoint.y - 19);
        ctx.textAlign = 'start';
      }

      // 6. Roaming Drivers (when idle or searching)
      if (status === 'idle' || status === 'selecting_destination' || status === 'choosing_vehicle' || status === 'searching_driver') {
        roamingDrivers.forEach(rd => {
          ctx.save();
          ctx.translate(rd.x, rd.y);
          ctx.rotate((rd.bearing * Math.PI) / 180);

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.ellipse(0, 2, 8, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          if (rd.type === 'car') {
            // Little yellow/red taxi roof
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-5, -9, 10, 18, 3);
            ctx.fill();
            ctx.fillStyle = '#E61E25'; // Sama Taxi Red
            ctx.fillRect(-4, -4, 8, 8);
          } else {
            // Moto
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(0, 0, 4, 8, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });
      }

      // 7. Active Driver Pin (if driver is assigned, arriving, or in progress)
      if ((status === 'driver_assigned' || status === 'driver_arriving' || status === 'in_progress') && driver) {
        let carPos = { x: pPoint.x - 40, y: pPoint.y + 35 };

        if (status === 'driver_arriving') {
          // Animate driver moving from starting point towards pickup
          const t = Math.min(1, Math.max(0, tripProgress));
          const startX = pPoint.x - 55;
          const startY = pPoint.y + 45;
          carPos = {
            x: startX + (pPoint.x - startX) * t,
            y: startY + (pPoint.y - startY) * t,
          };
        } else if (status === 'in_progress' && dPoint) {
          // Animate car along route to destination
          const t = Math.min(1, Math.max(0, tripProgress));
          const midX = (pPoint.x + dPoint.x) / 2 + 25;
          const midY = (pPoint.y + dPoint.y) / 2 - 15;
          // Quadratic bezier interpolation: (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
          const cx = Math.pow(1 - t, 2) * pPoint.x + 2 * (1 - t) * t * midX + Math.pow(t, 2) * dPoint.x;
          const cy = Math.pow(1 - t, 2) * pPoint.y + 2 * (1 - t) * t * midY + Math.pow(t, 2) * dPoint.y;
          carPos = { x: cx, y: cy };
        }

        // Draw Driver Car Icon with live pulsating glow
        ctx.save();
        ctx.translate(carPos.x, carPos.y);

        // Radar wave circle
        ctx.strokeStyle = 'rgba(230, 30, 37, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Car Body
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(-8, -14, 16, 28, 5);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Sama Red roof
        ctx.fillStyle = '#E61E25';
        ctx.beginPath();
        ctx.roundRect(-6, -6, 12, 13, 2);
        ctx.fill();

        // Headlights
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-6, -14, 3, 2);
        ctx.fillRect(3, -14, 3, 2);

        // Driver Tag
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-30, -32, 60, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Moussa (2 min)', 0, -21);

        ctx.restore();
      }

      // 8. Pickup Point Marker (Pulsing Green Halo)
      ctx.save();
      ctx.translate(pPoint.x, pPoint.y);

      // Ripple halo
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // Core point
      ctx.fillStyle = '#10b981'; // Green pickup
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Pickup Tag
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-36, 12, 72, 20, 6);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pickup.name.slice(0, 11) + (pickup.name.length > 11 ? '..' : ''), 0, 25);

      ctx.restore();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [pickup, dropoff, status, driver, tripProgress, zoom, offset, showTraffic, roamingDrivers, projectCoords]);

  // Touch and mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRecenter = () => {
    setOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      <canvas
        ref={canvasRef}
        width={420}
        height={650}
        className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Floating Map Controls - Thumb ergonomic */}
      <div className="absolute right-3 top-20 flex flex-col gap-2 z-10">
        {/* Recenter Button */}
        <button
          onClick={handleRecenter}
          aria-label="Recentrer la carte"
          className="w-10 h-10 rounded-full bg-slate-900/90 text-white border border-slate-700/80 shadow-lg flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
        >
          <Navigation2 className="w-4 h-4 text-red-500 fill-red-500" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-lg overflow-hidden backdrop-blur-md">
          <button
            onClick={() => setZoom(z => Math.min(1.8, z + 0.15))}
            aria-label="Zoomer"
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-slate-800 active:bg-slate-700 transition-colors border-b border-slate-800"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.7, z - 0.15))}
            aria-label="Dézoomer"
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-slate-800 active:bg-slate-700 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Traffic Toggle */}
        <button
          onClick={() => setShowTraffic(t => !t)}
          aria-label="Afficher le trafic"
          className={`w-10 h-10 rounded-full border shadow-lg flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform ${
            showTraffic
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
              : 'bg-slate-900/90 border-slate-700/80 text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Safety & Real-time Google Maps Live Badge */}
      <div className="absolute left-3 top-20 z-10 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] font-medium text-slate-200 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white">Google Maps Live</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300">GPS Dakar ±2m</span>
        </div>

        <div className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800/80 text-[10px] text-slate-400 self-start">
          Trafic en temps réel Dakar
        </div>
      </div>

      {/* Google Maps Attribution Watermark at bottom */}
      <div className="absolute left-3 bottom-3 z-10 flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
        <span className="font-semibold text-slate-300">Google</span>
        <span>· Données cartographiques ©2026 Sénégal</span>
      </div>
    </div>
  );
};
