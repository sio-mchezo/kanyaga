// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    const storyGen = new StoryGenerator();
    
    // Available dictionaries
    const dictionaries = {
        'bedtime': bedtimeDictionary,
        'adventure': adventureDictionary,
        'space': spaceDictionary,
        'rosen': rosenDictionary,
        'milligan': milliganDictionary,
        'python': pythonDictionary
    };
    
    // Load default dictionary
    storyGen.loadDictionary(dictionaries.bedtime);
    generateNewStory();
    
    // Event listeners
    // document.getElementById('generate').addEventListener('click', generateNewStory);
    
    // Dictionary button listeners
    const dictButtons = document.querySelectorAll('.dict-btn');
    dictButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            dictButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Load selected dictionary
            const selectedDict = this.getAttribute('data-dict');
            storyGen.loadDictionary(dictionaries[selectedDict]);
            generateNewStory();
        });
    });
    
    function generateNewStory() {
        try {
            const story = storyGen.generateStory();
            document.getElementById('story-content').textContent = story;
        } catch (error) {
            console.error('Error generating story:', error);
            document.getElementById('story-content').textContent = 'Error creating story. Please try again.';
        }
    }
});