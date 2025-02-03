import Map from "./components/Map";

async function getBusLocations() {
  const res = await fetch(
    "https://openapi.izmir.bel.tr/api/iztek/hatotobuskonumlari/423",
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data.HatOtobusKonumlari || [];
}

async function getBusSchedules() {
  const res = await fetch(
    "https://acikveri.bizizmir.com/tr/api/3/action/datastore_search?resource_id=c6fa6046-f755-47d7-b69e-db6bb06a8b5a&limit=50"
  );
  const data = await res.json();
  return data.result.records || [];
}

async function getBusAnnouncements() {
  const res = await fetch(
    "https://acikveri.bizizmir.com/tr/api/3/action/datastore_search?resource_id=aeafda53-3db8-46fa-abe3-47b773fc8b90&limit=50"
  );
  const data = await res.json();
  return data.result.records || [];
}

async function getBusRoutes() {
  const res = await fetch(
    "https://acikveri.bizizmir.com/tr/api/3/action/datastore_search?resource_id=bd6c84f8-49ba-4cf4-81f8-81a0fbb5caa3&limit=50"
  );
  const data = await res.json();
  return data.result.records || [];
}

export default async function Home() {
  const busLocations = await getBusLocations();
  const busSchedules = await getBusSchedules();
  const busAnnouncements = await getBusAnnouncements();
  const busRoutes = await getBusRoutes();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">İzmir Otobüs Konumları</h1>
      <Map busLocations={busLocations} />

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