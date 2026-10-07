from ultralytics import YOLO

def inspect_model(path):
    print(f"Inspecting {path}")
    try:
        model = YOLO(path)
        print("Model names:", model.names)
    except Exception as e:
        print("Error:", e)

inspect_model("yolo11n.pt")
inspect_model("yolo12n.pt")
inspect_model("yolo26n.pt")
