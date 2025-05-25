from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Correct paths for Render deployment
from backend_extract.config.db import Base, engine
from backend_extract.routes.auth_routes import router as auth_router
from backend_extract.routes.dashboard_routes import router as dashboard_router
from backend_extract.routes.sales_routes import router as sales_router

app = FastAPI()

# Optional: Auto-create tables at startup
Base.metadata.create_all(bind=engine)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(sales_router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the Finance API"}
