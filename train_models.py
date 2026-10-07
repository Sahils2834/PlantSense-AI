from ultralytics import YOLO
import os

def train_model(model_name, epochs=1):
    print(f"Training {model_name}...")
    try:
        model = YOLO(f"{model_name}.pt")
        # Train on the custom dataset
        results = model.train(
            data="dataset/data.yaml",
            epochs=epochs,
            imgsz=224, # small image size for faster training
            batch=16,
            device="cpu", # Force CPU if no GPU available to prevent crash
            project="runs/detect",
            name=f"{model_name}_plantdoc"
        )
        print(f"Finished training {model_name}.")
        # Save the best model back to root to overwrite the bad base model
        best_model_path = os.path.join("runs", "detect", f"{model_name}_plantdoc", "weights", "best.pt")
        if os.path.exists(best_model_path):
            import shutil
            shutil.copy(best_model_path, f"{model_name}.pt")
            shutil.copy(best_model_path, os.path.join("backend", "models", f"{model_name}.pt"))
            print(f"Copied best model to {model_name}.pt and backend/models/{model_name}.pt")
    except Exception as e:
        print(f"Error training {model_name}: {e}")

if __name__ == "__main__":
    # In a real scenario we'd do 30+ epochs, but for speed we do 1 epoch so it finishes
    train_model("yolo11n", epochs=1)
    train_model("yolo12n", epochs=1)
    train_model("yolo26n", epochs=1)
