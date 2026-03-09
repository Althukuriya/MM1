// js/data.js - COMPLETELY UPDATED AND WORKING VERSION

// Your Google Sheets CSV URL
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1pstK8BTamjt-LTSDJ40d6OdayNmT5NQp1Y4inx6pvMuBQ68at3tbkJDyy6NiqMfOZ1mB9AXE6_v/pub?gid=1146903494&single=true&output=csv";

// Global vehicles array
window.allVehicles = [];

/**
 * Fetch vehicles from Google Sheets
 * Column mapping based on your sheet:
 * 0: Timestamp, 1: Vehicle Name, 2: Vehicle Type, 3: Model Year,
 * 4: Price, 5-9: Images 1-5, 10: YouTube Link, 11: STATUS
 */
async function fetchVehiclesFromSheet() {
    try {
        console.log("🚗 Fetching vehicles from Google Sheets...");
        
        // Add timestamp to prevent caching
        const response = await fetch(SHEET_URL + "&t=" + Date.now());
        const text = await response.text();
        
        console.log("📊 CSV data received, length:", text.length);
        
        // Split into lines and parse
        const lines = text.split("\n");
        const vehicles = [];
        
        // Skip header row (i starts at 1)
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(",");
            
            // Skip empty rows
            if (!row[1] || row[1].trim() === "") continue;
            
            // Get status and normalize
            const status = (row[11] || "AVAILABLE").trim().toUpperCase();
            
            // IMPORTANT: Skip vehicles marked as HIDE
            if (status === "HIDE") {
                console.log(`👻 Hiding vehicle: ${row[1]}`);
                continue;
            }
            
            // Collect all available images (columns 5-9)
            const images = [];
            for (let j = 5; j <= 9; j++) {
                if (row[j] && row[j].trim() !== "" && row[j].startsWith("http")) {
                    images.push(row[j].trim());
                }
            }
            
            // Create vehicle object
            const vehicle = {
                id: i,
                name: row[1]?.trim() || "Unknown Vehicle",
                type: row[2]?.trim() || "Car",
                year: parseInt(row[3]) || 2024,
                price: parseFloat(row[4]) || 0,
                image: images[0] || "https://placehold.co/600x400/0A1929/FFFFFF?text=No+Image",
                images: images.length ? images : ["https://placehold.co/600x400/0A1929/FFFFFF?text=No+Image"],
                youtube: row[10]?.trim() || "",
                status: status
            };
            
            vehicles.push(vehicle);
            console.log(`✅ Added: ${vehicle.name} (${vehicle.status})`);
        }
        
        console.log(`🎉 Total vehicles loaded: ${vehicles.length}`);
        window.allVehicles = vehicles;
        return vehicles;
        
    } catch (error) {
        console.error("❌ Sheet load failed:", error);
        console.log("⚠️ Using fallback demo data");
        
        // Return demo data as fallback
        const demoVehicles = getDemoVehicles();
        window.allVehicles = demoVehicles;
        return demoVehicles;
    }
}

/**
 * Fallback demo vehicles if sheet fails
 */
function getDemoVehicles() {
    return [
        {
            id: 1,
            name: "Honda Civic 2022",
            type: "Car",
            year: 2022,
            price: 22000,
            image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
            images: [
                "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
                "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600",
                "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600"
            ],
            youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            status: "AVAILABLE"
        },
        {
            id: 2,
            name: "Yamaha R15 V4",
            type: "Bike",
            year: 2023,
            price: 15000,
            image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600",
            images: [
                "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600",
                "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600"
            ],
            youtube: "",
            status: "AVAILABLE"
        },
        {
            id: 3,
            name: "Toyota Camry 2022",
            type: "Car",
            year: 2022,
            price: 28000,
            image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
            images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600"],
            youtube: "",
            status: "SOLD"
        },
        {
            id: 4,
            name: "Royal Enfield Classic 350",
            type: "Bike",
            year: 2023,
            price: 18000,
            image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600",
            images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600"],
            youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            status: "AVAILABLE"
        }
    ];
}

/**
 * Format price in Indian Rupees
 */
function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

/**
 * Extract YouTube videos from vehicles
 */
function getYouTubeVideosFromVehicles(vehicles = window.allVehicles) {
    return vehicles
        .filter(v => v.youtube && v.youtube.trim() !== "")
        .slice(0, 3)
        .map(v => ({
            id: v.id,
            title: v.name,
            thumbnail: v.image,
            videoUrl: v.youtube
        }));
}

// Auto-fetch when script loads (optional - you can also call this manually)
if (typeof window !== 'undefined') {
    // Don't auto-fetch here - let individual pages control when to fetch
    console.log("📦 data.js loaded, ready to fetch vehicles");
}
