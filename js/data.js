// js/data.js - UPDATED WITH YOUR LINK
// Google Sheets CSV URL - YOUR PUBLISHED LINK
const GOOGLE_SHEETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSE1pstK8BTamjt-LTSDJ40d6OdayNmT5NQp1Y4inx6pvMuBQ68at3tbkJDyy6NiqMfOZ1mB9AXE6_v/pub?gid=1146903494&single=true&output=csv";

// Main function to fetch vehicles from Google Sheets
async function fetchVehiclesFromSheet() {
    try {
        console.log("Fetching data from Google Sheets...");
        
        // Add cache busting
        const url = GOOGLE_SHEETS_CSV_URL + '&_=' + new Date().getTime();
        
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
        
        if (csvText.length < 10) {
            throw new Error("CSV data is too short");
        }
        
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
