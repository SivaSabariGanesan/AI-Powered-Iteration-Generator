export interface Destination {
    city: string;
    state: string;
    description: string;
    coordinates: [number, number];
    attractions: Array<{
      name: string;
      description: string;
      type: 'monument' | 'temple' | 'nature' | 'beach' | 'culture';
      entryFee?: number;
    }>;
    hotels: Array<{
      name: string;
      priceRange: 'budget' | 'mid-range' | 'luxury';
      pricePerNight: number;
      rating: number;
      amenities: string[];
    }>;
    bestTimeToVisit: string;
    weather: string;
  }
  
  export const indianDestinations: Destination[] = [
    {
      city: 'Agra',
      state: 'Uttar Pradesh',
      description: 'Home to the iconic Taj Mahal, Agra is a testament to Mughal architecture and history.',
      coordinates: [27.1767, 78.0081],
      attractions: [
        {
          name: 'Taj Mahal',
          description: 'An ivory-white marble mausoleum and UNESCO World Heritage site.',
          type: 'monument',
          entryFee: 1100
        },
        {
          name: 'Agra Fort',
          description: 'UNESCO World Heritage site and historical fortress.',
          type: 'monument',
          entryFee: 550
        }
      ],
      hotels: [
        {
          name: 'Hotel Sidhartha',
          priceRange: 'budget',
          pricePerNight: 999,
          rating: 4.0,
          amenities: ['AC', 'WiFi', 'Restaurant']
        },
        {
          name: 'Crystal Inn',
          priceRange: 'mid-range',
          pricePerNight: 2500,
          rating: 4.2,
          amenities: ['AC', 'WiFi', 'Restaurant', 'Pool']
        }
      ],
      bestTimeToVisit: 'October to March',
      weather: 'Hot summers and mild winters'
    },
    {
      city: 'Jaipur',
      state: 'Rajasthan',
      description: 'The Pink City of India, known for its stunning architecture and royal heritage.',
      coordinates: [26.9124, 75.7873],
      attractions: [
        {
          name: 'Amber Fort',
          description: 'Magnificent fort complex combining Rajput and Mughal architecture.',
          type: 'monument',
          entryFee: 500
        },
        {
          name: 'Hawa Mahal',
          description: 'Palace of Winds, featuring unique honeycomb-like architecture.',
          type: 'monument',
          entryFee: 200
        }
      ],
      hotels: [
        {
          name: 'Pearl Palace Heritage',
          priceRange: 'budget',
          pricePerNight: 1200,
          rating: 4.5,
          amenities: ['AC', 'WiFi', 'Restaurant', 'Heritage Property']
        },
        {
          name: 'Zostel Jaipur',
          priceRange: 'budget',
          pricePerNight: 800,
          rating: 4.3,
          amenities: ['AC', 'WiFi', 'Common Kitchen']
        }
      ],
      bestTimeToVisit: 'October to March',
      weather: 'Hot desert climate with mild winters'
    },
    {
      city: 'Goa',
      state: 'Goa',
      description: 'Famous for its beaches, nightlife, and Portuguese heritage.',
      coordinates: [15.2993, 74.1240],
      attractions: [
        {
          name: 'Calangute Beach',
          description: 'Popular beach known for water sports and nightlife.',
          type: 'beach'
        },
        {
          name: 'Basilica of Bom Jesus',
          description: 'UNESCO World Heritage site, example of Baroque architecture.',
          type: 'monument',
          entryFee: 0
        }
      ],
      hotels: [
        {
          name: 'Cuba Hostel',
          priceRange: 'budget',
          pricePerNight: 600,
          rating: 4.2,
          amenities: ['AC', 'WiFi', 'Beach Access']
        },
        {
          name: 'Ocean Palms',
          priceRange: 'mid-range',
          pricePerNight: 3500,
          rating: 4.4,
          amenities: ['AC', 'WiFi', 'Pool', 'Beach Access', 'Restaurant']
        }
      ],
      bestTimeToVisit: 'November to February',
      weather: 'Tropical climate with warm temperatures year-round'
    }
  ];