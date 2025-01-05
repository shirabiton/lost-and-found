import { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  Marker,
} from "@react-google-maps/api";
import { Circle } from "../../types/props/circle";

const Map: React.FC<{
  circles: Circle[];
  setCircles: (circles: Circle[]) => void;
}> = ({ circles, setCircles }) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager | null>(null);
  const [mapKey, setMapKey] = useState(0);

  const mapRef = useRef<google.maps.Map | null>(null);

  // Function to get the user's current location using the browser's geolocation API
  const getUserLocation = () => {
    if (navigator.geolocation && googleLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (window.google) {
            const userLatLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            setUserLocation(userLatLng);
          }
        },
        () => {
          console.error("Unable to find your location");
        }
      );
    }
  };

  // Function to handle drawing of a new circle
  const handleDrawCircle = (newCircle: google.maps.Circle) => {
    const circleData = {
      center: {
        lat: newCircle.getCenter()?.lat() || 0,
        lng: newCircle.getCenter()?.lng() || 0,
      },
      radius: newCircle.getRadius(),
    };
    setCircles([...circles, circleData]);
  };

  // Toggle the drawing mode between active and inactive
  const toggleDrawingMode = () => {
    if (drawingManager) {
      if (drawingMode) {
        drawingManager.setDrawingMode(null);
      } else {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
      }
      setDrawingMode(!drawingMode);
    } else {
      if (mapRef.current) {
        const newDrawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: false,
          circleOptions: {
            fillColor: "transparent",
            fillOpacity: 0,
            strokeColor: "#000",
            strokeWeight: 2,
          },
        });
        newDrawingManager.setMap(mapRef.current);
        setDrawingManager(newDrawingManager);
        newDrawingManager.setDrawingMode(
          google.maps.drawing.OverlayType.CIRCLE
        );
        setDrawingMode(true);
      }
    }
  };

  // Function to reset the circles on the map
  const handleResetCircles = () => {
    setCircles([]);
    setMapKey((prevKey) => prevKey + 1);
    setDrawingMode(false);
  };

  // Fetch the user's location once the Google Maps API has loaded
  useEffect(() => {
    if (googleLoaded) {
      getUserLocation();
    }
  }, [googleLoaded]);

  return (
    <div>
      <div className="buttons-container flex justify-between items-center mb-4">
        <button type="button" onClick={toggleDrawingMode} className="btn">
          {drawingMode ? "הפסק ציור" : "התחל ציור"}
        </button>
        <h4 className="font-bold mb-2">סמן את האזורים האבודים</h4>
        <button type="button" onClick={handleResetCircles} className="btn">
          איפוס
        </button>
      </div>
      <div className="border border-primary ">
        <LoadScript
          googleMapsApiKey="AIzaSyBNVjEXhyDOUvcCECJFY5x_OGKt38dxVBk"
          libraries={["drawing", "geometry"]}
          onLoad={() => setGoogleLoaded(true)}
        >
          <GoogleMap
            key={mapKey}
            mapContainerStyle={{ height: "500px", width: "100%" }}
            center={userLocation || { lat: 31.0461, lng: 34.8516 }}
            zoom={7}
            options={{
              restriction: {
                latLngBounds: {
                  north: 33.5,
                  south: 29.0,
                  west: 33.5,
                  east: 36.0,
                },
                strictBounds: true,
              },
              mapTypeControl: false,
              streetViewControl: false,
            }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {googleLoaded && (
              <div>
                <DrawingManager
                  onCircleComplete={handleDrawCircle}
                  drawingMode={
                    drawingMode ? google.maps.drawing.OverlayType.CIRCLE : null
                  }
                  options={{
                    drawingControl: false,
                    circleOptions: {
                      fillColor: "#c9c8c7",
                      fillOpacity: 0.3,
                      strokeColor: "#000",
                      strokeWeight: 2,
                    },
                  }}
                />
                {userLocation && (
                  <Marker position={userLocation} title="מיקומך הנוכחי" />
                )}
              </div>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default Map;
