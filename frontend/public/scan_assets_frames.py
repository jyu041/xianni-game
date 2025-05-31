import os
import json
from PIL import Image

def get_image_dimensions(image_path):
    """Get width and height of an image file."""
    try:
        with Image.open(image_path) as img:
            return img.size  # (width, height)
    except Exception as e:
        print(f"Error reading {image_path}: {e}")
        return None

def scan_directory(root_dir):
    """Recursively scan directory and build JSON structure with image dimensions."""
    assets_data = {}
    for root, dirs, files in os.walk(root_dir):
        relative_path = os.path.relpath(root, root_dir)
        current_level = assets_data
        
        # Navigate to the current directory level in the nested dict
        if relative_path != ".":
            for part in relative_path.split(os.sep):
                current_level = current_level.setdefault(part, {})
        
        # Add files
        for file in files:
            file_path = os.path.join(root, file)
            file_info = {"type": "file"}
            
            # Check if file is an image
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
                dimensions = get_image_dimensions(file_path)
                if dimensions:
                    file_info["dimensions"] = {
                        "width": dimensions[0],
                        "height": dimensions[1]
                    }
            
            current_level[file] = file_info
        
        # Add empty folders (optional)
        for dir in dirs:
            current_level.setdefault(dir, {"type": "folder"})
    
    return assets_data

if __name__ == "__main__":
    assets_dir = "assets"  # Change this if needed
    output_file = "assets_structure.json"
    
    print(f"Scanning {assets_dir}...")
    data = scan_directory(assets_dir)
    
    with open(output_file, "w") as f:
        json.dump(data, f, indent=2)
    
    print(f"Saved directory structure to {output_file}")