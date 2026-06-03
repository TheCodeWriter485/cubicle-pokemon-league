import os

# Folder containing images
folder = "public/img"

# Get all files in folder
files = [
    f for f in os.listdir(folder)
    if os.path.isfile(os.path.join(folder, f))
]

# Sort files so renaming is consistent
files.sort()

# Starting number
start_num = 150

for i, filename in enumerate(files):

    old_path = os.path.join(folder, filename)

    # Keep original extension
    ext = os.path.splitext(filename)[1]

    new_name = f"{start_num + i}{ext}"
    new_path = os.path.join(folder, new_name)

    os.rename(old_path, new_path)
    print(f"Renamed: {filename} -> {new_name}")

print("Done!")