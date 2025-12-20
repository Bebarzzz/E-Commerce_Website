const Car = require('../Models/carModel');

// Function to detect if query needs web search
const needsWebSearch = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Keywords that indicate general car inquiries requiring web search
  const searchKeywords = [
    'what is', 'how to', 'latest', 'news', 'review', 'comparison', 'best', 
    'vs', 'versus', 'specs', 'specifications', 'features', 'history',
    'evolution', 'future', 'upcoming', 'recall', 'safety rating',
    'fuel efficiency', 'maintenance', 'tips', 'guide', 'tutorial',
    'problems', 'issues', 'common', 'famous', 'popular', 'trending'
  ];
  
  // Car-related terms
  const carTerms = [
    'car', 'cars', 'vehicle', 'automobile', 'auto', 'sedan', 'suv', 'truck',
    'hatchback', 'coupe', 'convertible', 'wagon', 'minivan', 'pickup',
    'motorcycle', 'bike', 'electric', 'hybrid', 'gasoline', 'diesel',
    'engine', 'transmission', 'tires', 'brakes', 'battery', 'charging'
  ];
  
  const hasSearchKeyword = searchKeywords.some(keyword => lowerMessage.includes(keyword));
  const hasCarTerm = carTerms.some(term => lowerMessage.includes(term));
  
  // Don't search if asking about available cars or pricing from inventory
  const inventoryKeywords = ['available', 'price', 'cost', 'buy', 'purchase', 'inventory', 'stock'];
  const isInventoryQuery = inventoryKeywords.some(keyword => lowerMessage.includes(keyword));
  
  return hasSearchKeyword && hasCarTerm && !isInventoryQuery;
};

// Function to perform web search
const performWebSearch = async (query) => {
  try {
    if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      console.log('Google Search API not configured, skipping web search');
      return null;
    }

    const searchQuery = `cars ${query}`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=5`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const searchResults = data.items.map(item => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link
      }));
      
      return searchResults;
    }
    
    return null;
  } catch (error) {
    console.error('Web search error:', error);
    return null;
  }
};

// System prompt for the chatbot
const getSystemPrompt = (language, availableCars, searchResults = null) => {
  const carsInfo = availableCars.map(car => 
    `- ${car.brand} ${car.model} (${car.year}): $${car.price}, ${car.category}, ${car.transmission}, ${car.fuelType}, ${car.seats} seats, ${car.color}`
  ).join('\n');

  let webSearchInfo = '';
  if (searchResults) {
    webSearchInfo = '\n\nWeb Search Results (use this information to answer general car questions):\n' + 
      searchResults.map(result => 
        `Title: ${result.title}\nSummary: ${result.snippet}\nSource: ${result.link}`
      ).join('\n\n');
  }

  const prompts = {
    english: `You are a helpful car sales assistant for an online car dealership. Your role is to:
1. Help customers find the perfect car based on their needs and budget
2. Provide detailed information about specific cars
3. Make personalized recommendations
4. Answer questions about features, pricing, and specifications
5. Answer general car-related questions using web search results when available

Available cars in our inventory:
${carsInfo}${webSearchInfo}

Guidelines:
- Always be helpful and enthusiastic
- If a customer asks about a car not in inventory, politely inform them and suggest alternatives
- When recommending cars, consider budget, family size, fuel efficiency, and usage
- Keep responses concise but informative
- If asked about financing or delivery, inform them to contact sales for details
- For general car questions (reviews, specs, news, etc.), use the web search results provided above to give accurate information
- If web search results are available, mention that you're using current web information`,

    arabic: `أنت مساعد مبيعات سيارات مفيد لوكالة سيارات عبر الإنترنت. دورك هو:
1. مساعدة العملاء في العثور على السيارة المثالية بناءً على احتياجاتهم وميزانيتهم
2. تقديم معلومات مفصلة عن سيارات محددة
3. تقديم توصيات شخصية
4. الإجابة على الأسئلة حول الميزات والأسعار والمواصفات
5. الإجابة على الأسئلة العامة المتعلقة بالسيارات باستخدام نتائج البحث على الويب عند توفرها

السيارات المتوفرة في مخزوننا:
${carsInfo}${webSearchInfo}

الإرشادات:
- كن دائمًا مفيدًا ومتحمسًا
- إذا سأل العميل عن سيارة غير موجودة في المخزون، أخبره بأدب واقترح بدائل
- عند التوصية بالسيارات، ضع في الاعتبار الميزانية وحجم العائلة وكفاءة الوقود والاستخدام
- اجعل الردود موجزة ولكن غنية بالمعلومات
- إذا سُئل عن التمويل أو التسليم، أخبرهم بالاتصال بقسم المبيعات للحصول على التفاصيل
- للأسئلة العامة عن السيارات (مراجعات، مواصفات، أخبار، إلخ)، استخدم نتائج البحث على الويب المقدمة أعلاه لتقديم معلومات دقيقة
- إذا كانت نتائج البحث على الويب متاحة، اذكر أنك تستخدم معلومات الويب الحالية`
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

    // Check if web search is needed
    const requiresWebSearch = needsWebSearch(message);
    let searchResults = null;
    let isWebSearch = false;

    if (requiresWebSearch) {
      searchResults = await performWebSearch(message);
      if (searchResults) {
        isWebSearch = true;
      }
    }

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
    let botResponse;
    if (process.env.CLAUDE_API_KEY) {
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
          system: getSystemPrompt(selectedLanguage, availableCars, searchResults),
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      botResponse = data.content[0].text;
    } else {
      // Fallback response when API key is not set
      const lowerMessage = message.toLowerCase();
      let response = '';
      
      if (lowerMessage.includes('available') && lowerMessage.includes('car')) {
        if (availableCars.length > 0) {
          const carsList = availableCars.slice(0, 5).map(car => `${car.brand} ${car.model} (${car.year}) - $${car.price}`).join(', ');
          response = selectedLanguage === 'english'
            ? `We currently have these cars available: ${carsList}. Which one interests you?`
            : `لدينا هذه السيارات المتوفرة حالياً: ${carsList}. أي منها يثير اهتمامك؟`;
        } else {
          response = selectedLanguage === 'english'
            ? "I'm sorry, we don't have any cars available right now. Please check back later!"
            : "عذراً، ليس لدينا أي سيارات متوفرة الآن. يرجى المحاولة لاحقاً!";
        }
      } else if (lowerMessage.includes('suv') || lowerMessage.includes('family') || lowerMessage.includes('عائلي')) {
        const suvs = availableCars.filter(car => car.category === 'SUV').slice(0, 3);
        if (suvs.length > 0) {
          response = selectedLanguage === 'english'
            ? `For family adventures, I recommend these SUVs: ${suvs.map(car => `${car.brand} ${car.model} for $${car.price}`).join(', ')}. They're perfect for road trips with the kids!`
            : `للمغامرات العائلية، أوصي بهذه السيارات SUV: ${suvs.map(car => `${car.brand} ${car.model} بسعر $${car.price}`).join(', ')}. مثالية للرحلات مع الأطفال!`;
        } else {
          response = selectedLanguage === 'english'
            ? "I don't have any SUVs available right now, but I can suggest some spacious alternatives for your family!"
            : "ليس لدي أي سيارات SUV متوفرة الآن، لكن يمكنني اقتراح بعض البدائل الواسعة لعائلتك!";
        }
      } else if (lowerMessage.includes('sedan') || lowerMessage.includes('economy') || lowerMessage.includes('اقتصادي')) {
        const sedans = availableCars.filter(car => car.category === 'Sedan').slice(0, 3);
        if (sedans.length > 0) {
          response = selectedLanguage === 'english'
            ? `If you're looking for fuel efficiency, these sedans are great: ${sedans.map(car => `${car.brand} ${car.model} for $${car.price}`).join(', ')}. Very economical to run!`
            : `إذا كنت تبحث عن كفاءة الوقود، هذه السيارات رائعة: ${sedans.map(car => `${car.brand} ${car.model} بسعر $${car.price}`).join(', ')}. اقتصادية جداً في التشغيل!`;
        } else {
          response = selectedLanguage === 'english'
            ? "Let me show you our sedan options - they're perfect for daily commuting!"
            : "دعني أريك خياراتنا من السيارات - مثالية للتنقل اليومي!";
        }
      } else if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive') || lowerMessage.includes('فاخر')) {
        const luxury = availableCars.filter(car => car.price > 50000).slice(0, 3);
        if (luxury.length > 0) {
          response = selectedLanguage === 'english'
            ? `For that premium feel, check out these luxury options: ${luxury.map(car => `${car.brand} ${car.model} for $${car.price}`).join(', ')}. Pure sophistication!`
            : `للشعور الفاخر، تحقق من هذه الخيارات: ${luxury.map(car => `${car.brand} ${car.model} بسعر $${car.price}`).join(', ')}. أناقة نقية!`;
        } else {
          response = selectedLanguage === 'english'
            ? "We have some high-end vehicles that might suit your taste for luxury!"
            : "لدينا بعض المركبات عالية الجودة التي قد تناسب ذوقك للفخامة!";
        }
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('مرحبا')) {
        response = selectedLanguage === 'english'
          ? "Hello there! I'm excited to help you find your perfect car. What are you in the market for today?"
          : "مرحباً! أنا متحمس لمساعدتك في العثور على سيارتك المثالية. ما الذي تبحث عنه اليوم؟";
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('سعر')) {
        const affordable = availableCars.filter(car => car.price < 30000).slice(0, 3);
        if (affordable.length > 0) {
          response = selectedLanguage === 'english'
            ? `We have some great deals under $30,000: ${affordable.map(car => `${car.brand} ${car.model} for $${car.price}`).join(', ')}. Budget-friendly options!`
            : `لدينا بعض العروض الرائعة تحت 30,000 دولار: ${affordable.map(car => `${car.brand} ${car.model} بسعر $${car.price}`).join(', ')}. خيارات مناسبة للميزانية!`;
        } else {
          response = selectedLanguage === 'english'
            ? "Tell me your budget and I'll find cars that fit perfectly!"
            : "أخبرني بميزانيتك وسأجد سيارات تناسب تماماً!";
        }
      } else if (lowerMessage.includes('new') || lowerMessage.includes('used') || lowerMessage.includes('جديد') || lowerMessage.includes('مستعمل')) {
        response = selectedLanguage === 'english'
          ? "We have both new and used cars available. What type of vehicle are you interested in? New cars come with full warranty, while our certified used cars are thoroughly inspected!"
          : "لدينا سيارات جديدة ومستعملة متاحة. ما نوع السيارة التي تهتم بها؟ السيارات الجديدة تأتي مع ضمان كامل، بينما سياراتنا المستعملة المعتمدة تم فحصها بدقة!";
      } else {
        // General conversational responses
        const generalResponses = selectedLanguage === 'english' ? [
          "That's interesting! While I'm primarily here to help with cars, I'd be happy to chat about automotive topics. What kind of vehicle are you thinking about?",
          "I love talking about cars! Whether it's performance, comfort, or reliability, I can help you find the right one. What's on your mind?",
          "Great question! I'm your car expert. Let me know what you're looking for - from compact cars to luxury SUVs, I've got recommendations!",
          "I'm here to make your car buying experience amazing! Tell me more about what you need, and I'll guide you to the perfect vehicle."
        ] : [
          "هذا مثير للاهتمام! بينما أنا هنا بشكل أساسي للمساعدة في السيارات، سأكون سعيداً للحديث عن مواضيع السيارات. ما نوع السيارة التي تفكر فيها؟",
          "أحب الحديث عن السيارات! سواء كان الأداء أو الراحة أو الموثوقية، يمكنني مساعدتك في العثور على المناسب. ما الذي يدور في ذهنك؟",
          "سؤال رائع! أنا خبير السيارات الخاص بك. أخبرني بما تحتاجه، وسأرشدك إلى السيارة المثالية.",
          "أنا هنا لجعل تجربة شراء سيارتك رائعة! أخبرني المزيد عما تحتاجه، وسأرشدك إلى السيارة المثالية."
        ];
        response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }
      
      botResponse = response;
    }

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
      language: selectedLanguage,
      isWebSearch: isWebSearch
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