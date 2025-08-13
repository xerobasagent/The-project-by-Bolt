# Timesheet Management App

A comprehensive timesheet tracking application built with React Native and Expo, featuring both employee and admin interfaces.

## 🚀 Features

### Employee Features
- **Clock In/Out System**: Easy time tracking with location and client selection
- **Client Management**: View and manage client information
- **Timesheet Reports**: View daily, weekly, and monthly time reports
- **Client Survey**: Rate client experience after each work session
- **Profile Management**: Update personal information and view work statistics
- **Settings**: Customize app preferences and export data

### Admin Features
- **Dashboard**: Overview of all employees and time tracking statistics
- **Employee Management**: View and manage employee timesheets
- **Client Management**: Add, edit, and organize client information
- **Timesheet Reports**: View and edit all employee time entries
- **Web Admin Portal**: Standalone HTML admin interface

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **UI Components**: Custom components with Lucide React Native icons
- **Styling**: StyleSheet with gradient backgrounds
- **Platform**: iOS, Android, and Web support

## 📱 Screenshots

The app features a modern, professional design with:
- Gradient backgrounds and smooth animations
- Card-based layouts with proper shadows and elevation
- Responsive design that works on all screen sizes
- Intuitive navigation with tab-based structure

## 🏗 Project Structure

```
├── app/                          # Main application screens
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Clock in/out screen
│   │   ├── timesheet.tsx        # Timesheet reports
│   │   ├── clients.tsx          # Client management
│   │   ├── profile.tsx          # User profile
│   │   └── settings.tsx         # App settings
│   ├── admin/                   # Admin interface
│   │   ├── login.tsx           # Admin login
│   │   ├── dashboard.tsx       # Admin dashboard
│   │   ├── employees.tsx       # Employee management
│   │   ├── clients.tsx         # Admin client management
│   │   └── timesheets.tsx      # All timesheets view
│   ├── login.tsx               # Employee login
│   └── _layout.tsx             # Root layout
├── components/                  # Reusable components
│   ├── ClientSelector.tsx      # Client selection modal
│   ├── ClientSurvey.tsx        # Post-work survey
│   ├── ProfileCard.tsx         # User profile display
│   ├── QuickActions.tsx        # Dashboard quick actions
│   ├── SettingsItem.tsx        # Settings list item
│   ├── StatusCard.tsx          # Status display card
│   ├── StatsCard.tsx           # Statistics card
│   ├── TimesheetEntry.tsx      # Individual timesheet entry
│   └── WeeklyChart.tsx         # Weekly hours chart
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts              # Authentication logic
│   ├── useClients.ts           # Client data management
│   ├── useEmployee.ts          # Employee data management
│   ├── useFrameworkReady.ts    # Framework initialization
│   ├── useSettings.ts          # App settings management
│   └── useTimeTracking.ts      # Time tracking logic
├── web-admin/                  # Standalone web admin
│   └── index.html              # Web admin interface
└── assets/                     # Static assets
    └── images/                 # App icons and images
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd timesheet-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the app:
   - **iOS Simulator**: Press `i` in the terminal
   - **Android Emulator**: Press `a` in the terminal
   - **Web Browser**: Press `w` in the terminal
   - **Physical Device**: Scan the QR code with Expo Go app

### Web Admin Portal

The standalone web admin portal can be accessed by:
1. Opening `web-admin/index.html` in any web browser
2. Or serving it with: `npm run serve:admin-web`
3. Login credentials: `admin` / `admin123`

## 📋 Usage

### Employee Login
- Use any of the demo employee IDs (EMP001, EMP002, EMP003)
- PIN: `1234` for all demo accounts

### Admin Login
- Username: `admin`
- Password: `admin123`

### Key Features

1. **Time Tracking**: Select a client and clock in/out with location tracking
2. **Client Survey**: Rate your experience after clocking out
3. **Reports**: View detailed timesheet reports with charts
4. **Client Management**: Add and manage client information
5. **Admin Dashboard**: Monitor all employee activities

## 🔧 Configuration

### Environment Variables

The app uses Expo's environment variable system. Create environment files as needed:

- `.env` - Development defaults
- `.env.staging` - Staging environment  
- `.env.production` - Production environment

### Customization

- **Colors**: Update gradient colors in component styles
- **Branding**: Replace icons in `assets/images/`
- **Demo Data**: Modify default data in hooks files

## 📱 Platform Support

- **iOS**: Full native support
- **Android**: Full native support
- **Web**: Responsive web interface with platform-specific adaptations

## 🔒 Security Features

- Secure authentication with AsyncStorage
- Input validation and error handling
- Platform-specific security considerations
- Data export and privacy controls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Expo and React Native
- Icons by Lucide React Native
- UI inspiration from modern mobile design patterns

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the code comments
- Review the demo data and examples

---

**Note**: This is a demo application with sample data. For production use, implement proper backend integration, authentication, and data persistence.