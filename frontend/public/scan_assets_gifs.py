import os
import json
from PIL import Image, ImageSequence
import imageio

def get_gif_metadata(gif_path):
    """Extracts comprehensive GIF metadata with accurate frame durations."""
    try:
        # Method 1: Use PIL for basic info and fallback duration calculation
        with Image.open(gif_path) as img:
            width, height = img.size
            total_duration = 0
            frame_count = 0
            
            # Calculate duration by summing all frame durations
            for frame in ImageSequence.Iterator(img):
                frame_count += 1
                total_duration += frame.info.get('duration', 0)
            
            avg_duration = total_duration // frame_count if frame_count > 0 else 0
            
            # Method 2: Cross-validate with imageio for frame count
            try:
                with imageio.get_reader(gif_path) as reader:
                    frame_count = len(reader)
                    # Use imageio's duration if PIL returned 0
                    if total_duration == 0:
                        meta = reader.get_meta_data()
                        total_duration = meta.get('duration', 0) * frame_count
                        avg_duration = meta.get('duration', 0)
            except:
                pass
            
            return {
                "type": "gif",
                "dimensions": [width, height],
                "frame_count": frame_count,
                "total_duration_ms": total_duration,
                "avg_duration_per_frame_ms": avg_duration,
                "looping": bool(img.info.get('loop', 0)),
                "notes": "duration_calculated" if total_duration > 0 else "duration_estimated"
            }
            
    except Exception as e:
        print(f"Error processing {gif_path}: {str(e)}")
        return {
            "type": "gif",
            "error": str(e),
            "partial_data": True
        }

def scan_gifs_directory(root_dir):
    """Scans GIF files with enhanced error handling."""
    gifs_data = {"_metadata": {"scanning_errors": 0}}
    
    for root, dirs, files in os.walk(root_dir):
        relative_path = os.path.relpath(root, root_dir)
        current_level = gifs_data
        
        if relative_path != ".":
            for part in relative_path.split(os.sep):
                current_level = current_level.setdefault(part, {"type": "folder"})
        
        for file in files:
            if file.lower().endswith('.gif'):
                file_path = os.path.join(root, file)
                metadata = get_gif_metadata(file_path)
                
                if metadata and "error" in metadata:
                    gifs_data["_metadata"]["scanning_errors"] += 1
                
                if metadata:
                    current_level[file] = metadata
    
    return gifs_data

if __name__ == "__main__":
    gifs_dir = "assets/vfx"
    output_file = "vfx_metadata.json"
    
    print(f"Scanning {gifs_dir} with enhanced GIF analysis...")
    gifs_data = scan_gifs_directory(gifs_dir)
    
    with open(output_file, "w") as f:
        json.dump(gifs_data, f, indent=2, sort_keys=True)
    
    print(f"Scan complete. Results saved to {output_file}")
    print(f"Total GIFs processed: {sum(1 for _ in gifs_data if _ != '_metadata')}")
    print(f"Scanning errors: {gifs_data['_metadata']['scanning_errors']}")