
/**
 * Variables de entorno
 */
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    useMockNotifications: true,
    /** Calendario de Google embebido (vista pública, sin login). */
    googleCalendar: {
        embedUrl:
            'https://calendar.google.com/calendar/embed?src=c_fe406644d4d1e624a708877c623f8c603b0c0122c6dcea64582acea2522e40ad%40group.calendar.google.com&ctz=Europe%2FMadrid&hl=es&mode=MONTH',
    },
    firebase: {
        apiKey: 'AIzaSyADRm1ot81xIDrrW3iKu6ywdAd8NR1G0gA',
        authDomain: 'ziryab-7006e.firebaseapp.com',
        projectId: 'ziryab-7006e',
        storageBucket: 'ziryab-7006e.firebasestorage.app',
        messagingSenderId: '708163806772',
        appId: '1:708163806772:web:274c85353970b612c14c61',
        measurementId: 'G-WNWVENZL8X',
    },
};
