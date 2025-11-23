// Michael Rosen style stories dictionary
const rosenDictionary = {
    "origin": [
        "#opening# #characterIntro# #actionSequence# #sillyOutcome# #reaction#",
        "#opening# #characterIntro# #crazyIdea# #actionSequence# #consequence# #reaction#",
        "#opening# #characterIntro# #everydayThing# #exaggeration# #reaction#"
    ],
    "opening": [
        "One day,",
        "It was a Tuesday,",
        "In the middle of the afternoon,",
        "Suddenly,",
        "You'll never guess what happened."
    ],
    "characterIntro": [
        "this #adjective# #person# called #name#",
        "my #relative# #name#",
        "a #adjective# #person# named #name#",
        "#name#, who was feeling particularly #mood#"
    ],
    "person": ["boy", "girl", "person", "child", "grown-up", "baby"],
    "adjective": ["curious", "bouncy", "wobbly", "squeaky", "fidgety", "noisy", "quiet", "peculiar"],
    "name": ["Ben", "Lisa", "Mr. Hoppy", "Emily", "Charlie", "Sophie", "Grandad"],
    "relative": ["cousin", "uncle", "aunt", "grandma", "grandpa", "brother", "sister"],
    "mood": ["silly", "serious", "hungry", "sleepy", "bouncy", "curious"],
    "crazyIdea": [
        "got this idea in #possessive# head: 'What if I #crazyAction#?'",
        "decided to try something different. 'I know!' #pronoun# said, 'I'll #crazyAction#!'",
        "thought, 'This is boring. I need to #crazyAction#!'"
    ],
    "everydayThing": [
        "was eating #food#",
        "was putting on #clothing#",
        "was walking to #place#",
        "was playing with #toy#"
    ],
    "actionSequence": [
        "So #pronoun# #movement# #direction# the #location# #manner#.",
        "First #pronoun# #movement#. Then #pronoun# #movement#. Then #pronoun# #movement# #manner#.",
        "#pronoun# started to #movement#. #pronoun# #movement# and #pronoun# #movement#. #pronoun# couldn't stop #movement#!"
    ],
    "exaggeration": [
        "and before you could say '#sillyPhrase#', the whole #thing# turned into #sillyTransformation#!",
        "and suddenly, everything went all #sillyAdjective# and #sillyAdjective#!",
        "and then... POP! The #thing# went '#soundEffect#' and started #sillyAction#!"
    ],
    "sillyOutcome": [
        "And do you know what happened? The #thing# started #sillyAction#!",
        "Suddenly, all the #things# began #sillyAction#!",
        "Then something amazing happened - the #thing# went '#soundEffect#' and turned into #sillyTransformation#!"
    ],
    "consequence": [
        "Which meant that now #pronoun# had to #consequenceAction#.",
        "So then #pronoun# had to #consequenceAction#.",
        "And that's how #name# ended up #consequenceAction#."
    ],
    "reaction": [
        "#name# looked at it and went '#exclamation#!'",
        "Everyone stopped and stared. '#exclamation#!' they all shouted.",
        "#name# just smiled and said, '#sillyComment#'",
        "#relative# came in and said, '#adultComment#' and #name# said '#childResponse#'"
    ],
    "pronoun": ["he", "she", "they"],
    "possessive": ["his", "her", "their"],
    "crazyAction": [
        "put my pants on my head",
        "eat spaghetti with my toes",
        "talk to the goldfish",
        "wear wellies on my hands",
        "brush my teeth with jam",
        "use a banana as a telephone"
    ],
    "food": ["toast", "spaghetti", "jelly", "soup", "a biscuit", "an apple", "cornflakes"],
    "clothing": ["socks", "a hat", "shoes", "gloves", "a scarf", "pyjamas"],
    "toy": ["a ball", "building blocks", "a teddy bear", "a toy car", "a doll"],
    "place": ["the shops", "school", "the park", "the kitchen", "the garden"],
    "movement": ["jumped", "skipped", "hopped", "ran", "crawled", "danced", "wiggled", "bounced", "twirled"],
    "direction": ["around", "through", "over", "under", "across", "into"],
    "location": ["room", "garden", "kitchen", "stairs", "table", "chair"],
    "manner": [
        "like a wibbly-wobbly jelly",
        "as fast as a speeding rocket",
        "like a floppy spaghetti",
        "as quiet as a sleeping mouse",
        "like a bouncing ball"
    ],
    "sillyPhrase": [
        "banana pants",
        "wibble wobble",
        "flibberty gibbet",
        "oodles of noodles"
    ],
    "thing": ["ceiling", "floor", "door", "window", "sofa", "carpet", "television"],
    "things": ["chairs", "tables", "cushions", "shoes", "books", "plates"],
    "sillyAction": [
        "singing opera",
        "dancing the tango",
        "telling jokes",
        "growing feathers",
        "floating in the air",
        "turning purple"
    ],
    "sillyTransformation": [
        "a giant marshmallow",
        "a squishy pillow",
        "a bouncy castle",
        "a wobbly jelly",
        "a rubber chicken"
    ],
    "sillyAdjective": ["wobbly", "squishy", "bouncy", "fizzy", "wiggly", "floppy"],
    "soundEffect": ["boing", "pop", "squelch", "wobble", "fizz", "plop"],
    "consequenceAction": [
        "clean up the mess with a teaspoon",
        "explain everything to the cat",
        "wear a colander on their head for the rest of the day",
        "eat their words with a spoonful of jam"
    ],
    "exclamation": [
        "Blimey O'Riley",
        "Goodness gracious me",
        "Well I never",
        "Flippin' heck",
        "Crikey",
        "Whoops-a-daisy"
    ],
    "sillyComment": [
        "Well, that was unexpected!",
        "I meant to do that!",
        "Does this happen to everyone?",
        "I think I'll do that again tomorrow!"
    ],
    "adultComment": [
        "What in the world is going on here?",
        "Have you been at the sherbet again?",
        "I leave you for five minutes...",
        "Did the furniture start dancing or is it just me?"
    ],
    "childResponse": [
        "It wasn't me, it was the goldfish!",
        "The sofa started it!",
        "I was just sitting here being good!",
        "It's magic, I think!"
    ],
    "adventure": [
    "#name# went on a #adjective# adventure that involved #actionSequence#.",
    "What an adventure! #name# found themselves #nonsenseSituation#."
    ],
    "problem": [
        "But oh dear! There was a problem: #obstacle#!",
        "Suddenly, something went wrong: #problemDescription#!"
    ],
    "solution": [
        "So #name# decided to #solutionAction# and it worked!",
        "#name# had a brilliant idea: #pronoun# would #solutionAction#!"
    ],
    "resolution": [
        "And everything turned out #sillyAdjective# in the end!",
        "So it was all sorted out, in a #sillyAdjective# kind of way."
    ]
};
