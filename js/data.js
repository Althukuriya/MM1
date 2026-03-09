// js/data.js - COMPLETE WORKING VERSION

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1pstK8BTamjt-LTSDJ40d6OdayNmT5NQp1Y4inx6pvMuBQ68at3tbkJDyy6NiqMfOZ1mB9AXE6_v/pub?gid=1146903494&single=true&output=csv";

// Global vehicles array
window.allVehicles = [];

// DEMO VEHICLES - FALLBACK DATA
const DEMO_VEHICLES = [
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

// Main function to fetch vehicles from Google Sheets
async function fetchVehiclesFromSheet() {
    try {
        console.log("Fetching data from Google Sheets...");
        
        // Add cache busting
        const url = SHEET_URL + '&_=' + new Date().getTime();
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log("CSV data received, length:", csvText.length);
        console.log("First 200 chars:", csvText.substring(0, 200));
        
        if (csvText.length < 10) {
            throw new Error("CSV data is too short");
        }
        
        // Parse the CSV data
        const vehicles = parseCSV(csvText);
        
        if (vehicles.length > 0) {
            console.log(`✅ Successfully loaded ${vehicles.length} vehicles from sheet`);
            window.allVehicles = vehicles;
            return vehicles;
        } else {
            console.log("No vehicles found in sheet, using demo data");
            window.allVehicles = DEMO_VEHICLES;
            return DEMO_VEHICLES;
        }
    } catch (error) {
        console.error("❌ Error fetching from Google Sheets:", error);
        console.log("Using demo data instead");
        window.allVehicles = DEMO_VEHICLES;
        return DEMO_VEHICLES;
    }
}

// Parse CSV to vehicle objects
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length < 2) {
        console.log("CSV has no data rows");
        return [];
    }
    
    const vehicles = [];
    
    // Skip header row (index 0), start from row 1
    for (let i = 1; i < lines.length; i++) {
        try {
            // Parse CSV line properly (handles quotes)
            const values = [];
            let currentValue = '';
            let insideQuotes = false;
            
            for (let char of lines[i]) {
                if (char === '"' && !insideQuotes) {
                    insideQuotes = true;
                } else if (char === '"' && insideQuotes) {
                    insideQuotes = false;
                } else if (char === ',' && !insideQuotes) {
                    values.push(currentValue);
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue); // Add last value
            
            // Clean up values (remove quotes)
            const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
            
            // Check if we have a vehicle name (column 1)
            if (!cleanValues[1] || cleanValues[1] === '') {
                continue; // Skip empty rows
            }
            
            // Get status from column 11 (or default to AVAILABLE)
            const status = (cleanValues[11] || "AVAILABLE").trim().toUpperCase();
            
            // Skip if HIDE
            if (status === "HIDE") {
                continue;
            }
            
            // Collect images (columns 5-9)
            const images = [];
            for (let j = 5; j <= 9; j++) {
                if (cleanValues[j] && cleanValues[j].startsWith('http')) {
                    images.push(cleanValues[j]);
                }
            }
            
            // Parse year and price
            const year = parseInt(cleanValues[3]) || 2024;
            const price = parseFloat(cleanValues[4]) || 0;
            
            const vehicle = {
                id: i,
                name: cleanValues[1] || "Unknown Vehicle",
                type: cleanValues[2] || "Car",
                year: year,
                price: price,
                image: images.length > 0 ? images[0] : "https://placehold.co/600x400/0A1929/FFFFFF?text=No+Image",
                images: images.length > 0 ? images : ["https://placehold.co/600x400/0A1929/FFFFFF?text=No+Image"],
                youtube: cleanValues[10] || "",
                status: status
            };
            
            vehicles.push(vehicle);
            console.log(`✅ Added vehicle: ${vehicle.name} (${vehicle.status})`);
            
        } catch (err) {
            console.warn(`Error parsing row ${i}:`, err);
        }
    }
    
    console.log(`📊 Parsed ${vehicles.length} vehicles from CSV`);
    return vehicles;
}

// Get YouTube videos from vehicles
function getYouTubeVideosFromVehicles(vehicles = window.allVehicles) {
    return vehicles
        .filter(v => v.youtube && v.youtube.trim() !== '')
        .slice(0, 3)
        .map(v => ({
            id: v.id,
            title: v.name,
            thumbnail: v.image,
            videoUrl: v.youtube
        }));
}

// Format price in Rupees
function formatPrice(price) {
    return `₹${Number(price).toLocaleString('en-IN')}`;
}

// Auto-run when script loads
console.log("📦 data.js loaded, ready to fetch vehicles");
