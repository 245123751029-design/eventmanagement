#!/usr/bin/env python3
"""
Test database queries like the backend does
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import os

async def test_db_queries():
    # Connect to MongoDB like the backend does
    mongo_url = "mongodb://localhost:27017"
    client = AsyncIOMotorClient(mongo_url)
    db = client["test_database"]
    
    session_token = "session_admin_backend_format"
    
    print(f"Testing with session token: {session_token}")
    
    # Query session like the backend does
    session = await db.user_sessions.find_one({"session_token": session_token})
    print(f"Session found: {session}")
    
    if session:
        # Check expiration like the backend does
        try:
            expires_at = datetime.fromisoformat(session['expires_at'])
            now = datetime.now(timezone.utc)
            is_expired = expires_at < now
            print(f"Expires at: {expires_at}")
            print(f"Current time: {now}")
            print(f"Is expired: {is_expired}")
            
            if not is_expired:
                # Query user like the backend does
                user_doc = await db.users.find_one({"id": session["user_id"]}, {"_id": 0})
                print(f"User found: {user_doc}")
            else:
                print("Session is expired")
                
        except Exception as e:
            print(f"Error parsing datetime: {e}")
    else:
        print("No session found")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(test_db_queries())