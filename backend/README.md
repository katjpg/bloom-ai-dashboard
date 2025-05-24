# Bloom AI Dashboard - Backend
> Real-time message moderation and sentiment analysis backend using finite state machines and orchestrator-worker pattern

A message processing backend built with FastAPI and Pydantic AI, implementing finite state machine workflows for content moderation and sentiment analysis in gaming communities. Features graph-based agent orchestration, PII detection, and behavioral scoring.

## Quick Start

### Installation

```bash
git clone https://github.com/katjpg/bloom-ai-dashboard.git
cd bloom-ai-dashboard/backend

python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### Environment Setup

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
HF_TOKEN=your_huggingface_token_here
```

**Required API Keys:**
- **Gemini API Key**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **HuggingFace Token**: Get from [HuggingFace Settings](https://huggingface.co/settings/tokens)

### Running the Application

```bash
fastapi dev app.py
```

**Expected Output:**
```
FastAPI   Starting development server
module   app.py
server   Server started at http://127.0.0.1:8000
server   Documentation at http://127.0.0.1:8000/docs
```

**Access Points:**
- **API Documentation**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/api/v1/health
- **System Stats**: http://127.0.0.1:8000/api/v1/stats

## Finite State Machine Architecture

### Moderation State Machine

```mermaid
stateDiagram-v2
    [*] --> StartModeration
    StartModeration --> DetectPII
    DetectPII --> CheckIntent: No PII
    DetectPII --> BlockMessage: PII Found
    CheckIntent --> ModerateContent: No Intent
    CheckIntent --> BlockMessage: Sharing Intent
    ModerateContent --> DetermineAction: Harmful Content
    ModerateContent --> ApproveMessage: Content Safe
    DetermineAction --> ApplyModeration
    ApplyModeration --> [*]
    BlockMessage --> [*]
    ApproveMessage --> [*]
```

**State Machine Features:**
- **PII Detection**: Personal information identification using HuggingFace transformers
- **Intent Analysis**: Pydantic AI agent for sharing intent classification
- **Content Classification**: Multi-label content moderation (hate speech, spam, threats)
- **Action Determination**: Gemini-based moderation action selection

### Sentiment Analysis State Machine

```mermaid
stateDiagram-v2
    [*] --> StartSentimentAnalysis
    StartSentimentAnalysis --> CheckContentLength
    CheckContentLength --> SkipSentiment: Length  AnalyzeSentiment: Length >= 20
    SkipSentiment --> AnalyzeCommunityIntent
    AnalyzeSentiment --> AnalyzeCommunityIntent
    AnalyzeCommunityIntent --> CalculateRewards
    CalculateRewards --> [*]
```

**State Machine Features:**
- **Sentiment Scoring**: RoBERTa-based emotion analysis with neutral dampening
- **Community Intent**: Gaming-specific behavioral pattern recognition
- **Reward Calculation**: Dynamic point allocation based on contribution metrics
- **Length Filtering**: Minimum character threshold for analysis

## Orchestrator-Worker Pattern

The system implements a hierarchical orchestrator-worker architecture:

**Orchestrator Layer** (`/services/chat.py`):
- Coordinates moderation and sentiment workflows
- Manages state transitions between agent systems
- Handles error recovery and fallback mechanisms

**Worker Agents** (`/agents/`):
- **Moderation Workers**: PII detection, intent analysis, content classification
- **Sentiment Workers**: Emotion analysis, community intent, reward calculation
- **Specialized Models**: HuggingFace transformers, Gemini language models

**Graph Execution**:
- Pydantic Graph manages node execution order
- State persistence across workflow transitions
- Conditional routing based on previous node outputs

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/moderate` | Execute complete moderation pipeline |
| `GET` | `/api/v1/users/{user_id}/score` | Retrieve user sentiment score |
| `GET` | `/api/v1/leaderboard` | Query top scoring users |
| `GET` | `/api/v1/stats` | System performance metrics |
| `GET` | `/api/v1/health` | Service health status |

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/moderate \
  -H "Content-Type: application/json" \
  -d '{
    "message_id": "msg_001",
    "content": "Great job everyone! Keep up the excellent work!",
    "user_id": 123,
    "timestamp": "2025-05-23T20:00:00Z",
    "deleted": false
  }'
```

### Response Format

```json
{
  "moderation_state": {
    "message": {...},
    "pii_result": null,
    "content_result": {"main_category": "OK"},
    "recommended_action": null
  },
  "sentiment_analysis": {
    "sentiment_score": 87,
    "community_intent": {
      "intent": "ENCOURAGEMENT",
      "reason": "Positive encouragement to team members"
    }
  },
  "user_score_updated": true,
  "new_score": 4
}
```

## Project Structure

```
backend/
├── agents/
│   ├── moderation/
│   │   ├── state.py
│   │   ├── nodes.py
│   │   ├── graph.py
│   │   └── __init__.py
│   └── sentiment/
│       ├── state.py
│       ├── nodes.py
│       ├── graph.py
│       └── __init__.py
├── services/
│   ├── moderation.py
│   ├── sentiment.py
│   └── chat.py
├── routes/
│   └── chat.py
├── models/
│   └── chat.py
├── app.py
├── requirements.txt
└── .env
```

### Architecture Principles

- **Finite State Machines**: Deterministic state transitions using Pydantic Graph
- **Orchestrator-Worker Pattern**: Hierarchical task distribution and coordination
- **Type Safety**: Complete Pydantic validation across all state transitions
- **Async Processing**: Non-blocking I/O for external API integrations
- **Modular Design**: Isolated agent workflows with clean dependency injection

## Configuration

### Model Configuration

Edit configuration constants in `/agents/*/nodes.py`:

```python
# Language Models
GEMINI_MODEL = "google-gla:gemini-2.0-flash"

# Transformer Endpoints
PII_DETECTION_API_URL = "https://router.huggingface.co/..."
SENTIMENT_API_URL = "https://router.huggingface.co/..."

# State Machine Thresholds
POSITIVE_SENTIMENT_THRESHOLD = 30
POSITIVE_ACTION_POINTS = 2
```

### Environment Variables

```env
# Required
GEMINI_API_KEY=your_key_here
HF_TOKEN=your_token_here

# Optional
LOG_LEVEL=INFO
API_TIMEOUT=30
```

## Monitoring

- **State Metrics**: Real-time workflow execution statistics
- **Agent Performance**: Individual node execution timing
- **User Scoring**: Community engagement analytics
- **System Health**: Service availability monitoring


