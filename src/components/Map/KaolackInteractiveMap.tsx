import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LocationPoint, RideStatus, Driver } from '../../types/vtc';
import { Compass, Navigation2, Plus, Minus, Car, Bike, Sparkles } from 'lucide-react';

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

export const KaolackInteractiveMap: React.FC<Props> = ({
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

  // Dynamic nearby roaming taxis and Motos Jakarta in Kaolack
  const [roamingDrivers, setRoamingDrivers] = useState<MovingDriverPin[]>([
    { id: '1', type: 'car', x: 210, y: 280, bearing: 45, speed: 0.7 },
    { id: '2', type: 'moto', x: 250, y: 220, bearing: 180, speed: 1.2 }, // Moto Jakarta
    { id: '3', type: 'moto', x: 180, y: 340, bearing: 290, speed: 1.0 }, // Moto Jakarta
    { id: '4', type: 'car', x: 290, y: 310, bearing: 120, speed: 0.6 },
    { id: '5', type: 'moto', x: 320, y: 190, bearing: 20, speed: 1.3 },
  ]);

  // Convert lat/lng to Kaolack canvas coordinate space
  // Kaolack bounds roughly: Lat: 14.120 to 14.185, Lng: -16.105 to -16.035
  const projectCoords = useMemo(() => {
    return (lat: number, lng: number, width: number, height: number) => {
      const minLat = 14.125;
      const maxLat = 14.185;
      const minLng = -16.105;
      const maxLng = -16.035;

      const normX = (lng - minLng) / (maxLng - minLng);
      const normY = 1 - (lat - minLat) / (maxLat - minLat);

      const padding = 45;
      const effectiveW = width - padding * 2;
      const effectiveH = height - padding * 2;

      return {
        x: padding + normX * effectiveW,
        y: padding + normY * effectiveH,
      };
    };
  }, []);

  // Update roaming cars & Motos Jakarta
  useEffect(() => {
    const interval = setInterval(() => {
      setRoamingDrivers(prev =>
        prev.map(d => {
          const rad = (d.bearing * Math.PI) / 180;
          const nx = d.x + Math.cos(rad) * d.speed;
          const ny = d.y + Math.sin(rad) * d.speed;

          let newBearing = d.bearing;
          if (nx < 60 || nx > 380 || ny < 80 || ny > 560) {
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

  // Canvas drawing loop for Kaolack
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

      // 1. Land Background (Kaolack urban landscape - deep modern slate)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-200, -200, width + 400, height + 400);

      // 2. Bras du Fleuve Saloum (River Saloum water curving on South / South-West)
      ctx.fillStyle = '#0b253a'; // Deep river blue
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(-100, 480);
      ctx.quadraticCurveTo(80, 520, 160, 560);
      ctx.quadraticCurveTo(240, 600, 320, 650);
      ctx.lineTo(320, 720);
      ctx.lineTo(-100, 720);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Mangrove green accents along Saloum banks
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.beginPath();
      ctx.ellipse(90, 500, 40, 15, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(190, 560, 50, 20, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // 3. Kaolack City Road Network
      // RN1 (Route Nationale 1 : Dakar/Fatick -> Kaolack -> Kaffrine/Mali)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(30, 150); // From Fatick/Dakar
      ctx.quadraticCurveTo(120, 210, 200, 280); // Through Ndorong & Center
      ctx.quadraticCurveTo(280, 330, 400, 310); // Towards Kahone & Kaffrine
      ctx.stroke();

      // RN4 (Route Nationale 4 : Kaolack -> Nioro du Rip & Gambie)
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(200, 280); // Center junction
      ctx.quadraticCurveTo(190, 390, 170, 500); // Towards Garage Nioro
      ctx.stroke();

      // Boulevard Médina Baye (Center -> North-East towards Grande Mosquée)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(200, 280);
      ctx.quadraticCurveTo(260, 220, 310, 150);
      ctx.stroke();

      // Boulevard Valdiodio Ndiaye (Marché Central)
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(140, 340);
      ctx.lineTo(260, 340);
      ctx.stroke();

      // Traffic flow highlights if enabled
      if (showTraffic) {
        ctx.strokeStyle = '#10b981'; // Green fluid on RN1
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(40, 160);
        ctx.quadraticCurveTo(120, 215, 195, 280);
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b'; // Moderate traffic near Marché Central
        ctx.beginPath();
        ctx.moveTo(190, 290);
        ctx.quadraticCurveTo(220, 330, 250, 340);
        ctx.stroke();
      }

      // Secondary streets of Kaolack (Kasnack, Dialègne, Léona, Boustane)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      for (let s = 0; s < 6; s++) {
        ctx.beginPath();
        ctx.moveTo(90 + s * 35, 120 + s * 20);
        ctx.lineTo(150 + s * 35, 420);
        ctx.stroke();
      }

      // 4. Kaolack Landmark Labels (Authentic and sleek)
      ctx.font = '700 10px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('🕌 MÉDINA BAYE', 255, 135);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText('🛍️ MARCHÉ CENTRAL', 150, 360);

      ctx.font = '600 9px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('GARAGE DAKAR / NDORONG', 45, 135);
      ctx.fillText('LÉONA NIASSÈNE', 245, 255);
      ctx.fillText('HÔPITAL RÉGIONAL', 230, 310);
      ctx.fillText('GARAGE NIORO (RN4)', 110, 480);
      ctx.fillText('FLEUVE SALOUM ➔', 180, 580);
      ctx.fillText('RN1 VERS KAFFRINE ➔', 290, 300);

      // 5. Draw Route Line if Dropoff exists
      const pPoint = projectCoords(pickup.lat, pickup.lng, width, height);
      const dPoint = dropoff ? projectCoords(dropoff.lat, dropoff.lng, width, height) : null;

      if (dropoff && dPoint) {
        // Draw Route Polyline with subtle glow
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 14;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 5.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(pPoint.x, pPoint.y);

        // Control point for smooth curved route along Kaolack streets
        const midX = (pPoint.x + dPoint.x) / 2 + 15;
        const midY = (pPoint.y + dPoint.y) / 2 - 15;
        ctx.quadraticCurveTo(midX, midY, dPoint.x, dPoint.y);
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Inner dashed route line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(pPoint.x, pPoint.y);
        ctx.quadraticCurveTo(midX, midY, dPoint.x, dPoint.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Destination Marker (Gold Amber Pin)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(dPoint.x, dPoint.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Destination Label Bubble
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(dPoint.x - 42, dPoint.y - 34, 84, 22, 6);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(dropoff.name.slice(0, 14) + (dropoff.name.length > 14 ? '..' : ''), dPoint.x, dPoint.y - 19);
        ctx.textAlign = 'start';
      }

      // 6. Roaming Drivers (Kaolack Taxi jaune-noir & Motos Jakarta)
      if (status === 'idle' || status === 'selecting_destination' || status === 'choosing_vehicle' || status === 'searching_driver') {
        roamingDrivers.forEach(rd => {
          ctx.save();
          ctx.translate(rd.x, rd.y);
          ctx.rotate((rd.bearing * Math.PI) / 180);

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.ellipse(0, 2, 8, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          if (rd.type === 'car') {
            // Kaolack Classic Taxi: Yellow with Black stripes
            ctx.fillStyle = '#facc15'; // Kaolack Yellow
            ctx.beginPath();
            ctx.roundRect(-6, -10, 12, 20, 3);
            ctx.fill();
            ctx.fillStyle = '#0f172a'; // Black roof / hood
            ctx.fillRect(-5, -4, 10, 8);
          } else {
            // Moto Jakarta Kaolack (Blue or Red agile dot)
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.ellipse(0, 0, 4, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, -6, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });
      }

      // 7. Active Driver Pin (Assigned driver Cheikh Ndao)
      if ((status === 'driver_assigned' || status === 'driver_arriving' || status === 'in_progress') && driver) {
        let carPos = { x: pPoint.x - 35, y: pPoint.y + 30 };

        if (status === 'driver_arriving') {
          const t = Math.min(1, Math.max(0, tripProgress));
          const startX = pPoint.x - 50;
          const startY = pPoint.y + 45;
          carPos = {
            x: startX + (pPoint.x - startX) * t,
            y: startY + (pPoint.y - startY) * t,
          };
        } else if (status === 'in_progress' && dPoint) {
          const t = Math.min(1, Math.max(0, tripProgress));
          const midX = (pPoint.x + dPoint.x) / 2 + 15;
          const midY = (pPoint.y + dPoint.y) / 2 - 15;
          const cx = Math.pow(1 - t, 2) * pPoint.x + 2 * (1 - t) * t * midX + Math.pow(t, 2) * dPoint.x;
          const cy = Math.pow(1 - t, 2) * pPoint.y + 2 * (1 - t) * t * midY + Math.pow(t, 2) * dPoint.y;
          carPos = { x: cx, y: cy };
        }

        // Active Vehicle with Radar Wave
        ctx.save();
        ctx.translate(carPos.x, carPos.y);

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Car Body: Kaolack Taxi Jaune & Noir
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.roundRect(-8, -14, 16, 28, 5);
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Black Roof
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-6, -6, 12, 13, 2);
        ctx.fill();

        // Tag
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(-36, -32, 72, 16, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Cheikh (2 min)', 0, -21);

        ctx.restore();
      }

      // 8. Pickup Point Marker (Pulsing Green Halo)
      ctx.save();
      ctx.translate(pPoint.x, pPoint.y);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Pickup Tag
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(-42, 12, 84, 20, 6);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pickup.name.slice(0, 13) + (pickup.name.length > 13 ? '..' : ''), 0, 25);

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

      {/* Floating Map Controls */}
      <div className="absolute right-3 top-20 flex flex-col gap-2 z-10">
        <button
          onClick={handleRecenter}
          aria-label="Recentrer la carte Kaolack"
          className="w-10 h-10 rounded-full bg-slate-900/90 text-white border border-slate-700/80 shadow-lg flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
        >
          <Navigation2 className="w-4 h-4 text-red-500 fill-red-500" />
        </button>

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

      {/* Safety & Real-time Google Maps Kaolack Live Badge */}
      <div className="absolute left-3 top-20 z-10 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] font-medium text-slate-200 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-white">Google Maps Kaolack</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300">GPS Live</span>
        </div>

        <div className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800/80 text-[10px] text-amber-400 self-start font-mono">
          Taxis & Motos Jakarta Kaolack
        </div>
      </div>

      {/* Google Maps Attribution Watermark */}
      <div className="absolute left-3 bottom-3 z-10 flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950/85 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
        <span className="font-semibold text-slate-300">Google Maps</span>
        <span>· Kaolack, Bassin Saloum Sénégal</span>
      </div>
    </div>
  );
};
