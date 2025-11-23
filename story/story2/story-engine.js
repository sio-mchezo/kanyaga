// Story Engine - Handles story progression and choices
class StoryEngine {
    constructor(storyData) {
        this.storyData = storyData;
        this.currentScene = null;
        this.storyHistory = [];
        this.storyVariables = {}; // Store variables that persist through the story
    }

    // Start a new story
    startStory() {
        this.currentScene = this.storyData.start;
        this.storyHistory = [this.currentScene];
        this.storyVariables = {}; // Reset variables
        return this.getCurrentScene();
    }

    // Get the current scene data
    getCurrentScene() {
        return this.storyData.scenes[this.currentScene];
    }

    // Make a choice and progress the story
    makeChoice(choiceIndex) {
        const currentScene = this.getCurrentScene();
        
        if (currentScene.choices && currentScene.choices[choiceIndex]) {
            const choice = currentScene.choices[choiceIndex];
            this.storyHistory.push(choice.nextScene);
            this.currentScene = choice.nextScene;
            
            return this.getCurrentScene();
        }
        
        return null;
    }

    // Set a story variable that persists
    setVariable(name, value) {
        this.storyVariables[name] = value;
    }

    // Get a story variable
    getVariable(name) {
        return this.storyVariables[name];
    }

    // Get all current variables including scene-specific ones
    getAllVariables(currentSceneData) {
        const allVariables = {...this.storyVariables};
        
        // Add scene-specific variables
        if (currentSceneData.variables) {
            Object.keys(currentSceneData.variables).forEach(key => {
                if (!allVariables[key]) { // Don't override existing variables
                    const options = currentSceneData.variables[key];
                    allVariables[key] = options[Math.floor(Math.random() * options.length)];
                }
            });
        }
        
        return allVariables;
    }

    // Check if the current scene is an ending
    isEnding() {
        const scene = this.getCurrentScene();
        return !scene.choices || scene.choices.length === 0;
    }

    // Get story history
    getHistory() {
        return this.storyHistory;
    }
}