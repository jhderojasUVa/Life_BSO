from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
from PIL import Image
import io
from logger import log_message

app = FastAPI()

app.mount("/music", StaticFiles(directory="music"), name="music")

# CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In a production environment, restrict this to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained MobileNetV2 model
model = tf.keras.applications.MobileNetV2(weights='imagenet')

# Placeholder for music data
# In a real application, you would have a more sophisticated way to store and retrieve music
MUSIC_MAPPING = {
    "coffee_mug": "coffee_shop.mid",
    "keyboard": "lofi_beats.mid",
    "mouse": "electronic_music.mid",
    # Add more mappings as needed
}
DEFAULT_MUSIC = "default_music.mid"

def preprocess_image(image_data):
    log_message("PREPROCESS", "Preprocessing image")
    """Preprocesses the image for the model."""
    image = Image.open(io.BytesIO(image_data)).resize((224, 224))
    image = np.array(image)
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    image = np.expand_dims(image, axis=0)
    return image

@app.get("/")
@app.get("/health")
def read_root():
    log_message("GET", "Request to / or /health")
    return {"message": "Backend is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    log_message("POST", "Request to /predict")
    """
    Receives an image, uses MobileNetV2 to predict the object,
    and returns a corresponding music file name.
    """
    image_data = await file.read()
    processed_image = preprocess_image(image_data)
    predictions = model.predict(processed_image)
    decoded_predictions = tf.keras.applications.mobilenet_v2.decode_predictions(predictions, top=1)[0]
    
    # Get the top prediction
    top_prediction = decoded_predictions[0]
    object_name = top_prediction[1]

    # Map the object to a music file
    music_file = MUSIC_MAPPING.get(object_name, DEFAULT_MUSIC)
    
    log_message("POST", f"Predicted object: {object_name}")
    log_message("POST", f"Music file: {music_file}")

    return {"object": object_name, "music_file": music_file}
