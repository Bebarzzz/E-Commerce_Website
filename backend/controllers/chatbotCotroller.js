const Car = require('../Models/carModel');

// Web search function using DuckDuckGo instant answers API
const searchWeb = async (query) => {
  try {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    let result = '';

    // Extract instant answer if available
    if (data.Answer) {
      result += `Answer: ${data.Answer}\n\n`;
    }

    // Extract abstract if available
    if (data.Abstract) {
      result += `Summary: ${data.Abstract}\n\n`;
    }

    // Extract related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      result += 'Related Information:\n';
      data.RelatedTopics.slice(0, 3).forEach(topic => {
        if (topic.Text) {
          result += `- ${topic.Text}\n`;
        }
      });
    }

    return result || 'I couldn\'t find specific information for your query. Could you please rephrase or provide more details?';
  } catch (error) {
    console.error('Web search error:', error);
    return 'I\'m having trouble searching the web right now. Please try again later.';
  }
};

// Function to determine if query is car-related
const isCarRelated = (message, availableCars) => {
  const carKeywords = ['car', 'vehicle', 'auto', 'automobile', 'drive', 'driving', 'buy', 'purchase', 'price', 'model', 'brand'];
  const messageLower = message.toLowerCase();

  // Check for car-specific keywords
  const hasCarKeywords = carKeywords.some(keyword => messageLower.includes(keyword));

  // Check if message mentions specific cars from inventory
  const mentionsSpecificCar = availableCars.some(car =>
    messageLower.includes(car.brand.toLowerCase()) ||
    messageLower.includes(car.model.toLowerCase())
  );

  return hasCarKeywords || mentionsSpecificCar;
};

const getSystemPrompt = (language, availableCars, isWebSearch = false) => {
  const carsInfo = availableCars.map(car => 
    `- ${car.brand} ${car.model} (${car.year}): $${car.price}, ${car.category}, ${car.transmission}, ${car.fuelType}, ${car.seats} seats, ${car.color}`
  ).join('\n');

  const prompts = {
    english: isWebSearch ? `You are a helpful AI assistant with access to web search capabilities. Your role is to:
1. Answer general questions and provide information on any topic
2. Search the web for current information, facts, and answers
3. Be informative, accurate, and helpful
4. Keep responses concise but comprehensive
5. If you find relevant information, summarize it clearly

Guidelines:
- Always provide accurate information based on available data
- If information is time-sensitive, note that it may change
- Be conversational and engaging
- Ask for clarification if the query is ambiguous` :

`You are a helpful car sales assistant for an online car dealership. Your role is to:
1. Help customers find the perfect car based on their needs and budget
2. Provide detailed information about specific cars
3. Make personalized recommendations
4. Answer questions about features, pricing, and specifications
5. Be friendly, professional, and concise

Available cars in our inventory:
${carsInfo}

Guidelines:
- Always be helpful and enthusiastic
- If a customer asks about a car not in inventory, politely inform them and suggest alternatives
- When recommending cars, consider budget, family size, fuel efficiency, and usage
- Keep responses concise but informative
- If asked about financing or delivery, inform them to contact sales for details`,

    arabic: isWebSearch ? `أنت مساعد ذكي مفيد لديك إمكانية البحث على الويب. دورك هو:
1. الإجابة على الأسئلة العامة وتقديم معلومات عن أي موضوع
2. البحث على الويب للحصول على معلومات حديثة وحقائق وإجابات
3. كن معلوماتيًا ودقيقًا ومفيدًا
4. اجعل الردود موجزة ولكن شاملة
5. إذا وجدت معلومات ذات صلة، لخصها بوضوح

الإرشادات:
- قدم دائمًا معلومات دقيقة بناءً على البيانات المتاحة
- إذا كانت المعلومات حساسة زمنيًا، لاحظ أنها قد تتغير
- كن محادثًا وجذابًا
- اطلب توضيحًا إذا كان الاستعلام غامضًا` :

`أنت مساعد مبيعات سيارات مفيد لوكالة سيارات عبر الإنترنت. دورك هو:
1. مساعدة العملاء في العثور على السيارة المثالية بناءً على احتياجاتهم وميزانيتهم
2. تقديم معلومات مفصلة عن سيارات محددة
3. تقديم توصيات شخصية
4. الإجابة على الأسئلة حول الميزات والأسعار والمواصفات
5. كن ودودًا ومحترفًا وموجزًا

السيارات المتوفرة في مخزوننا:
${carsInfo}

الإرشادات:
- كن دائمًا مفيدًا ومتحمسًا
- إذا سأل العميل عن سيارة غير موجودة في المخزون، أخبره بأدب واقترح بدائل
- عند التوصية بالسيارات، ضع في الاعتبار الميزانية وحجم العائلة وكفاءة الوقود والاستخدام
- اجعل الردود موجزة ولكن غنية بالمعلومات
- إذا سُئل عن التمويل أو التسليم، أخبرهم بالاتصال بقسم المبيعات للحصول على التفاصيل`
  };

  return prompts[language] || prompts.english;
};

// Chat with the bot
const chatWithBot = async (req, res) => {
  try {
    const { message, language = 'english', conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Validate language
    const validLanguages = ['english', 'arabic'];
    const selectedLanguage = validLanguages.includes(language) ? language : 'english';

    // Fetch available cars from database
    const availableCars = await Car.find({ status: 'available' })
      .select('brand model year price category transmission fuelType seats color images')
      .limit(50);

    // Determine if the query is car-related
    const carRelated = isCarRelated(message, availableCars);
    const useWebSearch = !carRelated;

    let systemPrompt = getSystemPrompt(selectedLanguage, availableCars, useWebSearch);
    let userMessage = message;

    // If using web search, get web results and include them in context
    if (useWebSearch) {
      const webResults = await searchWeb(message);
      userMessage = `${message}\n\nWeb search results:\n${webResults}`;
    }

    // Build conversation history for Claude
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const botResponse = data.content[0].text;

    // Extract car recommendations if any are mentioned (only for car-related queries)
    const recommendedCars = carRelated ? availableCars.filter(car => {
      const carIdentifier = `${car.brand} ${car.model}`.toLowerCase();
      return botResponse.toLowerCase().includes(carIdentifier);
    }).slice(0, 3) : [];

    res.status(200).json({
      message: botResponse,
      recommendedCars: recommendedCars.map(car => ({
        _id: car._id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        image: car.images?.[0] || ''
      })),
      language: selectedLanguage,
      isWebSearch: useWebSearch
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
};

// Get available cars for chatbot context
const getAvailableCars = async (req, res) => {
  try {
    const cars = await Car.find({ status: 'available' })
      .select('brand model year price category transmission fuelType seats color images')
      .limit(50);

    res.status(200).json({ cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

module.exports = {
  chatWithBot,
  getAvailableCars
};