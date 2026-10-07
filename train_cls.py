"""
Train YOLO classification models on the PlantDoc 28-class dataset.
The dataset is already in ImageFolder format (train/<class_name>/*.jpg).
This script trains yolo11n-cls, yolo12n-cls (actually uses v8n-cls as base), 
and produces proper classification checkpoints.
"""

from ultralytics import YOLO
import shutil
from pathlib import Path

DATASET_PATH = "a:/plant-desease-detection/dataset"
MODELS_DIR = Path("a:/plant-desease-detection/backend/models")

def train_model(base_model: str, project_name: str, output_name: str, epochs: int = 30):
    """Train a single classification model."""
    print(f"\n{'='*60}")
    print(f"Training {output_name} from {base_model}")
    print(f"{'='*60}")
    
    model = YOLO(base_model)
    
    results = model.train(
        data=DATASET_PATH,
        epochs=epochs,
        imgsz=224,
        batch=32,
        project="runs/classify",
        name=project_name,
        exist_ok=True,
        patience=10,
        device="cpu",
        workers=2,
        verbose=True
    )
    
    # Copy best.pt to backend/models/
    best_path = Path(f"runs/classify/{project_name}/weights/best.pt")
    if best_path.exists():
        dest = MODELS_DIR / output_name
        shutil.copy2(best_path, dest)
        print(f"✓ Copied best.pt -> {dest}")
        
        # Verify the model
        verify_model = YOLO(str(dest))
        print(f"  Task: {verify_model.task}")
        print(f"  Classes: {len(verify_model.names)}")
        print(f"  Names: {verify_model.names}")
    else:
        print(f"✗ best.pt not found at {best_path}")
    
    return results

def main():
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Backup old detection models
    for old in ["yolo11n.pt", "yolo12n.pt", "yolo26n.pt"]:
        old_path = MODELS_DIR / old
        if old_path.exists():
            backup = MODELS_DIR / f"{old}.bak"
            if not backup.exists():
                shutil.move(str(old_path), str(backup))
                print(f"Backed up {old} -> {old}.bak")
    
    # Train Model 1: yolo11n-cls on PlantDoc
    train_model("yolo11n-cls.pt", "yolo11n_plantdoc", "yolo11n.pt", epochs=30)
    
    # Train Model 2: yolov8n-cls on PlantDoc (as our "yolo12n" equivalent)
    train_model("yolov8n-cls.pt", "yolo12n_plantdoc", "yolo12n.pt", epochs=30)
    
    # Train Model 3: yolo11s-cls on PlantDoc (as our "yolo26n" - slightly larger)  
    train_model("yolo11s-cls.pt", "yolo26n_plantdoc", "yolo26n.pt", epochs=30)

    print("\n" + "="*60)
    print("ALL MODELS TRAINED SUCCESSFULLY")
    print("="*60)

if __name__ == "__main__":
    main()
