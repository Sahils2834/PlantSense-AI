import os
import yaml
from pathlib import Path

dataset_dir = Path("a:/plant-desease-detection/dataset")
train_dir = dataset_dir / "train"
test_dir = dataset_dir / "test"

# Get all classes
classes = sorted([d.name for d in train_dir.iterdir() if d.is_dir()])
class_names = {i: name for i, name in enumerate(classes)}

# Create dataset.yaml
yaml_content = {
    "path": str(dataset_dir),
    "train": "train",
    "val": "test",  # Using test as val since there is no val folder
    "test": "test",
    "nc": len(classes),
    "names": class_names
}

with open(dataset_dir / "data.yaml", "w") as f:
    yaml.dump(yaml_content, f)

print(f"Created data.yaml with {len(classes)} classes.")
