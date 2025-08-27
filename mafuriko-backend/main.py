import os
from fastapi import FastAPI
from supabase import create_client, Client
from africastalking.SMS import SMSService
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ========== Config ==========
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
AT_USERNAME = os.getenv("AFRICASTALKING_USERNAME")
AT_API_KEY = os.getenv("AFRICASTALKING_API_KEY")

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Africa's Talking
sms = SMSService(username=AT_USERNAME, api_key=AT_API_KEY)

# Initialize FastAPI app
app = FastAPI(title="Mafuriko App Backend", version="0.1.0")

# ========== Routes ==========

@app.get("/")
def root():
    return {"message": "Mafuriko App Backend is running 🚀"}

@app.get("/alerts")
def get_alerts():
    """Fetch all alerts from Supabase"""
    try:
        response = supabase.table("alerts").select("*").execute()
        return {"alerts": response.data}
    except Exception as e:
        return {"error": str(e)}

@app.post("/send-alert")
def send_alert(phone: str, message: str):
    """Send SMS alert to a user"""
    try:
        response = sms.send(message, [phone])
        return {"status": "sent", "response": response}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.post("/predict-risk")
def predict_risk(rainfall_mm: float):
    """Simple rules-based climate risk predictor"""
    if rainfall_mm > 50:
        return {"risk": "High Flood Risk", "action": "Move to higher ground"}
    elif rainfall_mm > 20:
        return {"risk": "Moderate Flood Risk", "action": "Stay alert"}
    else:
        return {"risk": "Low Risk", "action": "No immediate action"}
