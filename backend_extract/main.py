from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.db import Base, engine
from routes.auth_routes import router as auth_router
from routes.dashboard import router as dashboard_router
from routes.sales_routes import router as sales_router

app = FastAPI()

# Optional: Auto-create tables at startup
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(sales_router)

@app.get("/")
def root():
    return {"message": "Welcome to the Finance API"}
