# AI Chatbot Documentation

## Overview
The chatbot has been rebuilt using Groq API with full support for Arabic and English languages. It's specifically designed for car dealership sales, helping customers find cars from your inventory.

## Features
- **Bilingual Support**: Fluent in both Arabic and English
- **Real-time Inventory**: Fetches current car listings from MongoDB
- **Context-Aware Conversations**: Maintains conversation history
- **Smart Recommendations**: Suggests cars based on customer needs and budget
- **Session Management**: Tracks individual user conversations

## Setup Instructions

### 1. Backend Configuration

#### Install Dependencies
```bash
cd backend
npm install groq-sdk
```

#### Environment Variables
Add the following to your `.env` file:
```env
GROQ_API_KEY=your_groq_api_key_here
```

To get a Groq API key:
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### 2. API Endpoints

#### Chat Endpoint
**POST** `/api/chatbot/chat`

Request body:
```json
{
  "message": "Show me available SUVs",
  "language": "en",  // "en" for English, "ar" for Arabic
  "sessionId": "optional-session-id"
}
```

Response:
```json
{
  "status": "success",
  "response": "AI generated response...",
  "sessionId": "session_123456",
  "carsCount": 10
}
```

#### Get Available Cars
**GET** `/api/chatbot/cars`

Response:
```json
{
  "status": "success",
  "count": 10,
  "cars": [...]
}
```

#### Clear Conversation History
**POST** `/api/chatbot/clear`

Request body:
```json
{
  "sessionId": "session_123456"
}
```

### 3. Frontend Usage

The chatbot component is automatically available in your React application:

```jsx
import Chatbot from './Components/Chatbot';

function App() {
  return (
    <div>
      {/* Your app content */}
      <Chatbot />
    </div>
  );
}
```

## Language Support

### Switching Languages
Users can switch between English and Arabic using the language toggle button in the chatbot header.

### Example Conversations

**English:**
```
User: Show me all available cars
Bot: We currently have 10 vehicles in our inventory. Here are some options...

User: I need a family SUV under $40,000
Bot: I can help you find a perfect family SUV! Based on your budget...
```

**Arabic:**
```
User: أرني جميع السيارات المتاحة
Bot: لدينا حالياً 10 مركبة في مخزوننا. إليك بعض الخيارات...

User: أحتاج سيارة SUV عائلية بأقل من 40,000 دولار
Bot: يمكنني مساعدتك في العثور على سيارة SUV عائلية مثالية! بناءً على ميزانيتك...
```

## Technical Details

### AI Model
- **Provider**: Groq
- **Model**: llama-3.3-70b-versatile
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 1024

### Conversation Management
- Sessions are tracked using unique session IDs
- Last 10 messages are kept in history to avoid token limits
- History is stored in memory (consider using Redis for production)

### Error Handling
- Graceful fallbacks for API errors
- User-friendly error messages in both languages
- Development mode shows detailed errors

## Customization

### Modifying System Prompt
Edit the `getSystemPrompt()` function in [backend/controllers/chatbotController.js](../backend/controllers/chatbotController.js) to customize the AI's behavior and personality.

### Adjusting Model Parameters
In [backend/controllers/chatbotController.js](../backend/controllers/chatbotController.js), modify:
```javascript
const completion = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,  // Adjust for creativity
  max_tokens: 1024,  // Adjust response length
  top_p: 0.9
});
```

### Adding More Languages
1. Add translations to the `translations` object in [frontend/src/Components/Chatbot.jsx](../frontend/src/Components/Chatbot.jsx)
2. Add corresponding system prompts in `getSystemPrompt()` function
3. Update language detection logic

## Troubleshooting

### Chatbot not responding
- Check if GROQ_API_KEY is set in `.env`
- Verify MongoDB connection (chatbot needs car data)
- Check browser console for errors

### Wrong language responses
- Ensure the `language` parameter is correctly passed ("en" or "ar")
- Verify the system prompt includes language instructions

### Session issues
- Session IDs are generated client-side
- Clear browser cache if experiencing session problems
- Use the clear history endpoint to reset conversations

## Production Considerations

1. **Rate Limiting**: Implement rate limiting to prevent API abuse
2. **Session Storage**: Use Redis instead of in-memory storage
3. **Monitoring**: Track API usage and costs
4. **Error Logging**: Implement proper error logging (e.g., Sentry)
5. **Caching**: Cache car inventory to reduce database queries
6. **Security**: Validate and sanitize user inputs

## API Costs

Groq provides:
- Free tier with generous limits
- Very fast inference times
- Cost-effective for production use

Monitor your usage at [Groq Console](https://console.groq.com/)

## Support

For issues or questions:
1. Check this documentation
2. Review error logs
3. Check Groq API status
4. Verify environment variables

## Updates and Maintenance

### Updating the AI Model
To use a different Groq model, change the `model` parameter in the API call:
```javascript
model: 'mixtral-8x7b-32768',  // Alternative model
```

Available models: Check [Groq Documentation](https://console.groq.com/docs/models)

### Monitoring Performance
Track these metrics:
- Response time
- Success rate
- User satisfaction
- API costs
- Conversation completion rate
