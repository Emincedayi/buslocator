import Map from "./components/Map";

// Define the type for bus locations
interface BusLocation {
  HAT_NO: string;
  PLAKA: string;
  BOYlam: number;
  ENlem: number;
  HIZ: number;
  HAREKET_YONU: number;
  ISTASYON: string;
  KAPALI_MI: boolean;
}

// Define the type for bus schedules
interface BusSchedule {
  _id: string;
  HAT_NO: string;
  TARIFE_ID: string;
  GIDIS_SAATI: string;
  DONUS_SAATI: string;
}

// Define the type for bus announcements
interface BusAnnouncement {
  _id: string;
  HAT_NO: string;
  BASLIK: string;
  BASLAMA_TARIHI: string;
  BITIS_TARIHI: string;
}

// Define the type for bus routes
interface BusRoute {
  _id: string;
  HAT_NO: string;
  HAT_ADI: string;
  GUZERGAH_ACIKLAMA: string;
  ACIKLAMA: string;
  HAT_BASLANGIC: string;
  HAT_BITIS: string;
}

// Fetch bus locations
async function getBusLocations(): Promise<BusLocation[]> {
  const res = await fetch(
    "https://openapi.izmir.bel.tr/api/iztek/hatotobuskonumlari/423",
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data.HatOtobusKonumlari || [];
}

// Fetch bus schedules
async function getBusSchedules(): Promise<BusSchedule[]> {
  const res = await fetch(
    "https://acikveri.bizizmir.com/tr/api/3/action/datastore_search?resource_id=c6fa6046-f755-47d7-b69e-db6bb06a8b5a&limit=50"
  );
  const data = await res.json();
  return data.result.records || [];
}

// Fetch bus announcements
async function getBusAnnouncements(): Promise<BusAnnouncement[]> {
  const res = await fetch(
    "https://acikveri.bizizmir.com/tr/api/3/action/datastore_search?resource_id=aeafda53-3db8-46fa-abe3-47b773fc8b90&limit=50"
  );
  const data = await res.json();
  return data.result.records || [];
}

// Fetch bus routes
async function getBusRoutes(): Promise<BusRoute[]> {
  const res = await fetch(
    "https://acikveri.bizizmir.com/tr/api/3/action/datastore_search?resource_id=bd6c84f8-49ba-4cf4-81f8-81a0fbb5caa3&limit=50"
  );
  const data = await res.json();
  return data.result.records || [];
}

export default async function Home() {
  const busLocations: BusLocation[] = await getBusLocations();
  const busSchedules: BusSchedule[] = await getBusSchedules();
  const busAnnouncements: BusAnnouncement[] = await getBusAnnouncements();
  const busRoutes: BusRoute[] = await getBusRoutes();

  // busLocations'ı Map bileşenine uygun hale getir
  const formattedBusLocations = busLocations.map((bus) => ({
    OtobusId: parseInt(bus.PLAKA.replace(/\D/g, ""), 10) || Math.random(), // Plaka numarasını sayıya çevir, yoksa rastgele bir ID kullan
    Yon: bus.HAREKET_YONU, // Hareket yönünü aktarıyoruz
    KoorY: bus.BOYlam.toString(), // Boylamı string olarak aktarıyoruz
    KoorX: bus.ENlem.toString(), // Enlemi string olarak aktarıyoruz
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">İzmir Otobüs Konumları</h1>
      <Map busLocations={formattedBusLocations} />

      <h2 className="text-xl font-bold mt-6 mb-4">Otobüs Tarifeleri</h2>
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-6">
        {busSchedules.map((schedule) => (
          <div key={schedule._id} className="mb-4 pb-4 border-b border-gray-200">
            <p><strong>Hat No:</strong> {schedule.HAT_NO}</p>
            <p><strong>Tarife ID:</strong> {schedule.TARIFE_ID}</p>
            <p><strong>Gidiş Saati:</strong> {schedule.GIDIS_SAATI}</p>
            <p><strong>Dönüş Saati:</strong> {schedule.DONUS_SAATI}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Otobüs Duyuruları</h2>
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-6">
        {busAnnouncements.map((announcement) => (
          <div key={announcement._id} className="mb-4 pb-4 border-b border-gray-200">
            <p><strong>Hat No:</strong> {announcement.HAT_NO}</p>
            <p><strong>Başlık:</strong> {announcement.BASLIK}</p>
            <p><strong>Başlama Tarihi:</strong> {new Date(announcement.BASLAMA_TARIHI).toLocaleString()}</p>
            <p><strong>Bitiş Tarihi:</strong> {new Date(announcement.BITIS_TARIHI).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Otobüs Hat Bilgileri</h2>
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
        {busRoutes.map((route) => (
          <div key={route._id} className="mb-4 pb-4 border-b border-gray-200">
            <p><strong>Hat No:</strong> {route.HAT_NO}</p>
            <p><strong>Hat Adı:</strong> {route.HAT_ADI}</p>
            <p><strong>Güzergah Açıklama:</strong> {route.GUZERGAH_ACIKLAMA}</p>
            <p><strong>Açıklama:</strong> {route.ACIKLAMA}</p>
            <p><strong>Hat Başlangıç:</strong> {route.HAT_BASLANGIC}</p>
            <p><strong>Hat Bitiş:</strong> {route.HAT_BITIS}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
