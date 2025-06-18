import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router
from routes.data import router as data_router

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(
    title="Bloom AI",
    description="Bloom AI's Real-time message moderation and sentiment analysis",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:3001",  # Alternative dev port
        "http://127.0.0.1:3001",
        "https://bloom-ai-dashboard.vercel.app",
        "https://*.vercel.app" 
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(data_router)


@app.on_event("startup")
async def startup():
    logger.info("Bloom AI started")


@app.on_event("shutdown")
async def shutdown():
    logger.info("Bloom AI shutdown")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
