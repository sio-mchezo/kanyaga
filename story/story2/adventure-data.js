// Adventure Story Data - Expanded choose your own adventure
const adventureData = {
    start: "wakeUp",
    
    scenes: {
        "wakeUp": {
            text: "One sunny morning, #playerName# wakes up feeling particularly #mood#. As you stretch and yawn, you notice something strange: your #everydayThing# is #unexpectedBehavior#! What do you do?",
            choices: [
                { text: "Investigate", nextScene: "investigateThing" },
                { text: "Make breakfast", nextScene: "kitchenAdventure" },
                { text: "Call for help", nextScene: "friendHelp" }
            ],
            variables: {
                mood: ["silly", "curious", "bouncy", "sleepy", "adventurous"],
                everydayThing: ["favourite teddy bear", "alarm clock", "slippers", "bedside lamp", "window"],
                unexpectedBehavior: ["singing opera", "floating in the air", "changing colors", "telling jokes", "dancing the tango"]
            }
        },
        
        "investigateThing": {
            text: "#playerName# leans in close to examine the #everydayThing#. Suddenly, it speaks! 'Hello!' it says in a #voiceType# voice. 'I've been waiting for you to wake up! We have an adventure to go on!'",
            choices: [
                { text: "Ask about adventure", nextScene: "magicalQuest" },
                { text: "Check if dreaming", nextScene: "dreamCheck" },
                { text: "Tell family", nextScene: "familyReaction" }
            ],
            variables: {
                voiceType: ["squeaky", "deep and mysterious", "musical", "whispery", "booming"]
            }
        },
        
        "kitchenAdventure": {
            text: "#playerName# heads to the kitchen, trying to ignore the strange #everydayThing#. But when you open the fridge, something amazing happens! All the #foodItems# start #foodBehavior#! The milk carton winks at you and says, '#fridgeComment#'",
            choices: [
                { text: "Join party", nextScene: "foodParty" },
                { text: "Back away", nextScene: "escapeKitchen" },
                { text: "Ask questions", nextScene: "foodExplanation" }
            ],
            variables: {
                foodItems: ["eggs and bacon", "yogurt pots", "juice boxes", "vegetables", "leftover pizza"],
                foodBehavior: ["dancing the cha-cha", "singing show tunes", "juggling themselves", "forming a conga line"],
                fridgeComment: ["Party time!", "About time you showed up!", "The butter's been waiting!", "Don't just stand there, dance!"]
            }
        },
        
        "friendHelp": {
            text: "#friendName# arrives within minutes, wearing #sillyClothing# and carrying a #strangeObject#. 'I knew today would be special!' #pronoun# says. 'My #pet# predicted it would be a #adjective# day!'",
            choices: [
                { text: "Ask prediction", nextScene: "petPrediction" },
                { text: "Show discovery", nextScene: "friendInvestigation" },
                { text: "Go outside", nextScene: "outsideAdventure" }
            ],
            variables: {
                sillyClothing: ["a hat made of spaghetti", "mismatched wellies", "a cape made of tea towels", "gloves on feet"],
                strangeObject: ["a talking compass", "a map of nowhere", "a jar of moonlight", "a philosophical sandwich"],
                pet: ["goldfish", "hamster", "pet rock", "imaginary dragon"],
                adjective: ["wibbly", "splendiferous", "absolutely bonkers", "magnificently odd"],
                pronoun: ["he", "she", "they"]
            }
        },
        
        "magicalQuest": {
            text: "'We must find the #magicalItem#!' explains the #everydayThing#. 'It's hidden somewhere in #location# and we need it to #importantTask#. But beware - the #obstacle# might try to stop us!'",
            choices: [
                { text: "Agree to help", nextScene: "questBegin" },
                { text: "Ask consequences", nextScene: "refusalConsequences" },
                { text: "Bring friend", nextScene: "friendJoinsQuest" },
                { text: "Refuse", nextScene: "normalizationAttempt" }
            ],
            variables: {
                magicalItem: ["Giggle Stone", "Chocolate Fountain of Truth", "Dancing Sceptre", "Invisible Crown"],
                location: ["the Whispering Woods", "the Garden of Dreams", "the Cloud Castle", "the Understairs Kingdom"],
                importantTask: ["restore laughter to the world", "make breakfast taste better forever", "teach grumpy people to smile", "invent a new color"],
                obstacle: ["Grumble Giants", "Serious Squirrels", "Frown Frogs", "Boring Bunnies"]
            }
        },
        
        "dreamCheck": {
            text: "#playerName# pinches yourself, but nothing happens. The #everydayThing# giggles. 'This is no dream!' it says. 'It's a #specialDay#! Everything is #worldState# today! Look out the window!' You peer outside and see #outsideSight#!",
            choices: [
                { text: "Explore outside", nextScene: "gardenAdventure" },
                { text: "Demand explanation", nextScene: "fullExplanation" },
                { text: "Try to normalize", nextScene: "normalizationAttempt" }
            ],
            variables: {
                specialDay: ["Wibbly Wednesday", "Funtastic Friday", "Magical Monday", "Silly Saturday"],
                worldState: ["alive with magic", "turned upside down", "extra sparkly", "completely bonkers"],
                outsideSight: ["trees doing gymnastics", "clouds forming shapes of animals", "rainbows coming from the ground", "the sun wearing sunglasses"]
            }
        },
        
        "foodParty": {
            text: "#playerName# joins the dancing #foodItems# in the kitchen. The toast is breakdancing, the eggs are doing the tango, and the orange juice is flowing in rhythm! Suddenly, the kitchen door swings open and #surpriseCharacter# appears!",
            choices: [
                { text: "Invite them", nextScene: "biggerParty" },
                { text: "Hide", nextScene: "hidingSpot" },
                { text: "Explain", nextScene: "explanationTime" }
            ],
            variables: {
                surpriseCharacter: ["your next-door neighbour", "the postman", "a confused cat", "a marching band"]
            }
        },
        
        "questBegin": {
            text: "Your quest begins! The #everydayThing# leads #playerName# to #startingPoint#. 'First,' it says, 'we need to #firstTask#. But watch out for #danger#!' As you proceed, you encounter #questEncounter#.",
            choices: [
                { text: "Be brave", nextScene: "successfulQuest" },
                { text: "Be clever", nextScene: "cleverSuccess" },
                { text: "Find another way", nextScene: "alternativeSuccess" },
                { text: "Go back", nextScene: "normalizationAttempt" }
            ],
            variables: {
                startingPoint: ["the edge of the magical forest", "the bottom of the garden", "under your bed", "behind the sofa"],
                firstTask: ["cross the River of Silly Questions", "get past the Talking Flowers", "solve the Riddle of the Grumpy Gnome", "find the Key of Giggles"],
                danger: ["ticklish traps", "silly spells", "confusing corridors", "dancing obstacles"],
                questEncounter: ["a hedgehog wearing a top hat", "a sign that changes what it says", "a path that moves when you're not looking", "a friendly ghost who tells bad jokes"]
            }
        },

        "familyReaction": {
            text: "#playerName# runs downstairs and finds your family already in the kitchen. 'Good morning!' says your mom. 'Isn't it wonderful? The #everydayThing# told us you'd be joining the adventure today!' Your dad is currently #parentActivity# while your sibling is #siblingActivity#.",
            choices: [
                { text: "Ask what's happening", nextScene: "familyAdventure" },
                { text: "Join fun", nextScene: "familyParty" },
                { text: "Go back", nextScene: "investigateThing" },
                { text: "Normalize", nextScene: "normalizationAttempt" }
            ],
            variables: {
                parentActivity: ["practicing ballet with the broom", "having a tea party with the salt shaker", "teaching the toaster to sing", "playing chess with the cereal boxes"],
                siblingActivity: ["building a fort out of cushions", "teaching the dog to speak French", "painting rainbows on the windows", "organizing a parade of toys"]
            }
        },

        "escapeKitchen": {
            text: "#playerName# slowly backs away from the dancing #foodItems# and tiptoes out of the kitchen. But when you reach the living room, you discover that the #furniture# is also #furnitureBehavior#! The sofa waves at you with a cushion and says '#sofaGreeting#'",
            choices: [
                { text: "Accept reality", nextScene: "livingRoomParty" },
                { text: "Hide in room", nextScene: "bedroomDiscovery" },
                { text: "Find normal room", nextScene: "searchForNormal" },
                { text: "Try to fix", nextScene: "normalizationAttempt" }
            ],
            variables: {
                furniture: ["armchairs", "bookshelves", "coffee table", "television"],
                furnitureBehavior: ["having a polite conversation", "playing musical chairs", "doing morning exercises", "reciting poetry"],
                sofaGreeting: ["Do come join us, dear!", "Lovely weather for levitating!", "We were just discussing philosophy!", "Care for a spot of dancing?"]
            }
        },

        "normalizationAttempt": {
            text: "#playerName# decides enough is enough! You take a deep breath and try to make everything normal again. You #normalizationAction#. To your surprise, it actually works! The #everydayThing# stops #unexpectedBehavior# and everything slowly returns to normal.",
            choices: [
                { text: "Enjoy normalcy", nextScene: "normalLife" },
                { text: "Miss the magic", nextScene: "magicWithdrawal" },
                { text: "Try to restore magic", nextScene: "restoreMagic" }
            ],
            variables: {
                normalizationAction: ["close your eyes and count to ten", "say the magic word 'normal' three times", "spin around in a circle", "tap your heels together"],
                unexpectedBehavior: ["singing opera", "floating", "changing colors", "telling jokes", "dancing"]
            }
        },

        "restoreMagic": {
            text: "#playerName# realizes you miss the magic! You try to bring it back by #restorationAttempt#. Amazingly, the magic returns even stronger than before! The #everydayThing# cheers and everything becomes wonderfully strange again.",
            choices: [
                { text: "Celebrate", nextScene: "eternalParty" },
                { text: "Go on quest", nextScene: "magicalQuest" },
                { text: "Have food party", nextScene: "foodParty" }
            ],
            variables: {
                restorationAttempt: ["doing a silly dance", "telling your best joke", "singing a happy song", "imagining the most wonderful thing you can"]
            }
        },

        // Intermediate scenes that lead to endings
        "familyAdventure": {
            text: "Your family explains that today is #specialDay# and magic is everywhere! They've been waiting for you to wake up so you can all have adventures together. Your mom hands you a #familyItem# and says, 'Let the family fun begin!'",
            choices: [
                { text: "Start adventure", nextScene: "familyFunEnding" },
                { text: "Have breakfast", nextScene: "foodFriends" }
            ],
            variables: {
                specialDay: ["Family Fun Day", "Magical Monday", "Wonderful Wednesday"],
                familyItem: ["magical map", "talking compass", "family adventure book"]
            }
        },

        "familyParty": {
            text: "You join your family's magical morning! Your dad teaches you how to #familyActivity# while your sibling shows you how to #siblingMagic#. The whole house is filled with laughter and wonder!",
            choices: [
                { text: "Continue the fun", nextScene: "eternalParty" },
                { text: "Make it special", nextScene: "familyFunEnding" }
            ],
            variables: {
                familyActivity: ["dance with the furniture", "sing with the appliances", "play hide and seek with shadows"],
                siblingMagic: ["make rainbows appear", "talk to the family pet", "float small objects"]
            }
        },

        "livingRoomParty": {
            text: "You join the living room party! The #furniture# teaches you how to #furnitureDance# and soon you're having the best time. The radio starts playing your favorite songs and everyone dances together!",
            choices: [
                { text: "Keep dancing", nextScene: "eternalParty" },
                { text: "Invite others", nextScene: "biggerParty" }
            ],
            variables: {
                furnitureDance: ["the bookshelf boogie", "the sofa shuffle", "the armchair aerobics"]
            }
        },

        "biggerParty": {
            text: "The party grows! Soon the whole neighborhood joins in. People are dancing in the streets, animals are singing, and even the weather is joining the fun! It's the biggest, happiest party anyone has ever seen!",
            choices: [
                { text: "Celebrate forever", nextScene: "eternalParty" }
            ],
            variables: {}
        },

        // ENDINGS - No choices, just THE END
        "successfulQuest": {
            text: "🎉 SUCCESS! #playerName# found the #magicalItem#! As you hold it, everything becomes even more wonderful. Colors are brighter, laughter comes easier, and even the grumpiest people start smiling. The #everydayThing# gives you a happy nod. 'You did it! Now every day will be a little bit magical!' And indeed, from that day on, #playerName#'s life was filled with wonderful, silly adventures.\n\n🏁 THE END",
            choices: []
        },
        
        "cleverSuccess": {
            text: "🎉 CLEVER VICTORY! Using your wits, #playerName# outsmarted the #obstacle# and found the #magicalItem#! The world becomes a place where clever ideas solve problems and laughter fills the air. You've proven that brains can be just as powerful as magic!\n\n🏁 THE END",
            choices: []
        },
        
        "alternativeSuccess": {
            text: "🎉 CREATIVE TRIUMPH! #playerName# found an amazing alternative path and discovered the #magicalItem# in the most unexpected way! Your creative thinking has made the world more wonderful and shown that there's always more than one way to solve a problem.\n\n🏁 THE END",
            choices: []
        },
        
        "foodFriends": {
            text: "🎉 BREAKFAST BLISS! #playerName# and the food become best friends! The #foodItems# teach you their dance moves, and you have the best breakfast party ever. Your family joins in, and everyone agrees it's the most fun morning ever. #playerName# realizes that magic was in your kitchen all along!\n\n🏁 THE END",
            choices: []
        },
        
        "normalLife": {
            text: "🏠 BACK TO NORMAL! #playerName# manages to make everything return to normal. The #everydayThing# stops its strange behavior, the food stays in the fridge, and your friend #friendName# forgets the whole thing. Life goes back to ordinary... but sometimes, when you least expect it, #playerName# catches your teddy bear winking or hears the faint sound of dancing from the kitchen.\n\n🏁 THE END",
            choices: []
        },
        
        "eternalParty": {
            text: "🎊 ETERNAL CELEBRATION! The party grows and grows! Soon the whole neighborhood is dancing, then the whole town! The news calls it 'The Day Everything Went Delightfully Daft.' #playerName# is declared Mayor of Merriment and every day is a celebration. The #everydayThing# becomes your chief advisor, and together you make sure nobody ever has a boring day again!\n\n🏁 THE END",
            choices: []
        },

        "magicWithdrawal": {
            text: "😔 QUIET REFLECTION! As everything returns to normal, #playerName# feels a strange emptiness. The silence is too quiet, the colors seem dull, and the world feels... ordinary. You sit on your bed, wondering if you made the right choice by removing all the magic from your life.\n\n🏁 THE END",
            choices: []
        },

        "familyFunEnding": {
            text: "👨‍👩‍👧‍👦 FAMILY FUN FOREVER! #playerName# and your family have the most amazing day together! You discover that family adventures are the best kind of magic. From that day on, every weekend becomes Family Adventure Day, filled with laughter, discovery, and wonderful memories.\n\n🏁 THE END",
            choices: []
        },

        "bedroomDiscovery": {
            text: "🔍 SECRET DISCOVERY! While hiding in your room, #playerName# discovers a secret door you never noticed before! It leads to a magical world where you can visit anytime. You become the keeper of this wonderful secret, having amazing adventures whenever you want while keeping a normal life too!\n\n🏁 THE END",
            choices: []
        },

        "searchForNormal": {
            text: "🚪 THE LAST NORMAL PLACE! After searching everywhere, #playerName# finds one room that's still completely normal - the bathroom! You decide to keep this one normal place as your sanctuary while enjoying the magic everywhere else. It's the perfect balance between wonderful chaos and peaceful normalcy!\n\n🏁 THE END",
            choices: []
        }
    }
};