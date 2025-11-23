// Adventure Story Data - Yes/No choices only
const adventureData = {
    start: "wakeUp",
    
    scenes: {
        "wakeUp": {
            text: "One sunny morning, #playerName# wakes up feeling particularly #mood#. Your #everydayThing# is #unexpectedBehavior#! Do you investigate this strange occurrence?",
            yes: "investigateThing",
            no: "ignoreThing"
        },
        
        "investigateThing": {
            text: "You lean in close to examine the #everydayThing#. Suddenly, it speaks! 'Hello!' it says in a #voiceType# voice. 'I've been waiting for you! We have an adventure to go on!' Do you want to go on this adventure?",
            yes: "magicalQuest",
            no: "refuseAdventure"
        },
        
        "ignoreThing": {
            text: "You decide to ignore the strange #everydayThing# and head to the kitchen. But when you open the fridge, all the #foodItems# start #foodBehavior#! The milk carton says, '#fridgeComment#' Do you join the food party?",
            yes: "foodParty",
            no: "escapeKitchen"
        },
        
        "magicalQuest": {
            text: "'We must find the #magicalItem#!' explains the #everydayThing#. 'It's hidden in #location# and we need it to #importantTask#! But beware - the #obstacle# might try to stop us!' Do you bravely accept this quest?",
            yes: "questBegin",
            no: "questRefusal"
        },
        
        "refuseAdventure": {
            text: "'Oh...' says the #everydayThing#, looking disappointed. 'But what about #friendName#? They were counting on you to help with the #importantTask#!' Do you change your mind and help after all?",
            yes: "changeMind",
            no: "stayNormal"
        },
        
        "foodParty": {
            text: "You join the dancing #foodItems#! The toast is breakdancing and the eggs are doing the tango! Suddenly, #surpriseCharacter# appears at the kitchen door! Do you invite them to join the party?",
            yes: "biggerParty",
            no: "hideFromStranger"
        },
        
        "escapeKitchen": {
            text: "You back away from the dancing food and tiptoe out. But in the living room, the #furniture# is #furnitureBehavior#! The sofa says '#sofaGreeting#' Do you accept this strange new reality?",
            yes: "livingRoomParty",
            no: "tryToNormalize"
        },
        
        "questBegin": {
            text: "Your quest begins! The #everydayThing# leads you to #startingPoint#. 'First, we need to #firstTask#!' As you proceed, you encounter #questEncounter#. Do you face this challenge bravely?",
            yes: "braveSuccess",
            no: "cleverAlternative"
        },
        
        "questRefusal": {
            text: "You tell the #everydayThing# you don't want to go on a dangerous quest. It sighs. 'Well, maybe we could just have a small, safe adventure instead?' Do you agree to a safer adventure?",
            yes: "safeAdventure",
            no: "noAdventure"
        },
        
        "changeMind": {
            text: "You decide to help after all! The #everydayThing# cheers up immediately. 'Wonderful! Let's go find #friendName# and start our adventure!' Do you want to lead the way?",
            yes: "becomeLeader",
            no: "followAlong"
        },
        
        "stayNormal": {
            text: "You firmly tell the #everydayThing# that you want a normal day. It slowly stops #unexpectedBehavior# and everything returns to ordinary. Do you feel happy with this normal day?",
            yes: "contentNormal",
            no: "regretDecision"
        },
        
        "biggerParty": {
            text: "You invite #surpriseCharacter# to join! The party grows and soon the whole neighborhood is dancing in the streets! Do you want this celebration to last forever?",
            yes: "eternalParty",
            no: "temporaryFun"
        },
        
        "hideFromStranger": {
            text: "You hide from #surpriseCharacter#, but they find you anyway! 'Don't be shy!' they say. 'Everyone's talking about the magical day!' Do you come out of hiding?",
            yes: "joinCelebration",
            no: "keepHiding"
        },
        
        "livingRoomParty": {
            text: "You join the living room party! The #furniture# teaches you the #furnitureDance# and you're having an amazing time! Do you want to make this magical day last forever?",
            yes: "eternalParty",
            no: "enjoyMoment"
        },
        
        "tryToNormalize": {
            text: "You try to make everything normal again. You #normalizationAction#. Surprisingly, it starts working! Things are slowly returning to normal. Do you want to completely remove all the magic?",
            yes: "normalLife",
            no: "keepSomeMagic"
        },
        
        "braveSuccess": {
            text: "You face the challenge bravely and succeed! You find the #magicalItem#! The world becomes brighter and more wonderful. Do you want to share this magic with everyone?",
            yes: "shareMagic",
            no: "keepSecret"
        },
        
        "cleverAlternative": {
            text: "You find a clever alternative path and discover the #magicalItem# in a surprising way! Your creativity has made the world more wonderful. Do you want to use this magic for great things?",
            yes: "greatAdventures",
            no: "simpleJoy"
        },
        
        "safeAdventure": {
            text: "You agree to a safe adventure! The #everydayThing# takes you to see the #safeWonder#. It's beautiful and magical but completely safe. Do you want to have more safe adventures like this?",
            yes: "safeAdventureLife",
            no: "oneTimeWonder"
        },
        
        "noAdventure": {
            text: "You refuse any kind of adventure. The #everydayThing# sadly stops #unexpectedBehavior# and everything becomes ordinary again. Do you feel this was the right choice?",
            yes: "certainNormal",
            no: "magicRegret"
        },

        // ENDINGS
        "becomeLeader": {
            text: "🎯 LEADER OF FUN! #playerName# becomes the leader of wonderful adventures! You, #friendName#, and the #everydayThing# have amazing safe adventures every day, bringing joy to everyone you meet while staying completely safe.\n\n🏁 THE END",
        },
        
        "followAlong": {
            text: "🤝 TRUSTY COMPANION! #playerName# becomes the best adventure companion! You help #friendName# and the #everydayThing# have wonderful times, always there to support and enjoy the magic together.\n\n🏁 THE END",
        },
        
        "contentNormal": {
            text: "🏠 HAPPILY NORMAL! #playerName# enjoys a perfectly normal day and realizes that sometimes ordinary days can be wonderful too. You appreciate the simple things in life and find joy in everyday moments.\n\n🏁 THE END",
        },
        
        "regretDecision": {
            text: "😔 MISSED MAGIC! As the magic fades, #playerName# feels a growing regret. The ordinary world seems dull now that you've glimpsed the wonderful possibilities. You wonder what amazing adventures you missed.\n\n🏁 THE END",
        },
        
        "eternalParty": {
            text: "🎊 ETERNAL CELEBRATION! The magic lasts forever! #playerName# becomes the Mayor of Merriment, and every day is filled with dancing, laughter, and wonderful surprises. Life becomes an endless celebration!\n\n🏁 THE END",
        },
        
        "temporaryFun": {
            text: "⭐ MAGICAL MEMORY! #playerName# enjoys one amazing day of magic that becomes a cherished memory. Life returns to normal, but you always remember that one perfect day when everything was wonderfully strange.\n\n🏁 THE END",
        },
        
        "joinCelebration": {
            text: "🎉 COMMUNITY JOY! #playerName# joins the community celebration! You make new friends and discover that sharing magical moments with others makes them even more special. Your neighborhood becomes the happiest place!\n\n🏁 THE END",
        },
        
        "keepHiding": {
            text: "🚪 SOLITARY MAGIC! #playerName# stays hidden and enjoys the magic alone. You discover that sometimes the most wonderful experiences are the quiet, personal ones that you keep just for yourself.\n\n🏁 THE END",
        },
        
        "enjoyMoment": {
            text: "🌈 PERFECT MOMENT! #playerName# enjoys one perfect magical day without trying to make it last forever. You learn to appreciate wonderful moments as they happen, making them even more special.\n\n🏁 THE END",
        },
        
        "normalLife": {
            text: "🔄 BACK TO NORMAL! #playerName# successfully returns everything to normal. The #everydayThing# becomes ordinary again, and life continues as before. Sometimes you wonder about what might have been.\n\n🏁 THE END",
        },
        
        "keepSomeMagic": {
            text: "⚖️ BALANCED LIFE! #playerName# finds the perfect balance! You keep just enough magic to make life interesting while maintaining a normal routine. Some days are magical, some are ordinary - and both are wonderful!\n\n🏁 THE END",
        },
        
        "shareMagic": {
            text: "🌟 MAGICAL SHARING! #playerName# shares the magic with the whole world! You use the #magicalItem# to make everyone's life a little more wonderful. The world becomes a brighter, happier place because of you!\n\n🏁 THE END",
        },
        
        "keepSecret": {
            text: "🤫 SECRET WONDER! #playerName# keeps the magic as your special secret. You enjoy wonderful adventures whenever you want while the world stays normal. It's your personal magical world to explore!\n\n🏁 THE END",
        },
        
        "greatAdventures": {
            text: "🚀 EPIC JOURNEYS! #playerName# uses the magic for amazing adventures! You explore magical lands, meet incredible creatures, and have stories that will be told forever. Your life becomes the greatest adventure!\n\n🏁 THE END",
        },
        
        "simpleJoy": {
            text: "😊 HAPPY SIMPLICITY! #playerName# uses the magic for simple, everyday joy. You make flowers bloom brighter, food taste better, and laughter come easier. Life becomes wonderfully pleasant!\n\n🏁 THE END",
        },
        
        "safeAdventureLife": {
            text: "🛡️ SAFE WONDERS! #playerName# enjoys a lifetime of safe magical adventures! You discover beautiful places and meet friendly magical beings, always staying completely safe while having amazing experiences.\n\n🏁 THE END",
        },
        
        "oneTimeWonder": {
            text: "📸 SINGLE MAGIC MEMORY! #playerName# has one perfect safe adventure that becomes your most cherished memory. You return to normal life with one wonderful story that you'll treasure forever.\n\n🏁 THE END",
        },
        
        "certainNormal": {
            text: "✅ CONTENT ORDINARY! #playerName# is completely certain that normal life is best. You appreciate the predictability and comfort of ordinary days, finding deep satisfaction in the simple routine.\n\n🏁 THE END",
        },
        
        "magicRegret": {
            text: "💔 LASTING REGRET! #playerName# deeply regrets refusing the magic. As life continues normally, you can't stop thinking about the wonderful adventures you could have had. The memory of what you turned down stays with you.\n\n🏁 THE END",
        }
    }
};