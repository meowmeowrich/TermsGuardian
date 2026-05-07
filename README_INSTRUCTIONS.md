Build a production-quality AI-powered web application called “Terms Guardian” that analyzes Terms of Service, Privacy Policies, contracts, and legal documents in an aggressive, highly detailed, user-friendly way.

The goal is NOT generic summarization.
The AI must actively search for:
- hidden risks
- dangerous clauses
- anti-consumer wording
- data harvesting
- account termination abuse
- arbitration clauses
- forced waivers
- auto-renewals
- subscription traps
- ownership/license traps
- vague wording
- suspicious legal loopholes
- privacy concerns
- dark patterns
- liability shifting
- one-sided terms
- misleading language
- excessive permissions
- future policy modification abuse
- cancellation difficulty
- resale/sharing of data
- AI training data usage
- biometric/behavioral collection
- location tracking
- third-party sharing

The platform should feel futuristic, immersive, smooth, and premium.

==================================================
CORE USER EXPERIENCE
==================================================

When the user opens the website:
- ultra smooth cinematic animations begin immediately
- subtle animated gradients
- floating UI movement
- glassmorphism
- immersive transitions
- premium modern feel
- extremely responsive
- smooth easing animations everywhere
- no clunky movements
- elegant motion design inspired by modern AI products

The landing page layout should be inspired by Base44-style AI interfaces:
- minimal
- centered
- clean
- immersive
- dark mode by default
- large centered input box
- AI-first design

The homepage should contain:
- large animated centered textbox
- “Paste Terms of Service, Privacy Policy, or URL”
- upload button for files
- URL input support
- animated glowing borders
- hover interactions
- soft particle/background effects
- dynamic motion while typing

When the user pastes a URL:
- backend fetches webpage contents automatically
- extracts readable legal text
- strips navigation/ads/junk
- processes the real document text
- handles redirects and lazy-loaded content
- shows loading progress animations

==================================================
AI ANALYSIS ENGINE
==================================================

The AI must NOT behave like a passive summarizer.

The AI should behave like:
- an aggressive consumer protection analyst
- a privacy investigator
- a legal risk detector
- a “worst-case-scenario” analyzer

The AI should:
- assume companies may exploit loopholes
- highlight potential abuse possibilities
- explain realistic consequences
- explain what could happen to the user
- estimate risk severity
- explain risks in plain human language
- identify manipulative wording
- explain hidden implications
- explain difficult-to-understand clauses

The AI output should include:
- simplified summary
- aggressive risk analysis
- privacy score
- danger score
- consumer friendliness score
- cancellation difficulty score
- “what they really mean” explanations
- highlighted suspicious sections
- actionable recommendations
- “should you avoid this?” analysis
- “biggest red flags”
- “best clauses”
- “what happens if something goes wrong?”
- “what rights do you lose?”
- “what data do they REALLY collect?”

==================================================
OUTPUT UI
==================================================

The AI response must transform into a highly polished expandable dashboard UI.

DO NOT display plain AI chat text.

Instead:
- parse AI output into sections/cards
- each finding becomes an expandable animated accordion/tab
- smooth open/close transitions
- severity color indicators
- risk icons
- dynamic gradients
- animated highlights
- hover interactions
- floating UI depth effects

The AI itself should control formatting metadata:
- heading size
- text emphasis
- boldness
- warning highlights
- importance levels
- structured hierarchy

The frontend should parse structured AI JSON output and automatically render:
- headings
- paragraphs
- expandable sections
- warnings
- badges
- scores
- danger labels
- recommendation boxes

Each section should feel alive and interactive.

==================================================
DESIGN REQUIREMENTS
==================================================

Use:
- Next.js
- TypeScript
- TailwindCSS
- Framer Motion
- shadcn/ui
- responsive design
- smooth spring animations
- GPU-accelerated transitions
- modern glassmorphism aesthetics

The site should feel:
- premium
- fluid
- immersive
- futuristic
- trustworthy
- highly polished

Animation quality is EXTREMELY important.
Every UI interaction should feel intentional and smooth.

==================================================
BACKEND
==================================================

Implement:
- secure backend API
- webpage text extraction
- legal text parsing
- AI analysis pipeline
- caching
- rate limiting
- authentication
- document storage
- analysis history
- PostgreSQL database

Use:
- OpenRouter API (Which i will enter in the .env file, also the model name I will also enter there)
- structured JSON outputs
- robust prompt engineering
- streaming responses

==================================================
AI OUTPUT FORMAT
==================================================

Design a structured JSON schema for the AI responses including:
- title
- severity
- risk category
- explanation
- real-world consequence
- recommendation
- confidence score
- formatting metadata
- expandable content
- tags

Frontend should dynamically render UI entirely from this AI JSON structure.

==================================================
EXTRA FEATURES
==================================================

Add:
- drag/drop uploads
- PDF support
- DOCX support
- compare policy versions
- “policy changed” detection
- highlight changed clauses
- export report feature
- shareable analysis pages
- history dashboard
- user accounts
- dark/light themes
- mobile optimization
- SEO optimization

==================================================
IMPORTANT
==================================================

Prioritize:
- beautiful UI/UX
- immersive animations
- polished interactions
- scalable architecture
- clean maintainable code
- performance optimization
- modern SaaS quality

The final result should feel like a premium AI startup product, not a template or generic chatbot wrapper.
