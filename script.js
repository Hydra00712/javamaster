// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            
            // Create mobile nav if it doesn't exist
            if (!document.querySelector('.mobile-nav')) {
                const mobileNav = document.createElement('div');
                mobileNav.classList.add('mobile-nav');
                
                // Clone nav links and auth buttons for mobile
                const navLinksClone = navLinks.cloneNode(true);
                const authButtonsClone = authButtons.cloneNode(true);
                
                mobileNav.appendChild(navLinksClone);
                mobileNav.appendChild(authButtonsClone);
                
                document.querySelector('.navbar').appendChild(mobileNav);
            } else {
                const mobileNav = document.querySelector('.mobile-nav');
                mobileNav.classList.toggle('active');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Initialize interactive elements based on page
    initPageSpecificFunctions();
});

// Page specific initializations
function initPageSpecificFunctions() {
    // Initialize code playground if it exists
    initCodePlayground();
    
    // Initialize quizzes if they exist
    initQuizzes();
    
    // Initialize code copy functionality
    initCodeCopy();
}

// Code Playground Functionality
function initCodePlayground() {
    const playgroundContainer = document.querySelector('.playground-container');
    if (!playgroundContainer) return;
    
    const runButton = document.querySelector('.run-button');
    const resetButton = document.querySelector('.reset-button');
    const outputContainer = document.querySelector('.playground-output');
    const editor = document.querySelector('.playground-editor');
    
    // Sample initial code (this will be replaced with actual editors like CodeMirror or Monaco in a real implementation)
    if (editor) {
        const defaultCode = `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java Master!");
    }
}`;
        
        editor.textContent = defaultCode;
    }
    
    // Run code button
    if (runButton) {
        runButton.addEventListener('click', function() {
            if (outputContainer) {
                outputContainer.innerHTML = `<pre>Hello, Java Master!</pre>`;
                
                // Simulate code execution (in real implementation this would be an API call to a Java compiler service)
                setTimeout(() => {
                    outputContainer.classList.add('show-output');
                }, 300);
            }
        });
    }
    
    // Reset code button
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (editor) {
                editor.textContent = defaultCode;
            }
            if (outputContainer) {
                outputContainer.innerHTML = '';
                outputContainer.classList.remove('show-output');
            }
        });
    }
    
    // Playground tabs
    const tabs = document.querySelectorAll('.playground-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // In a real implementation, this would switch between different code editors/files
        });
    });
}

// Quiz Functionality
function initQuizzes() {
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;
    
    const quizOptions = document.querySelectorAll('.quiz-option');
    const nextButton = document.querySelector('.quiz-next');
    const submitButton = document.querySelector('.quiz-submit');
    const resultsContainer = document.querySelector('.quiz-results');
    
    // Track selected options
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Deselect siblings
            const parentQuestion = this.closest('.quiz-question');
            if (parentQuestion) {
                const siblingOptions = parentQuestion.querySelectorAll('.quiz-option');
                siblingOptions.forEach(sib => sib.classList.remove('selected'));
            }
            
            // Select this option
            this.classList.add('selected');
        });
    });
    
    // Next question button
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const currentQuestion = document.querySelector('.quiz-question.active');
            if (currentQuestion) {
                currentQuestion.classList.remove('active');
                const nextQuestion = currentQuestion.nextElementSibling;
                if (nextQuestion && nextQuestion.classList.contains('quiz-question')) {
                    nextQuestion.classList.add('active');
                    
                    // Show submit button on last question
                    if (!nextQuestion.nextElementSibling || !nextQuestion.nextElementSibling.classList.contains('quiz-question')) {
                        nextButton.style.display = 'none';
                        if (submitButton) {
                            submitButton.style.display = 'block';
                        }
                    }
                }
            }
        });
    }
    
    // Submit quiz button
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            // Calculate score
            const totalQuestions = document.querySelectorAll('.quiz-question').length;
            let correctAnswers = 0;
            
            // Check answers (in a real implementation, this would compare against correct answers from a database)
            document.querySelectorAll('.quiz-question').forEach(question => {
                const selectedOption = question.querySelector('.quiz-option.selected');
                if (selectedOption && selectedOption.dataset.correct === 'true') {
                    correctAnswers++;
                    selectedOption.classList.add('correct');
                } else if (selectedOption) {
                    selectedOption.classList.add('incorrect');
                    
                    // Highlight the correct answer
                    const correctOption = question.querySelector('.quiz-option[data-correct="true"]');
                    if (correctOption) {
                        correctOption.classList.add('correct');
                    }
                }
            });
            
            // Display results
            if (resultsContainer) {
                resultsContainer.innerHTML = `
                    <div class="quiz-score">
                        Your score: <span>${correctAnswers}/${totalQuestions}</span> (${Math.round((correctAnswers/totalQuestions) * 100)}%)
                    </div>
                    <p>${getScoreFeedback(correctAnswers/totalQuestions)}</p>
                    <button class="btn-primary quiz-retry">Try Again</button>
                `;
                
                resultsContainer.style.display = 'block';
                
                // Retry button
                const retryButton = resultsContainer.querySelector('.quiz-retry');
                if (retryButton) {
                    retryButton.addEventListener('click', resetQuiz);
                }
            }
            
            // Hide submit button
            submitButton.style.display = 'none';
        });
    }
    
    // Initialize first question as active
    const firstQuestion = document.querySelector('.quiz-question');
    if (firstQuestion) {
        firstQuestion.classList.add('active');
    }
}

// Reset quiz for retry
function resetQuiz() {
    // Hide results
    const resultsContainer = document.querySelector('.quiz-results');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
    
    // Clear all selections and feedback classes
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Reset to first question
    document.querySelectorAll('.quiz-question').forEach((question, index) => {
        question.classList.remove('active');
        if (index === 0) {
            question.classList.add('active');
        }
    });
    
    // Show next button, hide submit button
    const nextButton = document.querySelector('.quiz-next');
    const submitButton = document.querySelector('.quiz-submit');
    
    if (nextButton) {
        nextButton.style.display = 'block';
    }
    
    if (submitButton) {
        submitButton.style.display = 'none';
    }
}

// Generate feedback based on score percentage
function getScoreFeedback(scorePercentage) {
    if (scorePercentage === 1) {
        return "Perfect! You've mastered this topic!";
    } else if (scorePercentage >= 0.8) {
        return "Great job! You have a strong understanding of this topic.";
    } else if (scorePercentage >= 0.6) {
        return "Good work! You're on the right track but might want to review some concepts.";
    } else if (scorePercentage >= 0.4) {
        return "You're making progress! Consider revisiting this lesson to strengthen your knowledge.";
    } else {
        return "Don't worry! Java takes practice. Let's review this topic again.";
    }
}

// Code Copy Functionality
function initCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeSnippet = this.closest('.code-snippet');
            if (codeSnippet) {
                const code = codeSnippet.querySelector('pre').textContent;
                
                // Copy to clipboard
                navigator.clipboard.writeText(code).then(() => {
                    // Success feedback
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.style.backgroundColor = '#4caf50';
                    this.style.color = 'white';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.backgroundColor = '';
                        this.style.color = '';
                    }, 2000);
                });
            }
        });
    });
}

// Track lesson progress (for learning tracks)
function trackProgress(lessonId, courseId) {
    // In a real implementation, this would store progress in localStorage or send to a server
    const progressKey = `course_${courseId}_progress`;
    
    let courseProgress = JSON.parse(localStorage.getItem(progressKey)) || {
        completedLessons: [],
        totalLessons: 0,
        lastAccessedLesson: null
    };
    
    // Add this lesson to completed lessons if not already there
    if (!courseProgress.completedLessons.includes(lessonId)) {
        courseProgress.completedLessons.push(lessonId);
    }
    
    courseProgress.lastAccessedLesson = lessonId;
    
    // Save updated progress
    localStorage.setItem(progressKey, JSON.stringify(courseProgress));
    
    // Update progress UI
    updateProgressUI(courseId);
}

// Update progress bar and related UI elements
function updateProgressUI(courseId) {
    const progressBar = document.querySelector('.progress-fill');
    if (!progressBar) return;
    
    const progressKey = `course_${courseId}_progress`;
    const courseProgress = JSON.parse(localStorage.getItem(progressKey)) || {
        completedLessons: [],
        totalLessons: 0
    };
    
    // Get total lessons if not already set
    if (courseProgress.totalLessons === 0) {
        courseProgress.totalLessons = document.querySelectorAll('.lesson-link').length;
        localStorage.setItem(progressKey, JSON.stringify(courseProgress));
    }
    
    // Calculate percentage
    const progressPercentage = (courseProgress.completedLessons.length / courseProgress.totalLessons) * 100;
    
    // Update progress bar
    progressBar.style.width = `${progressPercentage}%`;
    
    // Update completed lesson indicators
    document.querySelectorAll('.lesson-link').forEach(link => {
        const lessonId = link.dataset.lessonId;
        if (courseProgress.completedLessons.includes(lessonId)) {
            link.classList.add('completed');
        }
    });
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const searchResults = document.querySelector('.search-results');
        
        if (searchTerm.length < 3) {
            if (searchResults) {
                searchResults.innerHTML = '';
            }
            return;
        }
        
        // In a real implementation, this would search through actual course content
        // This is a simplified example with hardcoded results
        const mockResults = [
            { title: 'Java Variables and Data Types', url: 'beginner/variables.html', level: 'Beginner' },
            { title: 'Java Control Flow Statements', url: 'beginner/control-flow.html', level: 'Beginner' },
            { title: 'Object-Oriented Programming in Java', url: 'beginner/oop-basics.html', level: 'Beginner' },
            { title: 'Java Collections Framework', url: 'intermediate/collections.html', level: 'Intermediate' },
            { title: 'Exception Handling in Java', url: 'intermediate/exceptions.html', level: 'Intermediate' }
        ];
        
        // Filter results based on search term
        const filteredResults = mockResults.filter(result => 
            result.title.toLowerCase().includes(searchTerm)
        );
        
        // Display results
        if (searchResults) {
            if (filteredResults.length > 0) {
                searchResults.innerHTML = filteredResults.map(result => `
                    <div class="search-result-item">
                        <a href="${result.url}">
                            <h4>${result.title}</h4>
                            <span class="result-level">${result.level}</span>
                        </a>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = '<div class="no-results">No results found</div>';
            }
        }
    });
}); 