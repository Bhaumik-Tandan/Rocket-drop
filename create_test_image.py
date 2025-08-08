#!/usr/bin/env python3
"""
Create a test image for asset extraction
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_test_image():
    """Create a test image with app icon and splash screen side by side"""
    
    # Create a wide image (2048x1024) to hold both assets
    width, height = 2048, 1024
    image = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(image)
    
    # Draw app icon on the left (square with rounded corners)
    icon_size = 800
    icon_x = 100
    icon_y = (height - icon_size) // 2
    
    # App icon background (dark blue space)
    draw.ellipse([icon_x, icon_y, icon_x + icon_size, icon_y + icon_size], 
                 fill=(10, 10, 26), outline=(20, 20, 40), width=5)
    
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
    
    # Draw some stars
    for i in range(20):
        x = icon_x + 50 + (i * 35) % (icon_size - 100)
        y = icon_y + 50 + (i * 25) % (icon_size - 100)
        draw.ellipse([x-2, y-2, x+2, y+2], fill=(255, 255, 255))
    
    # Draw splash screen on the right (vertical rectangle)
    splash_width = 600
    splash_height = 800
    splash_x = width - splash_width - 100
    splash_y = (height - splash_height) // 2
    
    # Splash screen background (dark blue space)
    draw.rectangle([splash_x, splash_y, splash_x + splash_width, splash_y + splash_height], 
                   fill=(10, 10, 26), outline=(20, 20, 40), width=3)
    
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
    
    # Draw stars in splash screen
    for i in range(15):
        x = splash_x + 30 + (i * 40) % (splash_width - 60)
        y = splash_y + 30 + (i * 50) % (splash_height - 60)
        draw.ellipse([x-1, y-1, x+1, y+1], fill=(255, 255, 255))
    
    # Save the test image
    test_image_path = "test_combined_image.png"
    image.save(test_image_path)
    print(f"Test image created: {test_image_path}")
    return test_image_path

if __name__ == "__main__":
    create_test_image() 