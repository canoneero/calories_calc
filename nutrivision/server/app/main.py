from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

app = FastAPI(title="NutriVision API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/recognize")
async def recognize_food(image: UploadFile = File(...)) -> Dict[str, Any]:
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty image content")

    # TODO: Replace with a real ML model. For now, return a deterministic stub.
    recognized_items: List[Dict[str, Any]] = [
        {"name": "chicken salad", "calories": 320, "confidence": 0.78},
        {"name": "iced tea", "calories": 90, "confidence": 0.62},
    ]
    total_calories = sum(item["calories"] for item in recognized_items)

    return {
        "items": recognized_items,
        "total_calories": total_calories,
    }