// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2,
    1, 1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Variables to manage zoom and pan
let zoomLevel = 1;
let panOffset = { x: 0, y: 0 };

// Fetch the data from server
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        // Sort data by x value (optional, depends on the data structure)
        data.sort((a, b) => a.x - b.x);

        // Create geometry for the line
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        // Map data points to 2D vertices
        data.forEach(point => {
            vertices.push(point.x - 500, point.y - 50, 0); // Center the graph
        });

        // Add vertices to the geometry
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        // Create a material for the line
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

        // Create a line using the geometry and material
        const line = new THREE.Line(geometry, material);
        scene.add(line);

        // Add X axis (horizontal line)
        const xAxisGeometry = new THREE.BufferGeometry();
        xAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([-500, 0, 0, 500, 0, 0], 3));
        const xAxisMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
        scene.add(xAxis);

        // Add Y axis (vertical line)
        const yAxisGeometry = new THREE.BufferGeometry();
        yAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, -50, 0, 0, 50, 0], 3));
        const yAxisMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
        scene.add(yAxis);

        // Initial render
        render();
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to render the scene
function render() {
    // Apply zoom and pan transformations
    camera.left = (window.innerWidth / -2) * zoomLevel + panOffset.x;
    camera.right = (window.innerWidth / 2) * zoomLevel + panOffset.x;
    camera.top = (window.innerHeight / 2) * zoomLevel + panOffset.y;
    camera.bottom = (window.innerHeight / -2) * zoomLevel + panOffset.y;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
});

// Handle mouse wheel for zoom
window.addEventListener('wheel', (event) => {
    const zoomSpeed = 0.1;
    zoomLevel += event.deltaY * zoomSpeed * 0.01;
    zoomLevel = Math.max(0.1, Math.min(zoomLevel, 10)); // Clamp zoom level between 0.1 and 10
    render();
});

// Handle mouse move for pan
let isPanning = false;
let startPan = { x: 0, y: 0 };

window.addEventListener('mousedown', (event) => {
    isPanning = true;
    startPan.x = event.clientX;
    startPan.y = event.clientY;
});

window.addEventListener('mousemove', (event) => {
    if (isPanning) {
        const panSpeed = 0.5 / zoomLevel;
        const deltaX = (event.clientX - startPan.x) * panSpeed;
        const deltaY = (startPan.y - event.clientY) * panSpeed;

        panOffset.x -= deltaX;
        panOffset.y -= deltaY;

        startPan.x = event.clientX;
        startPan.y = event.clientY;

        render();
    }
});

window.addEventListener('mouseup', () => {
    isPanning = false;
});
