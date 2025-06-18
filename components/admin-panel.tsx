"use client"

import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminPanel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>

        <div className="mb-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Νέα μέθοδος προσθήκης παιχνιδιών</AlertTitle>
            <AlertDescription>
              Τα παιχνίδια πλέον προστίθενται απευθείας στον κώδικα της σελίδας. Χρησιμοποιήστε τη φόρμα για να
              δημιουργήσετε τον κώδικα του νέου παιχνιδιού και έπειτα προσθέστε τον στον πίνακα clickerGames στο αρχείο
              app/page.tsx.
            </AlertDescription>
          </Alert>
        </div>

        <p className="text-gray-700 text-center">This is a placeholder for the admin panel.</p>
      </div>
    </div>
  )
}
