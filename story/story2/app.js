// Main Application
class AdventureApp {
    constructor() {
        this.storyEngine = new StoryEngine(adventureData);
        this.playerName = "Adventurer"; // Default name
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startAdventure());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartAdventure());
        document.getElementById('save-name').addEventListener('click', () => this.savePlayerName());
        
        // Allow Enter key to save name
        document.getElementById('player-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.savePlayerName();
            }
        });
    }

    savePlayerName() {
        const nameInput = document.getElementById('player-name');
        const name = nameInput.value.trim();
        
        if (name) {
            this.playerName = name;
            document.getElementById('name-input-container').classList.add('hidden');
            document.getElementById('start-btn').classList.remove('hidden');
            document.getElementById('story-content').innerHTML = `<p>Hello ${this.playerName}! Click "Start New Adventure" to begin!</p>`;
        } else {
            alert("Please enter your name!");
        }
    }

    startAdventure() {
        this.storyEngine.startStory();
        // Set player name as a persistent variable
        this.storyEngine.setVariable('playerName', this.playerName);
        this.storyEngine.setVariable('friendName', this.getRandomFriendName());
        
        this.updateDisplay();
        
        // Show/hide appropriate buttons
        document.getElementById('start-btn').classList.add('hidden');
        document.getElementById('restart-btn').classList.remove('hidden');
        document.getElementById('name-input-container').classList.add('hidden');
    }

    restartAdventure() {
        document.getElementById('name-input-container').classList.remove('hidden');
        document.getElementById('start-btn').classList.add('hidden');
        document.getElementById('restart-btn').classList.add('hidden');
        document.getElementById('choices-container').classList.add('hidden');
        document.getElementById('story-content').innerHTML = `<p>Enter your name to start a new adventure!</p>`;
        
        // Reset name input
        document.getElementById('player-name').value = '';
        this.playerName = "Adventurer";
    }

    getRandomFriendName() {
        const names = ["Bobby", "Sally", "Mr. Wobble", "Professor Noodle", "Captain Sparkle", "Lily", "Tommy", "Ms. Twinkle"];
        return names[Math.floor(Math.random() * names.length)];
    }

    updateDisplay() {
        const currentScene = this.storyEngine.getCurrentScene();
        const storyContent = document.getElementById('story-content');
        const choicesContainer = document.getElementById('choices-container');
        
        // Get all variables (both persistent and scene-specific)
        const allVariables = this.storyEngine.getAllVariables(currentScene);
        
        // Update story text with variables
        let storyText = currentScene.text;
        storyText = this.replaceVariables(storyText, allVariables);
        
        // Format the text with line breaks
        storyText = storyText.replace(/\n/g, '<br>');
        
        storyContent.innerHTML = `<div class="story-part">${storyText}</div>`;
        
        // Update choices - only show if there are valid choices
        if (this.storyEngine.isEnding() || !currentScene.choices || currentScene.choices.length === 0) {
            choicesContainer.classList.add('hidden');
        } else {
            choicesContainer.classList.remove('hidden');
            this.displayChoices(currentScene.choices, allVariables);
        }
    }

    replaceVariables(text, variables) {
        return text.replace(/#(\w+)#/g, (match, variableName) => {
            if (variables[variableName]) {
                return variables[variableName];
            }
            
            // Fallback for common variables
            const fallbacks = {
                'everydayThing': 'favourite teddy bear',
                'friendName': 'Bobby',
                'foodItems': 'eggs and bacon',
                'magicalItem': 'Giggle Stone',
                'location': 'the Whispering Woods',
                'obstacle': 'Grumble Giants',
                'foodBehavior': 'dancing the cha-cha',
                'specialDay': 'Wibbly Wednesday',
                'playerName': this.playerName
            };
            
            return fallbacks[variableName] || `something amazing`;
        });
    }

    displayChoices(choices, variables) {
        const choicesContainer = document.getElementById('choices-container');
        choicesContainer.innerHTML = '';
        
        // Only display choices that lead to valid scenes
        const validChoices = choices.filter(choice => 
            adventureData.scenes[choice.nextScene]
        );
        
        if (validChoices.length === 0) {
            choicesContainer.classList.add('hidden');
            return;
        }
        
        validChoices.forEach((choice, index) => {
            const originalIndex = choices.indexOf(choice);
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', () => this.makeChoice(originalIndex));
            choicesContainer.appendChild(button);
        });
    }

    makeChoice(choiceIndex) {
        this.storyEngine.makeChoice(choiceIndex);
        this.updateDisplay();
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdventureApp();
});