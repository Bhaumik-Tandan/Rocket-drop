#!/usr/bin/env python3
"""
Asset Extraction Script for Cosmic Dash
Extracts app icon and splash screen from a combined image
"""

import cv2
import numpy as np
import os
from PIL import Image, ImageDraw, ImageFont
import argparse

def detect_rounded_rectangle(image):
    """
    Detect rounded rectangle (app icon) in the image
    """
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply edge detection
    edges = cv2.Canny(gray, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find the largest contour (should be the app icon)
    if contours:
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Get bounding rectangle
        x, y, w, h = cv2.boundingRect(largest_contour)
        
        # Add padding to ensure we get the full icon
        padding = 20
        x = max(0, x - padding)
        y = max(0, y - padding)
        w = min(image.shape[1] - x, w + 2 * padding)
        h = min(image.shape[0] - y, h + 2 * padding)
        
        return (x, y, w, h)
    
    return None

def detect_rectangle(image):
    """
    Detect rectangular splash screen in the image
    """
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply edge detection
    edges = cv2.Canny(gray, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find rectangular contours (splash screen should be more rectangular)
    rectangles = []
    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 1000:  # Filter out small contours
            x, y, w, h = cv2.boundingRect(contour)
            aspect_ratio = w / h if h > 0 else 0
            
            # Look for rectangular shapes (aspect ratio between 0.3 and 0.8 for splash screen)
            if 0.3 <= aspect_ratio <= 0.8:
                rectangles.append((x, y, w, h, area))
                print(f"Found rectangle: {x}, {y}, {w}, {h}, aspect_ratio: {aspect_ratio:.2f}, area: {area}")
    
    if rectangles:
        # Get the largest rectangular contour
        largest_rect = max(rectangles, key=lambda x: x[4])
        x, y, w, h, _ = largest_rect
        
        # Add padding
        padding = 20
        x = max(0, x - padding)
        y = max(0, y - padding)
        w = min(image.shape[1] - x, w + 2 * padding)
        h = min(image.shape[0] - y, h + 2 * padding)
        
        return (x, y, w, h)
    
    return None

def extract_icon(image_path, output_dir="extracted_assets"):
    """
    Extract app icon from the image
    """
    # Read image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not read image {image_path}")
        return None
    
    # Detect app icon
    icon_bbox = detect_rounded_rectangle(image)
    if icon_bbox is None:
        print("Could not detect app icon")
        return None
    
    x, y, w, h = icon_bbox
    
    # Crop the icon
    icon = image[y:y+h, x:x+w]
    
    # Resize to 1024x1024 (Expo app icon size)
    icon_resized = cv2.resize(icon, (1024, 1024))
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save icon
    icon_path = os.path.join(output_dir, "app-icon.png")
    cv2.imwrite(icon_path, icon_resized)
    
    print(f"App icon extracted and saved to: {icon_path}")
    return icon_path

def extract_splash_screen(image_path, output_dir="extracted_assets"):
    """
    Extract splash screen from the image
    """
    # Read image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not read image {image_path}")
        return None
    
    # Detect splash screen
    splash_bbox = detect_rectangle(image)
    if splash_bbox is None:
        print("Could not detect splash screen")
        return None
    
    x, y, w, h = splash_bbox
    
    # Crop the splash screen
    splash = image[y:y+h, x:x+w]
    
    # Resize to 400x800 (Expo splash screen size)
    splash_resized = cv2.resize(splash, (400, 800))
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save splash screen
    splash_path = os.path.join(output_dir, "splash-screen.png")
    cv2.imwrite(splash_path, splash_resized)
    
    print(f"Splash screen extracted and saved to: {splash_path}")
    return splash_path

def create_svg_from_image(image_path, output_dir="extracted_assets"):
    """
    Create SVG versions from the extracted images
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # App icon SVG template
    icon_svg = '''<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#0A0A1A"/>
      <stop offset="70%" stop-color="#0B0B2A"/>
      <stop offset="100%" stop-color="#08081E"/>
    </radialGradient>
    <radialGradient id="planet" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#87CEEB"/>
      <stop offset="100%" stop-color="#4A90E2"/>
    </radialGradient>
    <radialGradient id="moon" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#F5F5F5"/>
      <stop offset="100%" stop-color="#D3D3D3"/>
    </radialGradient>
    <linearGradient id="ufo" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C2C"/>
      <stop offset="50%" stop-color="#404040"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <radialGradient id="ufoDome" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#87CEEB"/>
      <stop offset="100%" stop-color="#4A90E2"/>
    </radialGradient>
    <symbol id="star">
      <circle r="1.2" fill="#FFFFFF" opacity="0.8"/>
    </symbol>
  </defs>
  <rect width="1024" height="1024" rx="200" fill="url(#bg)"/>
  <g opacity="0.7">
    <use href="#star" x="160" y="200"/>
    <use href="#star" x="320" y="150" transform="scale(0.85)"/>
    <use href="#star" x="520" y="230" transform="scale(1.1)"/>
    <use href="#star" x="740" y="180"/>
    <use href="#star" x="870" y="290" transform="scale(0.9)"/>
    <use href="#star" x="220" y="420" transform="scale(1.1)"/>
    <use href="#star" x="820" y="470" transform="scale(0.8)"/>
    <use href="#star" x="300" y="650"/>
    <use href="#star" x="520" y="710" transform="scale(0.9)"/>
    <use href="#star" x="780" y="760"/>
  </g>
  <g transform="translate(150, 750)">
    <circle cx="0" cy="0" r="50" fill="url(#planet)"/>
    <circle cx="-12" cy="-12" r="10" fill="#4A90E2" opacity="0.6"/>
    <circle cx="16" cy="8" r="6" fill="#4A90E2" opacity="0.4"/>
  </g>
  <g transform="translate(750, 180)">
    <circle cx="0" cy="0" r="35" fill="url(#moon)"/>
    <circle cx="-8" cy="-8" r="7" fill="#E0E0E0" opacity="0.6"/>
    <circle cx="12" cy="4" r="4" fill="#E0E0E0" opacity="0.4"/>
  </g>
  <g>
    <rect x="60" y="120" width="70" height="784" fill="#2C2C2C" rx="15"/>
    <rect x="70" y="140" width="50" height="744" fill="#1A1A1A" rx="12"/>
    <rect x="80" y="160" width="30" height="704" fill="#404040" rx="8"/>
    <rect x="894" y="120" width="70" height="784" fill="#2C2C2C" rx="15"/>
    <rect x="904" y="140" width="50" height="744" fill="#1A1A1A" rx="12"/>
    <rect x="914" y="160" width="30" height="704" fill="#404040" rx="8"/>
  </g>
  <g transform="translate(512, 480)">
    <ellipse cx="0" cy="0" rx="70" ry="22" fill="url(#ufo)"/>
    <ellipse cx="0" cy="0" rx="60" ry="18" fill="#1A1A1A" opacity="0.8"/>
    <ellipse cx="0" cy="-12" rx="45" ry="18" fill="url(#ufoDome)"/>
    <ellipse cx="0" cy="-12" rx="35" ry="14" fill="#4A90E2" opacity="0.6"/>
    <ellipse cx="-25" cy="0" rx="7" ry="3" fill="#FFD700"/>
    <ellipse cx="25" cy="0" rx="7" ry="3" fill="#FFD700"/>
    <ellipse cx="0" cy="8" rx="5" ry="2" fill="#FFD700"/>
    <ellipse cx="0" cy="25" rx="50" ry="18" fill="#FF6B35" opacity="0.8"/>
    <ellipse cx="0" cy="30" rx="35" ry="13" fill="#FFD700" opacity="0.9"/>
    <ellipse cx="0" cy="35" rx="18" ry="8" fill="#FFFFFF" opacity="0.7"/>
    <ellipse cx="0" cy="0" rx="85" ry="35" fill="#87CEEB" opacity="0.1"/>
  </g>
</svg>'''
    
    # Splash screen SVG template
    splash_svg = '''<svg width="400" height="800" viewBox="0 0 400 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0A1A"/>
      <stop offset="60%" stop-color="#0B0B2A"/>
      <stop offset="100%" stop-color="#08081E"/>
    </linearGradient>
    <radialGradient id="planet" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#87CEEB"/>
      <stop offset="100%" stop-color="#4A90E2"/>
    </radialGradient>
    <radialGradient id="moon" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#F5F5F5"/>
      <stop offset="100%" stop-color="#D3D3D3"/>
    </radialGradient>
    <linearGradient id="ufo" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C2C2C"/>
      <stop offset="50%" stop-color="#404040"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <radialGradient id="ufoDome" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#87CEEB"/>
      <stop offset="100%" stop-color="#4A90E2"/>
    </radialGradient>
    <symbol id="star">
      <circle r="1" fill="#FFFFFF" opacity="0.7"/>
    </symbol>
  </defs>
  <rect width="400" height="800" fill="url(#bg)"/>
  <g opacity="0.6">
    <use href="#star" x="36" y="72"/>
    <use href="#star" x="110" y="96" transform="scale(1.2)"/>
    <use href="#star" x="312" y="88" />
    <use href="#star" x="360" y="160" transform="scale(0.9)"/>
    <use href="#star" x="64" y="200"/>
    <use href="#star" x="192" y="150" transform="scale(1.1)"/>
    <use href="#star" x="300" y="240"/>
    <use href="#star" x="80" y="320"/>
    <use href="#star" x="340" y="360"/>
    <use href="#star" x="220" y="420"/>
    <use href="#star" x="70" y="520"/>
    <use href="#star" x="300" y="580"/>
    <use href="#star" x="180" y="740"/>
  </g>
  <g transform="translate(60, 650)">
    <circle cx="0" cy="0" r="25" fill="url(#planet)"/>
    <circle cx="-6" cy="-6" r="5" fill="#4A90E2" opacity="0.6"/>
    <circle cx="8" cy="4" r="3" fill="#4A90E2" opacity="0.4"/>
  </g>
  <g transform="translate(280, 100)">
    <circle cx="0" cy="0" r="18" fill="url(#moon)"/>
    <circle cx="-4" cy="-4" r="3" fill="#E0E0E0" opacity="0.6"/>
    <circle cx="6" cy="2" r="2" fill="#E0E0E0" opacity="0.4"/>
  </g>
  <g>
    <rect x="25" y="60" width="35" height="680" fill="#2C2C2C" rx="8"/>
    <rect x="30" y="70" width="25" height="660" fill="#1A1A1A" rx="6"/>
    <rect x="35" y="80" width="15" height="640" fill="#404040" rx="4"/>
    <rect x="340" y="60" width="35" height="680" fill="#2C2C2C" rx="8"/>
    <rect x="345" y="70" width="25" height="660" fill="#1A1A1A" rx="6"/>
    <rect x="350" y="80" width="15" height="640" fill="#404040" rx="4"/>
  </g>
  <g transform="translate(280, 180)">
    <path d="M0,0 L-50,35" stroke="#4A90E2" stroke-width="2" opacity="0.8"/>
    <path d="M0,0 L-40,30" stroke="#87CEEB" stroke-width="1" opacity="0.9"/>
  </g>
  <g transform="translate(200, 160)" text-anchor="middle" font-family="Arial, sans-serif">
    <text y="0" font-size="40" font-weight="bold" fill="#FFFFFF">COSMIC</text>
    <text y="45" font-size="40" font-weight="bold" fill="#FFFFFF">DASH</text>
    <text y="75" font-size="14" fill="#BFC7D6" opacity="0.85">Space Adventure</text>
  </g>
  <g transform="translate(200, 480)">
    <ellipse cx="0" cy="0" rx="35" ry="11" fill="url(#ufo)"/>
    <ellipse cx="0" cy="0" rx="30" ry="9" fill="#1A1A1A" opacity="0.8"/>
    <ellipse cx="0" cy="-6" rx="22" ry="9" fill="url(#ufoDome)"/>
    <ellipse cx="0" cy="-6" rx="18" ry="7" fill="#4A90E2" opacity="0.6"/>
    <ellipse cx="-12" cy="0" rx="3" ry="1.5" fill="#FFD700"/>
    <ellipse cx="12" cy="0" rx="3" ry="1.5" fill="#FFD700"/>
    <ellipse cx="0" cy="4" rx="2" ry="1" fill="#FFD700"/>
    <ellipse cx="0" cy="12" rx="25" ry="9" fill="#FF6B35" opacity="0.8"/>
    <ellipse cx="0" cy="15" rx="18" ry="7" fill="#FFD700" opacity="0.9"/>
    <ellipse cx="0" cy="18" rx="9" ry="4" fill="#FFFFFF" opacity="0.7"/>
    <ellipse cx="0" cy="0" rx="42" ry="18" fill="#87CEEB" opacity="0.1"/>
  </g>
</svg>'''
    
    # Save SVG files
    icon_svg_path = os.path.join(output_dir, "app-icon.svg")
    splash_svg_path = os.path.join(output_dir, "splash-screen.svg")
    
    with open(icon_svg_path, 'w') as f:
        f.write(icon_svg)
    
    with open(splash_svg_path, 'w') as f:
        f.write(splash_svg)
    
    print(f"SVG files created:")
    print(f"  - {icon_svg_path}")
    print(f"  - {splash_svg_path}")

def main():
    parser = argparse.ArgumentParser(description='Extract app icon and splash screen from image')
    parser.add_argument('image_path', help='Path to the input image')
    parser.add_argument('--output-dir', default='extracted_assets', help='Output directory')
    parser.add_argument('--svg-only', action='store_true', help='Create only SVG files')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.image_path):
        print(f"Error: Image file {args.image_path} not found")
        return
    
    print(f"Processing image: {args.image_path}")
    print(f"Output directory: {args.output_dir}")
    
    if not args.svg_only:
        # Extract PNG versions
        icon_path = extract_icon(args.image_path, args.output_dir)
        splash_path = extract_splash_screen(args.image_path, args.output_dir)
    
    # Create SVG versions
    create_svg_from_image(args.image_path, args.output_dir)
    
    print("\n✅ Asset extraction complete!")
    print(f"Check the '{args.output_dir}' directory for extracted files.")

if __name__ == "__main__":
    main() 