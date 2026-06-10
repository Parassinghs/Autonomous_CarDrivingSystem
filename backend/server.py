from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSCODE = os.environ.get('ADMIN_PASSCODE', 'paras-av-2026')

app = FastAPI(title="Autonomous Vehicle Simulation API")
api_router = APIRouter(prefix="/api")


# ----- Models -----
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class TrainingLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    thumbnail_url: str
    video_url: Optional[str] = None
    episode: Optional[str] = None
    duration: Optional[str] = None
    metric: Optional[str] = None
    created_at: str = Field(default_factory=now_iso)


class TrainingLogCreate(BaseModel):
    title: str
    description: str
    thumbnail_url: str
    video_url: Optional[str] = None
    episode: Optional[str] = None
    duration: Optional[str] = None
    metric: Optional[str] = None


class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str
    created_at: str = Field(default_factory=now_iso)


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str


# ----- Helpers -----
def check_admin(passcode: Optional[str]):
    if passcode != ADMIN_PASSCODE:
        raise HTTPException(status_code=401, detail="Invalid admin passcode")


# ----- Routes -----
@api_router.get("/")
async def root():
    return {"message": "Autonomous Vehicle Simulation API", "status": "online"}


@api_router.get("/training-logs", response_model=List[TrainingLog])
async def list_training_logs():
    docs = await db.training_logs.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/training-logs", response_model=TrainingLog)
async def create_training_log(payload: TrainingLogCreate, x_admin_passcode: Optional[str] = Header(None)):
    check_admin(x_admin_passcode)
    log = TrainingLog(**payload.model_dump())
    await db.training_logs.insert_one(log.model_dump())
    return log


@api_router.delete("/training-logs/{log_id}")
async def delete_training_log(log_id: str, x_admin_passcode: Optional[str] = Header(None)):
    check_admin(x_admin_passcode)
    result = await db.training_logs.delete_one({"id": log_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Training log not found")
    return {"deleted": log_id}


@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(payload: ContactMessageCreate):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact_messages(x_admin_passcode: Optional[str] = Header(None)):
    check_admin(x_admin_passcode)
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/admin/verify")
async def verify_admin(x_admin_passcode: Optional[str] = Header(None)):
    check_admin(x_admin_passcode)
    return {"ok": True}


# ----- Seed -----
SEED_LOGS = [
    {
        "title": "Episode 042 — Highway Merge Mastery",
        "description": "Agent achieves 98.4% success rate on dynamic highway merges with adaptive lane-change policies under stochastic traffic density.",
        "thumbnail_url": "https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "episode": "EP-042",
        "duration": "06:21",
        "metric": "Reward +1284.2",
    },
    {
        "title": "Episode 037 — Night Urban Navigation",
        "description": "Raytraced low-light environment trial. The policy network adapts to glare, wet asphalt reflections, and irregular pedestrian crossings.",
        "thumbnail_url": "https://images.pexels.com/photos/256502/pexels-photo-256502.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "episode": "EP-037",
        "duration": "04:58",
        "metric": "Collisions 0",
    },
    {
        "title": "Episode 028 — Spline Curvature Optimization",
        "description": "Catmull-Rom spline planner outperforms baseline pure-pursuit by 23% on tight S-curves. Lateral error reduced to <0.12m RMS.",
        "thumbnail_url": "https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "episode": "EP-028",
        "duration": "08:12",
        "metric": "RMSE 0.118m",
    },
    {
        "title": "Episode 019 — Adversarial Pedestrian Scenarios",
        "description": "Curriculum learning phase 3. Agent generalizes to unseen adversarial actors after 1.2M timesteps in domain-randomized environments.",
        "thumbnail_url": "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "episode": "EP-019",
        "duration": "11:04",
        "metric": "Success 94.1%",
    },
    {
        "title": "Episode 011 — Sensor Fusion Calibration",
        "description": "LiDAR + RGB + IMU late-fusion architecture. Synthetic perception pipeline benchmarked against real-world KITTI samples.",
        "thumbnail_url": "https://images.pexels.com/photos/3052727/pexels-photo-3052727.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "episode": "EP-011",
        "duration": "07:43",
        "metric": "mAP 0.891",
    },
    {
        "title": "Episode 005 — Baseline PPO Rollout",
        "description": "Proximal Policy Optimization warm-up. First convergence on the figure-eight track. Establishes reward shaping baseline.",
        "thumbnail_url": "https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "episode": "EP-005",
        "duration": "03:27",
        "metric": "Reward +412.8",
    },
]


@app.on_event("startup")
async def seed_training_logs():
    count = await db.training_logs.count_documents({})
    if count == 0:
        for entry in SEED_LOGS:
            log = TrainingLog(**entry)
            await db.training_logs.insert_one(log.model_dump())
        logging.info(f"Seeded {len(SEED_LOGS)} training logs.")


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
