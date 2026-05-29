import BookingForm from '@/components/BookingForm';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to Our Booking App</h1>
      <BookingForm />
    </main>
  );
}
