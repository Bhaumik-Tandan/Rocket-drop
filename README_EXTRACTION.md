# Asset Extraction Script for Cosmic Dash

This script extracts app icon and splash screen from a combined image and creates both PNG and SVG versions optimized for Expo.

## Features

- **Automatic Detection**: Uses computer vision to detect app icon (rounded rectangle) and splash screen (rectangle)
- **Expo Optimization**: Resizes assets to exact Expo requirements (1024x1024 for icon, 400x800 for splash)
- **Multiple Formats**: Creates both PNG and SVG versions
- **Smart Cropping**: Adds padding to ensure no important elements are cut off

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage
```bash
python extract_assets.py your_image.png
```

### Advanced Options
```bash
# Specify custom output directory
python extract_assets.py your_image.png --output-dir my_assets

# Create only SVG files (skip PNG extraction)
python extract_assets.py your_image.png --svg-only
```

## Input Image Requirements

The script expects an image with:
- **Left side**: App icon (rounded square with space theme)
- **Right side**: Splash screen (vertical rectangle with space theme)

## Output Files

The script creates the following files in the output directory:

### PNG Files (if not using --svg-only)
- `app-icon.png` (1024x1024) - Expo app icon
- `splash-screen.png` (400x800) - Expo splash screen

### SVG Files
- `app-icon.svg` (1024x1024) - Vector app icon
- `splash-screen.svg` (400x800) - Vector splash screen

## Example Usage

```bash
# Extract from a combined image
python extract_assets.py combined_assets.png

# Output will be in 'extracted_assets' directory:
# - app-icon.png
# - splash-screen.png  
# - app-icon.svg
# - splash-screen.svg
```

## Technical Details

### Detection Algorithm
- **App Icon**: Detects largest contour (assumed to be the rounded square icon)
- **Splash Screen**: Detects rectangular contours with aspect ratio 0.4-0.6
- **Padding**: Adds 20px padding to prevent cropping

### Expo Compliance
- **App Icon**: 1024x1024 with 200px rounded corners
- **Splash Screen**: 400x800 optimized for mobile screens
- **SVG Format**: Vector graphics for crisp scaling

### Error Handling
- Validates input image exists
- Handles detection failures gracefully
- Creates output directories automatically

## Troubleshooting

### Common Issues

1. **"Could not detect app icon"**
   - Ensure the image has a clear rounded square on the left
   - Check that the image isn't too blurry or low resolution

2. **"Could not detect splash screen"**
   - Ensure the image has a clear rectangular splash screen on the right
   - Verify the aspect ratio is roughly 0.5 (width/height)

3. **"Could not read image"**
   - Check that the image file exists and is a supported format (PNG, JPG, etc.)

### Tips for Best Results

- Use high-resolution images (at least 2048x1024)
- Ensure good contrast between elements
- Avoid images with too many overlapping elements
- Test with the provided example image first

## Integration with Expo

After extraction, copy the files to your Expo project:

```bash
# Copy to your Expo project
cp extracted_assets/app-icon.svg assets/
cp extracted_assets/splash-screen.svg assets/
```

Then update your `app.json`:

```json
{
  "expo": {
    "icon": "./assets/app-icon.svg",
    "splash": {
      "image": "./assets/splash-screen.svg",
      "resizeMode": "contain",
      "backgroundColor": "#0A0A1A"
    }
  }
}
``` 