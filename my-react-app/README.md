# PlayPal - Connect Through Sports

A modern web application that allows people to connect through sports by creating and joining teams. Built with React, JavaScript, CSS, and HTML.

## Features

### 🏠 Home Page
- **PlayPal Logo**: Eye-catching gradient logo with the tagline "Connect Through Sports"
- **Description**: Clear explanation of the platform's purpose
- **Action Buttons**: 
  - **Join Team**: Browse and join existing teams
  - **Create Team**: Start your own sports team
- **Feature Highlights**: Three key features with icons and descriptions

### 👥 Team Management
- **Create Teams**: Users can create new teams with:
  - Team name and sport selection
  - Location and description
  - Maximum member limit
  - Creator information
- **Browse Teams**: View all available teams with:
  - Search functionality (by name, location, description)
  - Sport filtering
  - Team cards with key information
- **Join Teams**: Users can join teams by entering their name

### 🎯 Team Details
- **Comprehensive Team Info**: 
  - Sport icon and team name
  - Member count and capacity
  - Location and creator information
  - Detailed team description
- **Member List**: Display all team members with creator badges
- **Join Functionality**: Easy team joining with validation

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Gradient Backgrounds**: Beautiful purple-blue gradients throughout
- **Smooth Animations**: Hover effects and transitions
- **Glass Morphism**: Modern backdrop blur effects
- **Interactive Elements**: Buttons with hover states and feedback

## Technology Stack

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 7.0.3
- **Styling**: CSS3 with modern features
- **Language**: JavaScript (ES6+)
- **Icons**: Unicode emoji icons for sports

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd my-react-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
my-react-app/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx          # Landing page with logo and navigation
│   │   ├── HomePage.css          # Home page styling
│   │   ├── CreateTeam.jsx        # Team creation form
│   │   ├── CreateTeam.css        # Create team styling
│   │   ├── TeamsList.jsx         # Teams browsing and filtering
│   │   ├── TeamsList.css         # Teams list styling
│   │   ├── TeamDetails.jsx       # Detailed team view
│   │   └── TeamDetails.css       # Team details styling
│   ├── App.jsx                   # Main app component with routing
│   ├── App.css                   # Global styles
│   ├── main.jsx                  # App entry point
│   └── index.css                 # Base styles
├── public/
├── package.json
└── README.md
```

## Key Features Implementation

### State Management
- Uses React's `useState` for local state management
- Teams data stored in App component
- Navigation state managed centrally

### Form Validation
- Client-side validation for team creation
- Required field checking
- Error messages and visual feedback

### Search and Filtering
- Real-time search across team names, locations, and descriptions
- Sport-based filtering
- Responsive search interface

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Adaptive typography and spacing

## Sample Data

The application comes with 4 sample teams to demonstrate functionality:
- Basketball Legends (Downtown Sports Center)
- Soccer United (Central Park Field)
- Tennis Pros (Riverside Tennis Club)
- Volleyball Stars (Beach Volleyball Court)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

- User authentication and profiles
- Real-time messaging between team members
- Match scheduling and calendar integration
- Photo and video sharing
- Team statistics and achievements
- Mobile app version
- Backend integration with database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

---

**PlayPal** - Where sports bring people together! 🏆
