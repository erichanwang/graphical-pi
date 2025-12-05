# Graphical Pi

This project creates a graphical representation of Pi using two rotating lines. The inner line moves at a speed S, and the outer line moves at a speed pi*S. This creates a mesmerizing pattern that visualizes the transcendental number.

## Features

-   **Python and Web Versions:** The project includes a Python version using Pygame and a web version using HTML, CSS, and JavaScript.
-   **Trail Effect:** The outer line leaves a trail, creating a beautiful and intricate pattern over time.
-   **Zoom Functionality:** Both versions allow you to zoom in and out to get a closer look at the drawing.
-   **Speed Control:** You can adjust the speed of the animation in both versions.
-   **Two Zoom Modes:** Both versions have a "Toggle Follow" button to switch between a static, zoomed-out view and a zoomed-in view that follows the drawing.

## How to Run

### Python Version

1.  Navigate to the `python` directory.
2.  Install the required dependencies: `pip install -r requirements.txt`
3.  Run the script: `python main.py`

### Web Version

1.  Open the `index.html` file in your web browser.

### Cloudflare Pages Deployment

To deploy this project to Cloudflare Pages, you can connect your Git repository and use the following settings:

-   **Build command:** Leave this blank.
-   **Build output directory:** Leave this blank.
-   **Root directory:** `/`

Alternatively, you can use the Wrangler CLI to deploy the project. A `wrangler.toml` file is included in the project to simplify this process.

## Controls

### Python Version

-   **Speed:** Use the slider at the top left to control the speed of the animation.
-   **Zoom:** Use the `+` and `-` buttons to zoom in and out, or use the mouse wheel.
-   **Toggle Follow:** Click the "Toggle Follow" button to switch between the two zoom modes.

### Web Version

-   **Speed:** Use the slider at the top left to control the speed of the animation.
-   **Zoom:** Use the `+` and `-` buttons to zoom in and out, or use the mouse wheel.
-   **Toggle Follow:** Click the "Toggle Follow" button to switch between the two zoom modes.
