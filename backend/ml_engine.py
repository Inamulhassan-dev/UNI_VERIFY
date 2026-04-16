import numpy as np
from typing import List, Tuple, Optional
import pickle

# ============ ML MODEL CONFIGURATION ============

# Using a lightweight but effective model
MODEL_NAME = "all-MiniLM-L6-v2"  # Fast and accurate, ~80MB

# Similarity threshold - projects above this are flagged
SIMILARITY_THRESHOLD = 0.70  # 70%

# Global model instance (loaded once)
_model = None


def get_model():
    """
    Get or load the sentence transformer model.
    Uses lazy loading to avoid loading on import.
    """
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer  # noqa: PLC0415
        print(f"Loading ML model: {MODEL_NAME}...")
        _model = SentenceTransformer(MODEL_NAME)
        print("Model loaded successfully!")
    return _model


# ============ EMBEDDING FUNCTIONS ============

def generate_embedding(text: str) -> np.ndarray:
    """
    Generate an embedding vector for the given text.
    
    Args:
        text: Input text to embed
        
    Returns:
        Numpy array of shape (384,) - the embedding vector
    """
    model = get_model()
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding


def embedding_to_bytes(embedding: np.ndarray) -> bytes:
    """Convert numpy embedding to bytes for database storage"""
    return pickle.dumps(embedding)


def bytes_to_embedding(embedding_bytes: bytes) -> np.ndarray:
    """Convert bytes back to numpy embedding"""
    return pickle.loads(embedding_bytes)


# ============ SIMILARITY FUNCTIONS ============

def calculate_similarity(embedding1: np.ndarray, embedding2: np.ndarray) -> float:
    """
    Calculate cosine similarity between two embeddings.
    
    Args:
        embedding1: First embedding vector
        embedding2: Second embedding vector
        
    Returns:
        Similarity score between 0 and 1
    """
    # Normalize vectors
    norm1 = np.linalg.norm(embedding1)
    norm2 = np.linalg.norm(embedding2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    # Cosine similarity
    similarity = np.dot(embedding1, embedding2) / (norm1 * norm2)
    
    # Clamp to [0, 1]
    return float(max(0.0, min(1.0, similarity)))


def find_similar_projects(
    new_embedding: np.ndarray,
    existing_embeddings: List[Tuple[int, bytes]],  # List of (project_id, embedding_bytes)
    threshold: float = SIMILARITY_THRESHOLD
) -> List[dict]:
    """
    Find projects similar to the new submission.
    
    Args:
        new_embedding: Embedding of the new project
        existing_embeddings: List of (project_id, embedding_bytes) tuples
        threshold: Minimum similarity to be considered a match
        
    Returns:
        List of dictionaries with 'project_id' and 'similarity' keys
    """
    similar_projects = []
    
    for project_id, embedding_bytes in existing_embeddings:
        try:
            existing_embedding = bytes_to_embedding(embedding_bytes)
            similarity = calculate_similarity(new_embedding, existing_embedding)
            
            if similarity >= threshold:
                similar_projects.append({
                    "project_id": project_id,
                    "similarity": round(similarity * 100, 2)  # Convert to percentage
                })
        except Exception as e:
            print(f"Error comparing with project {project_id}: {e}")
            continue
    
    # Sort by similarity (highest first)
    similar_projects.sort(key=lambda x: x["similarity"], reverse=True)
    
    return similar_projects


def calculate_originality_score(similar_projects: List[dict]) -> float:
    """
    Calculate originality score based on similar projects found.
    
    Args:
        similar_projects: List of similar projects with similarity scores
        
    Returns:
        Originality score from 0 to 100
    """
    if not similar_projects:
        return 100.0  # Completely original
    
    # Get the highest similarity found
    max_similarity = similar_projects[0]["similarity"]
    
    # Originality is inverse of max similarity
    # If 90% similar to something, originality is 10%
    originality = 100.0 - max_similarity
    
    return round(max(0.0, originality), 2)


# ============ AI ANALYSIS FUNCTIONS ============

def extract_project_details(text: str) -> dict:
    """
    Extract key details from the project text using simple NLP.
    """
    text_lower = text.lower()
    
    # Common tech keywords to detect
    tech_keywords = {
        "python": "Python",
        "javascript": "JavaScript", 
        "react": "React.js",
        "node": "Node.js",
        "machine learning": "Machine Learning",
        "deep learning": "Deep Learning",
        "tensorflow": "TensorFlow",
        "pytorch": "PyTorch",
        "flask": "Flask",
        "django": "Django",
        "mongodb": "MongoDB",
        "mysql": "MySQL",
        "postgresql": "PostgreSQL",
        "html": "HTML/CSS",
        "android": "Android",
        "ios": "iOS",
        "java": "Java",
        "kotlin": "Kotlin",
        "swift": "Swift",
        "firebase": "Firebase",
        "aws": "AWS",
        "azure": "Azure",
        "docker": "Docker",
        "neural network": "Neural Networks",
        "nlp": "NLP",
        "natural language": "NLP",
        "computer vision": "Computer Vision",
        "image processing": "Image Processing",
        "api": "REST API",
        "blockchain": "Blockchain",
        "iot": "IoT",
        "arduino": "Arduino",
        "raspberry": "Raspberry Pi"
    }
    
    # Detect technologies
    detected_tech = []
    for keyword, tech_name in tech_keywords.items():
        if keyword in text_lower and tech_name not in detected_tech:
            detected_tech.append(tech_name)
    
    # Limit to top 5 technologies
    detected_tech = detected_tech[:5] if detected_tech else ["Not specified"]
    
    # Extract smart summary
    summary = extract_smart_summary(text)
    
    # Detect project domain
    domain_keywords = {
        "spam": "Email/Spam Detection",
        "email": "Email Systems",
        "detection": "Detection System",
        "classification": "Classification",
        "prediction": "Predictive Analytics",
        "e-commerce": "E-Commerce",
        "healthcare": "Healthcare",
        "education": "Education",
        "finance": "Finance",
        "security": "Security",
        "chat": "Chat/Communication",
        "social": "Social Media",
        "weather": "Weather/Environment",
        "recommendation": "Recommendation System",
        "sentiment": "Sentiment Analysis",
        "face": "Face Recognition",
        "object": "Object Detection",
        "voice": "Voice/Speech",
        "translator": "Translation"
    }
    
    detected_domain = "General"
    for keyword, domain in domain_keywords.items():
        if keyword in text_lower:
            detected_domain = domain
            break
    
    return {
        "summary": summary,
        "technologies": detected_tech,
        "domain": detected_domain,
        "word_count": len(text.split())
    }


def extract_smart_summary(text: str) -> str:
    """
    Intelligently extract a summary by scoring sentences based on importance keywords.
    """
    import re
    
    # 1. Split into sentences (simple rule-based)
    sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', text)
    
    # 2. Keywords that indicate importance
    importance_keywords = {
        "aim": 5, "objective": 5, "purpose": 5, "goal": 5,
        "propose": 4, "develop": 4, "design": 4, "implement": 4,
        "methodology": 3, "method": 3, "approach": 3, "algorithm": 3,
        "result": 3, "conclusion": 3, "outcome": 3,
        "feature": 2, "system": 2, "application": 2,
        "abstract": 1, "introduction": 1
    }
    
    scored_sentences = []
    
    for i, sentence in enumerate(sentences):
        # Skip very short sentences or titles
        if len(sentence) < 20:
            continue
            
        score = 0
        sent_lower = sentence.lower()
        
        # Keyword scoring
        for word, weight in importance_keywords.items():
            if word in sent_lower:
                score += weight
        
        # Boost first few sentences (likely introduction)
        if i < 3:
            score += 2
            
        scored_sentences.append((score, i, sentence))
    
    # 3. Sort by score (desc) then original index (asc)
    # We want high scoring sentences, but in order of appearance
    scored_sentences.sort(key=lambda x: x[0], reverse=True)
    
    # Take top 3-4 sentences
    top_sentences = scored_sentences[:4]
    
    # Sort back to original order for flow
    top_sentences.sort(key=lambda x: x[1])
    
    # Join them
    summary = " ".join([item[2] for item in top_sentences])
    
    # Fallback to simple truncation if no good sentences found
    if len(summary) < 50 or len(top_sentences) == 0:
        return text[:400] + "..."
        
    return summary



def generate_suggestions(originality: float, similar_projects: list, project_details: dict) -> list:
    """
    Generate data-driven AI suggestions based on actual analysis results.
    Responses reference real project matches, not generic pre-made answers.
    """
    suggestions = []
    
    # Get info about the most similar project for specific feedback
    top_match_title = None
    top_match_similarity = 0
    if similar_projects:
        top_match_similarity = similar_projects[0]["similarity"]
        top_match_title = f"Project #{similar_projects[0]['project_id']}"
    
    if originality >= 80:
        suggestions.append({
            "type": "success",
            "title": "✅ Highly Original Project",
            "message": f"Your project scored {originality}% originality. No significant matches found in our database of existing projects. This topic is unique and you can proceed confidently."
        })
        techs = project_details.get("technologies", [])
        tech_str = ", ".join(t for t in techs if t != "Not specified")
        if tech_str:
            suggestions.append({
                "type": "tip",
                "title": "💡 Strengthen Your Project",
                "message": f"Your project uses {tech_str}. To make it even stronger, consider adding performance benchmarks, real-world dataset evaluation, or a comparative study with alternative approaches in {project_details['domain']}."
            })
    elif originality >= 50:
        match_info = f" The closest match has {top_match_similarity}% similarity." if top_match_similarity else ""
        suggestions.append({
            "type": "warning",
            "title": f"⚠️ Partial Overlap Detected ({originality}% Original)",
            "message": f"Your project shares some concepts with {len(similar_projects)} existing project(s) in our database.{match_info} You need to add unique elements to differentiate your work."
        })
        
        domain = project_details.get("domain", "General")
        suggestions.append({
            "type": "tip",
            "title": "💡 How to Make It Unique",
            "message": f"Since your {domain} project overlaps with existing work, consider: (1) Using a different algorithm or methodology, (2) Applying it to a unique dataset or use case, (3) Adding features the existing projects don't have, (4) Combining it with another domain like IoT or mobile."
        })
    else:
        match_count = len(similar_projects)
        suggestions.append({
            "type": "danger",
            "title": f"❌ High Similarity — {originality}% Originality",
            "message": f"This project is {100 - originality}% similar to existing submissions. We found {match_count} closely matching project(s) in our database. The highest match is {top_match_similarity}% similar. This project will likely be flagged for duplication."
        })
        suggestions.append({
            "type": "tip",
            "title": "💡 What You Should Do",
            "message": "We strongly recommend choosing a different topic OR significantly modifying your approach. For example: change the core algorithm, target a different problem domain, use a novel dataset, or combine technologies in a way not seen in existing projects."
        })
    
    # Technology-based suggestions (data-aware)
    techs = project_details.get("technologies", [])
    if "Machine Learning" in techs or "Deep Learning" in techs:
        suggestions.append({
            "type": "info",
            "title": "🧠 ML Project Guidance",
            "message": f"ML projects in {project_details.get('domain', 'your domain')} are common in our database. To stand out: use cross-validation, compare at least 3 algorithms, show confusion matrices, and test on a real-world dataset rather than a benchmark one."
        })
    
    if "Not specified" in techs or len(techs) < 2:
        suggestions.append({
            "type": "info",
            "title": "📋 Improve Your Documentation",
            "message": f"Your document mentions few technologies. Our analysis works best when your synopsis clearly lists frameworks, languages, and tools used. This helps us give more accurate originality assessments."
        })
    
    return suggestions[:4]  # Limit to 4 suggestions


# ============ MAIN ANALYSIS FUNCTION ============

def analyze_project(
    text: str,
    existing_embeddings: List[Tuple[int, bytes]]
) -> dict:
    """
    Full analysis of a project submission.
    
    Args:
        text: Extracted text from the project PDF
        existing_embeddings: List of existing project embeddings
        
    Returns:
        Analysis result dictionary
    """
    # Generate embedding for new text
    embedding = generate_embedding(text)
    
    # Find similar projects
    similar = find_similar_projects(embedding, existing_embeddings)
    
    # Calculate originality score
    originality = calculate_originality_score(similar)
    
    # Extract project details
    project_details = extract_project_details(text)
    
    # Generate AI suggestions
    suggestions = generate_suggestions(originality, similar, project_details)
    
    # Determine status and message
    if originality >= 70:
        status = "original"
        message = "🎉 Great news! Your project is original and unique. You can proceed with this topic!"
    elif originality >= 40:
        status = "review"
        message = "⚠️ Your project has some similarities with existing work. Please review the similar projects and consider adding unique features."
    else:
        status = "duplicate"
        message = "❌ This project is very similar to existing submissions. We recommend choosing a different topic or significantly modifying your approach."
    
    return {
        "embedding": embedding,
        "embedding_bytes": embedding_to_bytes(embedding),
        "similar_projects": similar,
        "originality_score": originality,
        "status": status,
        "message": message,
        "project_details": project_details,
        "suggestions": suggestions
    }

