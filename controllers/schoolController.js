import { addSchool, getAllSchools } from "../models/schoolModel.js";

/**
 * Add a new school to the database
 */
export async function addSchoolController(req, res) {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    await addSchool(name, address, latitude, longitude);
    res.status(201).json({ message: "School added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error!" });
  }
}

/**
 * Get all schools sorted by proximity to user's location
 */
export async function listSchoolsController(req, res) {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "Latitude and longitude are required!" });
  }

  try {
    const schools = await getAllSchools();
    
    // Convert input to float
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // Function to calculate distance (Haversine Formula)
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in km
      const toRad = (value) => (value * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    }

    // Calculate distance for each school and sort by proximity
    const sortedSchools = schools.map(school => ({
      ...school,
      distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error!" });
  }
}
