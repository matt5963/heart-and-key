import React, { useState, useEffect, useCallback } from "react";
import { Lock, Key, Heart, Sparkles, Send, Check, X, Plus, RefreshCw, Gift, MessageCircle, Home, Dice6, Clock, Trash2, Camera, Star, ChevronDown, ChevronRight, Lightbulb, BookOpen, ArrowLeft, Flame, Droplet, AlertCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  CONTENT LIBRARIES
// ─────────────────────────────────────────────────────────────
const DEFAULT_TASK_DECK = [
  { id: "t1", category: "Devotion", text: "Write three new reasons you adore her and send them over", points: 10 },
  { id: "t2", category: "Devotion", text: "Write her a message describing exactly what you're thinking about right now", points: 10 },
  { id: "t3", category: "Devotion", text: "Write a handwritten love note and photograph it", points: 15 },
  { id: "t4", category: "Devotion", text: "Copy out a favorite passage or poem by hand and photograph it for her", points: 15 },
  { id: "t5", category: "Home", text: "Complete a chore she'd appreciate and send a photo of it done", points: 15 },
  { id: "t6", category: "Home", text: "Cook a meal she loves and send a photo of the plate", points: 20 },
  { id: "t7", category: "Home", text: "Deep clean one room and send a before/after", points: 25 },
  { id: "t8", category: "Home", text: "Organize something she's been meaning to get to", points: 20 },
  { id: "t9", category: "Body", text: "30 minutes of exercise — send a sweaty selfie", points: 15 },
  { id: "t10", category: "Body", text: "Drink 8 glasses of water today and report back", points: 10 },
  { id: "t11", category: "Body", text: "In bed by your target bedtime tonight", points: 10 },
  { id: "t12", category: "Body", text: "Take a cold shower — all the way through", points: 10 },
  { id: "t13", category: "Mind", text: "Meditate for 10 minutes thinking only of her", points: 10 },
  { id: "t14", category: "Mind", text: "Journal about your favorite memory of the two of you", points: 10 },
  { id: "t15", category: "Mind", text: "Write about what you're most looking forward to when she's home", points: 15 },
  { id: "t16", category: "Mind", text: "Sit still for 5 minutes without your phone. Just breathe.", points: 5 },
  { id: "t17", category: "Play", text: "Do 20 push-ups right now and report back", points: 5 },
  { id: "t18", category: "Play", text: "Find an old photo of you two and send it with a memory", points: 5 },
  { id: "t19", category: "Play", text: "Send a photo of something that reminded you of her today", points: 5 },
  { id: "t20", category: "Play", text: "Dance to her favorite song. Yes, really.", points: 5 },
];

const DEFAULT_REWARDS = [
  { id: "r1", name: "A flirty text from her", cost: 25 },
  { id: "r2", name: "A goodnight photo from wherever she is", cost: 15 },
  { id: "r3", name: "A photo of what she's wearing", cost: 40 },
  { id: "r4", name: "An extra video call tonight", cost: 50 },
  { id: "r5", name: "A handwritten letter mailed to you", cost: 75 },
  { id: "r6", name: "One day off the countdown", cost: 100 },
  { id: "r7", name: "Early release consideration", cost: 250 },
];

const DAILY_SUGGESTIONS = [
  "Wear the key on a chain under your top tonight — send him a glimpse",
  "Photo of the key resting between your breasts",
  "Touch the key through your dress while you're out — tell him you did",
  "Slip into the bathroom at dinner and send him a peek",
  "Go out with nothing on underneath — let him know from the cab",
  "Mirror pic from your hotel, top pulled down",
  "Text him from the bar: 'thinking about you locked up for me tonight'",
  "Photo of the key lying on your bare chest",
  "Wear the key out with friends — selfie, they have no idea",
  "Key against your lipstick, nothing else in the frame",
  "Tell him what you'd be doing to him right now if he weren't locked",
  "Remind him he's locked up and it's making you want him",
  "Cleavage with the key resting in it — send it, say nothing",
  "From the cab: legs out, dress up, caption: 'no panties tonight'",
  "Tell him how hard he'd be for you right now if he could be",
  "Tell him you're already thinking about what you'll do to him when you're home",
  "Boobs-out selfie from the hotel bathroom",
  "Send him a taste: top pulled aside, just one",
  "Key near your mouth, looking straight into the camera",
  "Assign him one small task before bed",
  "Tell him how he's already got you wanting him tonight",
  "Tell him you wish his cock was just a little bigger ;)",
  "Key on bare skin under the hotel sheets",
  "Lift your dress in the elevator — send the photo",
  "Tell him you're proud of how he's holding out",
  "'Thinking about what I'll do to you when I'm home.' Send it. Nothing else.",
  "Photo of the key high on your thigh",
  "Assign him a 5-point task just to remind him who has the key",
  "From bed — top off, key in your hand",
  "Request a photo from him: locked, straining, just for you",
];

const COACHING_TIPS = [
  "Small gestures land harder than big ones. One photo of the key can make his whole day.",
  "Playful works. Sweet works. You don't have to play 'strict' unless it feels like you.",
  "When he submits a task, take a moment before approving. The pause itself is part of the game.",
  "One task a day is enough. You don't have to fill his plate.",
  "The key is your power. Wearing it, photographing it, mentioning it — all of it lands.",
  "Men love when you talk about their penis.  Say something about it.  You love his big balls, or even fun and ask him why he's so small right now.",
  "Sending a task back for redo isn't mean — it's attention. Attention is the whole point.",
  "You set the pace. Fast, slow, playful, intense — your call, no wrong answer.",
  "The best tease is casual. Drop a photo, say nothing, let him stare at it.",
  "He's not waiting for a perfect keyholder. He's waiting for you.",
  "Rewards don't always have to cost points. A surprise flirty text is its own reward.",
  "This is still about closeness. Check in sometimes on how he's actually feeling.",
  "If something sounds fun to you, it almost certainly will be for him too.",
  "You're allowed to change your mind. You're allowed to make mistakes. This is a game.",
  "Denial isn't cruelty — it's sustained attention. Keep connecting, the rest works itself out.",
];

const PHOTO_IDEAS_OF_HIM = [
  { id: "oh1", text: "A photo of you locked", intimate: true },
  { id: "oh2", text: "Straining — show me what it's like right now", intimate: true },
  { id: "oh3", text: "Leaking for me — show me", intimate: true },
  { id: "oh4", text: "Your morning face, the real one", intimate: false },
  { id: "oh5", text: "What you're wearing today", intimate: false },
  { id: "oh6", text: "A sweaty post-workout selfie", intimate: false },
  { id: "oh7", text: "The view from where you are right now", intimate: false },
  { id: "oh8", text: "Something you're cooking for yourself", intimate: false },
  { id: "oh9", text: "Your coffee this morning", intimate: false },
  { id: "oh10", text: "A mirror selfie — just for me", intimate: false },
  { id: "oh11", text: "Your hands", intimate: false },
  { id: "oh12", text: "Something that made you think of me today", intimate: false },
  { id: "oh13", text: "Your smile, right now", intimate: false },
  { id: "oh14", text: "A shoulders-up shot, shirtless", intimate: true },
  { id: "oh15", text: "You holding something of hers", intimate: false },
];

const PHOTO_IDEAS_OF_HER = [
  { id: "oher1", text: "The key between your breasts" },
  { id: "oher2", text: "Key on a chain, you in a dress out with friends" },
  { id: "oher3", text: "Key against bare skin, anywhere" },
  { id: "oher4", text: "Key at your lips" },
  { id: "oher5", text: "Hotel mirror — top pulled down" },
  { id: "oher6", text: "From the shoulders down, nothing underneath" },
  { id: "oher7", text: "Key in your hand, in bed, nothing else" },
  { id: "oher8", text: "Cleavage with the key resting in it" },
  { id: "oher9", text: "Key on your thigh, dress pulled up" },
  { id: "oher10", text: "Boobs out from the hotel bed" },
  { id: "oher11", text: "A peek of what you went out in — and what you didn't" },
  { id: "oher12", text: "Key against your lipstick" },
  { id: "oher13", text: "Bathroom mirror, dress half off" },
  { id: "oher14", text: "Legs out in the cab, 'no panties' caption" },
  { id: "oher15", text: "Key on bare skin under the sheets" },
  { id: "oher16", text: "One breast, top pulled aside" },
  { id: "oher17", text: "Selfie with friends, key visible, they don't know" },
  { id: "oher18", text: "You in the shower — just the key and skin" },
];

// ─────────────────────────────────────────────────────────────
//  GUIDE CONTENT — for her (and him) to read
// ─────────────────────────────────────────────────────────────
const INTRO_PARAGRAPHS = [
  "Here's the short version of why this exists.",
  "When a man has an orgasm, for a few days afterward something quiets. The wanting that makes him show up, notice, reach for you — it dips. Not gone, just lower. For a lot of couples, that's when the 'roommates' feeling creeps in.",
  "Chastity keeps the wanting on. Not as punishment — as a choice to hold his attention where normal life lets it drift.",
  "Your job isn't to be strict. It's to stay interested in his interest. Tease him. Surprise him. Remind him the key exists. When you do, he'll notice you in ways normal rarely produces.",
  "The failure mode of this isn't 'not enough denial.' It's 'not enough attention.' Keep the thread warm, even in small ways, and the rest takes care of itself.",
  "There's no right way to do this. Only your way. You're already doing it by reading this.",
];

const GLOSSARY_TERMS = [
  { term: "Teasing", short: "The heart of it.", long: "Keeping him wanting. Reminders, photos, suggestions, language — anything that makes him think about you and what he can't have. The goal isn't deprivation. It's sustained attention.", group: "Core ideas" },
  { term: "Denial", short: "Choosing not to let him finish.", long: "Can be brief (today, not tonight) or longer (days, weeks). It's not cruelty. It's how anticipation builds. The delay is what makes the return feel like something.", group: "Core ideas" },
  { term: "Edging", short: "Bringing him close and stopping.", long: "Him doing it on your instruction, or you controlling the pace. The closer you take him without letting him over, the more charged he gets. Can be a standalone activity or part of a longer session.", group: "Core ideas" },
  { term: "Ruined orgasm", short: "Release without the satisfaction.", long: "You let him cum but stop stimulation at the moment of release. Physically, he still cums. Emotionally, the usual wave of satisfaction never arrives. Most men find this frustrating and electric at once. Often followed by going right back in the cage.", group: "Types of release" },
  { term: "Hands-free / prostate orgasm", short: "An orgasm you give him from the inside.", long: "The prostate is a small gland inside the body, a couple of inches in, toward the front. It's dense with nerve endings. With a finger or small toy, gentle pressure there can produce an orgasm that's qualitatively different from the usual — slower to build, deeper, more emotional, sometimes without much ejaculation. Many men describe it as given to them rather than taken, which fits the whole arrangement. Most men never experience this unless a partner helps. Patience helps; the first few tries often don't end in orgasm at all, and that's normal.", group: "Types of release" },
  { term: "Full release, earned", short: "The normal kind, but earned.", long: "Sometimes the point is to let him finish. In this dynamic, make him earn it — a task, a stretch of good behavior, a promise. The earning is half the experience for him.", group: "Types of release" },
  { term: "Pegging", short: "You wearing a strap-on, on him.", long: "Penetrative sex where you wear a strap-on. In a dynamic where his equipment is off the table, it's often the most intimate option available — it completely flips who's giving.\n\nA note on orientation, since it comes up: 'gay' describes who a person is attracted to, not what body parts or toys are involved in sex between a husband and wife. A wife stimulating her husband's prostate — with fingers, a toy, or a strap-on — is her, doing it, to him, inside their marriage. Men have a prostate the same way women have a g-spot; it's anatomy. Using it doesn't change who he loves or desires. He wants you.\n\nPractically: plenty of lube, start slow, let him tell you what works. Trim nails. Dedicated toys with a flared base. Most men who try it want it again.", group: "Activities" },
  { term: "Strap-on, the other way", short: "Him using one on you.", long: "With the cage on, a strap-on is how penetration happens. He can still do everything he'd normally do, just with a different tool. Many men find this intense in its own way — they're giving without receiving, which fits the whole idea.", group: "Activities" },
  { term: "Cleaning her up", short: "Him, with his mouth, after.", long: "After sex — or after an accident where he came in her — him going down and cleaning her gently with his mouth and tongue. Tender, attentive, a little submissive in character. For some wives this is a huge turn-on; for others it's not their thing. Both are fine. The only way to know is to try it once and see how it lands for you.", group: "Activities" },
  { term: "Multiple orgasms (yours)", short: "Stacking yours, as many as you want.", long: "Often underexplored in normal sex because the session tends to end at his finish. Here, his finish isn't happening — so attention can stay on yours, as many as you want, however you want. This is one of the less-discussed gifts of the arrangement.", group: "Activities" },
  { term: "Lingerie sessions", short: "Wearing something on purpose.", long: "Together: visual, obvious, effective. Apart: a photo of you in something chosen-for-him, ideally with the key somewhere in frame. Doesn't have to be fancy. Anything worn on purpose counts.", group: "Activities" },
  { term: "Hotwife", short: "One possible flavor — not required.", long: "A lifestyle where the wife has sexual experiences with other men, with her husband's knowledge and encouragement. His arousal comes from her pleasure and his own exclusion. Can range from flirting and stories to actual encounters. Some couples love it; many don't. Worth knowing the term — not something to try unless you both genuinely want to.", group: "Dynamics" },
  { term: "Cuckolding (fantasy version)", short: "Hotwife, but just in the imagination.", long: "Stories, fantasy, dirty talk about her with others — without any of it actually happening. Lots of couples enjoy this as pure roleplay. The imagined version can be as good as the real thing for a lot of people, with none of the real-world complications.", group: "Dynamics" },
  { term: "Keyholder", short: "You.", long: "The one with power over when, how, and if he's released. That's the whole job. The rest is style — you choose what kind of keyholder you want to be. Strict, sweet, playful, rare, constant — any of it works.", group: "Roles" },
  { term: "Kept / locked", short: "Him.", long: "The one wearing the cage. Some people use 'submissive' — not everyone likes that word. 'Kept' is gentler and fits most couples. He's not lesser; he's in your keeping.", group: "Roles" },
];

const TRY_ACTIVITIES = [
  { title: "Tease with the cage on", text: "Hands, mouth, a vibrator against the cage, words — any of it. The point is sensation without release. Watch his face; he can't hide any of it from you." },
  { title: "Lingerie and the key", text: "Wear something you like in. Put the key somewhere visible. Let him look. That's the whole activity, and it works." },
  { title: "All focus on you", text: "His mouth, hands, tongue, a toy — however you like. The rule is simple: the session ends when you're done, not when he is. Multiple rounds were always on the table; in this dynamic they're the point." },
  { title: "Pegging", text: "You wearing a strap-on, taking him. For a lot of men in chastity, this is the most intimate thing their partner can do. Start slow, use plenty of lube, and let him tell you what feels right." },
  { title: "Strap-on the other way", text: "Him using one on you, cage still on. You get penetration; he gets to give without receiving — which carries its own charge for him." },
  { title: "Hands-free / prostate play", text: "Finger or small toy inside him, cage on. Takes patience — the first few times often don't end in orgasm at all, and that's fine. When it does, it looks nothing like his usual. Slower, quieter, sometimes overwhelming." },
  { title: "Ruined orgasm, right back in", text: "Let him out. Bring him close. The instant he starts to release, stop everything. He'll cum, but hollow. Lock him back up without finishing the job. Classic move. Memorable." },
  { title: "Full release, earned", text: "When you decide the time has come, make the earning part of it. A task, a promise, a set of days. The waiting makes the finish mean more than it would otherwise." },
  { title: "Tease from distance", text: "Photo of the key somewhere unexpected. Voice note describing what you'd do if you were there. One-line text about what you're wearing. Small, effective, takes two minutes." },
  { title: "Long slow teasing session", text: "Set aside an evening. Edge him once, twice, three times. No release at the end — just lock back up and send him to sleep wanting. Works even better when you're right next to him after." },
];

const INTEREST_ITEMS = [
  { id: "i1", text: "Long denial (a week or more at a time)", cat: "Rhythm" },
  { id: "i2", text: "Short denial (resetting every few days)", cat: "Rhythm" },
  { id: "i3", text: "Regular full releases", cat: "Rhythm" },
  { id: "i4", text: "Ruined orgasms", cat: "Release" },
  { id: "i5", text: "Hands-free / prostate orgasms", cat: "Release" },
  { id: "i6", text: "Edging him", cat: "Release" },
  { id: "i7", text: "Pegging (you using a strap-on on him)", cat: "Together" },
  { id: "i8", text: "Him using a strap-on on you", cat: "Together" },
  { id: "i9", text: "Oral focus on you", cat: "Together" },
  { id: "i9b", text: "Him cleaning you up with his mouth after sex", cat: "Together" },
  { id: "i9c", text: "Him kissing and licking you clean after an accident", cat: "Together" },
  { id: "i10", text: "Multiple orgasms for you in one session", cat: "Together" },
  { id: "i11", text: "Teasing him with the cage on", cat: "Together" },
  { id: "i12", text: "Lingerie sessions together", cat: "Visual" },
  { id: "i13", text: "Lingerie photos while apart", cat: "Visual" },
  { id: "i14", text: "Photos of the key", cat: "Visual" },
  { id: "i15", text: "Photos of him locked / straining", cat: "Visual" },
  { id: "i16", text: "Voice notes while apart", cat: "Distance" },
  { id: "i17", text: "Video calls while apart", cat: "Distance" },
  { id: "i18", text: "Written teasing (notes, texts)", cat: "Distance" },
  { id: "i19", text: "Public chastity (him locked during normal life)", cat: "Dynamic" },
  { id: "i20", text: "Tasks and points systems", cat: "Dynamic" },
  { id: "i21", text: "Cuckolding fantasy (stories only, not real)", cat: "Dynamic" },
  { id: "i22", text: "Hotwife (you with others, his knowledge)", cat: "Dynamic" },
];

// ─────────────────────────────────────────────────────────────
//  REUNION MODE — for after she's back
// ─────────────────────────────────────────────────────────────
const REUNION_ACTIVITIES = [
  // Worship — him pleasuring her
  { id: "ra1", cat: "Worship", text: "Eat her until she says stop — no time limit" },
  { id: "ra2", cat: "Worship", text: "Lick her ass, slow and patient" },
  { id: "ra3", cat: "Worship", text: "Worship her breasts for 20 minutes" },
  { id: "ra4", cat: "Worship", text: "Full-body massage with oil, all her" },
  { id: "ra5", cat: "Worship", text: "Oral first thing in the morning, before anything else" },
  { id: "ra6", cat: "Worship", text: "Go down on her until she comes at least twice" },
  { id: "ra7", cat: "Worship", text: "Clean her up after — gentle, thorough" },

  // Fuck — while caged
  { id: "ra8", cat: "Fuck", text: "Strap-on over the cage — fuck her with it" },
  { id: "ra9", cat: "Fuck", text: "Sleeve over the cage — fuck her with it" },
  { id: "ra10", cat: "Fuck", text: "She rides the strap-on over his cage while he holds her" },
  { id: "ra11", cat: "Fuck", text: "Sleeve first, then go down on her after" },
  { id: "ra12", cat: "Fuck", text: "She fucks herself on him while he stays still — caged" },
  { id: "ra13", cat: "Fuck", text: "Unlocked, he fucks her but isn't allowed to finish" },

  // Ruined — each one counts toward the 10
  { id: "ra14", cat: "Ruined", text: "Unlock, stroke to the edge, push over — ruin in her hand", counts: true },
  { id: "ra15", cat: "Ruined", text: "He fucks her, pulls out early — ruin on her stomach", counts: true },
  { id: "ra16", cat: "Ruined", text: "She strokes him to the edge and pushes over on her command", counts: true },
  { id: "ra17", cat: "Ruined", text: "Unlock, edge five times, then ruin on the sixth", counts: true },
  { id: "ra18", cat: "Ruined", text: "Ruin him through the sleeve — pull out the second it starts", counts: true },
  { id: "ra19", cat: "Ruined", text: "Prostate ruin — finger inside, no stroking, push him over that way", counts: true },

  // Play — cage/prostate/edging
  { id: "ra20", cat: "Play", text: "Vibrator on the cage until he's begging" },
  { id: "ra21", cat: "Play", text: "Dildo on his prostate while he eats her" },
  { id: "ra22", cat: "Play", text: "Feather on his balls, slow" },
  { id: "ra23", cat: "Play", text: "Her nails on his balls, just teasing" },
  { id: "ra24", cat: "Play", text: "Edge him through the cage with her hand" },
  { id: "ra25", cat: "Play", text: "Dildo in his ass while she strokes the cage" },

  // Tease — her ongoing tease while home
  { id: "ra26", cat: "Tease", text: "No panties around the house all day" },
  { id: "ra27", cat: "Tease", text: "Key on a chain around her neck, all day" },
  { id: "ra28", cat: "Tease", text: "Flash him at random times — boobs, ass, whatever" },
  { id: "ra29", cat: "Tease", text: "Naked in bed — he's not allowed to touch yet" },
  { id: "ra30", cat: "Tease", text: "Uses a vibrator next to him while he stays caged" },
];

const REUNION_CATEGORIES = ["Worship", "Fuck", "Ruined", "Play", "Tease"];

const REUNION_INTRO = [
  "Here's what this is, in plain words.",
  "While you're gone, you hold his erections and his orgasms. You and only you. The cage and the key make that real. Every time he feels it, his mind goes to you.",
  "That's the gift. Not a denial, not a punishment. One part of him, in your keeping.",
  "When you come home, the two of you get to play with what that means — together.",
  "You don't have to be strict. You don't have to be theatrical. This is just one more way the two of you get to love each other after twenty years — a little more thought, a little more play, a key around your neck.",
];

const REUNION_PLAN = [
  "The plan: a number of ruined orgasms before a full one. You set the number.",
  "A ruined orgasm is release without the satisfaction. He starts to cum, you stop stimulation, it happens anyway — but hollow. Frustrating. Electric. Then back in the cage.",
  "Somewhere between five and twenty is the usual range. Five is a taste. Ten is a solid arc. Fifteen or twenty is a serious stretch — he'll feel it. Your pace, your call.",
  "Everything else is on the table in between — strap-on over the cage, sleeve when he wants to feel something, toys on his prostate, feather on his balls, him worshipping you however you want. None of that counts toward the number. It's just for you.",
  "Accident rule: if he cums inside you during anything, he goes down and cleans you up with his mouth. The app logs it. Doesn't count toward the number — that was an accident, not a ruin.",
  "When the counter reaches your number, you decide if he's earned the full one. You can always say 'not yet.' The count doesn't obligate you.",
];

// ─────────────────────────────────────────────────────────────
//  DAILY PROMPT SYSTEM — 3 slots per day, her side and his side
// ─────────────────────────────────────────────────────────────
const PROMPT_SLOTS = [
  { id: "morning", label: "Morning", icon: "☀" },
  { id: "midday", label: "Midday", icon: "◐" },
  { id: "evening", label: "Evening", icon: "☾" },
];

const HER_PROMPTS = {
  morning: [
    "Send him a photo of the key on your pillow",
    "A flirty text: 'morning, my locked one'",
    "Key against your coffee cup — send it",
    "Tell him what you were dreaming about",
    "A selfie before you put makeup on — just for him",
    "Remind him it's already yours today",
    "Key on your nightstand, morning light",
    "'Miss you' with no other words",
    "Tell him one thing you're looking forward to today",
    "Send a photo of yourself stretching in bed",
  ],
  midday: [
    "Midday check-in: 'still yours?'",
    "Key photo from wherever you are — desk, cafe, car",
    "Assign him one thing to do before you talk next",
    "Send him one line of what you want tonight",
    "A 'thinking about you' with no context",
    "Photo of the key against your lipstick",
    "Tell him you're proud of how he's doing",
    "Send something that reminded you of him today",
    "Mirror pic from a bathroom — anywhere",
    "One word: 'locked?' and nothing else",
  ],
  evening: [
    "Goodnight text with the key in frame",
    "Mirror pic, getting ready for bed",
    "Tell him one thing you miss about him physically",
    "Key against bare skin under the sheets",
    "A soft 'goodnight, my love'",
    "'Thinking about what I'll do to you when I'm home' — send it",
    "Send him the day's best photo of you",
    "Tell him one task to do first thing tomorrow",
    "Key on the nightstand, lamp light",
    "One line about how he makes you feel",
  ],
};

const HIS_PROMPTS = {
  morning: [
    "Send her a good-morning text before anything else",
    "Tell her the first thing you thought about today",
    "Write her one reason you adored her yesterday",
    "Send her a photo of your coffee, no context",
    "Ask her what she wants from you today",
    "A simple 'locked and yours, as ordered'",
    "Tell her something you're grateful for this morning",
    "Send her a selfie — real face, no filter",
    "Ask her one question about her day ahead",
    "A single sentence about missing her",
  ],
  midday: [
    "Midday check-in: how is she?",
    "Send her a photo of where you are",
    "Tell her one thing you'd do to her if she were here",
    "Ask her what would make her smile today",
    "Update her on one thing you've accomplished",
    "A photo of lunch — anything",
    "Tell her you're holding out well",
    "Ask if she has anything for you to do",
    "Send her one memory of you two",
    "A single word that captures your afternoon",
  ],
  evening: [
    "Send her a goodnight text with something you love about her",
    "Tell her what the highlight of your day was",
    "Ask her what she's wearing to bed",
    "Tell her one thing you'd do first when she's home",
    "A photo from wherever you're ending the day",
    "Thank her for having the key",
    "Tell her you're going to bed thinking about her",
    "Ask her what tomorrow's one task should be",
    "Send a photo of the view from your bed",
    "A simple 'yours' before you sleep",
  ],
};

// ─────────────────────────────────────────────────────────────
//  SETUP QUESTIONNAIRE — she answers, the game follows
// ─────────────────────────────────────────────────────────────
const SETUP_SECTIONS = [
  {
    id: "pace", title: "The pace",
    qs: [
      { id: "goal", type: "single", q: "How many ruined orgasms before he gets a full one?", opts: [
        { v: 5, l: "5", n: "For beginners" },
        { v: 10, l: "10", n: "So-so" },
        { v: 15, l: "15", n: "Now we're talking" },
        { v: 20, l: "20", n: "Really making him wait" },
      ]},
      { id: "lockup", type: "single", q: "How long do you like him locked up?", opts: [
        { v: 5, l: "5 days" },
        { v: 10, l: "10 days" },
        { v: 20, l: "20 days" },
        { v: 30, l: "A month" },
        { v: "forever", l: "Why let him out?" },
      ]},
    ],
  },
  {
    id: "turnon", title: "What turns you on",
    qs: [
      { id: "precum", type: "single", q: "Knowing he's aroused for you throughout the day — precum, straining in the cage, thinking about you — does that do something for you?", opts: [
        { v: "yes", l: "Yes, I like knowing" },
        { v: "wants", l: "It makes me want him" },
        { v: "no", l: "Not really my thing" },
      ]},
      { id: "tease_close", type: "single", q: "Being the one who teases him close without letting him finish — your thing?", opts: [
        { v: "yes", l: "Yes, that feels good" },
        { v: "curious", l: "Curious to try" },
        { v: "no", l: "Not really" },
      ]},
      { id: "turn_on", type: "multi", q: "What turns you on most in this dynamic?", opts: [
        { v: "focus", l: "Him fully focused on me" },
        { v: "control", l: "Being in control" },
        { v: "straining", l: "Him straining, holding back for me" },
        { v: "buildup", l: "Slow buildup over days or weeks" },
        { v: "eyes", l: "Eye contact while he resists" },
        { v: "talk", l: "Sweet or teasing talk" },
        { v: "begging", l: "Him begging" },
        { v: "anticipation", l: "Long stretches of anticipation" },
      ]},
    ],
  },
  {
    id: "focus", title: "Being the focus",
    qs: [
      { id: "oral_long", type: "single", q: "Him giving you oral for a long time with no expectation of anything back?", opts: [
        { v: "yes", l: "Yes please" },
        { v: "some", l: "Sometimes" },
        { v: "no", l: "Not my favorite" },
      ]},
      { id: "worship", type: "single", q: "Long slow body worship — massage, kissing, attention to every part of you, no rush to anywhere?", opts: [
        { v: "yes", l: "Yes please" },
        { v: "some", l: "Sometimes" },
        { v: "no", l: "Not my favorite" },
      ]},
      { id: "finish_her", type: "single", q: "The rule: he doesn't stop until you've finished, even if it takes a while?", opts: [
        { v: "yes", l: "Yes, I like that" },
        { v: "some", l: "Sometimes" },
        { v: "no", l: "Not necessary" },
      ]},
      { id: "initiate", type: "single", q: "Him available on your schedule — you initiate when you feel like it, not the other way around?", opts: [
        { v: "yes", l: "Yes" },
        { v: "some", l: "Sometimes" },
        { v: "prefer_him", l: "I'd rather he initiate" },
      ]},
      { id: "cleanup", type: "single", q: "If he slips and cums in you during a session he wasn't supposed to finish, him cleaning you up with his mouth afterward?", opts: [
        { v: "yes", l: "Yes — 'oops, that's on you now'" },
        { v: "curious", l: "Curious to try" },
        { v: "no", l: "Not for me" },
      ]},
      { id: "multi_o", type: "single", q: "Having more than one orgasm in a session — as many as you want?", opts: [
        { v: "yes", l: "Yes" },
        { v: "time", l: "If I have the time" },
        { v: "one", l: "One orgasm is usually enough" },
      ]},
    ],
  },
  {
    id: "new", title: "New things, if you're open",
    qs: [
      { id: "sleep_cage", type: "single", q: "Him sleeping naked with the cage on next to you?", opts: [
        { v: "yes", l: "Yes, I like that" },
        { v: "some", l: "Sometimes" },
        { v: "clothed", l: "Prefer him in something" },
      ]},
      { id: "her_sleep", type: "single", q: "You sleeping in something of your choosing — lingerie, a t-shirt of his, nothing at all?", opts: [
        { v: "dress", l: "Yes, I like dressing up" },
        { v: "some", l: "Sometimes" },
        { v: "pjs", l: "I'm a comfortable-pajamas kind of girl" },
      ]},
      { id: "ride_locked", type: "single", q: "You climbing on top and riding him while he's locked — letting him feel you, knowing he can't give you anything back?", opts: [
        { v: "yes", l: "Sounds fun" },
        { v: "curious", l: "Curious" },
        { v: "no", l: "Not my thing" },
      ]},
      { id: "prostate", type: "single", q: "Giving him a prostate massage? (Slow, with lots of lube. Often the most tender, intimate kind of release — different from what he can give himself.)", opts: [
        { v: "yes", l: "Open to it" },
        { v: "curious", l: "Curious — tell me more" },
        { v: "not", l: "Not now" },
      ]},
      { id: "close_stop", type: "single", q: "Bringing him close, then stopping — over and over?", opts: [
        { v: "yes", l: "Open to it" },
        { v: "curious", l: "Curious" },
        { v: "not", l: "Not now" },
      ]},
      { id: "strap_cage", type: "single", q: "When he's locked but you still want him — him using a strap-on over the cage so you can have him inside you?", opts: [
        { v: "yes", l: "Yes, I like that" },
        { v: "curious", l: "Curious" },
        { v: "no", l: "Not really my thing" },
      ]},
      { id: "handsfree", type: "single", q: "The idea that he could climax just from giving you pleasure with the strap-on — no touch to himself, just from you and your sounds — does that do something for you?", opts: [
        { v: "yes", l: "Yes, I love that idea" },
        { v: "curious", l: "Curious to see if he could" },
        { v: "no", l: "Not really my thing" },
      ]},
      { id: "sleeve", type: "single", q: "When you let him out and he's hard for you, him wearing a sleeve that makes him thicker — just to give you more — is that something you'd want?", opts: [
        { v: "yes", l: "Yes, I'd like that" },
        { v: "curious", l: "Curious" },
        { v: "no", l: "Not my thing" },
      ]},
    ],
  },
  {
    id: "key", title: "The key",
    qs: [
      { id: "key_feel", type: "single", q: "The idea of having the key to his erections and orgasms on you at all times — how does that sit with you?", opts: [
        { v: "love", l: "I love it — it's mine, on me, all the time" },
        { v: "powerful", l: "It makes me feel powerful" },
        { v: "heavy", l: "A little heavy for every day — I'd rather keep it somewhere safe" },
        { v: "no_carry", l: "I'd prefer not to carry it around" },
      ]},
      { id: "key_where", type: "single", q: "If you do want it on you, where feels best?", opts: [
        { v: "neck", l: "Around my neck" },
        { v: "bra", l: "Tucked in my bra" },
        { v: "bag", l: "In my purse or bag" },
        { v: "stand", l: "On my nightstand at home" },
        { v: "mood", l: "Only when I'm in the mood for it" },
      ]},
      { id: "key_awkward", type: "single", q: "Honest check — does carrying the key feel awkward to you?", opts: [
        { v: "secret", l: "No, I like it — feels like a secret" },
        { v: "get_used", l: "A little at first, but I'd get used to it" },
        { v: "public", l: "Yes in public. Private is fine." },
        { v: "drawer", l: "Yes — I'd rather it lived in a drawer" },
      ]},
      { id: "key_tease", type: "multi", q: "How do you like to tease him with the key?", opts: [
        { v: "touch", l: "Touching it when I'm near him" },
        { v: "visible", l: "Letting him see it on my body" },
        { v: "cleavage", l: "Tucked in my cleavage where he can catch a glimpse" },
        { v: "photos", l: "Sending him photos of it during my day" },
        { v: "dangle", l: "Dangling it close and pulling away" },
        { v: "secret", l: "Wearing it where only he knows what it means" },
        { v: "quiet", l: "I hold it quietly — that's my style" },
      ]},
    ],
  },
  {
    id: "lines", title: "Lines (optional)",
    qs: [
      { id: "offlimits", type: "text", q: "Anything you'd rather not do? (Optional. Be honest.)", placeholder: "e.g., anything involving other people, or anything uncomfortable" },
      { id: "notes", type: "text", q: "Anything to tell him?", placeholder: "Optional. A note, a hope, a request." },
    ],
  },
];

const EMPTY_DATA = {
  startDate: null,
  releaseDate: null,
  points: 0,
  assignedTasks: [],
  pendingApprovals: [],
  completedTasks: [],
  rewardClaims: [],
  messages: [],
  customRewards: DEFAULT_REWARDS,
  photoRequests: [],
  preferences: { keyholder: [], kept: [] },
  interests: { keyholder: {}, kept: {} },
  suggestionDone: {},
  promptsDone: {},   // { "2026-04-24": { morning: true, midday: false, ... } } — per role via _her / _him suffix
  setup: {},         // her answers; setup.complete = true when game activated
  // Reunion mode
  reunionActive: false,
  ruinedCount: 0,
  ruinedGoal: 10,
  reunionRequests: [],   // {id, fromRole, activityId, text, cat, counts, status, createdAt, decidedAt, completedAt, note}
  reunionHistory: [],     // completed/declined
  accidents: [],          // {id, createdAt, cleanedAt}
  checkinTimes: ["09:00", "21:00"], // daily rhythm prompts
  checkinDone: {},        // { "2026-04-24": ["09:00"] }
  lastUpdated: null,
};

// ─────────────────────────────────────────────────────────────
//  STORAGE
// ─────────────────────────────────────────────────────────────
const storageKey = (code) => `hak:${code}:data`;

async function loadData(code) {
  try {
    const res = await window.storage.get(storageKey(code), true);
    if (res && res.value) {
      const parsed = JSON.parse(res.value);
      return {
        ...EMPTY_DATA,
        ...parsed,
        preferences: { ...EMPTY_DATA.preferences, ...(parsed.preferences || {}) },
        interests: {
          keyholder: { ...(parsed.interests?.keyholder || {}) },
          kept: { ...(parsed.interests?.kept || {}) },
        },
        suggestionDone: parsed.suggestionDone || {},
        promptsDone: parsed.promptsDone || {},
        setup: parsed.setup || {},
        photoRequests: parsed.photoRequests || [],
        reunionRequests: parsed.reunionRequests || [],
        reunionHistory: parsed.reunionHistory || [],
        accidents: parsed.accidents || [],
        checkinTimes: parsed.checkinTimes || EMPTY_DATA.checkinTimes,
        checkinDone: parsed.checkinDone || {},
      };
    }
  } catch { /* no data yet */ }
  return null;
}

async function saveData(code, data) {
  const payload = { ...data, lastUpdated: new Date().toISOString() };
  await window.storage.set(storageKey(code), JSON.stringify(payload), true);
  return payload;
}

// ─────────────────────────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────────────────────────
const daysBetween = (a, b) => Math.floor((new Date(b) - new Date(a)) / 86400000);
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "";
const todayKey = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);

function getDayIndex() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
}
const getDailySuggestion = () => DAILY_SUGGESTIONS[getDayIndex() % DAILY_SUGGESTIONS.length];
const getRotatingTip = () => COACHING_TIPS[(getDayIndex() + 3) % COACHING_TIPS.length];

function getContextualTip(data, role) {
  if (role !== "keyholder") return null;
  if (data.pendingApprovals.length > 0) {
    const oldest = [...data.pendingApprovals].sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))[0];
    const hours = (new Date() - new Date(oldest.submittedAt)) / 3600000;
    if (hours > 24) return "He's been waiting on your reply for a day. Even a quick send-back is a form of attention.";
  }
  const incomingReqs = data.photoRequests.filter(r => r.from === "kept" && r.status === "pending");
  if (incomingReqs.length > 0) return `He's asked you for a photo${incomingReqs.length > 1 ? "s" : ""}. Your call on whether and when.`;
  if (data.assignedTasks.length === 0 && data.pendingApprovals.length === 0 && data.completedTasks.length < 3) {
    return "His plate is empty. Even a five-point task is plenty to start.";
  }
  if (data.completedTasks.length > 5 && data.points > 75 && data.rewardClaims.length === 0) {
    return "He's earning but not spending. Maybe surprise him with something unprompted.";
  }
  if (!data.photoRequests.some(r => r.from === "keyholder") && data.completedTasks.length >= 2) {
    return "You haven't requested a photo yet. Anything counts — it's a small thrill for him.";
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────
export default function HeartAndKey() {
  const [code, setCode] = useState("");
  const [activeCode, setActiveCode] = useState(null);
  const [role, setRole] = useState(null);
  const [data, setData] = useState(EMPTY_DATA);
  const [tab, setTab] = useState("home");
  const [guideOpen, setGuideOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const connect = async () => {
    if (!code.trim() || !role) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const trimmed = code.trim();
      let next;
      try {
        const existing = await loadData(trimmed);
        if (existing) {
          next = existing;
        } else {
          const seed = { ...EMPTY_DATA, startDate: new Date().toISOString() };
          try {
            next = await saveData(trimmed, seed);
          } catch (saveErr) {
            // Storage write failed — proceed with seed in memory so the app is usable
            console.error("saveData failed on first connect:", saveErr);
            next = seed;
          }
        }
      } catch (loadErr) {
        console.error("loadData failed:", loadErr);
        next = { ...EMPTY_DATA, startDate: new Date().toISOString() };
      }
      setData(next);
      setActiveCode(trimmed);
    } catch (e) {
      console.error("connect fatal:", e);
      setErrorMsg("Couldn't connect. Try a different code, or tap 'Start fresh' below.");
    } finally {
      setLoading(false);
    }
  };

  const startFresh = async () => {
    if (!code.trim() || !role) {
      setErrorMsg("Enter a code and pick a role first.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    const trimmed = code.trim();
    const seed = { ...EMPTY_DATA, startDate: new Date().toISOString() };
    try {
      await saveData(trimmed, seed);
    } catch (e) {
      console.error("startFresh save failed:", e);
    }
    setData(seed);
    setActiveCode(trimmed);
    setLoading(false);
  };

  const refresh = useCallback(async () => {
    if (!activeCode) return;
    setLoading(true);
    const fresh = await loadData(activeCode);
    if (fresh) setData(fresh);
    setLoading(false);
  }, [activeCode]);

  const update = async (mutator) => {
    const next = mutator({ ...data });
    setData(next);
    if (activeCode) setData(await saveData(activeCode, next));
  };

  useEffect(() => {
    if (!activeCode) return;
    const id = setInterval(refresh, 20000);
    return () => clearInterval(id);
  }, [activeCode, refresh]);

  // Auto-route on entry: if setup is incomplete, send them to the Reunion tab
  useEffect(() => {
    if (!activeCode) return;
    if (!data.setup?.complete) {
      setTab("reunion");
    }
  }, [activeCode]); // only on initial entry

  if (!activeCode) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#1a0a10] via-[#2a0f1a] to-[#0f0508] text-rose-50 flex items-center justify-center p-6" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-rose-400/60" />
              <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-rose-400/60" />
            </div>
            <h1 className="text-5xl mb-2 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 500 }}>Heart &amp; Key</h1>
            <p className="text-rose-200/60 text-sm tracking-[0.2em] uppercase">A private game for two</p>
            <p className="text-rose-200/70 text-sm mt-3 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>A private space for the two of you while he's locked.</p>
          </div>
          <div className="bg-black/30 backdrop-blur border border-rose-400/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div>
              <label className="block text-xs uppercase tracking-widest text-rose-200/70 mb-2">Shared pair code</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. our-spring-2026-xyz" className="w-full bg-rose-950/40 border border-rose-400/20 rounded-lg px-4 py-3 text-rose-50 placeholder:text-rose-200/30 focus:outline-none focus:border-rose-400/60" autoCapitalize="none" />
              <p className="text-xs text-rose-200/50 mt-2 leading-relaxed">Enter the private code he sent you. Both of you use the same code so you see the same thing.</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-rose-200/70 mb-2">I am the…</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setRole("keyholder")} className={`py-3 rounded-lg border transition flex flex-col items-center gap-1 ${role === "keyholder" ? "bg-rose-400/20 border-rose-400/60 text-rose-50" : "bg-rose-950/20 border-rose-400/10 text-rose-200/60"}`}>
                  <Key className="w-5 h-5" />
                  <span className="text-sm">Keyholder</span>
                  <span className="text-[10px] opacity-70">I have the key</span>
                </button>
                <button onClick={() => setRole("kept")} className={`py-3 rounded-lg border transition flex flex-col items-center gap-1 ${role === "kept" ? "bg-rose-400/20 border-rose-400/60 text-rose-50" : "bg-rose-950/20 border-rose-400/10 text-rose-200/60"}`}>
                  <Lock className="w-5 h-5" />
                  <span className="text-sm">Kept</span>
                  <span className="text-[10px] opacity-70">I wear the cage</span>
                </button>
              </div>
            </div>
            <button onClick={connect} disabled={!code.trim() || !role || loading} className="w-full py-3 rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium tracking-wide">{loading ? "Connecting…" : "Enter"}</button>
            {errorMsg && (
              <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-400/20 rounded-lg p-3">
                {errorMsg}
              </div>
            )}
            <button onClick={startFresh} disabled={!code.trim() || !role || loading} className="w-full py-2 text-xs text-rose-200/50 hover:text-rose-200/80 disabled:opacity-30 transition">Start fresh with this code</button>
          </div>
          <p className="text-center text-rose-200/30 text-xs mt-8 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>"Absence sharpens love, presence strengthens it."</p>
        </div>
      </div>
    );
  }

  const daysLocked = data.startDate ? daysBetween(data.startDate, new Date()) : 0;
  const daysUntilRelease = data.releaseDate ? daysBetween(new Date(), data.releaseDate) : null;
  const pendingPhotoCount = data.photoRequests.filter(r => r.from !== role && r.status === "pending").length;
  const pendingApprovalCount = role === "keyholder" ? data.pendingApprovals.length : 0;
  const pendingReunionCount = (data.reunionRequests || []).filter(r => r.fromRole !== role && r.status === "pending").length
    + (role === "keyholder" ? (data.reunionRequests || []).filter(r => r.status === "approved" && !r.completedAt).length : 0)
    + (data.accidents || []).filter(a => !a.cleanedAt).length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a0a10] via-[#2a0f1a] to-[#0f0508] text-rose-50 pb-24" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap');
        .serif { font-family: 'Cormorant Garamond', serif; }
        @keyframes shimmer { 0%, 100% { opacity: 0.4 } 50% { opacity: 1 } }
        .pulse-dot { animation: shimmer 2s ease-in-out infinite; }
      `}</style>
      <header className="sticky top-0 z-20 bg-[#1a0a10]/85 backdrop-blur-xl border-b border-rose-400/10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" fill="currentColor" /><span className="serif italic text-xl">Heart &amp; Key</span></div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-rose-200/50 flex items-center gap-1"><span className={`inline-block w-1.5 h-1.5 rounded-full bg-rose-400 ${loading ? "pulse-dot" : ""}`} />{role === "keyholder" ? "Keyholder" : "Kept"}</div>
            <button onClick={refresh} className="p-1.5 rounded-lg hover:bg-rose-400/10 transition"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-5 pt-6">
        {tab === "home" && <HomeTab data={data} role={role} update={update} daysLocked={daysLocked} daysUntilRelease={daysUntilRelease} setTab={setTab} openGuide={() => setGuideOpen(true)} />}
        {tab === "photos" && <PhotosTab data={data} role={role} update={update} />}
        {tab === "reunion" && <ReunionTab data={data} role={role} update={update} />}
        {tab === "messages" && <MessagesTab data={data} role={role} update={update} />}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-[#1a0a10]/90 backdrop-blur-xl border-t border-rose-400/10">
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          {[
            { id: "home", label: "Home", Icon: Home, badge: 0 },
            { id: "photos", label: "Photos", Icon: Camera, badge: pendingPhotoCount },
            { id: "reunion", label: "Reunion", Icon: Flame, badge: pendingReunionCount },
            { id: "messages", label: "Notes", Icon: MessageCircle, badge: 0 },
          ].map(({ id, label, Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)} className={`py-3 flex flex-col items-center gap-1 transition relative ${tab === id ? "text-rose-300" : "text-rose-200/40"}`}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge > 0 && <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] leading-none px-1 py-0.5 rounded-full min-w-[14px] text-center">{badge}</span>}
              </div>
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </button>
          ))}
        </div>
      </nav>
      {guideOpen && <GuideOverlay data={data} role={role} update={update} onClose={() => setGuideOpen(false)} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PROMPTS CARD — 3 per day, morning/midday/evening
// ─────────────────────────────────────────────────────────────
function PromptsCard({ data, role, update }) {
  const lib = role === "keyholder" ? HER_PROMPTS : HIS_PROMPTS;
  const today = todayKey();
  const dayIdx = getDayIndex();

  // Deterministic-ish prompt per slot per day, so both partners see the same thing
  const promptsToday = PROMPT_SLOTS.map(slot => ({
    slot,
    text: lib[slot.id][(dayIdx + (slot.id === "morning" ? 0 : slot.id === "midday" ? 7 : 13)) % lib[slot.id].length],
  }));

  const doneKey = (slotId) => `${today}_${role}_${slotId}`;
  const isDone = (slotId) => !!data.promptsDone?.[doneKey(slotId)];

  const markDone = async (slotId) => {
    await update(d => ({
      ...d,
      promptsDone: { ...(d.promptsDone || {}), [doneKey(slotId)]: true },
    }));
  };

  return (
    <div className="rounded-2xl border border-rose-300/30 bg-gradient-to-br from-rose-500/10 via-rose-400/5 to-transparent p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-rose-200/80">
          <Star className="w-3.5 h-3.5" fill="currentColor" />
          <span>Three things today</span>
        </div>
        <div className="text-xs text-rose-200/50">
          {promptsToday.filter(p => isDone(p.slot.id)).length}/3
        </div>
      </div>
      <div className="space-y-3">
        {promptsToday.map(({ slot, text }) => {
          const done = isDone(slot.id);
          return (
            <div key={slot.id} className={`rounded-xl p-3 transition ${done ? "bg-rose-400/5 border border-rose-400/10" : "bg-[#0d0508]/60 border border-rose-400/20"}`}>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-rose-300/70 mb-1.5">
                <span>{slot.icon}</span><span>{slot.label}</span>
              </div>
              <p className={`serif italic text-base leading-snug mb-3 ${done ? "text-rose-200/40 line-through" : "text-rose-50"}`}>{text}</p>
              {!done && (
                <div className="flex items-center gap-2">
                  <button onClick={() => markDone(slot.id)} className="px-3 py-1.5 rounded-full bg-rose-500/80 hover:bg-rose-500 text-xs transition">Done</button>
                  <button onClick={() => markDone(slot.id)} className="px-3 py-1.5 rounded-full border border-rose-400/20 hover:bg-rose-400/10 text-xs text-rose-200/70 transition">Skip</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  HOME
// ─────────────────────────────────────────────────────────────
function HomeTab({ data, role, update, daysLocked, daysUntilRelease, setTab, openGuide }) {
  const [editingRelease, setEditingRelease] = useState(false);
  const [dateInput, setDateInput] = useState(data.releaseDate ? data.releaseDate.slice(0, 10) : "");

  const markSuggestionDone = async () => {
    await update((d) => ({ ...d, suggestionDone: { ...d.suggestionDone, [todayKey()]: true } }));
  };
  const setRelease = async () => {
    if (!dateInput) return;
    await update((d) => ({ ...d, releaseDate: new Date(dateInput + "T12:00:00").toISOString() }));
    setEditingRelease(false);
  };
  const clearRelease = async () => {
    await update((d) => ({ ...d, releaseDate: null }));
    setEditingRelease(false);
  };

  const contextualTip = getContextualTip(data, role);
  const rotatingTip = getRotatingTip();
  const suggestion = getDailySuggestion();
  const suggestionDone = !!data.suggestionDone?.[todayKey()];

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-rose-400/20 bg-gradient-to-br from-rose-950/40 via-rose-900/20 to-transparent p-8">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-400/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-rose-200/50 mb-3">Days together in this</p>
          <div className="flex items-baseline gap-3">
            <span className="serif text-7xl leading-none" style={{ fontStyle: "italic", fontWeight: 500 }}>{daysLocked}</span>
            <span className="text-rose-200/60 text-lg">{daysLocked === 1 ? "day" : "days"}</span>
          </div>
          <p className="serif italic text-rose-200/70 mt-3">Since {fmtDate(data.startDate)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-400/15 bg-black/20 p-5">
        <div className="flex items-center gap-2 text-rose-200/60 text-xs uppercase tracking-wider mb-2"><Clock className="w-3.5 h-3.5" /> Until release</div>
        <div className="serif text-5xl" style={{ fontStyle: "italic" }}>{daysUntilRelease === null ? "—" : daysUntilRelease <= 0 ? "soon" : `${daysUntilRelease} ${daysUntilRelease === 1 ? "day" : "days"}`}</div>
      </div>

      {data.reunionActive && (
        <button onClick={() => setTab("reunion")} className="w-full rounded-2xl border border-rose-400/20 bg-gradient-to-br from-rose-950/50 to-[#1a0a10] p-4 text-left hover:border-rose-400/40 transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-rose-300" />
              </div>
              <div>
                <div className="serif italic text-rose-100 text-lg">Reunion</div>
                <div className="text-xs text-rose-200/60">
                  {data.ruinedCount || 0}/{data.ruinedGoal || 10} ruined
                  {(data.accidents || []).some(a => !a.cleanedAt) && " · cleanup owed"}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rose-200/40" />
          </div>
        </button>
      )}

      <button onClick={openGuide} className="w-full text-left rounded-2xl border border-rose-400/25 bg-gradient-to-br from-rose-900/30 via-rose-950/20 to-transparent p-5 hover:border-rose-400/50 transition group">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-400/15 border border-rose-400/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <div className="serif italic text-xl text-rose-50">{role === "keyholder" ? "The Guide" : "Guide & glossary"}</div>
              <div className="text-xs text-rose-200/60 mt-0.5">{role === "keyholder" ? "Why this exists, terms, things to try, and a yes/maybe/no list for both of you" : "Terms, ideas, and a shared interests list"}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-200/40 group-hover:text-rose-200 group-hover:translate-x-0.5 transition" />
        </div>
      </button>

      {!data.setup?.complete && role === "kept" && (
        <button onClick={() => setTab("reunion")} className="w-full rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-transparent p-4 text-left hover:border-amber-400/50 transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-amber-100 font-medium">The game hasn't started yet</div>
              <div className="text-xs text-amber-200/60 mt-0.5">She's the one who sets it up. Until then, wait.</div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-200/40" />
          </div>
        </button>
      )}

      {!data.setup?.complete && role === "keyholder" && (
        <button onClick={() => setTab("reunion")} className="w-full rounded-2xl border border-rose-300/30 bg-gradient-to-br from-rose-500/15 to-transparent p-4 text-left hover:border-rose-400/50 transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-400/15 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-rose-200" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-rose-50 font-medium">Set up the game</div>
              <div className="text-xs text-rose-200/60 mt-0.5">A few questions from you, and the game begins</div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-200/40" />
          </div>
        </button>
      )}

      <PromptsCard data={data} role={role} update={update} />

      {role === "keyholder" && contextualTip && (
        <div className="rounded-2xl border border-amber-300/20 bg-amber-500/5 p-4 flex gap-3">
          <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-50/90 leading-relaxed">{contextualTip}</p>
        </div>
      )}

      {role === "keyholder" && (
        <div className="rounded-2xl border border-rose-400/10 bg-black/10 p-4">
          <div className="text-[10px] uppercase tracking-widest text-rose-200/40 mb-1">Keyholder, gently</div>
          <p className="serif italic text-rose-100/80 text-[15px] leading-relaxed">{rotatingTip}</p>
        </div>
      )}

      <div className="rounded-2xl border border-rose-400/15 bg-black/20 p-5">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="serif text-xl" style={{ fontStyle: "italic" }}>Next release</div>
            <div className="text-rose-200/60 text-sm">{fmtDate(data.releaseDate)}</div>
          </div>
          {role === "keyholder" && <button onClick={() => setEditingRelease(!editingRelease)} className="text-xs px-3 py-1.5 rounded-full border border-rose-400/20 hover:bg-rose-400/10 transition">{editingRelease ? "Cancel" : data.releaseDate ? "Edit" : "Set"}</button>}
        </div>
        {editingRelease && (
          <div className="mt-3 space-y-2">
            <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className="w-full bg-rose-950/40 border border-rose-400/20 rounded-lg px-3 py-2 text-rose-50" />
            <div className="flex gap-2">
              <button onClick={setRelease} className="flex-1 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 transition text-sm">Save</button>
              {data.releaseDate && <button onClick={clearRelease} className="py-2 px-3 rounded-lg border border-rose-400/20 hover:bg-rose-400/10 transition text-sm">Clear</button>}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-rose-400/15 bg-black/20 p-5 space-y-3">
        <div className="serif text-xl mb-1" style={{ fontStyle: "italic" }}>At a glance</div>
        <Glance label="Photo requests for you" value={data.photoRequests.filter(r => r.from !== role && r.status === "pending").length} hot={data.photoRequests.filter(r => r.from !== role && r.status === "pending").length > 0} onTap={() => setTab("photos")} />
        {data.reunionActive && (
          <Glance label={role === "keyholder" ? "Reunion items waiting on you" : "Reunion requests out"} value={(data.reunionRequests || []).filter(r => role === "keyholder" ? (r.fromRole === "kept" && r.status === "pending") || (r.status === "approved" && !r.completedAt) : r.fromRole === "kept" && r.status === "pending").length} hot={true} onTap={() => setTab("reunion")} />
        )}
      </div>

      {data.messages?.length > 0 && (
        <button onClick={() => setTab("messages")} className="w-full text-left rounded-2xl border border-rose-400/15 bg-black/20 p-5">
          <div className="serif text-xl mb-2" style={{ fontStyle: "italic" }}>Latest note</div>
          <div className="text-rose-100/90 italic">"{data.messages[data.messages.length - 1].text}"</div>
          <div className="text-xs text-rose-200/40 mt-2">— {data.messages[data.messages.length - 1].from}, {fmtTime(data.messages[data.messages.length - 1].at)}</div>
        </button>
      )}
    </div>
  );
}

function Glance({ label, value, hot, onTap }) {
  return (
    <button onClick={onTap} className="w-full flex items-center justify-between text-left">
      <span className="text-rose-200/70 text-sm">{label}</span>
      <span className={`text-sm font-medium flex items-center gap-1 ${hot ? "text-rose-300" : "text-rose-200/90"}`}>{value}<ChevronRight className="w-3 h-3 opacity-50" /></span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
//  TASKS
// ─────────────────────────────────────────────────────────────
function TasksTab({ data, role, update }) {
  const [view, setView] = useState(role === "keyholder" ? "assign" : "mine");
  const [note, setNote] = useState({});

  const drawRandom = async () => {
    const pool = DEFAULT_TASK_DECK.filter(t => !data.assignedTasks.some(a => a.deckId === t.id));
    const pick = pool[Math.floor(Math.random() * pool.length)] || DEFAULT_TASK_DECK[Math.floor(Math.random() * DEFAULT_TASK_DECK.length)];
    await update((d) => ({ ...d, assignedTasks: [...d.assignedTasks, { id: uid(), deckId: pick.id, text: pick.text, points: pick.points, category: pick.category, assignedBy: role, at: new Date().toISOString() }] }));
  };
  const assignTask = async (task) => {
    await update((d) => ({ ...d, assignedTasks: [...d.assignedTasks, { id: uid(), deckId: task.id, text: task.text, points: task.points, category: task.category, assignedBy: "keyholder", at: new Date().toISOString() }] }));
  };
  const submitForApproval = async (taskId) => {
    const task = data.assignedTasks.find(t => t.id === taskId);
    if (!task) return;
    await update((d) => ({ ...d, assignedTasks: d.assignedTasks.filter(t => t.id !== taskId), pendingApprovals: [...d.pendingApprovals, { ...task, note: note[taskId] || "", submittedAt: new Date().toISOString() }] }));
    setNote(n => ({ ...n, [taskId]: "" }));
  };
  const approve = async (taskId) => {
    const task = data.pendingApprovals.find(t => t.id === taskId);
    if (!task) return;
    await update((d) => ({ ...d, pendingApprovals: d.pendingApprovals.filter(t => t.id !== taskId), completedTasks: [{ ...task, approvedAt: new Date().toISOString() }, ...d.completedTasks], points: d.points + task.points }));
  };
  const reject = async (taskId) => {
    const task = data.pendingApprovals.find(t => t.id === taskId);
    if (!task) return;
    await update((d) => ({ ...d, pendingApprovals: d.pendingApprovals.filter(t => t.id !== taskId), assignedTasks: [...d.assignedTasks, { ...task }] }));
  };
  const cancelTask = async (taskId) => {
    await update((d) => ({ ...d, assignedTasks: d.assignedTasks.filter(t => t.id !== taskId) }));
  };

  const tabs = role === "keyholder"
    ? [{ id: "assign", label: "Assign" }, { id: "mine", label: "Active" }, { id: "review", label: `Review${data.pendingApprovals.length ? ` · ${data.pendingApprovals.length}` : ""}` }, { id: "history", label: "History" }]
    : [{ id: "mine", label: "Active" }, { id: "waiting", label: "Waiting" }, { id: "history", label: "History" }];

  return (
    <div className="space-y-5">
      <div className="flex gap-1 p-1 bg-black/30 rounded-xl border border-rose-400/10">
        {tabs.map(t => <button key={t.id} onClick={() => setView(t.id)} className={`flex-1 py-2 text-xs rounded-lg transition ${view === t.id ? "bg-rose-400/20 text-rose-100" : "text-rose-200/60"}`}>{t.label}</button>)}
      </div>

      {role === "kept" && view === "mine" && (
        <button onClick={drawRandom} className="w-full py-4 rounded-2xl border border-rose-400/30 bg-gradient-to-br from-rose-500/10 to-transparent hover:from-rose-500/20 transition flex items-center justify-center gap-2 group">
          <Dice6 className="w-5 h-5 group-hover:rotate-12 transition" /><span className="serif italic text-lg">Draw a random task</span>
        </button>
      )}

      {view === "assign" && role === "keyholder" && (
        <div className="space-y-4">
          <p className="text-rose-200/60 text-sm">Tap any card to assign it. Start small — one at a time is plenty.</p>
          {Object.entries(groupBy(DEFAULT_TASK_DECK, "category")).map(([cat, items]) => (
            <div key={cat}>
              <div className="text-xs uppercase tracking-widest text-rose-200/50 mb-2 mt-4">{cat}</div>
              <div className="space-y-2">
                {items.map(t => (
                  <button key={t.id} onClick={() => assignTask(t)} className="w-full text-left p-4 rounded-xl bg-black/20 border border-rose-400/10 hover:border-rose-400/40 hover:bg-black/30 transition">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-rose-50 text-sm leading-relaxed">{t.text}</div>
                      <div className="shrink-0 text-xs bg-rose-400/20 text-rose-200 px-2 py-1 rounded-full">{t.points} pts</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "mine" && (
        <div className="space-y-3">
          {data.assignedTasks.length === 0 && <EmptyState text={role === "kept" ? "No active tasks. Draw one or wait for her to assign." : "Nothing assigned right now."} />}
          {data.assignedTasks.map(t => (
            <div key={t.id} className="p-4 rounded-xl bg-black/20 border border-rose-400/15">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-rose-200/50 mb-1">{t.category}</div>
                  <div className="text-rose-50 leading-relaxed">{t.text}</div>
                </div>
                <div className="shrink-0 text-xs bg-rose-400/20 text-rose-200 px-2 py-1 rounded-full">{t.points} pts</div>
              </div>
              {role === "kept" ? (
                <div className="mt-3 space-y-2">
                  <textarea value={note[t.id] || ""} onChange={(e) => setNote(n => ({ ...n, [t.id]: e.target.value }))} placeholder="Proof, note, or link (optional)" className="w-full bg-rose-950/30 border border-rose-400/20 rounded-lg px-3 py-2 text-sm text-rose-50 placeholder:text-rose-200/30 focus:outline-none focus:border-rose-400/50" rows={2} />
                  <div className="flex gap-2">
                    <button onClick={() => submitForApproval(t.id)} className="flex-1 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-sm transition flex items-center justify-center gap-1"><Check className="w-4 h-4" /> Submit</button>
                    <button onClick={() => cancelTask(t.id)} className="px-3 py-2 rounded-lg border border-rose-400/20 hover:bg-rose-400/10 text-sm transition"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ) : (
                <button onClick={() => cancelTask(t.id)} className="text-xs text-rose-200/50 hover:text-rose-200 mt-2">Remove</button>
              )}
            </div>
          ))}
        </div>
      )}

      {view === "review" && role === "keyholder" && (
        <div className="space-y-3">
          {data.pendingApprovals.length === 0 && <EmptyState text="Nothing to review right now." />}
          {data.pendingApprovals.map(t => (
            <div key={t.id} className="p-4 rounded-xl bg-black/20 border border-rose-300/30">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-rose-200/50 mb-1">{t.category}</div>
                  <div className="text-rose-50 leading-relaxed">{t.text}</div>
                </div>
                <div className="shrink-0 text-xs bg-rose-400/20 text-rose-200 px-2 py-1 rounded-full">{t.points} pts</div>
              </div>
              {t.note && <div className="mt-2 p-3 rounded-lg bg-rose-950/40 text-sm italic text-rose-100/90">"{t.note}"</div>}
              <div className="text-xs text-rose-200/40 mt-2">Submitted {fmtTime(t.submittedAt)}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => approve(t.id)} className="flex-1 py-2 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-sm transition flex items-center justify-center gap-1"><Check className="w-4 h-4" /> Approve · +{t.points}</button>
                <button onClick={() => reject(t.id)} className="flex-1 py-2 rounded-lg border border-rose-400/30 hover:bg-rose-400/10 text-sm transition flex items-center justify-center gap-1"><X className="w-4 h-4" /> Send back</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "waiting" && role === "kept" && (
        <div className="space-y-3">
          {data.pendingApprovals.length === 0 && <EmptyState text="Nothing waiting for her review." />}
          {data.pendingApprovals.map(t => (
            <div key={t.id} className="p-4 rounded-xl bg-black/20 border border-rose-400/15">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-rose-200/50 mb-1">{t.category} · Awaiting approval</div>
                  <div className="text-rose-50 leading-relaxed">{t.text}</div>
                  {t.note && <div className="mt-2 text-sm italic text-rose-200/70">"{t.note}"</div>}
                </div>
                <div className="shrink-0 text-xs bg-rose-400/20 text-rose-200 px-2 py-1 rounded-full">{t.points} pts</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "history" && (
        <div className="space-y-2">
          {data.completedTasks.length === 0 && <EmptyState text="No completed tasks yet." />}
          {data.completedTasks.map(t => (
            <div key={t.id} className="p-3 rounded-lg bg-black/20 border border-rose-400/10 flex items-center justify-between gap-3">
              <div className="min-w-0"><div className="text-sm text-rose-50 truncate">{t.text}</div><div className="text-xs text-rose-200/40">{fmtDate(t.approvedAt)}</div></div>
              <div className="shrink-0 text-xs text-emerald-300">+{t.points}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PHOTOS
// ─────────────────────────────────────────────────────────────
function PhotosTab({ data, role, update }) {
  const [view, setView] = useState("inbox");
  const [picking, setPicking] = useState(false);
  const [customText, setCustomText] = useState("");
  const [showPrefs, setShowPrefs] = useState(false);

  const myIdeas = role === "keyholder" ? PHOTO_IDEAS_OF_HIM : PHOTO_IDEAS_OF_HER;
  const myPrefsKey = role;
  const myPrefs = data.preferences[myPrefsKey] || [];
  const partnerPrefsKey = role === "keyholder" ? "kept" : "keyholder";
  const partnerPrefs = data.preferences[partnerPrefsKey] || [];
  const partnerIdeas = role === "keyholder" ? PHOTO_IDEAS_OF_HER : PHOTO_IDEAS_OF_HIM;
  const partnerFavorites = partnerIdeas.filter(i => partnerPrefs.includes(i.id));

  const incoming = data.photoRequests.filter(r => r.from !== role && r.status === "pending");
  const outgoing = data.photoRequests.filter(r => r.from === role && r.status === "pending");
  const archive = data.photoRequests.filter(r => r.status !== "pending").slice(-20).reverse();

  const sendRequest = async (text) => {
    if (!text.trim()) return;
    await update((d) => ({ ...d, photoRequests: [...d.photoRequests, { id: uid(), from: role, text: text.trim(), at: new Date().toISOString(), status: "pending" }] }));
    setPicking(false); setCustomText("");
  };
  const markFulfilled = async (reqId) => {
    await update((d) => ({ ...d, photoRequests: d.photoRequests.map(r => r.id === reqId ? { ...r, status: "fulfilled", fulfilledAt: new Date().toISOString() } : r) }));
  };
  const markDeclined = async (reqId) => {
    await update((d) => ({ ...d, photoRequests: d.photoRequests.map(r => r.id === reqId ? { ...r, status: "declined", fulfilledAt: new Date().toISOString() } : r) }));
  };
  const cancelRequest = async (reqId) => {
    await update((d) => ({ ...d, photoRequests: d.photoRequests.filter(r => r.id !== reqId) }));
  };
  const togglePref = async (ideaId) => {
    await update((d) => {
      const list = d.preferences[myPrefsKey] || [];
      const next = list.includes(ideaId) ? list.filter(x => x !== ideaId) : [...list, ideaId];
      return { ...d, preferences: { ...d.preferences, [myPrefsKey]: next } };
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1 p-1 bg-black/30 rounded-xl border border-rose-400/10">
        <button onClick={() => setView("inbox")} className={`flex-1 py-2 text-xs rounded-lg transition ${view === "inbox" ? "bg-rose-400/20 text-rose-100" : "text-rose-200/60"}`}>For you{incoming.length > 0 && ` · ${incoming.length}`}</button>
        <button onClick={() => setView("sent")} className={`flex-1 py-2 text-xs rounded-lg transition ${view === "sent" ? "bg-rose-400/20 text-rose-100" : "text-rose-200/60"}`}>Waiting</button>
        <button onClick={() => setView("history")} className={`flex-1 py-2 text-xs rounded-lg transition ${view === "history" ? "bg-rose-400/20 text-rose-100" : "text-rose-200/60"}`}>History</button>
      </div>

      <button onClick={() => setPicking(!picking)} className="w-full py-4 rounded-2xl border border-rose-400/30 bg-gradient-to-br from-rose-500/10 to-transparent hover:from-rose-500/20 transition flex items-center justify-center gap-2">
        <Camera className="w-5 h-5" /><span className="serif italic text-lg">{picking ? "Close" : "Request a photo"}</span>
      </button>

      {picking && (
        <div className="rounded-2xl border border-rose-400/20 bg-black/30 p-4 space-y-4">
          {partnerFavorites.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-widest text-rose-200/60 mb-2 flex items-center gap-1">
                <Star className="w-3 h-3" fill="currentColor" /> {role === "keyholder" ? "His favorites to receive" : "Her favorites to receive"}
              </div>
              <div className="space-y-1.5">
                {partnerFavorites.map(i => (
                  <button key={i.id} onClick={() => sendRequest(i.text)} className="w-full text-left px-3 py-2.5 text-sm rounded-lg bg-rose-500/10 border border-rose-300/30 hover:bg-rose-500/20 transition">{i.text}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs uppercase tracking-widest text-rose-200/50 mb-2">All ideas</div>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {myIdeas.map(i => (
                <button key={i.id} onClick={() => sendRequest(i.text)} className="w-full text-left px-3 py-2.5 text-sm rounded-lg bg-black/20 border border-rose-400/10 hover:border-rose-400/30 hover:bg-black/30 transition flex items-center justify-between gap-2">
                  <span>{i.text}</span>
                  {i.intimate && <span className="text-[10px] uppercase tracking-wider text-rose-300/60">intimate</span>}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-rose-200/50 mb-2">Or ask your own way</div>
            <div className="flex gap-2">
              <input value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Write it in your words…" className="flex-1 bg-rose-950/30 border border-rose-400/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-400/50" />
              <button onClick={() => sendRequest(customText)} disabled={!customText.trim()} className="px-4 py-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 disabled:opacity-40 text-sm">Send</button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-rose-400/10 bg-black/10">
        <button onClick={() => setShowPrefs(!showPrefs)} className="w-full p-4 flex items-center justify-between">
          <div className="text-left">
            <div className="text-sm text-rose-100">What you enjoy receiving</div>
            <div className="text-xs text-rose-200/50 mt-0.5">{myPrefs.length} favorite{myPrefs.length === 1 ? "" : "s"} marked · visible to your partner</div>
          </div>
          <ChevronDown className={`w-4 h-4 transition ${showPrefs ? "rotate-180" : ""}`} />
        </button>
        {showPrefs && (
          <div className="p-4 pt-0 space-y-2">
            <p className="text-xs text-rose-200/50 leading-relaxed mb-2">Mark only what actually sounds fun to you. Leave the rest blank — no pressure. Your partner sees your favorites when they're deciding what to send you.</p>
            {myIdeas.map(i => {
              const on = myPrefs.includes(i.id);
              return (
                <button key={i.id} onClick={() => togglePref(i.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between gap-2 border ${on ? "bg-rose-500/15 border-rose-300/40 text-rose-50" : "bg-black/20 border-rose-400/10 text-rose-200/70"}`}>
                  <span>{i.text}</span>
                  <div className="flex items-center gap-2">
                    {i.intimate && <span className="text-[10px] uppercase tracking-wider text-rose-300/50">intimate</span>}
                    {on && <Star className="w-3.5 h-3.5 text-rose-300" fill="currentColor" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {view === "inbox" && (
        <div className="space-y-3">
          {incoming.length === 0 && <EmptyState text="No requests waiting on you." />}
          {incoming.map(r => (
            <div key={r.id} className="p-4 rounded-xl bg-rose-500/10 border border-rose-300/30">
              <div className="text-xs uppercase tracking-wider text-rose-200/60 mb-1">They asked for</div>
              <div className="text-rose-50 leading-relaxed">{r.text}</div>
              <div className="text-xs text-rose-200/40 mt-2">Requested {fmtTime(r.at)}</div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => markFulfilled(r.id)} className="flex-1 py-2 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-sm transition flex items-center justify-center gap-1"><Check className="w-4 h-4" /> Sent it</button>
                <button onClick={() => markDeclined(r.id)} className="px-3 py-2 rounded-lg border border-rose-400/30 hover:bg-rose-400/10 text-sm transition">Pass</button>
              </div>
              <p className="text-xs text-rose-200/40 mt-2 italic">Send the photo through your normal messages, then tap Sent here.</p>
            </div>
          ))}
        </div>
      )}

      {view === "sent" && (
        <div className="space-y-3">
          {outgoing.length === 0 && <EmptyState text="No requests waiting out there." />}
          {outgoing.map(r => (
            <div key={r.id} className="p-4 rounded-xl bg-black/20 border border-rose-400/15">
              <div className="text-xs uppercase tracking-wider text-rose-200/50 mb-1">You asked for</div>
              <div className="text-rose-50 leading-relaxed">{r.text}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-rose-200/40">Sent {fmtTime(r.at)}</div>
                <button onClick={() => cancelRequest(r.id)} className="text-xs text-rose-200/50 hover:text-rose-200">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "history" && (
        <div className="space-y-2">
          {archive.length === 0 && <EmptyState text="No history yet." />}
          {archive.map(r => (
            <div key={r.id} className="p-3 rounded-lg bg-black/20 border border-rose-400/10">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm text-rose-50">{r.text}</div>
                  <div className="text-xs text-rose-200/40 mt-0.5">{r.from === role ? "You asked" : "They asked"} · {fmtDate(r.at)}</div>
                </div>
                <div className={`shrink-0 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${r.status === "fulfilled" ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-400/10 text-rose-200/60"}`}>{r.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  SETUP FLOW — keyholder's first-login questionnaire
// ─────────────────────────────────────────────────────────────
function SetupFlow({ data, update }) {
  const [stage, setStage] = useState(data.setup?.startedSetup ? "questions" : "intro");
  const setup = data.setup || {};

  const answer = async (qid, value) => {
    await update(d => ({
      ...d,
      setup: { ...(d.setup || {}), [qid]: value, startedSetup: true },
    }));
  };

  const toggleMulti = async (qid, value) => {
    const current = setup[qid] || [];
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    await answer(qid, next);
  };

  const finish = async () => {
    let goal = setup.goal;
    if (typeof goal === "string") {
      const parsed = parseInt(goal, 10);
      goal = isNaN(parsed) ? 10 : Math.max(1, parsed);
    }
    goal = goal || 10;

    // Lockup choice → release date (skip if she picked "forever" or didn't pick)
    let newReleaseDate = null;
    const lockup = setup.lockup;
    let lockupDays = null;
    if (typeof lockup === "number") {
      lockupDays = lockup;
    } else if (typeof lockup === "string" && lockup !== "forever") {
      const parsed = parseInt(lockup, 10);
      if (!isNaN(parsed) && parsed > 0) lockupDays = parsed;
    }
    if (lockupDays !== null) {
      const rd = new Date();
      rd.setDate(rd.getDate() + lockupDays);
      newReleaseDate = rd.toISOString();
    }

    await update(d => ({
      ...d,
      setup: { ...(d.setup || {}), complete: true, completedAt: new Date().toISOString() },
      reunionActive: true,
      ruinedGoal: goal,
      releaseDate: newReleaseDate !== null ? newReleaseDate : d.releaseDate,
    }));
  };

  if (stage === "intro") {
    return (
      <div className="pb-28 space-y-5">
        <div className="bg-gradient-to-br from-rose-950/40 to-[#1a0a10] border border-rose-400/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-rose-300 mb-4">
            <Flame className="w-5 h-5" />
            <h2 className="font-serif italic text-2xl">Reunion — setting the game</h2>
          </div>
          <div className="space-y-3 text-sm text-rose-100/80 leading-relaxed font-light">
            {REUNION_INTRO.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        <div className="bg-[#1a0a10]/60 border border-rose-400/10 rounded-2xl p-6">
          <p className="text-sm text-rose-100/80 leading-relaxed">
            Before the game starts, a few questions for you. What you like, what you're open to, where your lines are. He'll see your answers — that's how this works. You set the game, he follows the game.
          </p>
          <p className="text-xs text-rose-200/50 mt-3 italic">Answers save as you tap. You can come back anytime to change them.</p>
        </div>
        <button onClick={() => setStage("questions")} className="w-full py-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-medium">Start the questions</button>
      </div>
    );
  }

  // Count answered questions for progress
  const totalRequired = SETUP_SECTIONS.reduce((n, s) => n + s.qs.filter(q => q.type !== "text").length, 0);
  const answered = SETUP_SECTIONS.reduce((n, s) => n + s.qs.filter(q => {
    if (q.type === "text") return false;
    if (q.type === "multi") return Array.isArray(setup[q.id]) && setup[q.id].length > 0;
    return setup[q.id] !== undefined;
  }).length, 0);

  return (
    <div className="pb-28 space-y-5">
      <div className="sticky top-0 z-10 bg-[#1a0a10]/95 backdrop-blur -mx-5 px-5 py-3 border-b border-rose-400/10">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-xs uppercase tracking-widest text-rose-300/70">Your setup</div>
          <div className="text-xs text-rose-200/50">{answered} / {totalRequired}</div>
        </div>
        <div className="h-1 bg-rose-400/10 rounded-full overflow-hidden">
          <div className="h-full bg-rose-400 transition-all" style={{ width: `${(answered / totalRequired) * 100}%` }} />
        </div>
      </div>

      {SETUP_SECTIONS.map(section => (
        <div key={section.id} className="bg-[#1a0a10]/60 border border-rose-400/10 rounded-2xl p-5">
          <h3 className="font-serif italic text-xl text-rose-100 mb-4">{section.title}</h3>
          <div className="space-y-6">
            {section.qs.map(q => (
              <div key={q.id}>
                <div className="text-sm text-rose-100/90 mb-3 leading-relaxed">{q.q}</div>
                {q.type === "single" && (() => {
                  const chosen = setup[q.id];
                  const isCustom = chosen !== undefined && !q.opts.some(o => o.v === chosen);
                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {q.opts.map(o => (
                          <button key={o.v} onClick={() => answer(q.id, o.v)} className={`px-3 py-2 rounded-lg text-xs text-left transition ${chosen === o.v ? "bg-rose-500 text-white" : "bg-rose-400/10 text-rose-200/70 hover:bg-rose-400/20"}`}>
                            <div>{o.l}</div>
                            {o.n && <div className="text-[10px] opacity-70 mt-0.5">{o.n}</div>}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Or write your own…"
                        value={isCustom ? String(chosen) : ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v.trim() === "") {
                            // clear selection entirely
                            update(d => {
                              const { [q.id]: _, ...rest } = (d.setup || {});
                              return { ...d, setup: { ...rest, startedSetup: true } };
                            });
                          } else {
                            answer(q.id, v);
                          }
                        }}
                        className={`w-full bg-rose-950/30 border rounded-lg px-3 py-2 text-xs text-rose-100 placeholder:text-rose-200/30 focus:outline-none focus:border-rose-400/30 ${isCustom ? "border-rose-400/40" : "border-rose-400/10"}`}
                      />
                    </div>
                  );
                })()}
                {q.type === "multi" && (() => {
                  const current = setup[q.id] || [];
                  const customStr = setup[q.id + "_other"] || "";
                  return (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {q.opts.map(o => {
                          const selected = current.includes(o.v);
                          return (
                            <button key={o.v} onClick={() => toggleMulti(q.id, o.v)} className={`px-3 py-2 rounded-lg text-xs transition ${selected ? "bg-rose-500 text-white" : "bg-rose-400/10 text-rose-200/70 hover:bg-rose-400/20"}`}>
                              {o.l}
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        placeholder="Or write your own (commas to separate)…"
                        value={customStr}
                        onChange={(e) => {
                          update(d => ({
                            ...d,
                            setup: { ...(d.setup || {}), [q.id + "_other"]: e.target.value, startedSetup: true },
                          }));
                        }}
                        className={`w-full bg-rose-950/30 border rounded-lg px-3 py-2 text-xs text-rose-100 placeholder:text-rose-200/30 focus:outline-none focus:border-rose-400/30 ${customStr ? "border-rose-400/40" : "border-rose-400/10"}`}
                      />
                    </div>
                  );
                })()}
                {q.type === "text" && (
                  <textarea value={setup[q.id] || ""} onChange={(e) => answer(q.id, e.target.value)} placeholder={q.placeholder} className="w-full bg-rose-950/30 border border-rose-400/10 rounded-lg px-3 py-2 text-sm text-rose-100 placeholder:text-rose-200/30 focus:outline-none focus:border-rose-400/30" rows="2" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={finish} disabled={setup.goal === undefined} className="w-full py-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-medium disabled:opacity-30 disabled:cursor-not-allowed">
        Set the game in motion
      </button>
      {setup.goal === undefined && (
        <p className="text-xs text-rose-200/40 text-center">Pick a number for ruined orgasms to continue.</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  REUNION
// ─────────────────────────────────────────────────────────────
function ReunionTab({ data, role, update }) {
  const [picking, setPicking] = useState(false);
  const [selectedCat, setSelectedCat] = useState("Worship");
  const [showIntro, setShowIntro] = useState(false);
  const [customText, setCustomText] = useState("");

  const requests = data.reunionRequests || [];
  const accidents = data.accidents || [];
  const pendingForMe = requests.filter(r => r.fromRole !== role && r.status === "pending");
  const pendingFromMe = requests.filter(r => r.fromRole === role && r.status === "pending");
  const approvedUnfinished = requests.filter(r => r.status === "approved" && !r.completedAt);
  const pendingAccidents = accidents.filter(a => !a.cleanedAt);
  const completed = requests.filter(r => r.completedAt).slice(-10).reverse();

  const ruinedDone = data.ruinedCount || 0;
  const ruinedGoal = data.ruinedGoal || 10;

  const activateReunion = async () => {
    await update(d => ({ ...d, reunionActive: true }));
  };

  const request = async (activity, text) => {
    const now = new Date().toISOString();
    const req = {
      id: `rr_${Date.now()}`,
      fromRole: role,
      activityId: activity?.id || null,
      text: text || activity?.text,
      cat: activity?.cat || "Custom",
      counts: !!activity?.counts,
      status: "pending",
      createdAt: now,
    };
    await update(d => ({ ...d, reunionRequests: [...(d.reunionRequests || []), req] }));
    setPicking(false);
    setCustomText("");
  };

  const decide = async (id, status) => {
    await update(d => ({
      ...d,
      reunionRequests: (d.reunionRequests || []).map(r => r.id === id ? { ...r, status, decidedAt: new Date().toISOString() } : r),
    }));
  };

  const complete = async (id) => {
    await update(d => {
      const reqs = (d.reunionRequests || []);
      const target = reqs.find(r => r.id === id);
      const counts = target && target.counts;
      return {
        ...d,
        reunionRequests: reqs.map(r => r.id === id ? { ...r, completedAt: new Date().toISOString() } : r),
        ruinedCount: counts ? (d.ruinedCount || 0) + 1 : (d.ruinedCount || 0),
      };
    });
  };

  const logAccident = async () => {
    if (!window.confirm("Log an accident? He'll owe a cleanup.")) return;
    await update(d => ({
      ...d,
      accidents: [...(d.accidents || []), { id: `ac_${Date.now()}`, createdAt: new Date().toISOString(), loggedBy: role }],
    }));
  };

  const cleanAccident = async (id) => {
    await update(d => ({
      ...d,
      accidents: (d.accidents || []).map(a => a.id === id ? { ...a, cleanedAt: new Date().toISOString() } : a),
    }));
  };

  const adjustRuined = async (delta) => {
    await update(d => ({ ...d, ruinedCount: Math.max(0, (d.ruinedCount || 0) + delta) }));
  };

  const resetRuined = async () => {
    if (!window.confirm("Reset the counter to 0?")) return;
    await update(d => ({ ...d, ruinedCount: 0 }));
  };

  // Intro view (before activation, or on re-read)
  const setup = data.setup || {};
  const setupComplete = !!setup.complete;

  // Kept partner waiting for her to set the game
  if (!setupComplete && role === "kept") {
    return (
      <div className="pb-28 space-y-5">
        <div className="bg-gradient-to-br from-rose-950/40 to-[#1a0a10] border border-rose-400/15 rounded-2xl p-8 text-center">
          <Flame className="w-10 h-10 text-rose-300/80 mx-auto mb-4" />
          <h2 className="font-serif italic text-2xl text-rose-100 mb-3">She's setting the game</h2>
          <p className="text-sm text-rose-100/70 leading-relaxed max-w-sm mx-auto">
            The reunion doesn't start until she's gone through her setup. She picks the number, she picks the pace, she decides what's on the table. Then the game begins.
          </p>
          <p className="text-xs text-rose-200/50 mt-4 italic">You'll get in when she says so. That's the whole point.</p>
        </div>
        {setup.startedSetup && (
          <div className="bg-rose-400/10 border border-rose-400/20 rounded-xl p-3 text-center">
            <p className="text-xs text-rose-200">She's started. Hang tight.</p>
          </div>
        )}
      </div>
    );
  }

  // Keyholder setup flow
  if (!setupComplete && role === "keyholder") {
    return <SetupFlow data={data} update={update} />;
  }

  // Intro re-read (after setup is complete)
  if (showIntro) {
    return (
      <div className="pb-28 space-y-5">
        <div className="bg-gradient-to-br from-rose-950/40 to-[#1a0a10] border border-rose-400/15 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-rose-300 mb-4">
            <Flame className="w-5 h-5" />
            <h2 className="font-serif italic text-2xl">Reunion</h2>
          </div>
          <div className="space-y-3 text-sm text-rose-100/80 leading-relaxed font-light">
            {REUNION_INTRO.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <button onClick={() => setShowIntro(false)} className="w-full py-3 rounded-xl bg-rose-400/10 text-rose-200 text-sm">
          Back to reunion dashboard
        </button>
      </div>
    );
  }

  // Picker overlay
  const picker = picking ? (
    <div className="fixed inset-0 z-30 bg-[#0d0508]/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-2xl mx-auto p-5 pt-8 pb-24">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setPicking(false)} className="p-2 -ml-2 text-rose-200"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="font-serif italic text-xl text-rose-200">Request something</h2>
          <div className="w-6" />
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {REUNION_CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCat(c)} className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${selectedCat === c ? "bg-rose-500 text-white" : "bg-rose-400/10 text-rose-200/60"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {REUNION_ACTIVITIES.filter(a => a.cat === selectedCat).map(a => (
            <button key={a.id} onClick={() => request(a)} className="w-full text-left bg-[#1a0a10]/60 border border-rose-400/10 rounded-xl p-4 hover:border-rose-400/30 transition">
              <div className="text-sm text-rose-100/90">{a.text}</div>
              {a.counts && <div className="text-[10px] text-rose-400 mt-1 uppercase tracking-wider">Counts toward the 10</div>}
            </button>
          ))}
        </div>

        <div className="mt-6 bg-[#1a0a10]/60 border border-rose-400/10 rounded-xl p-4">
          <div className="text-xs text-rose-200/60 mb-2">Or write your own:</div>
          <textarea value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Something specific..." className="w-full bg-transparent text-rose-100 text-sm placeholder:text-rose-200/30 focus:outline-none resize-none" rows="3" />
          <button disabled={!customText.trim()} onClick={() => request(null, customText.trim())} className="mt-2 px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs disabled:opacity-30">
            Send
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="pb-28 space-y-4">
      {picker}

      {/* Counter */}
      <div className="bg-gradient-to-br from-rose-950/40 to-[#1a0a10] border border-rose-400/15 rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-rose-300 mb-2">
          <Droplet className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">Ruined orgasms</span>
        </div>
        <div className="font-serif italic text-5xl text-rose-100">{ruinedDone} <span className="text-rose-200/30">/ {ruinedGoal}</span></div>
        {role === "keyholder" && (
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            <button onClick={() => adjustRuined(-1)} className="px-3 py-1 rounded-lg bg-rose-400/10 text-rose-200/70 text-xs">−1</button>
            <button onClick={() => adjustRuined(1)} className="px-3 py-1 rounded-lg bg-rose-400/10 text-rose-200/70 text-xs">+1</button>
            <button onClick={resetRuined} className="px-3 py-1 rounded-lg bg-rose-400/10 text-rose-200/70 text-xs">Reset</button>
            <div className="w-full h-px bg-rose-400/10 my-1" />
            <span className="text-[10px] text-rose-200/40 uppercase tracking-wider w-full">Goal</span>
            {[5, 10, 15, 20].map(n => (
              <button
                key={n}
                onClick={async () => await update(d => ({ ...d, ruinedGoal: n }))}
                className={`px-3 py-1 rounded-lg text-xs transition ${ruinedGoal === n ? "bg-rose-500 text-white" : "bg-rose-400/10 text-rose-200/70"}`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
        <div className="mt-4 h-1.5 bg-rose-400/10 rounded-full overflow-hidden">
          <div className="h-full bg-rose-400 transition-all" style={{ width: `${Math.min(100, (ruinedDone / ruinedGoal) * 100)}%` }} />
        </div>
        {ruinedDone >= ruinedGoal && (
          <div className="mt-3 text-sm text-rose-200 font-serif italic">Ten reached. A full one is hers to grant when she chooses.</div>
        )}
      </div>

      {/* Accidents */}
      {pendingAccidents.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-400/20 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-300 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Accident — cleanup owed</span>
          </div>
          {pendingAccidents.map(a => (
            <div key={a.id} className="flex items-center justify-between mt-2 text-sm">
              <div className="text-amber-100/80 text-xs">Logged {new Date(a.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</div>
              {role === "kept" ? (
                <button onClick={() => cleanAccident(a.id)} className="px-3 py-1 rounded-lg bg-amber-400/20 text-amber-100 text-xs">I cleaned her up</button>
              ) : (
                <div className="text-xs text-amber-200/60 italic">Waiting on him</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pending for me */}
      {pendingForMe.length > 0 && (
        <div className="bg-[#1a0a10]/60 border border-rose-400/10 rounded-2xl p-5">
          <h3 className="text-rose-200/80 text-xs uppercase tracking-wider mb-3">
            {role === "keyholder" ? "He's asking for" : "She wants"}
          </h3>
          <div className="space-y-2">
            {pendingForMe.map(r => (
              <div key={r.id} className="bg-[#0d0508] rounded-xl p-3">
                <div className="text-xs text-rose-400 mb-1">{r.cat}{r.counts ? " · counts" : ""}</div>
                <div className="text-sm text-rose-100/90 mb-3">{r.text}</div>
                <div className="flex gap-2">
                  <button onClick={() => decide(r.id, "approved")} className="flex-1 py-1.5 rounded-lg bg-rose-500 text-white text-xs flex items-center justify-center gap-1"><Check className="w-3 h-3" />{role === "keyholder" ? "Yes" : "Got it"}</button>
                  {role === "keyholder" && (
                    <button onClick={() => decide(r.id, "declined")} className="flex-1 py-1.5 rounded-lg bg-rose-400/10 text-rose-200/70 text-xs flex items-center justify-center gap-1"><X className="w-3 h-3" />Not yet</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved, waiting to happen */}
      {approvedUnfinished.length > 0 && (
        <div className="bg-[#1a0a10]/60 border border-rose-400/10 rounded-2xl p-5">
          <h3 className="text-rose-200/80 text-xs uppercase tracking-wider mb-3">On the menu</h3>
          <div className="space-y-2">
            {approvedUnfinished.map(r => (
              <div key={r.id} className="bg-[#0d0508] rounded-xl p-3 flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-xs text-rose-400 mb-1">{r.cat}{r.counts ? " · counts" : ""}</div>
                  <div className="text-sm text-rose-100/90">{r.text}</div>
                </div>
                {role === "keyholder" && (
                  <button onClick={() => complete(r.id)} className="px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs whitespace-nowrap">Done</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setPicking(true)} className="py-4 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-sm font-medium flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />Request
        </button>
        <button onClick={logAccident} className="py-4 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-200 text-sm font-medium flex items-center justify-center gap-2 border border-amber-400/20">
          <AlertCircle className="w-4 h-4" />Accident
        </button>
      </div>

      {/* Pending from me */}
      {pendingFromMe.length > 0 && (
        <div className="bg-[#1a0a10]/40 border border-rose-400/5 rounded-2xl p-4">
          <h3 className="text-rose-200/50 text-xs uppercase tracking-wider mb-2">Waiting on {role === "keyholder" ? "him" : "her"}</h3>
          <div className="space-y-1.5">
            {pendingFromMe.map(r => (
              <div key={r.id} className="text-xs text-rose-200/60 italic">"{r.text}"</div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {completed.length > 0 && (
        <div className="bg-[#1a0a10]/40 border border-rose-400/5 rounded-2xl p-4">
          <h3 className="text-rose-200/50 text-xs uppercase tracking-wider mb-2">Recent</h3>
          <div className="space-y-2">
            {completed.map(r => (
              <div key={r.id} className="text-xs text-rose-200/60">
                <span className="text-rose-400/70">{r.cat}</span> · {r.text}
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => setShowIntro(true)} className="w-full py-3 text-xs text-rose-200/40 hover:text-rose-200/70">Re-read the intro</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  REWARDS
// ─────────────────────────────────────────────────────────────
function RewardsTab({ data, role, update }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState("");

  const claim = async (reward) => {
    if (data.points < reward.cost) return;
    await update((d) => ({ ...d, points: d.points - reward.cost, rewardClaims: [...d.rewardClaims, { id: uid(), name: reward.name, cost: reward.cost, at: new Date().toISOString() }] }));
  };
  const fulfill = async (claimId) => { await update((d) => ({ ...d, rewardClaims: d.rewardClaims.filter(c => c.id !== claimId) })); };
  const addReward = async () => {
    if (!newName.trim() || !newCost) return;
    await update((d) => ({ ...d, customRewards: [...d.customRewards, { id: uid(), name: newName.trim(), cost: parseInt(newCost, 10) }] }));
    setNewName(""); setNewCost(""); setAdding(false);
  };
  const removeReward = async (id) => { await update((d) => ({ ...d, customRewards: d.customRewards.filter(r => r.id !== id) })); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-rose-300" /><span className="serif text-2xl italic">{data.points}</span><span className="text-rose-200/60 text-sm">points available</span></div>
        {role === "keyholder" && <button onClick={() => setAdding(!adding)} className="text-xs px-3 py-1.5 rounded-full border border-rose-400/20 hover:bg-rose-400/10 transition flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>}
      </div>

      {adding && role === "keyholder" && (
        <div className="p-4 rounded-xl bg-black/30 border border-rose-400/20 space-y-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Reward name" className="w-full bg-rose-950/40 border border-rose-400/20 rounded-lg px-3 py-2 text-sm" />
          <input value={newCost} onChange={(e) => setNewCost(e.target.value)} type="number" placeholder="Cost in points" className="w-full bg-rose-950/40 border border-rose-400/20 rounded-lg px-3 py-2 text-sm" />
          <button onClick={addReward} className="w-full py-2 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-sm">Add reward</button>
        </div>
      )}

      {data.rewardClaims.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-rose-200/50 mb-2">{role === "keyholder" ? "To fulfill" : "Claimed & pending"}</div>
          <div className="space-y-2">
            {data.rewardClaims.map(c => (
              <div key={c.id} className="p-3 rounded-xl bg-rose-500/10 border border-rose-300/30 flex items-center justify-between gap-3">
                <div><div className="text-rose-50">{c.name}</div><div className="text-xs text-rose-200/50">Claimed {fmtTime(c.at)} · {c.cost} pts</div></div>
                {role === "keyholder" && <button onClick={() => fulfill(c.id)} className="px-3 py-1.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 text-xs">Mark sent</button>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-widest text-rose-200/50 mb-2">Shop</div>
        <div className="space-y-2">
          {data.customRewards.map(r => {
            const canAfford = data.points >= r.cost;
            return (
              <div key={r.id} className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${canAfford ? "bg-black/20 border-rose-400/20" : "bg-black/10 border-rose-400/5 opacity-60"}`}>
                <div className="min-w-0"><div className="text-rose-50">{r.name}</div><div className="text-xs text-rose-300">{r.cost} points</div></div>
                <div className="flex items-center gap-2">
                  {role === "kept" && <button onClick={() => claim(r)} disabled={!canAfford} className="px-3 py-1.5 rounded-full bg-rose-500/80 hover:bg-rose-500 disabled:bg-rose-500/20 disabled:cursor-not-allowed text-xs">Claim</button>}
                  {role === "keyholder" && <button onClick={() => removeReward(r.id)} className="p-1.5 rounded-lg hover:bg-rose-400/10 text-rose-200/50"><Trash2 className="w-3.5 h-3.5" /></button>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MESSAGES
// ─────────────────────────────────────────────────────────────
function MessagesTab({ data, role, update }) {
  const [text, setText] = useState("");
  const send = async () => {
    if (!text.trim()) return;
    await update((d) => ({ ...d, messages: [...d.messages, { id: uid(), text: text.trim(), from: role === "keyholder" ? "Her" : "Him", at: new Date().toISOString() }] }));
    setText("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
        {data.messages.length === 0 && <EmptyState text="No notes yet. Send the first." />}
        {data.messages.map(m => {
          const mine = (role === "keyholder" && m.from === "Her") || (role === "kept" && m.from === "Him");
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${mine ? "bg-rose-500/30 border border-rose-400/30 rounded-br-sm" : "bg-black/30 border border-rose-400/15 rounded-bl-sm"}`}>
                <div className="text-rose-50 leading-relaxed whitespace-pre-wrap">{m.text}</div>
                <div className="text-[10px] text-rose-200/40 mt-1">{m.from} · {fmtTime(m.at)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 pt-2 border-t border-rose-400/10">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="A little something…" rows={2} className="flex-1 bg-rose-950/30 border border-rose-400/20 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-rose-400/50" />
        <button onClick={send} disabled={!text.trim()} className="self-end p-3 rounded-xl bg-rose-500/80 hover:bg-rose-500 disabled:opacity-40 transition"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  SMALL
// ─────────────────────────────────────────────────────────────
function EmptyState({ text }) {
  return <div className="text-center py-10 text-rose-200/40 italic serif">{text}</div>;
}
function groupBy(arr, key) {
  return arr.reduce((acc, item) => { (acc[item[key]] = acc[item[key]] || []).push(item); return acc; }, {});
}

// ─────────────────────────────────────────────────────────────
//  GUIDE OVERLAY — added for deployable build
// ─────────────────────────────────────────────────────────────
function GuideOverlay({ data, role, update, onClose }) {
  const setup = data.setup || {};
  const setupPairs = SETUP_SECTIONS.flatMap(section =>
    section.qs.map(q => ({ section: section.title, ...q }))
  ).filter(q => setup[q.id] !== undefined || setup[q.id + "_other"]);

  const labelFor = (q, value) => {
    if (Array.isArray(value)) {
      return value.map(v => q.opts?.find(o => o.v === v)?.l || v).join(", ");
    }
    return q.opts?.find(o => o.v === value)?.l || String(value);
  };

  const nextIdeas = [];
  if (["love", "think", "curious"].includes(setup.ruined_like)) nextIdeas.push("Try one ruined orgasm and log it toward the full-release goal.");
  if (["yes", "curious"].includes(setup.tease_close)) nextIdeas.push("Bring him close once, stop, and leave him locked while you decide what happens next.");
  if (["yes", "curious", "later"].includes(setup.strap_cage)) nextIdeas.push("Plan a locked sex night with the strap-on over the cage so you still get him without giving him release.");
  if (["yes", "curious"].includes(setup.sleeve)) nextIdeas.push("Use the sleeve as a way for him to give you more while his orgasm stays yours to decide.");
  if (["yes", "curious"].includes(setup.cleanup)) nextIdeas.push("Keep the accident rule clear: if he finishes in you when he was not supposed to, he takes care of you with his mouth afterward.");
  if (setup.connected_by?.includes("service")) nextIdeas.push("Give him one useful service task before bed and make him report back.");
  if (setup.teasing_style?.includes("visual")) nextIdeas.push("Send one simple key photo today — no long explanation needed.");
  if (nextIdeas.length === 0) nextIdeas.push("Start simple: one sweet message, one key reminder, and one small thing for him to do for you.");

  return (
    <div className="fixed inset-0 z-40 bg-[#0d0508]/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-2xl mx-auto p-5 pt-8 pb-24">
        <div className="flex items-center justify-between mb-5">
          <button onClick={onClose} className="p-2 -ml-2 text-rose-200"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="font-serif italic text-2xl text-rose-100">Guide</h2>
          <button onClick={onClose} className="p-2 text-rose-200"><X className="w-5 h-5" /></button>
        </div>

        {data.setup?.complete && (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5 mb-5">
            <div className="text-xs uppercase tracking-widest text-rose-200/60 mb-3">Her answers</div>
            <div className="space-y-3">
              {setupPairs.length === 0 && <p className="text-sm text-rose-200/60">No setup answers found yet.</p>}
              {setupPairs.map(q => (
                <div key={q.id} className="border-b border-rose-400/10 pb-3 last:border-0 last:pb-0">
                  <div className="text-[10px] uppercase tracking-wider text-rose-300/60 mb-1">{q.section}</div>
                  <div className="text-sm text-rose-100/90 leading-snug">{q.q}</div>
                  <div className="text-sm text-rose-200/70 mt-1 italic">{labelFor(q, setup[q.id])}{setup[q.id + "_other"] ? ` · ${setup[q.id + "_other"]}` : ""}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.setup?.complete && (
          <div className="rounded-2xl border border-rose-400/20 bg-black/20 p-5 mb-5">
            <div className="text-xs uppercase tracking-widest text-rose-200/60 mb-3">Things to try next</div>
            <div className="space-y-2">
              {nextIdeas.map((idea, idx) => (
                <div key={idx} className="text-sm text-rose-100/85 leading-relaxed flex gap-2">
                  <span className="text-rose-400">•</span><span>{idea}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-rose-400/15 bg-black/20 p-5 mb-5">
          <div className="text-xs uppercase tracking-widest text-rose-200/60 mb-3">Why this works</div>
          <div className="space-y-3 text-sm text-rose-100/80 leading-relaxed">
            {INTRO_PARAGRAPHS.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-400/15 bg-black/20 p-5">
          <div className="text-xs uppercase tracking-widest text-rose-200/60 mb-3">Ideas to try together</div>
          <div className="space-y-3">
            {TRY_ACTIVITIES.slice(0, 10).map(item => (
              <div key={item.title} className="border-b border-rose-400/10 pb-3 last:border-0 last:pb-0">
                <div className="serif italic text-lg text-rose-100">{item.title}</div>
                <div className="text-sm text-rose-200/70 leading-relaxed mt-1">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
