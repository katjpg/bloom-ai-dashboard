import logging
from fastapi import FastAPI
from routes.chat import router as chat_router

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

app.include_router(chat_router)


@app.on_event("startup")
async def startup():
    logger.info("Bloom AI started")


@app.on_event("shutdown")
async def shutdown():
    logger.info("Bloom AI shutdown")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
