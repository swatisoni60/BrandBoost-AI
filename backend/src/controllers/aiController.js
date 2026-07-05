const OpenAI = require("openai");
const Campaign = require("../models/Campaign");

// Works with OpenAI by default. To use a free provider instead (e.g. Groq),
// set AI_BASE_URL and AI_MODEL in .env — see backend/.env.example for values.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_BASE_URL || undefined, // e.g. https://api.groq.com/openai/v1
});
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";

// Ask the model for strict JSON and parse defensively.
const askForJSON = async (systemPrompt, userPrompt) => {
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content;
  return JSON.parse(raw);
};

// @route POST /api/ai/marketing-generator
// Body: { product, targetAudience, budget, platform, goal, productId }
const generateMarketing = async (req, res, next) => {
  try {
    const { product, targetAudience, budget, platform, goal, productId } = req.body;

    if (!product || !targetAudience || !goal) {
      return res.status(400).json({ message: "product, targetAudience and goal are required" });
    }

    const systemPrompt = `You are a senior performance marketing strategist. Always respond with a single valid JSON object only, no markdown, matching this exact shape:
{
  "campaignStrategy": string (3-5 sentences),
  "instagramCaption": string,
  "facebookAd": string,
  "linkedinPost": string,
  "googleAdCopy": { "headline": string, "description": string },
  "cta": string,
  "hashtags": string[] (6-10 items, no # symbol needed, include it),
  "bestPostingTime": string
}`;

    const userPrompt = `Product: ${product}
Target audience: ${targetAudience}
Budget: ${budget || "not specified"}
Primary platform: ${platform || "multi-platform"}
Campaign goal: ${goal}`;

    const output = await askForJSON(systemPrompt, userPrompt);

    const campaign = await Campaign.create({
      owner: req.user._id,
      product: productId || undefined,
      type: "marketing",
      inputs: { product, targetAudience, budget, platform, goal },
      output,
      status: "draft",
    });

    res.status(201).json({ campaign });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/ai/seo-assistant
// Body: { product, keywords, productId }
const generateSEO = async (req, res, next) => {
  try {
    const { product, keywords, productId } = req.body;

    if (!product) {
      return res.status(400).json({ message: "product is required" });
    }

    const systemPrompt = `You are an expert e-commerce SEO copywriter. Always respond with a single valid JSON object only, no markdown, matching this exact shape:
{
  "productDescription": string (2-3 short paragraphs),
  "metaTitle": string (under 60 characters),
  "metaDescription": string (under 155 characters),
  "keywords": string[] (8-12 items),
  "blogTopics": string[] (5 items),
  "landingPageCopy": string (short hero section copy, 2-3 sentences)
}`;

    const userPrompt = `Product: ${product}
Seed keywords (optional): ${keywords || "none provided"}`;

    const output = await askForJSON(systemPrompt, userPrompt);

    const campaign = await Campaign.create({
      owner: req.user._id,
      product: productId || undefined,
      type: "seo",
      inputs: { product, keywords },
      output,
      status: "draft",
    });

    res.status(201).json({ campaign });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/ai/campaigns?type=marketing|seo
const getCampaigns = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { owner: req.user._id };
    if (type) query.type = type;

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 }).populate("product", "name");
    res.json({ campaigns });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/ai/poster-generator
// Body: { product, style, tagline, productId }
// Uses Pollinations.ai — a free, no-API-key image generation service.
const generatePoster = async (req, res, next) => {
  try {
    const { product, style, tagline, productId } = req.body;

    if (!product) {
      return res.status(400).json({ message: "product is required" });
    }

    const promptParts = [
      `professional advertising poster for ${product}`,
      style ? `${style} style` : "modern minimalist style",
      tagline ? `with bold text saying "${tagline}"` : "with clean bold typography",
      "high quality, studio lighting, commercial photography, 4k",
    ];
    const prompt = promptParts.join(", ");

    // Pollinations serves the generated image directly at this URL — no
    // API key, no request needed here, the frontend/browser loads it as
    // a normal <img src>. We add a random seed so repeat clicks vary.
    const seed = Math.floor(Math.random() * 1_000_000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1024&height=1024&seed=${seed}&nologo=true`;

    const campaign = await Campaign.create({
      owner: req.user._id,
      product: productId || undefined,
      type: "poster",
      inputs: { product, style, tagline },
      output: { imageUrl, prompt },
      status: "draft",
    });

    res.status(201).json({ campaign });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateMarketing, generateSEO, generatePoster, getCampaigns };
