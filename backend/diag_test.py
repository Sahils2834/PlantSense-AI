import sys
sys.path.insert(0, '.')

from app.services.hybrid_detector import hybrid_detector
from app.services.model_registry import model_registry
from PIL import Image
import numpy as np
import io
import cv2

# Test gate with different images
test_images = {
    'green_leaf':  Image.new('RGB', (224, 224), color=(34, 139, 34)),
    'yellow_leaf': Image.new('RGB', (224, 224), color=(200, 180, 50)),
    'brown_leaf':  Image.new('RGB', (224, 224), color=(120, 80, 40)),
    'dark_green':  Image.new('RGB', (224, 224), color=(0, 100, 0)),
    'pure_black':  Image.new('RGB', (224, 224), color=(0, 0, 0)),
}

print('=== Plant Gate Test ===')
for name, img in test_images.items():
    img_bgr = np.array(img)[:, :, ::-1].copy()
    is_plant, reason, fol = hybrid_detector.check_plant_gate(img_bgr, img)
    print(f'{name}: is_plant={is_plant}, reason={reason}, foliage={fol:.3f}')

print()
print('=== Active Models ===')
active = model_registry.get_active_models()
print(f'Active models: {list(active.keys())}')

print()
print('=== Sample Inference - Green Leaf ===')
img = Image.new('RGB', (224, 224), color=(34, 139, 34))
buf = io.BytesIO()
img.save(buf, 'JPEG')
result = hybrid_detector.process_image(buf.getvalue())
plant = result.get('plant')
disease = result.get('disease')
conf = result.get('confidence')
is_unknown = result.get('is_unknown')
print(f'Result: plant={plant}, disease={disease}, conf={conf}, is_unknown={is_unknown}')
print(f'Full result keys: {list(result.keys())}')
