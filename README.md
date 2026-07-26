# Infinite Calendar — See & Plan Everything in One Infinite Screen

**Infinite Calendar** transforms how you interact with time. Because it offers scrollable, unlimited calendars, you can easily view years ahead or decades past in a single seamless screen. It is the perfect tool to **see, plan, and map your goals and tasks** for the future.

## Stunning Year Carousel
- A 3-panel "Coverflow" style carousel.  
- Fully **colored weekends**: Friday (Purple), Saturday (Blue), Sunday (Red).  
- **Glossy hover effects** on all dates.  
- **Floating, compact mini-header** with a live clock and quick navigation buttons (Year, Month, Now).

## Beautiful Month & Agenda Views
- **Month View:** A 3-panel glass carousel showing previous, current, and next months with perfect grid alignment.  
- **Agenda (Now) View:** A Google Calendar-inspired layout with a **colorized mini-month sidebar** on the left and a **7-day time-grid** on the right. Features a red "Current Time" line and smooth sliding transitions.

## Optimized Performance & Lightweight
- **Lazy Loading:** Uses `IntersectionObserver` to only render months when they scroll into view (reducing DOM weight by 95%).  
- **No GPU dependency:** Uses pure CSS `transform` and `requestAnimationFrame` for buttery smooth scrolling on any hardware.  
- **Dead code removed:** The app is solely built around 3 View Modes (`Year`, `Month`, `Now`) with zero legacy zoom levels.  
- **Infinite Scrolling:** The home grid never stops. Scroll endlessly forward or backward to plan your tasks and map your goals across decades.

## 🛠️ Built With

- **[React](https://reactjs.org/)** – Component-based UI library.  
- **[Vite](https://vitejs.dev/)** – Next-generation frontend tooling.  
- **[date-fns](https://date-fns.org/)** – Modern JavaScript date utility library.  
- **[smooth-scroll](https://github.com/cferdinandi/smooth-scroll)** – Lightweight, animate scrolling library.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)  
- npm or yarn  

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/unlimited-calendar.git
   cd unlimited-calendar
