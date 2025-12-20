const getSystemPrompt = (language, availableCars) => {
  const carsInfo = availableCars.map(car => 
    `- ${car.brand} ${car.model} (${car.year}): $${car.price}, ${car.category}, ${car.transmission}, ${car.fuelType}, ${car.seats} seats, ${car.color}`
  ).join('\n');

  const prompts = {
    english: `You are a helpful car sales assistant for an online car dealership. Your role is to:
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

    arabic: `أنت مساعد مبيعات سيارات مفيد لوكالة سيارات عبر الإنترنت. دورك هو:
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
      .select('brand model year price category transmission fuelType seats color')
      .limit(50);

    // Build conversation history for Claude
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
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
        system: getSystemPrompt(selectedLanguage, availableCars),
        messages: messages
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const botResponse = data.content[0].text;

    // Extract car recommendations if any are mentioned
    const recommendedCars = availableCars.filter(car => {
      const carIdentifier = `${car.brand} ${car.model}`.toLowerCase();
      return botResponse.toLowerCase().includes(carIdentifier);
    }).slice(0, 3);

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
      language: selectedLanguage
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