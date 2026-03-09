// js/data.js
// GOOGLE SHEETS CSV URL - MAKE SURE THIS IS CORRECT
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmqHEH0b4l4JYMIEM0N6hnH55elmZMKtBie2cDRYGDb_YGMAe0d7ZKe18srlr23ReTJWYv_ECfTSMm/pub?output=csv";

// Store vehicles globally
window.allVehicles = [];

// ========== DEFINE FUNCTIONS FIRST ==========

// Demo data
const DEMO_VEHICLES = [
    {
        id: 1,
        name: "Honda Civic 2022",
        type: "Car",
        year: 2022,
        price: 22000,
        image: "https://placehold.co/600x400/0A1929/FFFFFF?text=Honda+Civic",
        images: ["https://placehold.co/600x400/0A1929/FFFFFF?text=Honda+Civic+1"],
        status: "AVAILABLE",
        youtube: ""
    },
    {
        id: 2,
        name: "Yamaha R15 V4",
        type: "Bike",
        year: 2023,
        price: 1800,
        image: "https://placehold.co/600x400/1E88E5/FFFFFF?text=Yamaha+R15",
        images: ["https://placehold.co/600x400/1E88E5/FFFFFF?text=Yamaha+R15+1"],
        status: "AVAILABLE",
        youtube: "https://youtu.be/JfYui0H1gRk"
    },
    {
        id: 3,
        name: "Toyota Fortuner",
        type: "Car",
        year: 2021,
        price: 45000,
        image: "https://placehold.co/600x400/FF6B35/FFFFFF?text=Toyota+Fortuner",
        images: ["https://placehold.co/600x400/FF6B35/FFFFFF?text=Toyota+Fortuner+1"],
        status: "AVAILABLE",
        youtube: ""
    },
    {
        id: 4,
        name: "Royal Enfield Classic 350",
        type: "Bike",
        year: 2023,
        price: 2200,
        image: "https://placehold.co/600x400/4CAF50/FFFFFF?text=Royal+Enfield",
        images: ["https://placehold.co/600x400/4CAF50/FFFFFF?text=Royal+Enfield+1"],
        status: "AVAILABLE",
        youtube: "https://youtu.be/JfYui0H1gRk"
    }
];

// Parse a single CSV line handling quotes
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
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
    return values.map(v => v.trim());
}

// Get value by header name
function getValueByHeader(values, headers, headerName) {
    const index = headers.findIndex(h => 
        h.toLowerCase().includes(headerName.toLowerCase()) || 
        headerName.toLowerCase().includes(h.toLowerCase())
    );
    
    if (index !== -1 && values[index] && values[index] !== '') {
        return values[index].replace(/^"|"$/g, '').trim();
    }
    return '';
}

// Parse CSV to vehicle objects
function parseCSV(csvText) {
    console.log("Parsing CSV data...");
    
    // Split into lines and clean
    const lines = csvText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    if (lines.length < 2) {
        console.log("CSV has no data rows");
        return [];
    }
    
    // Parse headers
    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine).map(h => h.replace(/^"|"$/g, '').trim());
    console.log("📋 CSV Headers:", headers);
    
    const vehicles = [];
    
    // Process each data row
    for (let i = 1; i < lines.length; i++) {
        try {
            const values = parseCSVLine(lines[i]);
            
            // Get values
            const name = getValueByHeader(values, headers, 'Vehicle Name');
            const type = getValueByHeader(values, headers, 'Vehicle Type');
            const yearStr = getValueByHeader(values, headers, 'Model Year');
            const priceStr = getValueByHeader(values, headers, 'Price');
            const status = getValueByHeader(values, headers, 'STATUS');
            const youtube = getValueByHeader(values, headers, 'YouTube');
            
            // Get images
            const images = [];
            const img1 = getValueByHeader(values, headers, 'Image 1');
            const img2 = getValueByHeader(values, headers, 'Image 2');
            const img3 = getValueByHeader(values, headers, 'Image 3');
            const img4 = getValueByHeader(values, headers, 'Image 4');
            const img5 = getValueByHeader(values, headers, 'Image 5');
            
            if (img1 && img1.startsWith('http')) images.push(img1);
            if (img2 && img2.startsWith('http')) images.push(img2);
            if (img3 && img3.startsWith('http')) images.push(img3);
            if (img4 && img4.startsWith('http')) images.push(img4);
            if (img5 && img5.startsWith('http')) images.push(img5);
            
            // Parse year and price
            const year = parseInt(yearStr) || 2023;
            const price = parseFloat(priceStr) || 0;
            
            // Only add if we have valid data
            if (name && name !== 'Vehicle Name' && price > 0) {
                const vehicle = {
                    id: i,
                    name: name,
                    type: type || 'Car',
                    year: year,
                    price: price,
                    image: images.length > 0 ? images[0] : 'https://placehold.co/600x400/0A1929/FFFFFF?text=No+Image',
                    images: images.length > 0 ? images : ['https://placehold.co/600x400/0A1929/FFFFFF?text=No+Image'],
                    status: status ? status.toUpperCase() : 'AVAILABLE',
                    youtube: youtube || '',
                };
                
                vehicles.push(vehicle);
                console.log(`✅ Added: ${vehicle.name}`);
            }
        } catch (err) {
            console.warn(`Error parsing row ${i}:`, err);
        }
    }
    
    console.log(`📊 Total vehicles parsed: ${vehicles.length}`);
    return vehicles;
}

// Load demo data
function loadDemoData() {
    console.log("📦 Loading demo data");
    window.allVehicles = DEMO_VEHICLES;
    return DEMO_VEHICLES;
}

// Main function to fetch vehicles from Google Sheets
async function fetchVehiclesFromSheet() {
    console.log("🔄 Fetching data from Google Sheets...");
    
    try {
        // Add cache busting
        const url = GOOGLE_SHEETS_CSV_URL + '&_=' + new Date().getTime();
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'text/csv',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log("✅ CSV data received, length:", csvText.length);
        console.log("First 200 chars:", csvText.substring(0, 200));
        
        if (csvText.length < 50) {
            console.warn("⚠️ CSV data too short, might be empty");
            return loadDemoData();
        }
        
        const vehicles = parseCSV(csvText);
        
        if (vehicles.length > 0) {
            console.log(`✅ Successfully loaded ${vehicles.length} vehicles from sheet`);
            window.allVehicles = vehicles;
            return vehicles;
        } else {
            console.log("⚠️ No vehicles found in sheet, loading demo data");
            return loadDemoData();
        }
    } catch (error) {
        console.error("❌ Error fetching from Google Sheets:", error);
        console.log("⚠️ Falling back to demo data");
        return loadDemoData();
    }
}

// Get YouTube videos from vehicles
function getYouTubeVideosFromVehicles(vehicles) {
    return vehicles
        .filter(v => v.youtube && v.youtube.trim() !== '')
        .slice(0, 6)
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

// Auto-fetch when script loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("📊 data.js loaded, fetching vehicles...");
    fetchVehiclesFromSheet();
});
