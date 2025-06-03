
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Project } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin } from 'lucide-react';

interface ProjectMapProps {
  projects: Project[];
  mapboxToken: string;
}

// Coordenadas de ciudades españolas comunes
const cityCoordinates: Record<string, [number, number]> = {
  'madrid': [-3.7038, 40.4168],
  'barcelona': [2.1734, 41.3851],
  'valencia': [-0.3763, 39.4699],
  'sevilla': [-5.9845, 37.3891],
  'zaragoza': [-0.8773, 41.6561],
  'málaga': [-4.4214, 36.7213],
  'murcia': [-1.1307, 37.9922],
  'palma': [2.6502, 39.5696],
  'las palmas': [-15.4138, 28.0997],
  'bilbao': [-2.9253, 43.2627],
  'alicante': [-0.4817, 38.3460],
  'córdoba': [-4.7793, 37.8882],
  'valladolid': [-4.7245, 41.6523],
  'vigo': [-8.7207, 42.2328],
  'gijón': [-5.6611, 43.5322],
  'hospitalet': [2.0993, 41.3598],
  'coruña': [-8.4115, 43.3623],
  'granada': [-3.5986, 37.1773],
  'vitoria': [-2.6734, 42.8467],
  'elche': [-0.7037, 38.2694],
  'santander': [-3.8044, 43.4623],
  'oviedo': [-5.8442, 43.3614],
  'móstoles': [-3.8649, 40.3218],
  'cartagena': [-0.9864, 37.6056],
  'jerez': [-6.1266, 36.6864],
  'sabadell': [2.1095, 41.5431],
  'santa cruz': [-16.2518, 28.4636],
  'pamplona': [-1.6440, 42.8125],
  'almería': [-2.4637, 36.8381],
  'fuenlabrada': [-3.7936, 40.2840]
};

const ProjectMap: React.FC<ProjectMapProps> = ({ projects, mapboxToken }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeView, setActiveView] = useState<'world' | 'spain'>('spain');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: activeView === 'spain' ? [-3.7038, 40.4168] : [0, 20],
      zoom: activeView === 'spain' ? 5 : 1.5,
      projection: 'mercator'
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add markers for projects
    projects.forEach((project) => {
      if (!project.city) return;
      
      const cityKey = project.city.toLowerCase();
      const coordinates = cityCoordinates[cityKey];
      
      if (coordinates) {
        // Create a custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'project-marker';
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          background-color: ${project.status === 'activo' ? '#3b82f6' : project.status === 'completado' ? '#22c55e' : '#6b7280'};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;
        
        const icon = document.createElement('div');
        icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`;
        markerElement.appendChild(icon);

        // Create popup content
        const projectRevenue = project.budget || (project.hourlyRate || 0) * 160;
        const projectExpenses = project.variableExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
        
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${project.name}</h3>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Tipo:</strong> ${project.type === 'presupuesto' ? 'Presupuesto' : 'Administración'}
            </p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Estado:</strong> ${project.status === 'activo' ? 'Activo' : project.status === 'completado' ? 'Completado' : 'Pausado'}
            </p>
            <p style="margin: 4px 0; color: #22c55e; font-size: 14px;">
              <strong>Ingresos:</strong> €${projectRevenue.toLocaleString()}
            </p>
            <p style="margin: 4px 0; color: #ef4444; font-size: 14px;">
              <strong>Gastos:</strong> €${projectExpenses.toLocaleString()}
            </p>
            <p style="margin: 8px 0 0 0; color: #1f2937; font-weight: bold;">
              <strong>Beneficio:</strong> €${(projectRevenue - projectExpenses).toLocaleString()}
            </p>
          </div>
        `);

        // Add marker to map
        new mapboxgl.Marker(markerElement)
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [projects, mapboxToken, activeView]);

  const switchView = (view: 'world' | 'spain') => {
    setActiveView(view);
    if (map.current) {
      if (view === 'spain') {
        map.current.flyTo({
          center: [-3.7038, 40.4168],
          zoom: 5,
          duration: 1500
        });
      } else {
        map.current.flyTo({
          center: [0, 20],
          zoom: 1.5,
          duration: 1500
        });
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Badge 
          variant={activeView === 'spain' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => switchView('spain')}
        >
          <MapPin className="w-3 h-3 mr-1" />
          España
        </Badge>
        <Badge 
          variant={activeView === 'world' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => switchView('world')}
        >
          <Building className="w-3 h-3 mr-1" />
          Mundial
        </Badge>
      </div>
      
      <div ref={mapContainer} className="h-96 w-full rounded-lg" />
      
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
          <span className="text-sm text-gray-600">Proyectos Activos</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full border border-white"></div>
          <span className="text-sm text-gray-600">Proyectos Completados</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-500 rounded-full border border-white"></div>
          <span className="text-sm text-gray-600">Proyectos Pausados</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;
