#!/usr/bin/env python3
"""
Save the main image for asset extraction
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_main_image():
    """Create the main image with app icon and splash screen side by side"""
    
    # Create a wide image (2048x1024) to hold both assets
    width, height = 2048, 1024
    image = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(image)
    
    # Draw app icon on the left (square with rounded corners)
    icon_size = 800
    icon_x = 100
    icon_y = (height - icon_size) // 2
    
    # App icon background (deep dark blue space)
    draw.ellipse([icon_x, icon_y, icon_x + icon_size, icon_y + icon_size], 
                 fill=(10, 10, 26), outline=(20, 20, 40), width=5)
    
    # Draw stars in app icon
    for i in range(30):
        x = icon_x + 50 + (i * 25) % (icon_size - 100)
        y = icon_y + 50 + (i * 20) % (icon_size - 100)
        draw.ellipse([x-1, y-1, x+1, y+1], fill=(255, 255, 255))
    
    # Draw planet in bottom-left of app icon
    planet_x = icon_x + 100
    planet_y = icon_y + icon_size - 150
    draw.ellipse([planet_x, planet_y, planet_x + 80, planet_y + 80], 
                 fill=(135, 206, 235), outline=(74, 144, 226), width=2)
    
    # Draw moon in upper-right of app icon
    moon_x = icon_x + icon_size - 120
    moon_y = icon_y + 80
    draw.ellipse([moon_x, moon_y, moon_x + 60, moon_y + 60], 
                 fill=(245, 245, 245), outline=(211, 211, 211), width=2)
    
    # Draw rock pillars in app icon
    # Left pillar
    draw.rectangle([icon_x + 20, icon_y + 50, icon_x + 60, icon_y + icon_size - 50], 
                   fill=(44, 44, 44), outline=(26, 26, 26), width=2)
    # Right pillar
    draw.rectangle([icon_x + icon_size - 80, icon_y + 50, icon_x + icon_size - 40, icon_y + icon_size - 50], 
                   fill=(44, 44, 44), outline=(26, 26, 26), width=2)
    
    # Draw UFO in app icon
    ufo_x = icon_x + icon_size // 2
    ufo_y = icon_y + icon_size // 2 - 50
    
    # UFO body (metallic grey)
    draw.ellipse([ufo_x - 60, ufo_y - 20, ufo_x + 60, ufo_y + 20], 
                 fill=(44, 44, 44), outline=(64, 64, 64), width=2)
    
    # UFO dome (blue)
    draw.ellipse([ufo_x - 40, ufo_y - 35, ufo_x + 40, ufo_y - 5], 
                 fill=(135, 206, 235), outline=(255, 255, 255), width=1)
    
    # UFO propulsion (orange glow)
    draw.ellipse([ufo_x - 30, ufo_y + 20, ufo_x + 30, ufo_y + 50], 
                 fill=(255, 107, 53), outline=(255, 210, 90), width=2)
    
    # Draw splash screen on the right (vertical rectangle)
    splash_width = 600
    splash_height = 800
    splash_x = width - splash_width - 100
    splash_y = (height - splash_height) // 2
    
    # Splash screen background (dark blue space)
    draw.rectangle([splash_x, splash_y, splash_x + splash_width, splash_y + splash_height], 
                   fill=(10, 10, 26), outline=(20, 20, 40), width=3)
    
    # Draw stars in splash screen
    for i in range(25):
        x = splash_x + 30 + (i * 25) % (splash_width - 60)
        y = splash_y + 30 + (i * 30) % (splash_height - 60)
        draw.ellipse([x-1, y-1, x+1, y+1], fill=(255, 255, 255))
    
    # Draw planet in splash screen
    planet_x = splash_x + 50
    planet_y = splash_y + splash_height - 100
    draw.ellipse([planet_x, planet_y, planet_x + 60, planet_y + 60], 
                 fill=(135, 206, 235), outline=(74, 144, 226), width=2)
    
    # Draw moon in splash screen
    moon_x = splash_x + splash_width - 100
    moon_y = splash_y + 50
    draw.ellipse([moon_x, moon_y, moon_x + 40, moon_y + 40], 
                 fill=(245, 245, 245), outline=(211, 211, 211), width=2)
    
    # Draw rock pillars in splash screen
    # Left pillar
    draw.rectangle([splash_x + 20, splash_y + 50, splash_x + 60, splash_y + splash_height - 50], 
                   fill=(44, 44, 44), outline=(26, 26, 26), width=2)
    # Right pillar (more complex)
    draw.rectangle([splash_x + splash_width - 80, splash_y + 50, splash_x + splash_width - 40, splash_y + splash_height - 50], 
                   fill=(44, 44, 44), outline=(26, 26, 26), width=2)
    
    # Draw shooting star/laser beam
    beam_start_x = splash_x + splash_width - 50
    beam_start_y = splash_y + 100
    beam_end_x = splash_x + splash_width - 150
    beam_end_y = splash_y + 150
    draw.line([beam_start_x, beam_start_y, beam_end_x, beam_end_y], 
              fill=(74, 144, 226), width=3)
    
    # Draw title text
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 48)
        font_small = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 24)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Title
    draw.text((splash_x + splash_width//2, splash_y + 100), "COSMIC DASH", 
              fill=(255, 255, 255), font=font_large, anchor="mm")
    draw.text((splash_x + splash_width//2, splash_y + 160), "Space Adventure", 
              fill=(191, 199, 214), font=font_small, anchor="mm")
    
    # Draw UFO in splash screen (smaller)
    splash_ufo_x = splash_x + splash_width // 2
    splash_ufo_y = splash_y + splash_height // 2 + 50
    
    # UFO body
    draw.ellipse([splash_ufo_x - 40, splash_ufo_y - 15, splash_ufo_x + 40, splash_ufo_y + 15], 
                 fill=(44, 44, 44), outline=(64, 64, 64), width=2)
    
    # UFO dome
    draw.ellipse([splash_ufo_x - 25, splash_ufo_y - 25, splash_ufo_x + 25, splash_ufo_y - 5], 
                 fill=(135, 206, 235), outline=(255, 255, 255), width=1)
    
    # UFO propulsion
    draw.ellipse([splash_ufo_x - 20, splash_ufo_y + 15, splash_ufo_x + 20, splash_ufo_y + 35], 
                 fill=(255, 107, 53), outline=(255, 210, 90), width=2)
    
    # Save the main image
    main_image_path = "main_cosmic_dash_image.png"
    image.save(main_image_path)
    print(f"Main image created: {main_image_path}")
    return main_image_path

if __name__ == "__main__":
    create_main_image() 