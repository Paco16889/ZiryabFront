
/**
 * Producción — API en Render (ZiryabBack).
 */
export const environment = {
    production: true,
    apiUrl: 'https://ziryabback.onrender.com/api',
    currentSchoolYear: '2024-2025',
    substituteEligibility: {
        maxWeeklyHours: 10,
        maxActiveAssignments: 2,
    },
    timetableSlots: [
        { startTime: '08:15', finishTime: '09:15' },
        { startTime: '09:15', finishTime: '10:15' },
        { startTime: '10:15', finishTime: '11:15' },
        { startTime: '11:45', finishTime: '12:45' },
        { startTime: '12:45', finishTime: '13:45' },
        { startTime: '13:45', finishTime: '14:45' },
    ] as const satisfies ReadonlyArray<{ startTime: string; finishTime: string }>,
    useMockNotifications: false,
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
