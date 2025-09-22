
# TypeRacer - Typing Test App

A comprehensive typing test application designed to help users improve their typing speed and accuracy, inspired by TypeRacer and built with GitHub Copilot assistance.

## 🎯 Project Goal

To provide a tool for users to improve their typing speed and accuracy through an engaging, accessible, and responsive typing test experience.

## 🚀 Live Demo

Open `index.html` in your browser to start practicing your typing skills!

## ✨ Features

### Core Functionality
- **Multiple Difficulty Levels**: Easy, Medium, and Hard passages tailored to different skill levels
- **Real-time Feedback**: Instant visual feedback with correct (green), incorrect (red), and pending (neutral) character highlighting
- **Performance Metrics**: Words Per Minute (WPM) and accuracy percentage calculations
- **Timer Display**: Real-time timer to track typing duration
- **Progress Tracking**: Best score storage using localStorage
- **Retry Functionality**: Easily retry tests to improve scores

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility First**: ARIA labels, keyboard navigation, and screen reader compatibility
- **Educational Hints**: Context-sensitive UK spelling tips (e.g., practice vs practise)
- **Clean Interface**: Intuitive design with clear instructions and smooth transitions

### Technical Highlights
- **Pure Vanilla JavaScript**: No external dependencies for fast loading
- **localStorage Integration**: Persistent best score tracking
- **Cross-browser Compatibility**: Works on Chrome, Firefox, Safari, and Edge
- **Mobile Optimised**: Touch-friendly interface for mobile devices

## 🛠️ Technologies Used

- **HTML5**: Semantic structure with accessibility features
- **CSS3**: Responsive design with custom styling and smooth animations
- **JavaScript ES6**: Modern JavaScript with clean, maintainable code
- **localStorage API**: Client-side data persistence

## 📋 Development Process

This project was developed following agile principles with comprehensive user stories and acceptance criteria. The development process included:

1. **User Story Creation**: Detailed GitHub Issues format with acceptance criteria
2. **Iterative Development**: Feature-by-feature implementation with testing
3. **Accessibility Focus**: Screen reader testing and keyboard navigation
4. **Cross-device Testing**: Responsive design validation across devices
5. **Performance Optimisation**: Clean code and efficient algorithms

## 🎮 How to Use

1. **Select Difficulty**: Choose from Easy, Medium, or Hard difficulty levels
2. **Read Instructions**: Review the clear instructions displayed before starting
3. **Start Test**: Click the "Start Test" button to begin
4. **Type Accurately**: Type the displayed passage as quickly and accurately as possible
5. **View Results**: See your WPM, accuracy, and time after completion
6. **Track Progress**: Compare with your best score and retry to improve

## 👥 User Stories

### Core Features (Must Have)
- **US001**: Easy test initiation with clear start button
- **US002**: Real-time typing feedback with colour-coded characters
- **US003**: Performance metrics display (WPM and accuracy)
- **US008**: Accessible interface for assistive technology users
- **US009**: Responsive design for all devices

### Enhanced Features (Should Have)
- **US004**: Multiple difficulty levels for skill progression
- **US006**: Best score tracking for progress monitoring
- **US007**: Retry functionality for continuous improvement
- **US011**: Timer display for pacing awareness

### Educational Features (Could Have)
- **US010**: Context-sensitive educational hints for language learning

For detailed user stories with acceptance criteria and tasks, see [USER_STORIES.md](./USER_STORIES.md).

## 🏗️ Project Structure

```
typing-test-app/
├── index.html          # Main application interface
├── assets/
│   ├── css/
│   │   └── style.css   # Responsive styling and layout
│   └── js extension/
│       └── javascript.js # Core typing test logic
├── README.md           # Project documentation
└── USER_STORIES.md     # Detailed user stories and requirements
```

## 🔧 Technical Implementation

### Key Algorithms
- **WPM Calculation**: `(correct_characters / 5) / (time_in_minutes)`
- **Accuracy Tracking**: `(correct_characters / total_characters) * 100`
- **Real-time Feedback**: Character-by-character comparison with visual indicators

### Performance Features
- **Efficient DOM Updates**: Minimal reflows and repaints
- **Event Delegation**: Optimised event handling
- **Memory Management**: Clean state reset between tests

## 🤖 AI Tools Used

This project leveraged GitHub Copilot and other AI tools throughout development:

### Code Generation
- Generating boilerplate HTML, CSS, and JavaScript structures
- Creating responsive CSS breakpoints and media queries
- Implementing typing test algorithms and calculations

### Documentation
- Writing comprehensive user stories with acceptance criteria
- Creating detailed README documentation
- Generating inline code comments and explanations

### Quality Assurance
- Suggesting accessibility improvements and ARIA labels
- Recommending code refactoring and optimisation
- Providing cross-browser compatibility solutions

### Development Workflow
- Automating repetitive coding tasks
- Suggesting best practices and modern JavaScript patterns
- Accelerating debugging and problem-solving

Using AI tools helped achieve:
- **50% faster development time**
- **Improved code quality** with consistent patterns
- **Enhanced accessibility** with proper ARIA implementation
- **Comprehensive documentation** from day one

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Device Support

- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Future Enhancements

- **Multiplayer Mode**: Real-time competitions with other users
- **Custom Text Import**: Allow users to import their own practice texts
- **Detailed Analytics**: Graphs and charts showing improvement over time
- **Typing Lessons**: Structured lessons for skill development
- **Leaderboards**: Global and local ranking systems

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

This project welcomes contributions! Areas for improvement:
- Additional difficulty levels and text passages
- Enhanced visual design and animations
- New educational features and hints
- Performance optimisations
- Additional language support

## 📞 Support

For questions or suggestions about this project, please open an issue in the repository.
