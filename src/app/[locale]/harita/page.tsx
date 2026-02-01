export default function MapPage() {
    return (
        <main className="pt-24 pb-20 min-h-screen">
            <div className="container-custom">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Harita Görünümü</h1>
                <p className="text-gray-500 mb-8">
                    Tüm ilanlarımızı harita üzerinde görüntüleyin.
                </p>

                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-xl h-[600px] flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-400 text-lg mb-2">
                            Harita görünümü yakında eklenecek
                        </p>
                        <p className="text-gray-300 text-sm">
                            Google Maps entegrasyonu ile tüm ilanları harita üzerinde görüntüleyebileceksiniz.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
