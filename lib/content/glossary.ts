/**
 * Applied-AI glossary — an informational-intent pSEO cluster targeting
 * "what is {term}" queries. Each entry is a real, accurate, useful definition
 * written for a leader evaluating production AI work (not a textbook gloss).
 *
 * Routing:
 *   /glossary            — alphabetical hub of every term
 *   /glossary/[term]     — a single "What is {term}?" definition page
 *
 * Cross-links (the `related` array) point only at real routes that exist on
 * the site — the AI-consulting pillar, capability detail pages
 * (/capabilities/{slug}), and industry detail pages (/industries/{slug}) —
 * so the cluster builds genuine topical authority back into the money pages.
 */

export type GlossaryRelated = {
  label: string;
  href: string;
};

export type GlossaryTerm = {
  /** URL slug under /glossary/. */
  slug: string;
  /** The term itself, lowercased for natural "What is {term}?" headings. */
  term: string;
  /** <title> for the detail page. */
  title: string;
  metaDescription: string;
  /** One-sentence definition — used as the hub card desc and the page lede. */
  short: string;
  /** 3–5 paragraphs: what it is, how it's used in production, why it matters. */
  body: string[];
  /** Cross-links to capabilities / industries / pillars. */
  related: GlossaryRelated[];
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "ai-agents",
    term: "AI agents",
    title: "What is an AI agent? | applied-AI glossary",
    metaDescription:
      "An AI agent is a system that uses a language model to plan and take actions toward a goal, calling tools and looping until the task is done. Here's how they work in production.",
    short:
      "An AI agent is a system that uses a language model to decide and take actions toward a goal — calling tools, observing results, and looping until the task is done.",
    body: [
      "An AI agent is software that wraps a large language model in a loop: it receives a goal, decides what to do next, takes an action (usually by calling a tool or API), observes the result, and repeats until the task is complete or it gives up. The defining feature is autonomy over multiple steps — unlike a single prompt-and-response call, an agent makes a sequence of its own decisions to get from a goal to an outcome.",
      "In practice, an agent is built from a few moving parts: a model that does the reasoning, a set of tools it is allowed to call (search, a database query, a code interpreter, an internal API), a memory or context mechanism so it can carry state across steps, and a control loop that decides when to keep going and when to stop. The hard engineering is rarely the model itself — it's defining the tool surface, bounding what the agent can touch, and handling the cases where a step fails or the model proposes something nonsensical.",
      "Production agents are most valuable for tasks that are multi-step, span several systems, and would otherwise need a person to copy data between tools — resolving a support ticket that touches three back-office systems, triaging an alert, drafting and filing a structured document, or running a research task across many sources. They are a poor fit when latency must be low and deterministic, when a single retrieval call would do, or when a wrong action is expensive and hard to reverse.",
      "The reason agents matter is leverage: they turn a model from a text generator into something that can complete work end to end. But that same autonomy is the risk. A useful agent needs guardrails on its actions, evaluations that test it against real tasks rather than vibes, and observability so you can see every step it took when something goes wrong. Most teams that ship agents successfully start narrow — one well-bounded workflow with a tight tool set — and widen scope only once the evaluations hold.",
    ],
    related: [
      { label: "Agentic systems", href: "/capabilities/agentic-systems" },
      { label: "What is agentic AI?", href: "/glossary/agentic-ai" },
      { label: "What are guardrails?", href: "/glossary/guardrails" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "agentic-ai",
    term: "agentic AI",
    title: "What is agentic AI? | applied-AI glossary",
    metaDescription:
      "Agentic AI describes systems that pursue goals autonomously — planning, calling tools, and adapting over multiple steps rather than answering a single prompt. Here's what that means in production.",
    short:
      "Agentic AI is the broad class of systems that pursue goals autonomously — planning, calling tools, and adapting over multiple steps instead of answering a single prompt.",
    body: [
      "Agentic AI is the umbrella term for systems that behave as agents: they take a goal and pursue it across multiple steps, choosing actions as they go rather than producing one answer to one prompt. Where a chatbot responds, an agentic system acts — it can plan, call tools, react to what it observes, and adjust its approach mid-task. The word \"agentic\" is a description of the behaviour pattern, not a specific architecture.",
      "What separates agentic systems from ordinary model calls is the presence of a feedback loop and a set of capabilities the model can exercise: tools to call, memory to carry state, and some notion of when a task is finished. A single agentic system might decompose a goal into sub-tasks, dispatch each to a tool or a sub-agent, gather the results, and synthesise a final outcome — all without a human in the loop for each step.",
      "In production, agentic AI shows up in workflow automation (resolving a class of tickets end to end), research and analysis (gathering and reconciling information across many sources), and operations (monitoring a system and taking corrective action). The pattern is powerful where work is genuinely multi-step and spread across tools; it is overkill — and a source of unnecessary failure modes — where a single, deterministic call would do the job.",
      "Agentic AI matters because it moves the frontier of what software can do unattended, but it raises the stakes on engineering discipline. Autonomy multiplies the cost of an unbounded action or a silent failure, so credible agentic systems are built with explicit guardrails, rigorous evaluation against real tasks, and full traceability of every decision the system made. The teams that get value from agentic AI treat it as a systems problem — scoping, tooling, and observability — not as a prompt to be cleverly worded.",
    ],
    related: [
      { label: "Agentic systems", href: "/capabilities/agentic-systems" },
      { label: "What is an AI agent?", href: "/glossary/ai-agents" },
      { label: "What are evals?", href: "/glossary/evals" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "retrieval-augmented-generation-rag",
    term: "retrieval-augmented generation (RAG)",
    title: "What is retrieval-augmented generation (RAG)? | applied-AI glossary",
    metaDescription:
      "RAG is a pattern that retrieves relevant documents at query time and feeds them to a language model so its answers are grounded in your own data. Here's how RAG works in production.",
    short:
      "Retrieval-augmented generation (RAG) is a pattern that fetches relevant documents at query time and feeds them to a language model, so its answers are grounded in your own data rather than only its training.",
    body: [
      "Retrieval-augmented generation, almost always shortened to RAG, is a pattern for grounding a language model in a specific body of knowledge. Instead of relying only on what the model learned during training, a RAG system retrieves relevant documents at query time — usually from a vector database or search index — and inserts them into the prompt as context. The model then answers using that retrieved material, so its output reflects your data, not just its pretraining.",
      "A typical RAG pipeline has two phases. Offline, you split source documents into chunks, turn each chunk into an embedding, and store those embeddings in an index. Online, when a user asks a question, you embed the query, find the most similar chunks, and pass the top results to the model alongside the question. The model's job becomes reading and synthesising the supplied passages rather than recalling facts from memory.",
      "RAG is the default architecture for question-answering over private or fast-changing data: internal knowledge bases, product documentation, contracts, policy libraries, support histories. It is attractive because it sidesteps the cost and staleness of retraining — you can update the knowledge by re-indexing documents, and you can cite the exact sources behind an answer, which matters in regulated settings. The retrieval step is also where most quality lives or dies: if the right chunk isn't retrieved, no amount of model quality will save the answer.",
      "RAG matters because it is the most reliable way to make a general model accurate and trustworthy on your specific domain, and because it makes answers auditable — you can show the passages an answer was drawn from. But it is not free: chunking strategy, embedding choice, retrieval tuning, and handling the cases where nothing relevant is found all require real engineering. Done well, RAG dramatically reduces hallucination; done carelessly, it retrieves the wrong context and produces confident, wrong answers that look grounded.",
    ],
    related: [
      { label: "What are embeddings?", href: "/glossary/embeddings" },
      { label: "What is a vector database?", href: "/glossary/vector-database" },
      { label: "What is hallucination?", href: "/glossary/hallucination" },
      { label: "Applied builds", href: "/capabilities/applied-builds" },
    ],
  },
  {
    slug: "evals",
    term: "evals",
    title: "What are evals (AI evaluations)? | applied-AI glossary",
    metaDescription:
      "Evals are structured tests that measure how well an AI system performs on real tasks, so you can catch regressions and ship with confidence. Here's how evaluation works in production AI.",
    short:
      "Evals are structured tests that measure how well an AI system performs against a set of real tasks, turning model quality from a feeling into a number you can track.",
    body: [
      "Evals — short for evaluations — are the test suites of applied AI. An eval is a set of example inputs paired with a way of judging whether the system's output is good: it might check an exact answer, score against a reference, apply a rubric, or use another model as a judge. Run together, evals turn \"the model feels better\" into a measurable score you can track across prompt changes, model upgrades, and code deploys.",
      "A practical eval set is built from real tasks the system has to handle, including the edge cases and failure modes that matter to you. Each item defines an input and a grading criterion. Grading can be deterministic (does the extracted figure match?), reference-based (how close is this to a known-good answer?), rubric-based (does it satisfy these criteria?), or model-graded (an LLM judges the output against instructions). Most serious systems combine several methods because no single one covers every kind of correctness.",
      "In production, evals do for AI what unit and integration tests do for ordinary software: they catch regressions before users do. When you change a prompt, swap a model, or tune retrieval, you rerun the evals and compare scores. They are also how you make a go/no-go decision on a new model — you don't trust a vendor's benchmark, you measure on your own tasks. Teams that ship reliably treat the eval set as a living asset that grows every time a real failure is found.",
      "Evals matter because without them, AI development is guesswork — you can't tell whether a change helped or hurt, and you discover regressions in production. Good evals are the difference between an AI feature you can iterate on confidently and one nobody dares to touch. They are also the foundation of safety work: you can't claim a system is reliable, unbiased, or on-policy without a measurable way to test it.",
    ],
    related: [
      { label: "Evaluation & safety", href: "/capabilities/evaluation-and-safety" },
      { label: "What is hallucination?", href: "/glossary/hallucination" },
      { label: "What are guardrails?", href: "/glossary/guardrails" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "fine-tuning",
    term: "fine-tuning",
    title: "What is fine-tuning? | applied-AI glossary",
    metaDescription:
      "Fine-tuning continues training a pretrained model on your own examples so it adapts to a specific task, format, or domain. Here's when to fine-tune versus use prompting or RAG.",
    short:
      "Fine-tuning continues training a pretrained model on your own examples, adapting its weights so it reliably handles a specific task, format, or domain.",
    body: [
      "Fine-tuning is the process of taking a model that has already been pretrained on broad data and continuing to train it on a curated set of your own examples. Unlike prompting — which only changes the instructions you give a fixed model — fine-tuning updates the model's weights, so the resulting model bakes in the behaviour you trained for. The output is a customised version of the model that you then call like any other.",
      "The mechanics are straightforward in principle: you assemble high-quality input-output pairs that demonstrate the behaviour you want, run a training job that nudges the model's parameters toward producing those outputs, and validate the result against held-out examples. Modern practice often uses parameter-efficient methods (such as LoRA adapters) that train only a small set of additional weights, which is far cheaper than updating the whole model and easy to serve.",
      "Fine-tuning earns its place when you need consistent structure or style that prompting can't reliably enforce, when you want to compress a long, expensive prompt into the model itself, when you need a smaller, cheaper model to match a larger one's behaviour on a narrow task, or when latency and cost rule out stuffing examples into every prompt. It is the wrong tool for injecting fresh facts — that's what retrieval is for — because retraining to add knowledge is slow, expensive, and goes stale.",
      "Fine-tuning matters because it is how you turn a general model into a specialist that is faster, cheaper, and more consistent on the job you actually run. But it carries real costs: you need a clean, representative dataset, evaluations to prove the tuned model is actually better, and a plan to maintain it as base models improve. The common mistake is reaching for fine-tuning first; in most applications, good prompting plus retrieval gets you most of the way, and fine-tuning is the optimisation you apply once the task is well understood.",
    ],
    related: [
      { label: "What is a large language model?", href: "/glossary/large-language-model" },
      { label: "What is RAG?", href: "/glossary/retrieval-augmented-generation-rag" },
      { label: "What is prompt engineering?", href: "/glossary/prompt-engineering" },
      { label: "Applied builds", href: "/capabilities/applied-builds" },
    ],
  },
  {
    slug: "mlops",
    term: "MLOps",
    title: "What is MLOps? | applied-AI glossary",
    metaDescription:
      "MLOps is the discipline of deploying, monitoring, and maintaining machine learning and AI systems reliably in production. Here's what MLOps covers and why it matters.",
    short:
      "MLOps is the discipline of deploying, monitoring, and maintaining machine learning and AI systems reliably in production — the operational backbone that keeps models working after launch.",
    body: [
      "MLOps — machine learning operations — is the set of practices, tooling, and discipline for running AI and machine learning systems reliably in production. It is the AI counterpart to DevOps: where DevOps covers building, shipping, and operating software, MLOps extends that to the parts unique to models — data pipelines, training and retraining, deployment of model artifacts, monitoring for quality drift, and the feedback loops that keep a system accurate over time.",
      "A mature MLOps setup covers the full lifecycle. Data and features are versioned and validated so you know exactly what a model was trained on. Training is reproducible and automated rather than run by hand. Models are versioned, tested against evaluation suites, and deployed through a controlled process with the ability to roll back. Once live, the system is monitored not just for uptime and latency but for the things that quietly break AI — input distributions shifting away from training data, output quality degrading, costs creeping up.",
      "In production, MLOps is what separates a demo from a dependable capability. A model that works in a notebook can fail in countless ways once it faces real traffic: the data feeding it changes, an upstream service alters a field, usage patterns drift, a new model version regresses on a case nobody tested. MLOps puts the guardrails, observability, and automation in place so these are caught and handled rather than discovered by users. It is also where cost discipline lives — tracking spend per request, caching, and right-sizing models.",
      "MLOps matters because the launch is the beginning, not the end. Most of an AI system's life and most of its risk are in operation, and without operational discipline even a well-built model decays into something unreliable and expensive. Treating MLOps as an afterthought is the most common reason promising AI projects stall after their first deployment; treating it as a first-class concern is what lets a system improve continuously and scale safely.",
    ],
    related: [
      { label: "MLOps & scale", href: "/capabilities/mlops-and-scale" },
      { label: "What are evals?", href: "/glossary/evals" },
      { label: "What is inference?", href: "/glossary/inference" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "prompt-engineering",
    term: "prompt engineering",
    title: "What is prompt engineering? | applied-AI glossary",
    metaDescription:
      "Prompt engineering is the practice of designing the instructions and context you give a language model to get reliable, accurate outputs. Here's how it's done in production systems.",
    short:
      "Prompt engineering is the practice of designing the instructions, examples, and context you give a language model to get reliable, accurate, well-structured outputs.",
    body: [
      "Prompt engineering is the craft of designing the input you give a language model so it produces the output you need, reliably. A prompt is more than a question — in a real system it bundles instructions, role and tone, format requirements, worked examples, and the relevant context the model needs to do the task. Prompt engineering is the disciplined work of constructing and refining that bundle so the model behaves consistently across the full range of inputs it will see.",
      "Effective prompts tend to share a few traits: clear, specific instructions about what to do and what not to do; a defined output format the downstream system can parse; examples that demonstrate the desired behaviour (often called few-shot prompting); and just enough context — no more — to ground the answer. Common techniques include asking the model to reason step by step before answering, decomposing a hard task into smaller prompts, and giving the model an explicit way to say \"I don't know\" rather than inventing an answer.",
      "In production, prompt engineering is rarely a one-off. Prompts are versioned and tested like code, measured against an evaluation set, and iterated whenever a failure mode is found or the model is upgraded. A prompt that works beautifully on a handful of hand-picked examples often falls apart on the long tail of real inputs, so the real work is hardening the prompt against edge cases — ambiguous inputs, adversarial inputs, and the inputs that fall outside what the system should handle at all.",
      "Prompt engineering matters because it is the cheapest, fastest lever you have on an AI system's quality — far quicker than fine-tuning and entirely under your control. For most applications, careful prompting plus good retrieval gets you most of the way to a reliable system before any model customisation is needed. It also matters because a brittle prompt is a hidden liability: it can pass a quick demo and then fail silently in production, which is why serious teams treat prompts as tested, owned artifacts rather than throwaway strings.",
    ],
    related: [
      { label: "What is a large language model?", href: "/glossary/large-language-model" },
      { label: "What is fine-tuning?", href: "/glossary/fine-tuning" },
      { label: "What is a context window?", href: "/glossary/context-window" },
      { label: "Applied builds", href: "/capabilities/applied-builds" },
    ],
  },
  {
    slug: "vector-database",
    term: "vector database",
    title: "What is a vector database? | applied-AI glossary",
    metaDescription:
      "A vector database stores embeddings and finds the most similar ones to a query fast — the retrieval engine behind RAG and semantic search. Here's how vector databases work.",
    short:
      "A vector database stores embeddings and quickly finds the ones most similar to a query — the retrieval engine that powers semantic search and RAG.",
    body: [
      "A vector database is a store built to hold embeddings — the numerical representations of text, images, or other data produced by an AI model — and to find, very quickly, the stored vectors most similar to a given query vector. Where a traditional database answers \"find rows where this column equals that value,\" a vector database answers \"find the items whose meaning is closest to this,\" which is the core operation behind semantic search and retrieval-augmented generation.",
      "The key capability is approximate nearest-neighbour search. Comparing a query against millions of stored vectors exactly would be too slow, so vector databases use specialised indexes (such as HNSW graphs) that find the closest matches in milliseconds with a tunable trade-off between speed and accuracy. They also handle the practical surroundings of retrieval — storing the original text alongside each vector, filtering results by metadata (date, source, permissions), and keeping the index fresh as documents are added, updated, or removed.",
      "In production, a vector database is the retrieval layer of most RAG systems and semantic-search features. The pipeline runs: embed your documents, store the vectors, then at query time embed the question and ask the database for the most similar chunks to feed the model. The same engine powers recommendation, deduplication, and clustering. Options range from dedicated services to vector extensions of existing databases (so you can keep vectors next to your relational data) — and the right choice depends on scale, latency targets, and how much of your data already lives in one place.",
      "A vector database matters because retrieval quality determines answer quality: if the database returns the wrong chunks, the model produces confident, wrong answers no matter how good it is. It also matters operationally — keeping the index in sync with source data, enforcing access controls so users only retrieve what they're allowed to see, and tuning the speed-accuracy trade-off are all real engineering concerns. The database is not a commodity bolt-on; it is the part of a RAG system that most often decides whether the whole thing works.",
    ],
    related: [
      { label: "What are embeddings?", href: "/glossary/embeddings" },
      { label: "What is RAG?", href: "/glossary/retrieval-augmented-generation-rag" },
      { label: "Data & platform engineering", href: "/capabilities/data-and-platform-engineering" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "large-language-model",
    term: "large language model",
    title: "What is a large language model (LLM)? | applied-AI glossary",
    metaDescription:
      "A large language model is an AI system trained on vast text to predict the next token, enabling it to generate, summarise, and reason over language. Here's how LLMs work and where they fit.",
    short:
      "A large language model (LLM) is an AI system trained on vast amounts of text to predict the next piece of text, which lets it generate, summarise, classify, and reason over language.",
    body: [
      "A large language model, or LLM, is a neural network trained on enormous quantities of text to predict the next token — the next chunk of text — given everything before it. From that single objective, scaled across billions of parameters and trillions of words, emerges a system that can write, summarise, translate, classify, extract structure, answer questions, and follow instructions. The \"large\" is doing real work: capabilities that don't appear in small models emerge as scale increases.",
      "Under the hood, an LLM converts text into tokens, represents each as a vector, and passes them through many layers of a transformer architecture that lets the model weigh how each token relates to every other. The result is a probability distribution over what comes next, sampled to produce output one token at a time. After pretraining, most production LLMs are further shaped by instruction tuning and human-feedback training so they follow directions and behave helpfully rather than merely continuing text.",
      "In production, LLMs are the engine behind chat assistants, document and email drafting, classification and extraction at scale, code generation, and the reasoning core of agents and RAG systems. They are accessed either through hosted APIs or by running open-weight models on your own infrastructure — a choice that trades off control, cost, latency, and data residency. Crucially, an LLM is a component, not a product: the value comes from wrapping it with retrieval, tools, guardrails, and evaluation that turn raw capability into something dependable.",
      "LLMs matter because they generalise — one model handles a huge range of language tasks that previously needed bespoke systems, which collapses the cost of building language-aware features. But the same generality is the catch: an LLM is a probabilistic system that can be confidently wrong, is sensitive to how it's prompted, and has no inherent knowledge of your private data or of events after its training cutoff. Getting durable value out of one is an engineering discipline — grounding it in your data, constraining its behaviour, and measuring it — not a matter of access alone.",
    ],
    related: [
      { label: "What is inference?", href: "/glossary/inference" },
      { label: "What is a context window?", href: "/glossary/context-window" },
      { label: "What is fine-tuning?", href: "/glossary/fine-tuning" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "embeddings",
    term: "embeddings",
    title: "What are embeddings? | applied-AI glossary",
    metaDescription:
      "Embeddings are numerical vectors that represent the meaning of text or other data, so similar items sit close together. Here's how embeddings power search, RAG, and clustering.",
    short:
      "Embeddings are numerical vectors that capture the meaning of text or other data, so that items with similar meaning sit close together in the vector space.",
    body: [
      "An embedding is a list of numbers — a vector — that represents the meaning of a piece of data such as a sentence, a document, an image, or a product. A model produces the embedding so that semantically similar items land close together in the vector space and dissimilar items land far apart. \"Cancel my subscription\" and \"how do I close my account\" end up near each other even though they share no words, because the embedding captures meaning rather than surface text.",
      "Embeddings are produced by a model trained for the purpose, separate from the generative model that writes answers. You pass text in and get a fixed-length vector out; the distance between two vectors (often cosine similarity) measures how related their meanings are. Because the representation is numerical, you can do mathematics on meaning — find nearest neighbours, cluster related items, detect duplicates, or measure how far a new input sits from anything the system has seen before.",
      "In production, embeddings are the foundation of semantic search and retrieval-augmented generation: you embed your documents, store them in a vector database, and at query time embed the question to find the most relevant passages. The same mechanism powers recommendations, deduplication, classification, and anomaly detection. Practical concerns include choosing an embedding model suited to your domain and languages, keeping embeddings consistent (re-embedding everything if you change models), and managing the cost of embedding large corpora.",
      "Embeddings matter because they are how machines compare meaning at scale, which is what makes retrieval, search, and grounding possible in the first place. They are also a common, quiet failure point: if the embedding model doesn't capture the distinctions that matter in your domain — say, the difference between two similar legal clauses — retrieval will surface near-misses and the answers built on them will be subtly wrong. Choosing and evaluating the embedding model is therefore as consequential as choosing the language model it feeds.",
    ],
    related: [
      { label: "What is a vector database?", href: "/glossary/vector-database" },
      { label: "What is RAG?", href: "/glossary/retrieval-augmented-generation-rag" },
      { label: "Data & platform engineering", href: "/capabilities/data-and-platform-engineering" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "rlhf",
    term: "RLHF",
    title: "What is RLHF (reinforcement learning from human feedback)? | applied-AI glossary",
    metaDescription:
      "RLHF is a training technique that uses human preferences to align a model's behaviour with what people actually want. Here's how reinforcement learning from human feedback works.",
    short:
      "RLHF — reinforcement learning from human feedback — is a training technique that uses human preferences to steer a model toward responses people actually find helpful and appropriate.",
    body: [
      "RLHF stands for reinforcement learning from human feedback. It is a training technique used to align a language model's behaviour with human preferences — turning a model that merely predicts plausible text into one that follows instructions, is helpful, and avoids responses people would object to. It is one of the main reasons modern chat models feel cooperative and on-topic rather than like an autocomplete that has read the whole internet.",
      "The process has three stages. First, a pretrained model is fine-tuned on examples of good responses. Then humans compare pairs of model outputs and indicate which they prefer; those judgements train a separate reward model that learns to score responses the way people would. Finally, reinforcement learning optimises the language model to produce outputs the reward model rates highly, nudging it toward the behaviour humans preferred without anyone having to write an explicit rule for every situation.",
      "RLHF is primarily the concern of the labs that build foundation models rather than of teams applying them, but it shapes everything downstream. The alignment, refusal behaviour, tone, and instruction-following of the model you call are products of how it was trained with human feedback. Related and increasingly common variants — such as direct preference optimisation and feedback generated by AI rather than humans — pursue the same goal of aligning outputs to preferences more cheaply. A few organisations apply preference-based tuning to specialise a model's behaviour, but it's a heavyweight tool.",
      "RLHF matters because it is the bridge between raw capability and usable behaviour: a model can be brilliant at predicting text and still be useless or harmful without alignment to what humans actually want. Understanding that a model's helpfulness and its guardrails come from this training also explains its limits — RLHF reflects the preferences of the people who provided feedback, can be inconsistent at the edges, and can sometimes make a model overly cautious or sycophantic. Knowing where a model's behaviour comes from is part of using it responsibly.",
    ],
    related: [
      { label: "What is fine-tuning?", href: "/glossary/fine-tuning" },
      { label: "Evaluation & safety", href: "/capabilities/evaluation-and-safety" },
      { label: "Responsible AI", href: "/capabilities/responsible-ai" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "hallucination",
    term: "hallucination",
    title: "What is an AI hallucination? | applied-AI glossary",
    metaDescription:
      "A hallucination is when an AI model generates confident but false or unsupported information. Here's why hallucinations happen and how production systems reduce them.",
    short:
      "A hallucination is when an AI model produces content that is fluent and confident but factually wrong or unsupported by any source.",
    body: [
      "A hallucination is output from an AI model that sounds confident and plausible but is false or unsupported — an invented citation, a fabricated figure, a made-up policy detail, a quoted source that doesn't exist. The term captures the unsettling quality of the failure: the model isn't hedging or erroring out, it is asserting something untrue with the same fluency it uses for correct answers.",
      "Hallucinations happen because of what a language model fundamentally does. It predicts plausible continuations of text based on patterns in its training data; it has no built-in mechanism that checks claims against reality. When the model lacks the specific knowledge, when the prompt pushes it toward an answer it can't actually support, or when the right information simply isn't in its training, it fills the gap with something that fits the pattern. The output is statistically likely text, not verified fact — and likely text can be wrong.",
      "In production, hallucination is the central reliability risk of using language models, and most of the architecture of a serious AI system exists to control it. Retrieval-augmented generation grounds answers in retrieved source documents so the model summarises real material instead of recalling from memory, and lets you cite the source. Prompts instruct the model to answer only from supplied context and to say when it doesn't know. Guardrails and evaluations test specifically for unsupported claims. None of these eliminate hallucination entirely, but together they reduce it from a constant hazard to a managed, measurable one.",
      "Hallucination matters because a confidently wrong answer can be worse than no answer — it erodes trust, and in regulated or high-stakes settings it creates real liability. The practical lesson for anyone deploying AI is that the question is never just \"is the model smart\" but \"how is this system designed so that wrong answers are rare, caught, and traceable.\" Treating hallucination as an engineering problem to be measured and bounded — rather than a flaw to be wished away — is what separates a demo from a system you can put in front of customers.",
    ],
    related: [
      { label: "What is RAG?", href: "/glossary/retrieval-augmented-generation-rag" },
      { label: "What are guardrails?", href: "/glossary/guardrails" },
      { label: "What are evals?", href: "/glossary/evals" },
      { label: "Evaluation & safety", href: "/capabilities/evaluation-and-safety" },
    ],
  },
  {
    slug: "context-window",
    term: "context window",
    title: "What is a context window? | applied-AI glossary",
    metaDescription:
      "A context window is the maximum amount of text a language model can consider at once — its working memory for a single request. Here's why it matters for prompts, RAG, and cost.",
    short:
      "A context window is the maximum amount of text a model can take in for a single request — its working memory, measured in tokens, for everything you send and everything it generates.",
    body: [
      "A context window is the maximum amount of text a language model can attend to in a single call, measured in tokens. It is the model's working memory for one request: the system instructions, the conversation history, any retrieved documents, the user's question, and the model's own response all have to fit within it. Anything outside the window simply isn't visible to the model — it cannot reason about text it can't see.",
      "Context windows have grown enormously, from a few thousand tokens to hundreds of thousands or more in current models, which changes what's feasible — you can fit whole documents, long conversations, or large code files into a single prompt. But a bigger window is not a free lunch. Every token in the window is processed on each call, so cost and latency scale with how much you put in. Models can also attend less reliably to information buried in the middle of a very long context, so simply dumping everything in often produces worse results than retrieving the right few passages.",
      "In production, the context window shapes core design decisions. It is why retrieval-augmented generation exists — you can't fit an entire knowledge base in the window, so you retrieve only the relevant chunks for each query. It governs how much conversation history a chatbot can carry before it must summarise or drop older turns. And it sets a hard ceiling on tasks like summarising a document longer than the window, which then have to be broken into pieces and stitched back together.",
      "The context window matters because it is a fundamental constraint that quietly determines architecture, cost, and quality. Teams that ignore it hit walls — truncated inputs, ballooning bills, degraded answers from over-stuffed prompts. Teams that design around it — retrieving precisely, managing history deliberately, and putting the most important information where the model attends to it best — get systems that are cheaper, faster, and more accurate. It is one of the clearest examples of why applied AI is an engineering discipline, not just a model-access problem.",
    ],
    related: [
      { label: "What is a large language model?", href: "/glossary/large-language-model" },
      { label: "What is inference?", href: "/glossary/inference" },
      { label: "What is RAG?", href: "/glossary/retrieval-augmented-generation-rag" },
      { label: "What is prompt engineering?", href: "/glossary/prompt-engineering" },
    ],
  },
  {
    slug: "inference",
    term: "inference",
    title: "What is inference? | applied-AI glossary",
    metaDescription:
      "Inference is the act of running a trained model to produce output — the part you pay for and wait on in production. Here's how inference works and why its cost and latency matter.",
    short:
      "Inference is the act of running a trained model to generate output from an input — the live operation you pay for and wait on every time an AI system responds.",
    body: [
      "Inference is what happens when you actually use a trained model: you give it an input and it computes an output. It is the counterpart to training. Training is the expensive, one-time process of building the model; inference is the repeated, ongoing process of running it to serve real requests. Every time a chat assistant answers, a document is classified, or an agent calls a model, that is an inference call.",
      "For a language model, inference works by processing the input tokens and then generating output one token at a time, each new token conditioned on everything so far. This token-by-token generation is why responses stream in and why longer outputs take longer and cost more. Inference can run on a hosted API, where the provider manages the hardware and you pay per token, or on your own infrastructure with open-weight models, where you manage the GPUs and the serving stack yourself.",
      "In production, inference is where the operating cost and the user-facing latency live, so it's where a lot of applied-AI engineering concentrates. Techniques to manage it include caching repeated work, batching requests, routing easy tasks to smaller cheaper models and hard ones to larger models, streaming output so users see progress immediately, and right-sizing the model to the task rather than always reaching for the largest. Getting inference economics right is often the difference between a feature that's viable at scale and one that's too slow or too expensive to ship.",
      "Inference matters because it is the part of AI you pay for forever. Training cost is a fixed investment; inference cost recurs with every single use and grows with adoption, so a system that's cheap in a demo can become ruinously expensive at scale if inference isn't engineered. It is also where reliability and speed are felt by users. Understanding inference — its cost, its latency, and the levers that control both — is essential to building AI that's not just capable but economically and operationally sustainable.",
    ],
    related: [
      { label: "What is a large language model?", href: "/glossary/large-language-model" },
      { label: "MLOps & scale", href: "/capabilities/mlops-and-scale" },
      { label: "What is a context window?", href: "/glossary/context-window" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "guardrails",
    term: "guardrails",
    title: "What are guardrails (in AI)? | applied-AI glossary",
    metaDescription:
      "Guardrails are the controls that constrain what an AI system can say or do — filtering inputs and outputs and bounding actions. Here's how guardrails keep production AI safe.",
    short:
      "Guardrails are the controls placed around an AI system that constrain what it can say or do — checking inputs and outputs and bounding the actions it's allowed to take.",
    body: [
      "Guardrails are the safety and control layer around an AI system. Because a language model is a probabilistic component that can be prompted into producing harmful, off-policy, or simply wrong output — and because an agent can take real actions — guardrails are the explicit checks and constraints that sit between the model and the outside world to keep its behaviour within bounds you've defined. They are how you make a non-deterministic model safe to put in front of users or to let act on systems.",
      "Guardrails operate at several points. On the input side, they detect and block prompt injection, off-topic requests, or attempts to extract sensitive data. On the output side, they screen for unsafe content, leaked personal information, claims that aren't grounded in a source, or responses that violate policy — and can block, rewrite, or escalate to a human. For agents, guardrails bound the action space: which tools the agent may call, what it may modify, and which operations require human approval. They are implemented with a mix of rules, classifiers, separate moderation models, and structural limits on what the system is even able to do.",
      "In production, guardrails are not optional decoration — they are core architecture for any AI that touches customers, regulated data, or real-world actions. A support assistant needs guardrails so it can't be talked into revealing another customer's data; an agent needs guardrails so a reasoning error can't trigger an irreversible action; a public-facing chatbot needs guardrails so it stays on-brand and on-policy. Crucially, guardrails are paired with evaluation: you test specifically that the system refuses what it should and permits what it should, and you tune the balance because guardrails that are too tight make the system useless.",
      "Guardrails matter because they are what make AI deployable in settings where being wrong, off-policy, or unbounded has real consequences — which is most settings that matter to a business. They turn an impressive but unpredictable model into a system you can stand behind. The discipline of designing them well — knowing what to block, where to keep a human in the loop, and how to measure that the controls actually work — is a defining part of putting AI into responsible production.",
    ],
    related: [
      { label: "Responsible AI", href: "/capabilities/responsible-ai" },
      { label: "Evaluation & safety", href: "/capabilities/evaluation-and-safety" },
      { label: "What is hallucination?", href: "/glossary/hallucination" },
      { label: "What is agentic AI?", href: "/glossary/agentic-ai" },
    ],
  },
  {
    slug: "model-context-protocol-mcp",
    term: "Model Context Protocol (MCP)",
    title: "What is the Model Context Protocol (MCP)? | applied-AI glossary",
    metaDescription:
      "MCP is an open standard that gives AI models and agents a uniform way to connect to external tools, data, and services — so integrations are built once and reused everywhere. Here's how it works.",
    short:
      "The Model Context Protocol (MCP) is an open standard that gives language models and agents a uniform way to connect to external tools and data sources, so each integration is built once and reused across applications.",
    body: [
      "The Model Context Protocol, usually shortened to MCP, is an open standard for connecting AI models to the tools, data, and services they need to do useful work. Instead of every application inventing its own bespoke way to expose a database, an internal API, or a file store to a model, MCP defines a common interface: a \"server\" publishes resources and tools, and any MCP-aware \"client\" — a chat app, an IDE, an agent — can discover and use them. It is often described as a universal connector for context.",
      "Mechanically, an MCP server advertises three kinds of capability: tools the model can call (actions with typed inputs and outputs), resources it can read (documents, records, files), and prompts or templates it can reuse. The client and server negotiate what is available, and the model is then given a structured menu of operations rather than a hard-coded integration. Because the contract is standardised, the same server that backs a coding assistant can back a customer-support agent without being rewritten.",
      "In production, MCP matters most to teams running more than one AI surface or more than one data source. Without a standard, integrations grow as an N×M problem — every model or app times every system — and each one is brittle and separately maintained. MCP collapses that to N+M: expose each system once as a server, and every client can reach it. It is a poor fit only where a single, fixed, one-off integration is all you will ever need, or where the data is so sensitive that a narrower, fully-bespoke boundary is warranted.",
      "MCP matters because the hard part of applied AI is rarely the model — it is wiring the model safely to the systems where the real data and actions live. A shared protocol turns that wiring into reusable infrastructure, makes the tool surface explicit and auditable, and lets governance and access controls be applied at the server rather than scattered through prompts. The teams getting leverage from it treat each MCP server as a durable internal product, with the same care for permissions and observability they would give any other production interface.",
    ],
    related: [
      { label: "What is an AI agent?", href: "/glossary/ai-agents" },
      { label: "What is RAG?", href: "/glossary/retrieval-augmented-generation-rag" },
      { label: "Agentic systems", href: "/capabilities/agentic-systems" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "ai-governance",
    term: "AI governance",
    title: "What is AI governance? | applied-AI glossary",
    metaDescription:
      "AI governance is the set of policies, controls, and accountability that decide how an organization builds, approves, and operates AI responsibly. Here's what it covers and why it matters in production.",
    short:
      "AI governance is the framework of policies, controls, and accountability that decides how an organization builds, approves, monitors, and retires AI systems — so the technology is used responsibly and defensibly.",
    body: [
      "AI governance is how an organization decides what AI it will build, who is accountable for it, and what controls it must pass before and after it goes live. It spans policy (what uses are allowed, what data may be used), process (how a model gets reviewed, approved, and audited), and the technical controls that enforce both. Where model engineering answers \"can we build this,\" governance answers \"should we, under what conditions, and who answers for it when it goes wrong.\"",
      "In practice, governance shows up as a set of concrete artifacts and gates: an inventory of where AI is used, documented risk assessments for each use, approval workflows with named owners, evaluation and monitoring requirements, data-handling and privacy rules, and a path to escalate or shut a system down. Mature programs tie these to existing risk and compliance functions rather than standing up a parallel bureaucracy — the model-risk team that already vets credit models, for example, extends to vetting AI systems.",
      "Governance becomes load-bearing the moment AI touches regulated decisions, customer-facing outcomes, or anything where a wrong or unexplainable result has real consequences — lending, insurance, healthcare, hiring, public services. Frameworks like the EU AI Act and NIST's AI Risk Management Framework increasingly give it concrete shape, but even absent regulation, the discipline is what lets a business deploy AI it can stand behind. It is overhead where the stakes are genuinely low, and a prerequisite where they are not.",
      "AI governance matters because the failure modes of AI are organizational as much as technical: an unmonitored model that drifts, a use case no one approved, a decision no one can explain to a regulator. Good governance is not a brake on building — it is what makes building safe to scale, by making risk visible, ownership clear, and controls testable. The teams that do it well treat it as engineering and operations, not paperwork: evaluations that actually run, monitoring that actually alerts, and controls that are proven to work rather than asserted.",
    ],
    related: [
      { label: "What are guardrails?", href: "/glossary/guardrails" },
      { label: "What are evals?", href: "/glossary/evals" },
      { label: "Responsible AI", href: "/capabilities/responsible-ai" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
  {
    slug: "multimodal-ai",
    term: "multimodal AI",
    title: "What is multimodal AI? | applied-AI glossary",
    metaDescription:
      "Multimodal AI describes models that work across more than one kind of data — text, images, audio, and video — in a single system. Here's how it works and where it earns its keep in production.",
    short:
      "Multimodal AI describes models that take in or produce more than one kind of data — text, images, audio, video — in a single system, rather than handling only text.",
    body: [
      "Multimodal AI refers to models that operate across more than one modality of data at once — most commonly text and images, but increasingly audio and video as well. A multimodal model can read a chart and answer a question about it, transcribe and summarize a meeting recording, or describe what is happening in a photo. Where a text-only model is confined to language, a multimodal one can perceive and reason over the formats real-world information actually arrives in.",
      "Under the hood, multimodal systems convert each modality into a shared representation the model can reason over — images and audio are encoded into the same kind of embedding space as text, so the model can attend across them jointly. Some systems are natively multimodal, trained from the start on mixed data; others stitch specialized encoders onto a language model. Either way, the practical surface is the same: a single call can mix a question, an image, and a document, and get one grounded answer back.",
      "In production, multimodal AI unlocks workflows that were previously two or three disconnected steps: extracting structured data from scanned forms and invoices, triaging support tickets that include screenshots, quality-inspecting product photos, or analyzing medical and technical imagery alongside notes. It is most valuable where the source material is inherently non-textual and a human would otherwise have to look at it. It is unnecessary where the data is already clean text, where the added cost and latency of vision or audio buys nothing.",
      "Multimodal AI matters because most of the information businesses run on is not tidy text — it is documents, images, recordings, and screens. Bringing those into the same system a model can reason over removes a whole class of brittle preprocessing and manual handoffs. The engineering discipline is the same as for any applied AI: ground the model in your data, evaluate it on the real artifacts it will see, and instrument it so you can trust what it extracts before a downstream system acts on it.",
    ],
    related: [
      { label: "What is a large language model?", href: "/glossary/large-language-model" },
      { label: "What is inference?", href: "/glossary/inference" },
      { label: "Our capabilities", href: "/capabilities" },
      { label: "AI consulting", href: "/ai-consulting" },
    ],
  },
];

/** Look up a single glossary term by slug. */
export function getTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}

/** Every glossary route, for sitemap inclusion (hub + each detail page). */
export const GLOSSARY_ROUTES = [
  "/glossary",
  ...GLOSSARY.map((t) => `/glossary/${t.slug}`),
];
