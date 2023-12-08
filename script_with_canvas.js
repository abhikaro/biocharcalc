document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Fixed-size rectangle dimensions
    const fixedRectWidth = 300;
    const fixedRectHeight = 150;

    // Draw the fixed-size rectangle initially
    drawRectangle(50, 30, fixedRectWidth, fixedRectHeight, "rgba(52, 152, 219, 0.5)"); // Blue color for the fixed-size rectangle

    function drawRectangles(subplotLength, subplotBreadth) {
        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the fixed-size rectangle
        drawRectangle(50, 30, fixedRectWidth, fixedRectHeight, "rgba(52, 152, 219, 0.5)"); // Blue color for the fixed-size rectangle

        // Divide the fixed-size rectangle into four equal parts along the longer side
        const partWidth = fixedRectWidth / 4;
        const partHeight = fixedRectHeight;

        // Different colors for each subplot
        const subplotColors = ["rgba(255, 0, 0, 0.3)", "rgba(0, 255, 0, 0.3)", "rgba(0, 0, 255, 0.3)", "rgba(255, 0, 255, 0.7)"];
        // Display subplot dimensions for each part
        for (let col = 0; col < 4; col++) {
            const partX = 50 + col * partWidth;
            const partY = 30;

            // Draw boundary line for each subplot
            drawBoundary(partX, partY, partWidth, partHeight);

            // Draw subplot with different colors
            drawRectangle(partX, partY, partWidth, partHeight, subplotColors[col]);

            // Display dimensions along the boundaries
            displayDimensions(partX + partWidth / 2, partY - 5, subplotLength);
            displayDimensions(partX - 5, partY + partHeight / 2, subplotBreadth);

            displayText(partX + partWidth / 2, partY + 30, calculateAreaValue(subplotLength, subplotBreadth, col));
        }
    }

    function drawRectangle(x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }

    function drawBoundary(x, y, width, height) {
        ctx.strokeStyle = "#000"; // Black color for boundary
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    function displayDimensions(x, y, edgeDimension) {
        let unit = "mtrs";
        const unitSelect = document.getElementsByName("unit")[0];
        if (unitSelect.value === "feet") {
            unit = "ft";
        }
        const text = `${edgeDimension.toFixed(2)} ${unit}`;
        displayText(x, y, text);
    }

    function displayText(x, y, text) {
        ctx.fillStyle = "#000"; // Black color for text
        ctx.font = "bold 14px Arial"; // Bold text
       
        // Display text along the top edge
        ctx.fillText(text, x - ctx.measureText(text).width / 2, y);  
    }
    
    function calculateAreaValue(width, height, subplotIndex) {
    
        if (subplotIndex == 0) {
            return "No GeoMix"
        }
        // Calculate subplot area in square feet
        let subplotArea = width * height;
    
        // If the unit is in feet, convert area to square meters
        const unitSelect = document.getElementsByName("unit")[0];
        if (unitSelect.value === "feet") {
            subplotArea /= 10.764; // Convert from square feet to square meters
        }
    
        // Multiply by 2, 4, 8 for the second, third, and fourth subplot respectively
        const multiplier = [0, 2, 4, 8][subplotIndex];
        const weight = Math.round(subplotArea * multiplier * 2) / 2;
    
        return `${weight} Kgs`;
    }
    
    
    function getUnitLabel() {
        const unitSelect = document.getElementsByName("unit")[0];
        return unitSelect.value;
    }
    
    
    function calculateSubplots() {
        const lengthInput = document.getElementsByName("length")[0];
        const breadthInput = document.getElementsByName("breadth")[0];
        const unitSelect = document.getElementsByName("unit")[0];

        const length = parseFloat(lengthInput.value).toFixed(2);
        const breadth = parseFloat(breadthInput.value).toFixed(2);
        const unit = unitSelect.value;

        if (isNaN(length) || isNaN(breadth)) {
            alert("Please enter valid dimensions.");
            return;
        }

        // Determine the longer and shorter sides
        const longerSide = Math.max(length, breadth);
        const shorterSide = Math.min(length, breadth);

        // Calculate subplots
        const subplotLength = longerSide / 4;
        const subplotBreadth = shorterSide;

        // Display result
        drawRectangles(subplotLength, subplotBreadth);
    }

    // Attach the calculateSubplots function to the form submission event
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        calculateSubplots();
    });
});
