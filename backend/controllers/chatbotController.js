const Groq = require('groq-sdk');
const Car = require('../Models/carModel');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Conversation history storage (in production, use Redis or database)
const conversationHistory = new Map();

// Function to get available cars from MongoDB
const getAvailableCarsData = async () => {
  try {
    const cars = await Car.find({ status: 'available' })
      .select('brand model year price category transmission fuelType seats color images description')
      .limit(50);
    return cars;
  } catch (error) {
    console.error('Error fetching cars from database:', error);
    return [];
  }
};

// Function to format cars data for AI context
const formatCarsContext = (cars) => {
  if (!cars || cars.length === 0) {
    return "Currently, there are no cars available in our inventory.";
  }
  
  return cars.map((car, index) => 
    `${index + 1}. ${car.year} ${car.brand} ${car.model}
   - Price: $${car.price.toLocaleString()}
   - Category: ${car.category}
   - Transmission: ${car.transmission}
   - Fuel Type: ${car.fuelType}
   - Seats: ${car.seats}
   - Color: ${car.color}
   ${car.description ? `- Description: ${car.description}` : ''}`
  ).join('\n\n');
};

// System prompt for the chatbot (supports both Arabic and English)
const getSystemPrompt = (carsContext, language) => {
  if (language === 'ar' || language === 'arabic') {
    return `أنت مساعد ذكي متخصص في مبيعات السيارات في معرض سيارات. مهمتك هي مساعدة العملاء في العثور على السيارة المثالية من مخزوننا.

معلومات مهمة:
- أجب دائماً باللغة العربية
- كن ودوداً ومحترفاً ومفيداً
- قدم معلومات دقيقة عن السيارات المتوفرة في مخزوننا
- اقترح سيارات بناءً على احتياجات العميل وميزانيته
- إذا لم تكن السيارة المطلوبة متوفرة، اقترح بدائل مناسبة
- أجب على أسئلة عامة عن السيارات، لكن ركز على مخزوننا

المخزون الحالي:
${carsContext}

عند التوصية بسيارات:
1. اسأل عن احتياجات العميل (فئة السيارة، الميزانية، الاستخدام)
2. قدم خيارات محددة من مخزوننا
3. اشرح لماذا كل خيار مناسب
4. قدم تفاصيل السعر والمواصفات
5. اعرض جدولة اختبار قيادة أو زيارة المعرض`;
  } else {
    return `You are an AI sales assistant for a car dealership. Your job is to help customers find the perfect car from our inventory.

Important guidelines:
- Always respond in English
- Be friendly, professional, and helpful
- Provide accurate information about cars available in our inventory
- Suggest cars based on customer needs and budget
- If a requested car is not available, suggest suitable alternatives
- Answer general car questions, but focus on our inventory

Current Inventory:
${carsContext}

When recommending cars:
1. Ask about customer needs (car type, budget, usage)
2. Provide specific options from our inventory
3. Explain why each option is suitable
4. Include pricing and specifications
5. Offer to schedule a test drive or showroom visit`;
  }
};

// Main chat function
const chatWithBot = async (req, res) => {
  try {
    const { message, language = 'en', sessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: language === 'ar' ? 'الرجاء إدخال رسالة صحيحة' : 'Please provide a valid message'
      });
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        status: 'error',
        message: language === 'ar' 
          ? 'خطأ في التكوين: مفتاح API غير موجود' 
          : 'Configuration error: Groq API key not found'
      });
    }

    // Get available cars
    const cars = await getAvailableCarsData();
    const carsContext = formatCarsContext(cars);

    // Get or create conversation history
    const sid = sessionId || 'default';
    if (!conversationHistory.has(sid)) {
      conversationHistory.set(sid, []);
    }
    const history = conversationHistory.get(sid);

    // Add user message to history
    history.push({
      role: 'user',
      content: message
    });

    // Keep only last 10 messages to avoid token limit
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    // Prepare messages for Groq API
    const messages = [
      {
        role: 'system',
        content: getSystemPrompt(carsContext, language)
      },
      ...history
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Fast and capable model
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from AI');
    }

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: assistantMessage
    });

    // Update conversation history
    conversationHistory.set(sid, history);

    // Return response
    res.json({
      status: 'success',
      response: assistantMessage,
      sessionId: sid,
      carsCount: cars.length
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    const isArabic = req.body.language === 'ar';
    
    res.status(500).json({
      status: 'error',
      message: isArabic 
        ? `عذراً، حدث خطأ أثناء معالجة طلبك. الرجاء المحاولة مرة أخرى.`
        : `Sorry, an error occurred while processing your request. Please try again.`,
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

// Get available cars endpoint
const getAvailableCars = async (req, res) => {
  try {
    const cars = await getAvailableCarsData();
    res.json({
      status: 'success',
      count: cars.length,
      cars: cars
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch cars'
    });
  }
};

// Clear conversation history endpoint
const clearHistory = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const sid = sessionId || 'default';
    
    conversationHistory.delete(sid);
    
    res.json({
      status: 'success',
      message: 'Conversation history cleared'
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to clear history'
    });
  }
};

module.exports = {
  chatWithBot,
  getAvailableCars,
  clearHistory
};
