// Core story generation logic
class StoryGenerator {
    constructor() {
        this.grammar = null;
    }

    // Load a specific dictionary
    loadDictionary(dictionary) {
        this.grammar = dictionary;
    }

    // Expand a symbol in the grammar with fallback
    expand(symbol, depth = 0) {
        if (!this.grammar) {
            throw new Error('No dictionary loaded');
        }

        // Prevent infinite recursion
        if (depth > 10) {
            return "[...]";
        }

        const options = this.grammar[symbol];
        if (!options) {
            // Try to find a fallback symbol
            return this.getFallbackContent(symbol, depth);
        }
        
        const choice = options[Math.floor(Math.random() * options.length)];
        
        // Replace any nested symbols in the choice
        return choice.replace(/#(\w+)#/g, (match, symbol) => {
            return this.expand(symbol, depth + 1);
        });
    }

    // Get fallback content when a symbol doesn't exist
    getFallbackContent(symbol, depth = 0) {
        const fallbacks = {
            'adventure': ['had an exciting adventure', 'went on a journey', 'discovered something amazing'],
            'problem': ['faced a challenge', 'encountered a problem', 'found something tricky'],
            'solution': ['found a clever solution', 'figured it out', 'solved the problem'],
            'journey': ['traveled far away', 'went on a trip', 'explored new places'],
            'encounter': ['met someone interesting', 'found a new friend', 'discovered something unexpected'],
            'discovery': ['made a discovery', 'found something special', 'learned something new'],
            'challenge': ['faced a difficult task', 'overcame an obstacle', 'dealt with a challenge'],
            'quest': ['went on a quest', 'searched for something important', 'embarked on a mission'],
            'victory': ['succeeded in the end', 'achieved their goal', 'won the day'],
            'crazyIdea': ['had a wild idea', 'thought of something crazy', 'came up with a plan'],
            'actionSequence': ['did something amazing', 'took action', 'made things happen'],
            'consequence': ['something unexpected happened', 'there were consequences', 'things changed'],
            'resolution': ['everything worked out', 'the problem was solved', 'peace was restored'],
            'lesson': ['learned an important lesson', 'gained wisdom', 'understood something valuable'],
            'reaction': ['everyone was amazed', 'people cheered', 'there was great excitement']
        };

        if (fallbacks[symbol]) {
            return fallbacks[symbol][Math.floor(Math.random() * fallbacks[symbol].length)];
        }
        
        // Generic fallback - try to use any available symbol
        if (this.grammar) {
            const availableSymbols = Object.keys(this.grammar);
            if (availableSymbols.length > 0) {
                const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
                return this.expand(randomSymbol, depth + 1);
            }
        }
        
        return "";
    }

    // Generate a story
    generateStory() {
        if (!this.grammar) {
            throw new Error('No dictionary loaded');
        }
        return this.expand("origin");
    }
}