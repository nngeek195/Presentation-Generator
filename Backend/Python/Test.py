
from flask import Flask, request, render_template_string, jsonify, send_from_directory, redirect, url_for
import os
import requests
import json
import time
from dotenv import load_dotenv
from PIL import Image
from flask_cors import CORS
from urllib.parse import unquote
from bson import ObjectId
from datetime import datetime
import pymongo
from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os


load_dotenv()


app = Flask(__name__)
CORS(app) 


IMAGES_DIR = "static/images"
if not os.path.exists(IMAGES_DIR):
    os.makedirs(IMAGES_DIR)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "YOUR_UNSPLASH_ACCESS_KEY_HERE")

if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY is missing in .env file")


try:
    client = pymongo.MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
    db = client["userDb"]  
    presentations_collection = db["presentations"]
    print("✅ Connected to MongoDB database 'userDb'")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")



presentations_collection = db["presentations"]  
trending_collection = db["Trending"] 
@app.route('/trending', methods=['GET'])
def get_trending_presentations():
    """Get all trending presentations"""
    try:
        print("=== GET TRENDING PRESENTATIONS ===")
        
        
        filter_query = {"isActive": True}
        
       
        projection = {
            "_id": 1,
            "presentationName": 1,
            "createdAt": 1,
            "code": 1,
            "email": 1,
            "username": 1,
            "views": 1,
            "likes": 1,
            "category": 1,
            "description": 1,
            "previewImageUrl": 1  
        }
        
        
        trending_collection = db["Trending"]
        
       
        trending_cursor = trending_collection.find(
            filter_query, 
            projection
        ).sort([("views", -1), ("createdAt", -1)])
        
        trending_presentations = []
        for doc in trending_cursor:
            trending_presentations.append({
                "_id": str(doc["_id"]),
                "presentationName": doc.get("presentationName", ""),
                "createdAt": doc.get("createdAt", ""),
                "code": doc.get("code", ""),
                "email": doc.get("email", ""),
                "username": doc.get("username", ""),
                "views": doc.get("views", 0),
                "likes": doc.get("likes", 0),
                "category": doc.get("category", "General"),
                "description": doc.get("description", ""),
                "previewImageUrl": doc.get("previewImageUrl", "")  
            })
        
        print(f"Found {len(trending_presentations)} trending presentations")
        
        return jsonify({
            "success": True,
            "message": "Trending presentations retrieved successfully",
            "data": {
                "presentations": trending_presentations
            }
        })
        
    except Exception as e:
        print(f"Error fetching trending presentations: {e}")
        return jsonify({
            "success": False,
            "message": f"Failed to fetch trending presentations: {str(e)}",
            "data": None
        }), 500


@app.route('/trending/view/<presentation_id>', methods=['GET'])
def view_trending_presentation(presentation_id):
    """View a trending presentation (increments view count)"""
    try:
        print("=== VIEW TRENDING PRESENTATION ===")
        print(f"Presentation ID: {presentation_id}")
        
       
        trending_collection = db["Trending"]
        
        
        try:
            object_id = ObjectId(presentation_id)
        except:
            return "Invalid presentation ID", 400
        
        filter_query = {
            "_id": object_id,
            "isActive": True
        }
        
       
        update_query = {
            "$inc": {"views": 1},
            "$set": {"lastViewed": datetime.utcnow().isoformat()}
        }
        
        update_result = trending_collection.update_one(filter_query, update_query)
        
        if update_result.matched_count == 0:
            print(f"Trending presentation not found with ID: {presentation_id}")
            return "Presentation not found", 404
        
        
        presentation = trending_collection.find_one(filter_query)
        
        if not presentation:
            print(f"Trending presentation not found after update: {presentation_id}")
            return "Presentation not found", 404
        
        views = presentation.get("views", 0)
        print(f"Trending presentation found and view count updated. Total views: {views}")
        
        
        return presentation.get("code", ""), 200, {'Content-Type': 'text/html'}
        
    except Exception as e:
        print(f"Error viewing trending presentation: {e}")
        return f"Error loading presentation: {str(e)}", 500


@app.route('/trending/add', methods=['POST'])
def add_to_trending():
    """Add a presentation to trending (admin function)"""
    try:
        print("=== ADD TO TRENDING ===")
        
        data = request.get_json()
        print(f"Received payload: {data}")
        
        
        email = data.get('email', '').strip()
        username = data.get('username', '').strip()
        presentation_name = data.get('presentationName', '').strip()
        code = data.get('code', '').strip()
        category = data.get('category', 'General').strip()
        description = data.get('description', '').strip()
        preview_image_url = data.get('previewImageUrl', '').strip()  
        
        
        if not all([email, username, presentation_name, code]):
            return jsonify({
                "success": False,
                "message": "Missing required fields: email, username, presentationName, and code are required",
                "data": None
            }), 400
        
        
        trending_collection = db["Trending"]
        
       
        trending_doc = {
            "email": email,
            "username": username,
            "presentationName": presentation_name,
            "code": code,
            "category": category,
            "description": description,
            "previewImageUrl": preview_image_url,  
            "views": 0,
            "likes": 0,
            "createdAt": datetime.utcnow().isoformat(),
            "updatedAt": datetime.utcnow().isoformat(),
            "isActive": True,
            "isFeatured": False
        }
        
       
        insert_result = trending_collection.insert_one(trending_doc)
        
        if insert_result.inserted_id:
            inserted_id = str(insert_result.inserted_id)
            print(f"Presentation added to trending successfully with ID: {inserted_id}")
            
            return jsonify({
                "success": True,
                "message": "Presentation added to trending successfully!",
                "data": {
                    "trendingId": inserted_id,
                    "email": email,
                    "presentationName": presentation_name,
                    "category": category,
                    "previewImageUrl": preview_image_url,  
                    "createdAt": datetime.utcnow().isoformat()
                }
            })
        else:
            print("Failed to get inserted ID for trending presentation")
            return jsonify({
                "success": False,
                "message": "Failed to add presentation to trending",
                "data": None
            }), 500
            
    except Exception as e:
        print(f"Error adding presentation to trending: {e}")
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}",
            "data": None
        }), 500


@app.route('/trending/stats', methods=['GET'])
def get_trending_stats():
    """Get trending presentation statistics"""
    try:
        print("=== GET TRENDING STATS ===")
        
       
        trending_collection = db["Trending"]
        
       
        total_count = trending_collection.count_documents({"isActive": True})
        
       
        most_viewed_cursor = trending_collection.find(
            {"isActive": True},
            {"_id": 1, "presentationName": 1, "views": 1, "previewImageUrl": 1} 
        ).sort("views", -1).limit(1)
        
        most_viewed = None
        for doc in most_viewed_cursor:
            most_viewed = {
                "_id": str(doc["_id"]),
                "presentationName": doc.get("presentationName", ""),
                "views": doc.get("views", 0),
                "previewImageUrl": doc.get("previewImageUrl", "") 
            }
            break
        
        return jsonify({
            "success": True,
            "message": "Trending statistics retrieved successfully",
            "data": {
                "totalTrendingPresentations": total_count,
                "mostViewed": most_viewed
            }
        })
        
    except Exception as e:
        print(f"Error fetching trending stats: {e}")
        return jsonify({
            "success": False,
            "message": f"Failed to fetch trending statistics: {str(e)}",
            "data": None
        }), 500



def api_call_with_backoff(url, headers, payload, max_retries=5, initial_delay=1):
    """Make API call with exponential backoff retry logic."""
    for i in range(max_retries):
        try:
            response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=180)
            if not response.ok:
                print("- API Error Response -")
                print(f"Status Code: {response.status_code}")
                try:
                    print(f"Response JSON: {response.json()}")
                except json.JSONDecodeError:
                    print(f"Response Text: {response.text}")
                print("-")
                response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            print(f"API call failed with HTTPError (retry {i+1}/{max_retries}): {e}")
            if i >= max_retries - 1:
                raise
        except (requests.exceptions.RequestException, requests.exceptions.Timeout) as e:
            print(f"API call failed with network error (retry {i+1}/{max_retries}): {e}")
            if i >= max_retries - 1:
                raise
        time.sleep(initial_delay * (2 ** i))


def download_image(image_url, filename):
    """Download and save image from URL, resize to optimize."""
    try:
        response = requests.get(image_url, stream=True)
        response.raise_for_status()
        filepath = os.path.join(IMAGES_DIR, filename)
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)
        
        img = Image.open(filepath)
        img.thumbnail((800, 600))
        img.save(filepath)
        return f"/static/images/{filename}"
    except Exception as e:
        print(f"Error downloading image {image_url}: {e}")
        return None

def search_unsplash_image(query):
    if not UNSPLASH_ACCESS_KEY or UNSPLASH_ACCESS_KEY == "YOUR_UNSPLASH_ACCESS_KEY_HERE":
      
        return f"https://placehold.co/600x400/1e293b/e2e8f0?text={query.replace(' ', '+')}"
    url = "https://api.unsplash.com/search/photos"
    params = {"query": query, "per_page": 1, "orientation": "landscape"}
    headers = {"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"}
    try:
        res = requests.get(url, headers=headers, params=params)
        res.raise_for_status()
        data = res.json()
        return data['results'][0]['urls']['regular'] if data['results'] else None
    except Exception as e:
        print(f"Error searching Unsplash: {e}")
        return None




@app.route('/')
def index():
    """Render the initial topic input page, capturing userEmail from React app."""
    user_email = request.args.get('userEmail', '')
    return render_template_string('''
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Presentation Generator</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
        }

        body { 
            font-family: 'Inter', sans-serif; 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            color: #e2e8f0; 
            min-height: 100vh;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column; /* Center content vertically */
        }

        /* Optimized Background Elements - Better Performance */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            will-change: transform;
        }

        .floating-orb {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(99, 179, 237, 0.4) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%);
            animation: float 8s ease-in-out infinite;
            will-change: transform;
            backface-visibility: hidden;
        }

        .floating-orb:nth-child(1) {
            width: clamp(60px, 8vw, 120px);
            height: clamp(60px, 8vw, 120px);
            top: 15%;
            left: 10%;
            animation-delay: 0s;
        }

        .floating-orb:nth-child(2) {
            width: clamp(40px, 6vw, 80px);
            height: clamp(40px, 6vw, 80px);
            top: 60%;
            right: 15%;
            animation-delay: 2s;
        }

        .floating-orb:nth-child(3) {
            width: clamp(80px, 10vw, 150px);
            height: clamp(80px, 10vw, 150px);
            bottom: 15%;
            left: 20%;
            animation-delay: 4s;
        }

        .floating-orb:nth-child(4) {
            width: clamp(30px, 4vw, 60px);
            height: clamp(30px, 4vw, 60px);
            top: 30%;
            right: 30%;
            animation-delay: 1s;
        }

        @keyframes float {
            0%, 100% { 
                transform: translateY(0px) translateX(0px) scale(1); 
                opacity: 0.6;
            }
            50% { 
                transform: translateY(-15px) translateX(10px) scale(1.05); 
                opacity: 0.8;
            }
        }

        /* Responsive Grid Pattern */
        .grid-pattern {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(99, 179, 237, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 179, 237, 0.08) 1px, transparent 1px);
            background-size: clamp(30px, 5vw, 50px) clamp(30px, 5vw, 50px);
            animation: gridMove 25s linear infinite;
            z-index: 1;
            will-change: transform;
        }

        @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }

        /* Responsive Container */
        .container { 
            max-width: min(90vw, 650px);
            margin: clamp(20px, 5vh, 50px) auto;
            padding: clamp(1.5rem, 4vw, 3rem);
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(99, 179, 237, 0.3);
            border-radius: clamp(1rem, 2vw, 1.5rem);
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.6),
                0 0 0 1px rgba(99, 179, 237, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 10;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        @media (hover: hover) {
            .container:hover {
                transform: translateY(-3px);
            }
        }

        /* Enhanced Input Styling - Mobile Optimized */
        input[type="text"] { 
            width: 100%; 
            padding: clamp(0.75rem, 3vw, 1rem) clamp(1rem, 4vw, 1.5rem);
            border-radius: clamp(0.5rem, 2vw, 0.75rem);
            border: 2px solid rgba(71, 85, 105, 0.4);
            background: rgba(51, 65, 85, 0.9);
            backdrop-filter: blur(10px);
            color: #e2e8f0; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: clamp(1rem, 3vw, 1.1rem);
            line-height: 1.5;
            -webkit-appearance: none;
            appearance: none;
        }

        input[type="text"]:focus { 
            border-color: #63b3ed; 
            box-shadow: 
                0 0 0 3px rgba(99, 179, 237, 0.25),
                0 8px 25px rgba(99, 179, 237, 0.15);
            outline: none; 
            transform: translateY(-1px);
        }

        /* Mobile-First Button Styling */
        button { 
            background: linear-gradient(135deg, #63b3ed, #90cdf4);
            color: #1a202c; 
            padding: clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2.5rem);
            border-radius: clamp(0.75rem, 2vw, 1rem);
            font-weight: 600; 
            cursor: pointer; 
            border: none; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: clamp(1rem, 3vw, 1.1rem);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(99, 179, 237, 0.3);
            min-height: 48px; /* Touch target size */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
            padding: clamp(0.75rem, 3vw, 1rem) calc(clamp(1.5rem, 5vw, 2.5rem) + 3px);
        }
        
        .secondary-button {
             background: transparent;
             border: 2px solid #63b3ed;
             color: #63b3ed;
             box-shadow: none;
        }
        
        @media (hover: hover) {
            .secondary-button:hover {
                background: rgba(99, 179, 237, 0.1);
                box-shadow: 0 8px 25px rgba(99, 179, 237, 0.2);
            }
        }


        /* Make the main button extra wide and center it */
        #submitBtn {
            width: 320px !important;
            max-width: 100%;
            margin: 0 auto;
            display: block;
            font-size: 1.15rem;
        }

        @media (hover: hover) {
            button:hover:not(:disabled) { 
                background: linear-gradient(135deg, #90cdf4, #bee3f8);
                transform: translateY(-2px);
                box-shadow: 0 12px 35px rgba(99, 179, 237, 0.4);
            }
        }

        /* Touch feedback for mobile */
        button:active:not(:disabled) {
            transform: translateY(0);
            transition: transform 0.1s;
        }

        button:disabled { 
            background: linear-gradient(135deg, #4a5568, #2d3748);
            cursor: not-allowed; 
            color: #a0aec0;
            transform: none;
        }

        /* Responsive Loading Spinner */
        .loading-spinner { 
            border: 3px solid rgba(99, 179, 237, 0.3); 
            border-top: 3px solid #63b3ed; 
            border-radius: 50%; 
            width: clamp(28px, 5vw, 35px);
            height: clamp(28px, 5vw, 35px);
            animation: spin 1s linear infinite; 
            display: none; 
            margin-left: clamp(0.75rem, 3vw, 1.5rem);
            flex-shrink: 0;
        }

        @keyframes spin { 
            to { transform: rotate(360deg); } 
        }

        /* Responsive Title */
        .title-glow {
            background: linear-gradient(135deg, #63b3ed, #a78bfa, #f093fb);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 4s ease infinite;
            font-size: clamp(2rem, 8vw, 3rem);
            line-height: 1.2;
            margin-bottom: clamp(1rem, 4vw, 1.5rem);
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        /* Optimized Particles - Reduced for mobile */
        .particle {
            position: absolute;
            width: clamp(2px, 0.5vw, 4px);
            height: clamp(2px, 0.5vw, 4px);
            background: #63b3ed;
            border-radius: 50%;
            animation: particleFloat 10s linear infinite;
            opacity: 0.4;
            will-change: transform;
            pointer-events: none;
        }

        .particle:nth-child(odd) {
            background: #a78bfa;
            animation-duration: 15s;
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10%, 90% {
                opacity: 0.4;
            }
            100% {
                transform: translateY(-10vh) translateX(50px);
                opacity: 0;
            }
        }

        /* Form Enhancements */
        .form-group {
            position: relative;
            margin-bottom: clamp(1.5rem, 4vw, 2rem);
        }

        .form-group::before {
            content: '✨';
            position: absolute;
            left: clamp(0.75rem, 3vw, 1rem);
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            opacity: 0.7;
            font-size: clamp(1rem, 3vw, 1.2rem);
            pointer-events: none;
        }

        input[type="text"] {
            padding-left: clamp(2.5rem, 8vw, 3.5rem);
        }

        /* Responsive Text */
        .description-text {
            font-size: clamp(1rem, 3vw, 1.125rem);
            line-height: 1.6;
            margin-bottom: clamp(2rem, 5vw, 2.5rem);
        }

        .label-text {
            font-size: clamp(1rem, 3vw, 1.125rem);
            margin-bottom: clamp(0.75rem, 2vw, 1rem);
        }

        /* Button Container */
        .button-container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap; /* Allow wrapping on small screens */
            gap: clamp(0.75rem, 3vw, 1.5rem);
            margin-top: clamp(1.5rem, 4vw, 2rem);
            width: 100%;
        }

        /* Media Queries for Better Control */
        @media (max-width: 640px) {
            .floating-orb {
                animation-duration: 12s; /* Slower on mobile for better performance */
            }
            
            .grid-pattern {
                animation-duration: 30s; /* Slower grid animation */
                opacity: 0.5; /* Reduce opacity on mobile */
            }
            
            .particle {
                display: none; /* Hide particles on very small screens */
            }
            #submitBtn {
                width: 100% !important;
            }
        }

        @media (max-width: 480px) {
            .container {
                margin: 10px;
                width: calc(100vw - 20px);
            }
            
            .button-container {
                flex-direction: column;
                align-items: stretch;
            }
            
            #submitBtn {
                width: 100% !important;
            }
            
            .loading-spinner {
                margin-left: 0;
                margin-top: 1rem;
            }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
            .floating-orb,
            .grid-pattern,
            .particle,
            .title-glow {
                animation: none;
            }
            
            .container:hover {
                transform: none;
            }
            
            button:hover:not(:disabled) {
                transform: none;
            }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .container {
                border: 2px solid #63b3ed;
                background: rgba(15, 23, 42, 0.95);
            }
            
            input[type="text"] {
                border: 2px solid #63b3ed;
            }
        }

        /* Fade-in with better performance */
        .fade-in {
            animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
        }

        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px);
            }
            to { 
                opacity: 1; 
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
    <!-- Background Animation Elements -->
    <div class="bg-animation">
        <div class="grid-pattern"></div>
        <div class="floating-orb"></div>
        <div class="floating-orb"></div>
        <div class="floating-orb"></div>
        <div class="floating-orb"></div>
    </div>

    <!-- Floating Particles -->
    <div id="particles" aria-hidden="true"></div>

    <div class="container text-center fade-in">
        <h1 class="title-glow font-bold">🚀 AI Presentation Generator</h1>
        <p class="description-text text-gray-300">Transform any topic into a stunning, interactive presentation with the power of AI</p>
        
        <form id="topicForm" onsubmit="submitTopic(event)" novalidate class="w-full">
            <input type="hidden" id="userEmail" value="{{ user_email }}">
            <div class="text-left">
                <label for="topic" class="label-text text-gray-200 block font-semibold">What would you like to present?</label>
                <div class="form-group">
                    <input 
                        type="text" 
                        id="topic" 
                        name="topic" 
                        placeholder="e.g., The Future of Artificial Intelligence" 
                        required
                        autocomplete="off"
                        spellcheck="true"
                    >
                </div>
            </div>
            <div class="button-container">
                <button type="submit" id="submitBtn" aria-describedby="loading-status">
                        Generate Slides
                </button>
                <div id="loadingSpinner" class="loading-spinner" role="status" aria-label="Loading"></div>
            </div>
            <div id="loading-status" class="sr-only" aria-live="polite"></div>
        </form>
         
    </div>

    <script>
        // Performance optimized particle creation
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const isMobile = window.innerWidth < 640;
            const particleCount = isMobile ? 5 : 10; // Fewer particles on mobile
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 10 + 's';
                particle.style.animationDuration = (10 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Debounced resize handler
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recreate particles on significant resize
                const particlesContainer = document.getElementById('particles');
                if (particlesContainer) {
                    particlesContainer.innerHTML = '';
                    createParticles();
                }
            }, 250);
        }

        // Initialize with better error handling
        function initialize() {
            try {
                createParticles();
                window.addEventListener('resize', handleResize, { passive: true });
                
                // Preload form validation
                const form = document.getElementById('topicForm');
                const input = document.getElementById('topic');
                
                if (input) {
                    input.addEventListener('input', function() {
                        this.setCustomValidity('');
                    });
                }
            } catch (error) {
                console.warn('Non-critical initialization error:', error);
            }
        }

        // Enhanced form validation
        function validateInput(topic) {
            if (!topic || topic.trim().length < 2) {
                return 'Please enter a topic with at least 2 characters.';
            }
            if (topic.trim().length > 200) {
                return 'Topic is too long. Please keep it under 200 characters.';
            }
            return null;
        }

        // Original JavaScript functionality with enhancements
        async function submitTopic(event) {
            event.preventDefault();
            
            const btn = document.getElementById('submitBtn');
            const spinner = document.getElementById('loadingSpinner');
            const topic = document.getElementById('topic').value;
            const userEmail = document.getElementById('userEmail').value;
            const statusElement = document.getElementById('loading-status');
            
            // Enhanced validation
            const validationError = validateInput(topic);
            if (validationError) {
                alert(validationError);
                return;
            }
            
            // UI state management
            btn.disabled = true;
            btn.innerHTML = 'Generating...';
            spinner.style.display = 'inline-block';
            statusElement.textContent = 'Generating presentation...';
            
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
                
                const res = await fetch('/suggest_subtopics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: topic.trim() }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error?.message || `Server error: ${res.status}`);
                }
                
                const data = await res.json();
                
                if (!data.subtopics || !Array.isArray(data.subtopics)) {
                    throw new Error('Invalid response format');
                }
                
                // Successful navigation, passing email along
                window.location.href = `/manage_presentation?topic=${encodeURIComponent(topic)}&subtopics=${data.subtopics.map(st => encodeURIComponent(st)).join(',')}&userEmail=${encodeURIComponent(userEmail)}`;
                
            } catch (error) {
                console.error('Submission error:', error);
                
                let errorMessage = 'Failed to generate presentation. ';
                if (error.name === 'AbortError') {
                    errorMessage += 'Request timed out. Please try again.';
                } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                    errorMessage += 'Please check your internet connection.';
                } else {
                    errorMessage += error.message || 'Please try again.';
                }
                
                alert(errorMessage);
                
                // Reset UI state
                btn.disabled = false;
                btn.innerHTML = '✨ Generate Slides ';
                spinner.style.display = 'none';
                statusElement.textContent = '';
            }
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    </script>
</body>
</html>''', user_email=user_email)


@app.route('/suggest_subtopics', methods=['POST'])
def suggest_subtopics():
    """Use Gemini API to generate subtopics from a main topic."""
    data = request.get_json()
    main_topic = data.get('topic', '').strip()

    if not main_topic:
        return jsonify({"error": {"message": "Topic is required"}}), 400

    prompt = f"""
    Suggest 6-8 engaging subtopics for a presentation on '{main_topic}'. 
    Return them as a comma-separated list. 
    Do not number them. Be concise and relevant.
    Example: Introduction, Key Features, Use Cases, Benefits, Challenges, Future Trends
    """

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.5}
    }

    try:
        result = api_call_with_backoff(api_url, {'Content-Type': 'application/json'}, payload)
        text_response = result['candidates'][0]['content']['parts'][0]['text']
        subtopics = [st.strip() for st in text_response.strip().split(',') if st.strip()]
        subtopics = subtopics[:8]  # Limit to 8
        while len(subtopics) < 4:
            subtopics.append(f"More Details on {main_topic} #{len(subtopics) + 1}")

        return jsonify({"subtopics": subtopics})
    except Exception as e:
        return jsonify({"error": {"message": f"Failed to call Gemini API: {e}"}}), 500


@app.route('/manage_presentation')
def manage_presentation():
    """Page to manage and reorder subtopics before final generation."""
    topic = request.args.get('topic', 'Presentation Topic')
    subtopics = [s for s in request.args.get('subtopics', '').split(',') if s]
    user_email = request.args.get('userEmail', '')

    return render_template_string('''
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Subtopics</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
        }

        body { 
            font-family: 'Inter', sans-serif; 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            color: #e2e8f0; 
            min-height: 100vh;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            position: relative;
        }

        /* Background Animation Elements - Same as first page */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            will-change: transform;
        }

        .floating-orb {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(99, 179, 237, 0.4) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%);
            animation: float 8s ease-in-out infinite;
            will-change: transform;
            backface-visibility: hidden;
        }

        .floating-orb:nth-child(1) {
            width: clamp(60px, 8vw, 120px);
            height: clamp(60px, 8vw, 120px);
            top: 15%;
            left: 10%;
            animation-delay: 0s;
        }

        .floating-orb:nth-child(2) {
            width: clamp(40px, 6vw, 80px);
            height: clamp(40px, 6vw, 80px);
            top: 60%;
            right: 15%;
            animation-delay: 2s;
        }

        .floating-orb:nth-child(3) {
            width: clamp(80px, 10vw, 150px);
            height: clamp(80px, 10vw, 150px);
            bottom: 15%;
            left: 20%;
            animation-delay: 4s;
        }

        .floating-orb:nth-child(4) {
            width: clamp(30px, 4vw, 60px);
            height: clamp(30px, 4vw, 60px);
            top: 30%;
            right: 30%;
            animation-delay: 1s;
        }

        @keyframes float {
            0%, 100% { 
                transform: translateY(0px) translateX(0px) scale(1); 
                opacity: 0.6;
            }
            50% { 
                transform: translateY(-15px) translateX(10px) scale(1.05); 
                opacity: 0.8;
            }
        }

        .grid-pattern {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(99, 179, 237, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 179, 237, 0.08) 1px, transparent 1px);
            background-size: clamp(30px, 5vw, 50px) clamp(30px, 5vw, 50px);
            animation: gridMove 25s linear infinite;
            z-index: 1;
            will-change: transform;
        }

        @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }

        /* Floating Particles */
        .particle {
            position: absolute;
            width: clamp(2px, 0.5vw, 4px);
            height: clamp(2px, 0.5vw, 4px);
            background: #63b3ed;
            border-radius: 50%;
            animation: particleFloat 10s linear infinite;
            opacity: 0.4;
            will-change: transform;
            pointer-events: none;
        }

        .particle:nth-child(odd) {
            background: #a78bfa;
            animation-duration: 15s;
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(100vh) translateX(0);
                opacity: 0;
            }
            10%, 90% {
                opacity: 0.4;
            }
            100% {
                transform: translateY(-10vh) translateX(50px);
                opacity: 0;
            }
        }

        /* Enhanced Container */
        .main-container {
            max-width: min(90vw, 800px);
            margin: clamp(20px, 5vh, 50px) auto;
            padding: clamp(1.5rem, 4vw, 2.5rem);
            background: rgba(30, 41, 59, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(99, 179, 237, 0.3);
            border-radius: clamp(1rem, 2vw, 1.5rem);
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.6),
                0 0 0 1px rgba(99, 179, 237, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 10;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (hover: hover) {
            .main-container:hover {
                transform: translateY(-3px);
            }
        }

        /* Enhanced Title */
        .title-glow {
            background: linear-gradient(135deg, #63b3ed, #a78bfa, #f093fb);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 4s ease infinite;
            font-size: clamp(1.5rem, 5vw, 2rem);
            line-height: 1.2;
            margin-bottom: clamp(1rem, 3vw, 1.5rem);
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        /* Subtitle styling */
        .subtitle {
            font-size: clamp(0.875rem, 2.5vw, 1rem);
            line-height: 1.6;
            margin-bottom: clamp(1.5rem, 4vw, 2rem);
            color: #94a3b8;
        }

        /* Enhanced Subtopic List */
        #subtopicList {
            margin-bottom: clamp(1.5rem, 4vw, 2rem);
            space-y: clamp(0.75rem, 2vw, 1rem);
        }

        #subtopicList li {
            display: flex;
            align-items: center;
            padding: clamp(0.75rem, 3vw, 1rem);
            margin: clamp(0.5rem, 2vw, 0.75rem) 0;
            border-radius: clamp(0.5rem, 2vw, 0.75rem);
            background: rgba(51, 65, 85, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(71, 85, 105, 0.4);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            cursor: grab;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        #subtopicList li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 3px;
            background: linear-gradient(135deg, #63b3ed, #a78bfa);
            transition: width 0.3s ease;
        }

        @media (hover: hover) {
            #subtopicList li:hover {
                transform: translateX(5px);
                border-color: rgba(99, 179, 237, 0.5);
                box-shadow: 0 8px 25px rgba(99, 179, 237, 0.15);
            }

            #subtopicList li:hover::before {
                width: 5px;
            }
        }

        #subtopicList li:active {
            cursor: grabbing;
        }

        #subtopicList li.opacity-50 {
            opacity: 0.5;
            transform: rotate(2deg) scale(0.98);
        }

        /* Enhanced number styling */
        #subtopicList li span {
            color: #94a3b8;
            margin-right: clamp(0.75rem, 3vw, 1rem);
            font-weight: 600;
            font-size: clamp(0.875rem, 2.5vw, 1rem);
            min-width: clamp(1.5rem, 4vw, 2rem);
            text-align: center;
            background: rgba(99, 179, 237, 0.1);
            border-radius: 50%;
            width: clamp(1.5rem, 4vw, 2rem);
            height: clamp(1.5rem, 4vw, 2rem);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Enhanced input styling */
        #subtopicList li input {
            background: transparent;
            flex-grow: 1;
            outline: none;
            width: 100%;
            color: #e2e8f0;
            font-size: clamp(0.875rem, 2.5vw, 1rem);
            border: none;
            padding: clamp(0.25rem, 1vw, 0.5rem);
            border-radius: 0.25rem;
            transition: background-color 0.2s ease;
        }

        #subtopicList li input:focus {
            background: rgba(99, 179, 237, 0.1);
        }

        /* Enhanced delete button */
        #subtopicList li button {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            font-weight: bold;
            width: clamp(1.75rem, 4vw, 2rem);
            height: clamp(1.75rem, 4vw, 2rem);
            border-radius: 50%;
            margin-left: clamp(0.75rem, 3vw, 1rem);
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(0.75rem, 2vw, 0.875rem);
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }

        @media (hover: hover) {
            #subtopicList li button:hover {
                background: linear-gradient(135deg, #dc2626, #b91c1c);
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
            }
        }

        /* Enhanced add section */
        .add-section {
            display: flex;
            align-items: center;
            gap: clamp(0.75rem, 3vw, 1rem);
            margin-top: clamp(1.5rem, 4vw, 2rem);
            flex-wrap: wrap;
        }

        #newSubtopicInput {
            flex-grow: 1;
            min-width: 200px;
            background: rgba(51, 65, 85, 0.9);
            backdrop-filter: blur(10px);
            padding: clamp(0.75rem, 3vw, 1rem);
            border-radius: clamp(0.5rem, 2vw, 0.75rem);
            border: 2px solid rgba(71, 85, 105, 0.4);
            color: #e2e8f0;
            font-size: clamp(0.875rem, 2.5vw, 1rem);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            outline: none;
        }

        #newSubtopicInput:focus {
            border-color: #63b3ed;
            box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.25);
            transform: translateY(-1px);
        }

        .add-button {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            font-weight: 600;
            padding: clamp(0.75rem, 3vw, 1rem) clamp(1.25rem, 4vw, 1.5rem);
            border-radius: clamp(0.5rem, 2vw, 0.75rem);
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: clamp(0.875rem, 2.5vw, 1rem);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            min-height: 48px;
            display: flex;
            align-items: center;
            white-space: nowrap;
        }

        @media (hover: hover) {
            .add-button:hover {
                background: linear-gradient(135deg, #059669, #047857);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
            }
        }

        /* Enhanced final button */
        .final-button-section {
            text-align: center;
            margin-top: clamp(2rem, 6vw, 3rem);
        }

        #generateFinalBtn {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            font-weight: bold;
            padding: clamp(0.75rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2rem);
            border-radius: clamp(0.75rem, 2vw, 1rem);
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: clamp(1rem, 3vw, 1.125rem);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
            position: relative;
            overflow: hidden;
            min-height: 48px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        #generateFinalBtn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
        }

        @media (hover: hover) {
            #generateFinalBtn:hover::before {
                left: 100%;
            }

            #generateFinalBtn:hover {
                background: linear-gradient(135deg, #1d4ed8, #1e40af);
                transform: translateY(-3px);
                box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
            }
        }

        /* Enhanced loading spinner */
        #loadingSpinner {
            border: 4px solid rgba(37, 99, 235, 0.3);
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            width: clamp(28px, 5vw, 32px);
            height: clamp(28px, 5vw, 32px);
            animation: spin 1s linear infinite;
            margin: clamp(1rem, 3vw, 1.5rem) auto 0;
            filter: drop-shadow(0 0 10px rgba(37, 99, 235, 0.5));
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Fade-in animation */
        .fade-in {
            animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
        }

        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px);
            }
            to { 
                opacity: 1; 
                transform: translateY(0);
            }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
            .floating-orb {
                animation-duration: 12s;
            }
            
            .grid-pattern {
                animation-duration: 30s;
                opacity: 0.5;
            }
            
            .particle {
                display: none;
            }

            .add-section {
                flex-direction: column;
                align-items: stretch;
            }

            #newSubtopicInput {
                min-width: auto;
            }
        }

        @media (max-width: 480px) {
            .main-container {
                margin: 10px;
                width: calc(100vw - 20px);
            }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            .floating-orb,
            .grid-pattern,
            .particle,
            .title-glow {
                animation: none;
            }
            
            .main-container:hover {
                transform: none;
            }
            
            button:hover {
                transform: none;
            }
        }

        @media (prefers-contrast: high) {
            .main-container {
                border: 2px solid #63b3ed;
                background: rgba(15, 23, 42, 0.95);
            }
            
            #subtopicList li {
                border: 2px solid #63b3ed;
            }
        }
    </style>
</head>
<body class="p-4 md:p-8">
    <!-- Background Animation Elements -->
    <div class="bg-animation">
        <div class="grid-pattern"></div>
        <div class="floating-orb"></div>
        <div class="floating-orb"></div>
        <div class="floating-orb"></div>
        <div class="floating-orb"></div>
    </div>

    <!-- Floating Particles -->
    <div id="particles" aria-hidden="true"></div>

    <div class="main-container fade-in">
        <h1 class="title-glow font-bold text-center">✏️ Review Your Subtopics</h1>
        <p class="text-center subtitle">Drag to reorder, edit, add, or delete subtopics before generating the final presentation.</p>
        
        <ul id="subtopicList" class="mb-6 space-y-3"></ul>
        
        <div class="add-section">
            <input type="text" id="newSubtopicInput" placeholder="Add a new subtopic" autocomplete="off">
            <button onclick="addSubtopic()" class="add-button">Add</button>
        </div>
        
        <div class="final-button-section">
            <button id="generateFinalBtn" onclick="generateFinalPresentation()">✨ Create Presentation </button>
            <div id="loadingSpinner" style="display:none;"></div>
        </div>
    </div>

    <script>
        // Performance optimized particle creation
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const isMobile = window.innerWidth < 640;
            const particleCount = isMobile ? 5 : 10;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 10 + 's';
                particle.style.animationDuration = (10 + Math.random() * 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Initialize particles
        function initialize() {
            try {
                createParticles();
            } catch (error) {
                console.warn('Non-critical initialization error:', error);
            }
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }

        let subtopics = {{ subtopics | tojson | safe }};
        const mainTopic = "{{ topic }}";
        const userEmail = "{{ user_email }}";
        const list = document.getElementById('subtopicList');
        
        function renderSubtopics() {
            list.innerHTML = subtopics.map((st, i) => `
                <li class="flex items-center p-3 my-2 rounded-lg bg-slate-700 shadow-md cursor-grab" draggable="true" data-index="${i}">
                    <span class="text-slate-400 mr-4">${i + 1}.</span>
                    <input value="${st.replace(/"/g, '&quot;')}" onchange="updateSubtopic(${i}, this.value)" class="bg-transparent flex-grow focus:outline-none w-full">
                    <button onclick="deleteSubtopic(${i})" class="bg-red-500 text-white font-bold w-8 h-8 rounded-full ml-4 hover:bg-red-600 transition-colors">X</button>
                </li>`).join('');
            addDragAndDropHandlers();
        }
        
        function updateSubtopic(index, value) { subtopics[index] = value; }
        function deleteSubtopic(index) { subtopics.splice(index, 1); renderSubtopics(); }
        function addSubtopic() { 
            const input = document.getElementById('newSubtopicInput'); 
            if (input.value.trim()) { subtopics.push(input.value.trim()); input.value = ''; renderSubtopics(); } 
        }

        function addDragAndDropHandlers() {
            let draggedItem = null;
            list.querySelectorAll('li').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedItem = e.target;
                    setTimeout(() => e.target.classList.add('opacity-50'), 0);
                });
                item.addEventListener('dragend', (e) => {
                    e.target.classList.remove('opacity-50');
                    const newSubtopics = Array.from(list.querySelectorAll('li')).map(li => li.querySelector('input').value);
                    subtopics = newSubtopics;
                    renderSubtopics(); // Re-render to update numbers
                });
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const afterElement = getDragAfterElement(list, e.clientY);
                    list.insertBefore(draggedItem, afterElement);
                });
            });
        }
        
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('li:not(.opacity-50)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } 
                else { return closest; }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        async function generateFinalPresentation() {
            const btn = document.getElementById('generateFinalBtn'), spinner = document.getElementById('loadingSpinner');
            btn.style.display = 'none'; spinner.style.display = 'block';
            try { 
                const res = await fetch('/generate_final_presentation', { 
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({ 
                        topic: mainTopic, 
                        subtopics: subtopics,
                        email: userEmail
                    }) 
                }); 
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || 'Server error generating presentation.');
                }
                const result = await res.json();
                if (result.success && result.presentationId) {
                    // Redirect to the new editor page for the created presentation
                    window.location.href = `/present/${result.presentationId}`;
                } else {
                    throw new Error(result.message || 'Failed to get presentation ID.');
                }
            } catch (err) { 
                alert('Failed to generate presentation: ' + err); 
                btn.style.display = 'block'; 
                spinner.style.display = 'none'; 
            }
        }
        renderSubtopics();
    </script>
</body>
</html>
    ''', topic=topic, subtopics=subtopics, user_email=user_email)

@app.route('/present/<presentation_id>')
def present(presentation_id):
    """This is the editor page. It loads presentation data from MongoDB."""
    try:
        presentation = presentations_collection.find_one({'_id': ObjectId(presentation_id)})
        if not presentation or not presentation.get('isActive'):
            return "Presentation not found or has been deleted.", 404
        
       
        presentation_data = presentation.get('presentationData', {})

    except Exception as e:
        return f"Error loading presentation: {e}", 500

    return render_template_string('''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Presentation Editor</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lexend+Deca:wght@400;700&family=Roboto+Mono&family=Lora&family=Poppins&display=swap" rel="stylesheet">
            <style>
                :root { --primary-bg: #0f172a; --secondary-bg: #1e293b; --text: #e2e8f0; --accent: #38bdf8; --font-family: 'Inter', sans-serif; --title-font-size: 60px; --body-font-size: 28px; }
                body { background-color: var(--primary-bg); color: var(--text); font-family: var(--font-family); }
                .slide { width: 100%; height: 100%; position: absolute; top: 0; left: 0; display: none; background-color: var(--secondary-bg); color: var(--text); overflow: hidden; }
                .slide.active { display: block; }
                .draggable { position: absolute; border: 2px dashed transparent; transition: border-color 0.2s; touch-action: none; box-sizing: border-box; }
                .draggable.selected, .draggable:hover { border-color: var(--accent); }
                .draggable .resizer-handle { width: 12px; height: 12px; background: var(--accent); border: 2px solid white; border-radius: 50%; position: absolute; right: -6px; bottom: -6px; cursor: se-resize; z-index: 10; }
                .draggable .delete-btn { position: absolute; top: -12px; left: -12px; width: 24px; height: 24px; background: #ef4444; color: white; border-radius: 50%; border: 2px solid white; cursor: pointer; display: none; align-items: center; justify-content: center; font-weight: bold; z-index: 20; }
                .draggable.selected .delete-btn, .draggable:hover .delete-btn { display: flex; }
                .draggable div[contenteditable] { outline: none; width: 100%; height: 100%; }
                .draggable div[contenteditable] ul { list-style: disc; padding-left: 2rem; text-align: left; }
                .draggable div[contenteditable] li { margin-bottom: 0.75rem; }
                .customization-panel { transition: transform 0.3s ease-in-out; }
                .customization-panel.hidden { transform: translateX(100%); }
                .slide.bg-grid { background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 50px 50px; }
                .slide.bg-shapes::before, .slide.bg-shapes::after { content: ''; position: absolute; border-radius: 9999px; z-index: 0; opacity: 0.1; animation: float 20s infinite alternate ease-in-out; }
                .slide.bg-shapes::before { width: 200px; height: 200px; top: 10%; left: 15%; background: var(--accent); }
                .slide.bg-shapes::after { width: 150px; height: 150px; bottom: 10%; right: 15%; background: #f472b6; animation-delay: 5s; }
                @keyframes float { 0% { transform: translateY(0px) rotate(0deg) scale(1); } 100% { transform: translateY(40px) rotate(20deg) scale(1.1); } }
            </style>
        </head>
        <body class="w-screen h-screen overflow-hidden">
            <div id="top-bar" class="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm p-2 flex items-center justify-between z-30 shadow-lg">
                <div class="flex items-center gap-2">
                    <button id="addTextBtn" title="Add Text Box" class="bg-green-500 text-white font-bold p-2 rounded-lg hover:bg-green-600"> T+ </button>
                    <button id="addImageBtn" title="Add Image" class="bg-green-500 text-white font-bold p-2 rounded-lg hover:bg-green-600"> 🖼️ </button>
                    <input type="file" id="imageUpload" class="hidden" accept="image/*">
                </div>
                <div class="flex items-center gap-3">
                    <button id="prevBtn" class="bg-slate-700 p-2 rounded-md text-white hover:bg-slate-600 disabled:opacity-50">&lt; Prev</button>
                    <span id="slideIndicator" class="text-white font-mono">1 / 1</span>
                    <button id="nextBtn" class="bg-slate-700 p-2 rounded-md text-white hover:bg-slate-600">Next &gt;</button>
                </div>
                <div class="flex items-center gap-4">
                    <button id="saveBtn" class="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">Save Changes</button>
                    <button id="downloadPdfBtn" class="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Download PDF</button>
                    <button id="toggleCustomization" class="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700">🎨</button>
                </div>
            </div>

            <div id="customization-panel" class="customization-panel hidden fixed top-0 right-0 h-full bg-slate-800/90 backdrop-blur-lg p-6 shadow-2xl z-20 w-80 overflow-y-auto text-white">
                <h3 class="text-xl font-bold text-center mb-6">Customize Design</h3>
                <div class="space-y-4">
                    <div><label class="font-semibold block mb-1">Background Color</label><input type="color" id="bgColor" class="w-full h-10 p-1 bg-slate-700 rounded-md cursor-pointer"></div>
                    <div><label class="font-semibold block mb-1">Default Text Color</label><input type="color" id="textColor" class="w-full h-10 p-1 bg-slate-700 rounded-md cursor-pointer"></div>
                    <div><label class="font-semibold block mb-1">Accent/Title Color</label><input type="color" id="accentColor" class="w-full h-10 p-1 bg-slate-700 rounded-md cursor-pointer"></div>
                    <div><label class="font-semibold block mb-1">Font Family</label><select id="fontFamily" class="w-full bg-slate-700 p-2 rounded-md">
                        <option value="'Inter', sans-serif">Inter (Sans-serif)</option>
                        <option value="'Lexend Deca', sans-serif">Lexend Deca (Display)</option>
                        <option value="'Lora', serif">Lora (Serif)</option>
                        <option value="'Poppins', sans-serif">Poppins (Modern Sans)</option>
                        <option value="'Roboto Mono', monospace">Roboto Mono (Monospace)</option>
                    </select></div>
                    <div><label class="font-semibold block mb-1">Title Font Size: <span id="titleFsValue">60</span>px</label><input type="range" id="titleFontSize" min="30" max="100" step="1" class="w-full"></div>
                    <div><label class="font-semibold block mb-1">Body Font Size: <span id="bodyFsValue">28</span>px</label><input type="range" id="bodyFontSize" min="16" max="50" step="1" class="w-full"></div>
                    <div><label class="font-semibold block mb-1">Background Style</label><select id="backgroundStyle" class="w-full bg-slate-700 p-2 rounded-md">
                        <option value="none">None</option>
                        <option value="grid">Subtle Grid</option>
                        <option value="shapes">Floating Shapes</option>
                    </select></div>
                </div>
            </div>
            
            <div id="delete-confirm-modal" class="fixed inset-0 bg-black/60 items-center justify-center z-50 hidden">
                <div class="bg-slate-800 p-6 rounded-lg shadow-xl text-center">
                    <p class="text-lg mb-4">Are you sure you want to delete this element?</p>
                    <div class="flex justify-center gap-4">
                        <button id="confirm-delete-btn" class="bg-red-600 text-white px-4 py-2 rounded-lg">Yes, Delete</button>
                        <button id="cancel-delete-btn" class="bg-slate-600 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                </div>
            </div>

            <main id="presentation-container" class="w-full h-full pt-12 relative"></main>

            <script>
                let presentation = {{ presentation_data | tojson | safe }};
                let currentSlideIndex = 0;
                const presentationId = '{{ presentation_id }}';

                document.addEventListener('DOMContentLoaded', () => {
                    if (!presentation || !presentation.slides) {
                        alert('Could not load presentation data.');
                        // Fallback to a default structure if data is missing
                        presentation = { topic: "Error", theme: { bgColor: '#1e293b', textColor: '#e2e8f0', accentColor: '#38bdf8', fontFamily: "'Inter', sans-serif", titleFontSize: '60', bodyFontSize: '28', backgroundStyle: 'none' }, slides: [{ title: "Error Slide", elements: [] }] };
                    }
                    setupEventListeners();
                    applyTheme();
                    renderCurrentSlide();
                    updateNav();
                    updateCustomizationPanel();
                });

                function setupEventListeners() {
                    document.getElementById('prevBtn').addEventListener('click', prevSlide);
                    document.getElementById('nextBtn').addEventListener('click', nextSlide);
                    document.getElementById('addTextBtn').addEventListener('click', addTextElement);
                    document.getElementById('addImageBtn').addEventListener('click', () => document.getElementById('imageUpload').click());
                    document.getElementById('imageUpload').addEventListener('change', addImageElement);
                    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);
                    document.getElementById('toggleCustomization').addEventListener('click', () => {
                        document.getElementById('customization-panel').classList.toggle('hidden');
                    });
                    document.getElementById('customization-panel').addEventListener('input', handleThemeChange);
                    document.getElementById('saveBtn').addEventListener('click', handleUpdatePresentation);
                }
                
                async function handleUpdatePresentation() {
                    const saveButton = document.getElementById('saveBtn');
                    saveButton.disabled = true;
                    saveButton.textContent = 'Saving...';

                    try {
                        const response = await fetch(`/update_presentation/${presentationId}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ presentationData: presentation })
                        });
                        
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Failed to save changes.');
                        }
                        
                        const result = await response.json();
                        if (result.success) {
                            alert('Changes saved successfully!');
                        } else {
                            throw new Error(result.message || 'An unknown error occurred.');
                        }

                    } catch (error) {
                        console.error('Save error:', error);
                        alert(`Error: ${error.message}`);
                    } finally {
                        saveButton.disabled = false;
                        saveButton.textContent = 'Save Changes';
                    }
                }

                function handleThemeChange(e) {
                    const theme = presentation.theme;
                    if (e.target.id === 'bgColor') theme.bgColor = e.target.value;
                    if (e.target.id === 'textColor') theme.textColor = e.target.value;
                    if (e.target.id === 'accentColor') theme.accentColor = e.target.value;
                    if (e.target.id === 'fontFamily') theme.fontFamily = e.target.value;
                    if (e.target.id === 'titleFontSize') {
                        theme.titleFontSize = e.target.value;
                        document.getElementById('titleFsValue').textContent = e.target.value;
                    }
                    if (e.target.id === 'bodyFontSize') {
                        theme.bodyFontSize = e.target.value;
                        document.getElementById('bodyFsValue').textContent = e.target.value;
                    }
                    if (e.target.id === 'backgroundStyle') {
                        theme.backgroundStyle = e.target.value;
                    }
                    applyTheme();
                }

                function applyTheme() {
                    const root = document.documentElement;
                    const theme = presentation.theme;
                    root.style.setProperty('--primary-bg', theme.bgColor);
                    root.style.setProperty('--secondary-bg', theme.bgColor);
                    root.style.setProperty('--text', theme.textColor);
                    root.style.setProperty('--accent', theme.accentColor);
                    root.style.setProperty('--font-family', theme.fontFamily);
                    root.style.setProperty('--title-font-size', theme.titleFontSize + 'px');
                    root.style.setProperty('--body-font-size', theme.bodyFontSize + 'px');
                    renderCurrentSlide();
                }

                function updateCustomizationPanel() {
                    const theme = presentation.theme;
                    document.getElementById('bgColor').value = theme.bgColor;
                    document.getElementById('textColor').value = theme.textColor;
                    document.getElementById('accentColor').value = theme.accentColor;
                    document.getElementById('fontFamily').value = theme.fontFamily;
                    document.getElementById('titleFontSize').value = theme.titleFontSize;
                    document.getElementById('bodyFontSize').value = theme.bodyFontSize;
                    document.getElementById('titleFsValue').textContent = theme.titleFontSize;
                    document.getElementById('bodyFsValue').textContent = theme.bodyFontSize;
                    document.getElementById('backgroundStyle').value = theme.backgroundStyle || 'none';
                }

                function renderCurrentSlide() {
                    const container = document.getElementById('presentation-container');
                    container.innerHTML = ''; 
                    const slideData = presentation.slides[currentSlideIndex];
                    const slideEl = document.createElement('div');
                    slideEl.className = 'slide active';
                    slideEl.id = `slide-${currentSlideIndex}`;
                    
                    slideEl.classList.remove('bg-grid', 'bg-shapes');
                    if(presentation.theme.backgroundStyle && presentation.theme.backgroundStyle !== 'none') {
                        slideEl.classList.add(`bg-${presentation.theme.backgroundStyle}`);
                    }
                    
                    container.appendChild(slideEl);

                    slideData.elements.forEach((element, index) => {
                        const el = createDraggableElement(element, index);
                        slideEl.appendChild(el);
                    });
                }
                
                function createDraggableElement(elementData, index) {
                    const el = document.createElement('div');
                    el.className = 'draggable';
                    el.id = `element-${currentSlideIndex}-${index}`;
                    el.style.left = elementData.x;
                    el.style.top = elementData.y;
                    el.style.width = elementData.width;
                    el.style.height = elementData.height;
                    el.dataset.x = 0;
                    el.dataset.y = 0;
                    
                    let innerHTML = '';
                    if (elementData.type === 'text') {
                        el.style.color = elementData.isTitle ? 'var(--accent)' : 'var(--text)';
                        el.style.fontSize = elementData.isTitle ? 'var(--title-font-size)' : 'var(--body-font-size)';
                        el.style.fontFamily = 'inherit';
                        el.style.textAlign = elementData.isTitle ? 'center' : 'left';
                        innerHTML = `<div contenteditable="true" class="w-full h-full">${elementData.content}</div>`;
                    } else if (elementData.type === 'image') {
                        innerHTML = `<img src="${elementData.src}" class="w-full h-full object-cover">`;
                    }
                    
                    el.innerHTML = `<button class="delete-btn">X</button>${innerHTML}<div class="resizer-handle"></div>`;
                    
                    el.querySelector('.delete-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteElement(index);
                    });
                    
                    const contentDiv = el.querySelector('[contenteditable]');
                    if (contentDiv) {
                        contentDiv.addEventListener('blur', () => {
                            updateElementContent(el);
                        });
                    }

                    el.addEventListener('click', () => {
                          document.querySelectorAll('.draggable').forEach(d => d.classList.remove('selected'));
                          el.classList.add('selected');
                    });

                    interact(el)
                        .draggable({ listeners: { move: dragMoveListener }, onend: updateElementPositionAndSize })
                        .resizable({
                            edges: { left: true, right: true, bottom: true, top: true },
                            listeners: { move: resizeListener },
                            onend: updateElementPositionAndSize
                        });
                    return el;
                }
                
                function deleteElement(elementIndex) {
                    const modal = document.getElementById('delete-confirm-modal');
                    modal.style.display = 'flex';

                    const confirmBtn = document.getElementById('confirm-delete-btn');
                    const cancelBtn = document.getElementById('cancel-delete-btn');

                    const confirmHandler = () => {
                        presentation.slides[currentSlideIndex].elements.splice(elementIndex, 1);
                        renderCurrentSlide();
                        closeModal();
                    };
                    
                    const closeModal = () => {
                        modal.style.display = 'none';
                        confirmBtn.removeEventListener('click', confirmHandler);
                        cancelBtn.removeEventListener('click', closeModal);
                    };

                    confirmBtn.addEventListener('click', confirmHandler, { once: true });
                    cancelBtn.addEventListener('click', closeModal, { once: true });
                }

                function dragMoveListener(event) {
                    const target = event.target;
                    const x = (parseFloat(target.dataset.x) || 0) + event.dx;
                    const y = (parseFloat(target.dataset.y) || 0) + event.dy;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.dataset.x = x;
                    target.dataset.y = y;
                }

                function resizeListener(event) {
                    const target = event.target;
                    let x = (parseFloat(target.dataset.x) || 0);
                    let y = (parseFloat(target.dataset.y) || 0);
                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';
                    target.style.transform = `translate(${x}px, ${y}px)`;
                }
                
                function updateElementContent(target) {
                    const [, slideIdx, elIdx] = target.id.split('-').map(Number);
                     if(!presentation.slides[slideIdx] || !presentation.slides[slideIdx].elements[elIdx]) return;
                    const elementData = presentation.slides[slideIdx].elements[elIdx];
                    if (elementData.type === 'text') {
                        elementData.content = target.querySelector('[contenteditable]').innerHTML;
                    }
                }

                function updateElementPositionAndSize(event) {
                    const target = event.target;
                    const [, slideIdx, elIdx] = target.id.split('-').map(Number);
                    if(!presentation.slides[slideIdx] || !presentation.slides[slideIdx].elements[elIdx]) return;
                    
                    const elementData = presentation.slides[slideIdx].elements[elIdx];
                    const parentRect = target.parentElement.getBoundingClientRect();

                    const newX = target.offsetLeft + (parseFloat(target.dataset.x) || 0);
                    const newY = target.offsetTop + (parseFloat(target.dataset.y) || 0);

                    elementData.x = `${(newX / parentRect.width * 100).toFixed(2)}%`;
                    elementData.y = `${(newY / parentRect.height * 100).toFixed(2)}%`;
                    elementData.width = `${(target.offsetWidth / parentRect.width * 100).toFixed(2)}%`;
                    elementData.height = `${(target.offsetHeight / parentRect.height * 100).toFixed(2)}%`;
                    
                    if (elementData.type === 'text') {
                        elementData.content = target.querySelector('[contenteditable]').innerHTML;
                    }
                    
                    target.style.transform = '';
                    target.dataset.x = 0;
                    target.dataset.y = 0;
                    target.style.left = elementData.x;
                    target.style.top = elementData.y;
                }
                
                function addTextElement() {
                    const newText = { type: 'text', content: 'New Text', x: '5%', y: '5%', width: '30%', height: '15%', isTitle: false };
                    presentation.slides[currentSlideIndex].elements.push(newText);
                    renderCurrentSlide();
                }

                function addImageElement(event) {
                    const file = event.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const newImage = { type: 'image', src: e.target.result, x: '10%', y: '10%', width: '40%', height: '40%' };
                        presentation.slides[currentSlideIndex].elements.push(newImage);
                        renderCurrentSlide();
                    };
                    reader.readAsDataURL(file);
                }
                
                function prevSlide() { if (currentSlideIndex > 0) { currentSlideIndex--; renderCurrentSlide(); updateNav(); } }
                function nextSlide() { if (currentSlideIndex < presentation.slides.length - 1) { currentSlideIndex++; renderCurrentSlide(); updateNav(); } }
                
                function updateNav() {
                    document.getElementById('slideIndicator').textContent = `${currentSlideIndex + 1} / ${presentation.slides.length}`;
                    document.getElementById('prevBtn').disabled = currentSlideIndex === 0;
                    document.getElementById('nextBtn').disabled = currentSlideIndex === presentation.slides.length - 1;
                }

                async function downloadPDF() {
                    document.querySelectorAll('.draggable').forEach(d => d.classList.remove('selected'));
                    
                    const btn = document.getElementById('downloadPdfBtn'); btn.textContent = 'Downloading...'; btn.disabled = true;
                    const { jsPDF } = window.jspdf; 
                    const doc = new jsPDF({ orientation: 'l', unit: 'px', format: [1280, 720] });
                    const originalIndex = currentSlideIndex;

                    for (let i = 0; i < presentation.slides.length; i++) {
                        currentSlideIndex = i;
                        renderCurrentSlide();
                        await new Promise(r => setTimeout(r, 500)); 
                        const slideEl = document.getElementById(`slide-${i}`);
                        const canvas = await html2canvas(slideEl, { scale: 2, backgroundColor: presentation.theme.bgColor });
                        if (i > 0) doc.addPage([1280, 720], 'l');
                        doc.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 1280, 720);
                    }
                    
                    doc.save(`${presentation.topic.replace(/\s+/g, '_') || 'presentation'}.pdf`);
                    currentSlideIndex = originalIndex;
                    renderCurrentSlide();
                    btn.textContent = 'Download PDF'; btn.disabled = false;
                }
            </script>
        </body>
        </html>
    ''', presentation_data=presentation_data, presentation_id=presentation_id)


@app.route('/generate_final_presentation', methods=['POST'])
def generate_final_presentation():
    """Generates presentation, saves it to DB immediately, and returns the new ID."""
    data = request.get_json()
    main_topic = data.get('topic')
    user_subtopics = data.get('subtopics', [])
    email = data.get('email')

    if not all([main_topic, user_subtopics, email]):
        return jsonify({"success": False, "error": "Invalid request. Topic, subtopics, and email are required."}), 400

    final_subtopics = ["Introduction"] + user_subtopics[:] + ["Conclusion", "Q&A"]
    
    prompt = f"""
    Create a JSON object for a presentation on "{main_topic}".
    The JSON must have a 'topic' key set to "{main_topic}" and a 'slides' array. Each object in 'slides' represents a slide and has a 'title' (short and impactful) and an 'elements' array.
    Each element in 'elements' must have these keys: 'type', 'content' (for text) or 'query' (for image), 'x', 'y', 'width', 'height' (as responsive percentages, e.g., "50%"), and 'isTitle' (boolean). The 'fontSize' key is deprecated and should NOT be included.

    **IMPORTANT LAYOUT RULES & CONTENT FORMATTING:**
    The canvas is 100% wide by 100% high. Follow these layout templates STRICTLY.

    1.  **For a slide with an image and text (e.g., Introduction, Conclusion, content slides):**
        * **Layout:** Two-column.
        * **Text Element (Title):**
            * `"type": "text"`, `"isTitle": true`
            * `"x": "4%", "y": "20%", "width": "43%", "height": "15%"`
            * Content should be a short, engaging title for the slide's topic.
        * **Text Element (Body/Bullets):**
            * `"type": "text"`, `"isTitle": false`
            * **CRITICAL:** Content MUST be a detailed introductory paragraph followed by a concise HTML bulleted list. The list MUST use `<ul>` and `<li>` tags. For example: "<p>Introductory sentence about the topic.</p><ul><li>First key point.</li><li>Second key point.</li><li>Third key point.</li></ul>". Generate 3-5 key points.
            * `"x": "4%", "y": "35%", "width": "43%", "height": "50%"`
        * **Image Element:**
            * `"type": "image"`
            * `"x": "51%", "y": "18%", "width": "45%", "height": "64%"`

    2.  **For a "Title Only" slide (e.g., Q&A slide):**
        * **Layout:** Centered title.
        * **Text Element (Title):**
            * `"type": "text"`, `"isTitle": true`
            * `"x": "10%", "y": "40%", "width": "80%", "height": "20%"`

    **TASK:**
    Generate one slide object for each of these topics: {', '.join(final_subtopics)}.
    - Use the **Two-Column Layout** for all slides EXCEPT the 'Q&A' slide.
    - Use the **Title Only Layout** for the 'Q&A' slide.
    - For each image element, provide a concise, relevant search 'query'.

    Return ONLY the raw, perfectly formatted JSON object. Do not include any other text or markdown.
    """
    
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "responseMimeType": "application/json"}
    }
    
    try:
        print("Generating presentation data...")
        result = api_call_with_backoff(api_url, headers={'Content-Type': 'application/json'}, payload=payload)
        presentation_data = json.loads(result['candidates'][0]['content']['parts'][0]['text'])
        
      
        presentation_data['theme'] = {
            'bgColor': '#1e293b', 'textColor': '#e2e8f0', 'accentColor': '#38bdf8', 
            'fontFamily': "'Inter', sans-serif", 'titleFontSize': '60', 
            'bodyFontSize': '28', 'backgroundStyle': 'none'
        }

        print("Fetching and downloading images...")
       
        preview_image_url = None
        first_image_query = main_topic 

        for slide_idx, slide in enumerate(presentation_data.get('slides', [])):
            for element_idx, element in enumerate(slide.get('elements', [])):
                if element.get('type') == 'image' and 'query' in element:
                    
                    if not preview_image_url:
                        first_image_query = element['query']
                        preview_image_url = search_unsplash_image(first_image_query)
                    
                    image_url = search_unsplash_image(element['query'])
                    if image_url:
                        filename = f"slide_{slide_idx}_element_{element_idx}_{int(time.time())}.jpg"
                        local_image_path = download_image(image_url, filename)
                        element['src'] = local_image_path or "https://placehold.co/600x400/1e293b/e2e8f0?text=Image+Not+Found"
                    else:
                        element['src'] = "https://placehold.co/600x400/1e293b/e2e8f0?text=Image+Not+Found"
                    
                    if 'query' in element:
                        del element['query']
        
        
        if not preview_image_url:
            preview_image_url = search_unsplash_image(first_image_query)


        
        presentation_html = generate_presentation_html(presentation_data)
        presentation_doc = {
            'email': email,
            'username': "User",
            'presentationName': main_topic,
            'code': presentation_html,
            'presentationData': presentation_data,
            'theme': presentation_data.get('theme'),
           
            'previewImageUrl': preview_image_url or f"https://placehold.co/600x400/1e293b/e2e8f0?text={main_topic.replace(' ', '+')}",
            'createdAt': datetime.utcnow().isoformat(),
            'updatedAt': datetime.utcnow().isoformat(),
            'isActive': True
        }
        insert_result = presentations_collection.insert_one(presentation_doc)
        
        return jsonify({"success": True, "presentationId": str(insert_result.inserted_id)})

    except Exception as e:
        print(f"Error during presentation generation: {e}")
        return jsonify({"success": False, "error": "Failed to generate presentation content."}), 500




def generate_presentation_html(presentation_data):
    """Renders the presentation data into a static HTML string."""
    theme = presentation_data.get('theme', {})
    
    style = f"""
    <style>
        :root {{ 
            --primary-bg: {theme.get('bgColor', '#0f172a')}; 
            --text: {theme.get('textColor', '#e2e8f0')}; 
            --accent: {theme.get('accentColor', '#38bdf8')}; 
            --font-family: {theme.get('fontFamily', "'Inter', sans-serif")}; 
            --title-font-size: {theme.get('titleFontSize', '60')}px; 
            --body-font-size: {theme.get('bodyFontSize', '28')}px; 
        }}
        body {{ background-color: var(--primary-bg); color: var(--text); font-family: var(--font-family); margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; }}
        .slide {{ width: 100%; height: 100%; position: relative; overflow: hidden; page-break-after: always; }}
        .element {{ position: absolute; box-sizing: border-box; }}
        .element.text.title {{ color: var(--accent); font-size: var(--title-font-size); text-align: center; }}
        .element.text.body {{ color: var(--text); font-size: var(--body-font-size); }}
        .element.text.body ul {{ list-style: disc; padding-left: 2rem; text-align: left; }}
        .element.text.body li {{ margin-bottom: 0.75rem; }}
        .element.image img {{ width: 100%; height: 100%; object-fit: cover; }}
    </style>
    """
    
    slides_html = ""
    for slide_data in presentation_data.get('slides', []):
        elements_html = ""
        for el in slide_data.get('elements', []):
            el_style = f"left: {el['x']}; top: {el['y']}; width: {el['width']}; height: {el['height']};"
            if el['type'] == 'text':
                content = el['content']
                el_class = 'title' if el.get('isTitle') else 'body'
                elements_html += f'<div class="element text {el_class}" style="{el_style}">{content}</div>'
            elif el['type'] == 'image':
                img_src = el.get("src", "")
                elements_html += f'<div class="element image" style="{el_style}"><img src="{img_src}"></div>'
        
        slides_html += f'<div class="slide">{elements_html}</div>'

    return f"<!DOCTYPE html><html><head><title>{presentation_data.get('topic', '')}</title>{style}</head><body>{slides_html}</body></html>"


@app.route('/update_presentation/<presentation_id>', methods=['POST'])
def update_presentation(presentation_id):
    """Updates an existing presentation in MongoDB."""
    data = request.get_json()
    try:
        presentation_data = data.get('presentationData')
        if not presentation_data:
            return jsonify({'success': False, 'message': 'No presentation data provided'}), 400

        
        presentation_html = generate_presentation_html(presentation_data)

        update_result = presentations_collection.update_one(
            {'_id': ObjectId(presentation_id)},
            {'$set': {
                'presentationName': presentation_data.get('topic'),
                'code': presentation_html,
                'presentationData': presentation_data,
                'theme': presentation_data.get('theme'),
                'updatedAt': datetime.utcnow().isoformat()
            }}
        )
        
        if update_result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Presentation updated successfully.'})
        else:
            return jsonify({'success': False, 'message': 'No changes detected or presentation not found.'}), 404

    except Exception as e:
        print(f"Error updating presentation: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500




@app.route('/presentations/<email>')
def get_user_presentations(email):
    """
    Fetches all active presentations for a given user email.
    This is the primary endpoint for the React frontend to get the presentation list.
    """
    try:
        email = unquote(email)
       
        presentations = list(presentations_collection.find(
            {'email': email, 'isActive': True},
            {'_id': 1, 'presentationName': 1, 'createdAt': 1, 'previewImageUrl': 1, 'code': 1} 
        ).sort('createdAt', -1))
        
        for p in presentations:
            p['_id'] = str(p['_id'])
            
        return jsonify({'success': True, 'presentations': presentations})
    except Exception as e:
        print(f"Error fetching presentations for {email}: {e}")
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500

@app.route('/presentations/view/<presentation_id>')
def view_presentation(presentation_id):
    """Serves the raw HTML of a presentation for viewing/previewing."""
    try:
        presentation = presentations_collection.find_one(
            {'_id': ObjectId(presentation_id), 'isActive': True}
        )
        if presentation:
            return presentation['code']
        return "Presentation not found or has been deleted.", 404
    except Exception as e:
        return str(e), 500

@app.route('/presentations/delete/<presentation_id>', methods=['DELETE'])
def delete_presentation(presentation_id):
    """Soft-deletes a presentation by marking it as inactive."""
    try:
        result = presentations_collection.update_one(
            {'_id': ObjectId(presentation_id)},
            {'$set': {'isActive': False, 'deletedAt': datetime.utcnow().isoformat()}}
        )
        if result.modified_count > 0:
            return jsonify({'success': True, 'message': 'Presentation deleted successfully'})
        else:
            return jsonify({'success': False, 'message': 'Presentation not found'}), 404
    except Exception as e:
        print(f"Error deleting presentation {presentation_id}: {e}")
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500


@app.route('/dashboard')
def dashboard():
    return render_template_string('''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Presentations</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            body { 
                font-family: 'Inter', sans-serif; 
                background: #0f172a;
                color: #e2e8f0; 
            }
        </style>
    </head>
    <body class="p-8">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold text-center mb-2 text-sky-400">My Presentations</h1>
            <p class="text-center text-slate-400 mb-8">View, edit, and manage your AI-generated presentations.</p>
            <div class="flex gap-4 mb-8">
                <input type="email" id="emailInput" placeholder="Enter your email to load presentations" class="flex-grow bg-slate-800 p-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                <button id="loadBtn" class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg">Load</button>
            </div>
            <div id="presentationsList" class="space-y-4">
                <!-- Presentations will be loaded here -->
            </div>
        </div>

        <script>
            document.getElementById('loadBtn').addEventListener('click', loadPresentations);
            
            document.addEventListener('DOMContentLoaded', () => {
                const savedEmail = localStorage.getItem('userEmail');
                if (savedEmail) {
                    document.getElementById('emailInput').value = savedEmail;
                    loadPresentations();
                }
            });

            async function loadPresentations() {
                const email = document.getElementById('emailInput').value;
                if (!email) {
                    alert('Please enter an email.');
                    return;
                }
                localStorage.setItem('userEmail', email); 
                
                const listEl = document.getElementById('presentationsList');
                listEl.innerHTML = '<p>Loading...</p>';
                
                try {
                    const response = await fetch(`/presentations/${encodeURIComponent(email)}`);
                    if (!response.ok) throw new Error('Failed to fetch presentations.');
                    
                    const data = await response.json();
                    if (data.success) {
                        if (data.presentations.length > 0) {
                            listEl.innerHTML = data.presentations.map(p => `
                                <div class="bg-slate-800 p-4 rounded-lg flex justify-between items-center transition hover:bg-slate-700">
                                    <div>
                                        <h3 class="text-xl font-bold">${p.presentationName}</h3>
                                        <p class="text-slate-400 text-sm">Created: ${new Date(p.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div class="flex gap-2">
                                        <a href="/presentations/view/${p._id}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">View</a>
                                        <a href="/present/${p._id}" target="_blank" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Edit</a>
                                        <button onclick="deletePresentation('${p._id}')" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
                                    </div>
                                </div>
                            `).join('');
                        } else {
                            listEl.innerHTML = '<p class="text-center text-slate-400">No presentations found for this email.</p>';
                        }
                    } else {
                        throw new Error(data.message);
                    }
                } catch (error) {
                    listEl.innerHTML = `<p class="text-red-400">Error: ${error.message}</p>`;
                }
            }

            async function deletePresentation(id) {
                if (!confirm('Are you sure you want to delete this presentation?')) return;
                
                try {
                    const response = await fetch(`/presentations/delete/${id}`, { method: 'DELETE' });
                    const data = await response.json();
                    if (data.success) {
                        alert('Presentation deleted.');
                        loadPresentations(); // Refresh the list
                    } else {
                        throw new Error(data.message);
                    }
                } catch (error) {
                    alert(`Error deleting presentation: ${error.message}`);
                }
            }
        </script>
    </body>
    </html>
    ''')


@app.route('/static/images/<filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_DIR, filename)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
