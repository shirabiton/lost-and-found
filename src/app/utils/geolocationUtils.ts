import { Circle } from "../types/props/circle";
import { Postion } from "../types/props/postion";

// Function to compute the distance between two geographical points
function computeDistance(center: { lat: number, lng: number }, point: { latitude: number, longitude: number }) {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = center.lat * Math.PI / 180;// Convert latitude of center to radians
    const φ2 = point.latitude * Math.PI / 180;// Latitude difference in radians
    const Δφ = (point.latitude - center.lat) * Math.PI / 180;// Longitude difference in radians
    const Δλ = (point.longitude - center.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +// Haversine formula part
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));// Haversine formula part

    return R * c;  // Returns distance in meters
}

// Function to check if a position point is inside a geographic circle
export const checkIfPointInsideCircle = (
    circle: Circle,
    position: Postion
) => {
    console.log("circle", circle);
    console.log("PoPostion", position);


    // Compute distance from position to circle center
    const distance = computeDistance(circle.center, position);

    // If distance is less than or equal to radius, the point is inside the circle
    return distance <= circle.radius;
};