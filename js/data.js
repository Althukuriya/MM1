// js/data.js
// Global variables
window.allVehicles = [];
window.currentVehicle = null;

// Google Sheets CSV URL - REPLACE WITH YOUR PUBLISHED LINK
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmqHEH0b4l4JYMIEM0N6hnH55elmZMKtBie2cDRYGDb_YGMAe0d7ZKe18srlr23ReTJWYv_ECfTSMm/pub?gid=596049360&single=true&output=csv";

// Demo vehicles (fallback)
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
        status: "Available",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
        status: "Available",
        youtube: ""
    },
    {
        id: 3,
        name: "Toyota Camry 2022",
        type: "Car",
        year: 2022,
        price: 28000,
        image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
        images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600"],
        status: "Sold",
        youtube: ""
    },
    {
        id: 4,
        name: "Royal Enfield Classic 350",
        type: "Bike",
        year: 2023,
        price: 18000,
        image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600",
        images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600"],
        status: "Available",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
];

// Main function to fetch vehicles
async function fetchVehiclesFromSheet() {
    try {
        console.log("Fetching data from Google Sheets...");
        
        // Try to fetch from Google Sheets
        const response = await fetch(GOOGLE_SHEETS_CSV_URL + '&_=' + Date.now(), {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        if (csvText && csvText.length > 50) {
            const vehicles = parseCSV(csvText);
            if (vehicles.length > 0) {
                window.allVehicles = vehicles;
                console.log(`✅ Loaded ${vehicles.length} vehicles from sheet`);
                return vehicles;
            }
        }
        
        // Fallback to demo data
        console.log("Using demo data");
        window.allVehicles = DEMO_VEHICLES;
        return DEMO_VEHICLES;
        
    } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Using demo data");
        window.allVehicles = DEMO_VEHICLES;
        return DEMO_VEHICLES;
    }
}

// Parse CSV to vehicle objects
function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const vehicles = [];
    
    for (let i = 1; i < Math.min(lines.length, 10); i++) {
        try {
            const values = parseCSVLine(lines[i]);
            
            const vehicle = {
                id: i,
                name: getValueByHeader(headers, values, 'Vehicle Name') || `Vehicle ${i}`,
                type: getValueByHeader(headers, values, 'Vehicle Type') || 'Car',
                year: parseInt(getValueByHeader(headers, values, 'Model Year')) || 2023,
                price: parseFloat(getValueByHeader(headers, values, 'Price (INR or USD)')) || 20000,
                image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600",
                images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600"],
                status: (getValueByHeader(headers, values, 'STATUS') || 'Available').toUpperCase(),
                youtube: getValueByHeader(headers, values, 'YouTube Video Link (Optional Walkthrough/Review)') || ''
            };
            
            vehicles.push(vehicle);
        } catch (err) {
            console.warn("Error parsing row:", err);
        }
    }
    
    return vehicles;
}

// Helper to parse CSV line
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of line) {
        if (char === '"' && !inQuotes) {
            inQuotes = true;
        } else if (char === '"' && inQuotes) {
            inQuotes = false;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values.map(v => v.replace(/^"|"$/g, '').trim());
}

// Helper to get value by header
function getValueByHeader(headers, values, headerName) {
    const index = headers.findIndex(h => h.includes(headerName));
    return index !== -1 && values[index] ? values[index] : '';
}

// Get YouTube videos
function getYouTubeVideosFromVehicles() {
    return window.allVehicles
        .filter(v => v.youtube && v.youtube.trim() !== '')
        .slice(0, 3)
        .map(v => ({
            id: v.id,
            title: v.name,
            thumbnail: v.image,
            videoUrl: v.youtube
        }));
}

// Format price
function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}