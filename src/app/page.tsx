import Map from "./components/Map";

async function getBusLocations() {
  const res = await fetch(
    "https://openapi.izmir.bel.tr/api/iztek/hatotobuskonumlari/423",
    {
      cache: "no-store",
    }
  );
  const data = await res.json();

  console.log("Otobüs Konum:", data.HatOtobusKonumlari); // Gelen veriyi kontrol edin
  return data.HatOtobusKonumlari || [];
}

async function getBusSchedules() {
  const res = await fetch(
    "https://acikveri.bizizmir.com/tr/api/3/action/datastore_search?resource_id=c6fa6046-f755-47d7-b69e-db6bb06a8b5a&limit=50"
  );
  const data = await res.json();

  console.log("Otobüs Tarifeleri:", data.result.records); // Gelen veriyi kontrol edin
  return data.result.records || [];
}

export default async function Home() {
  const busLocations = await getBusLocations();
  const busSchedules = await getBusSchedules();

  return (
    <div>
      <h1>İzmir Otobüs Konumları</h1>
      <Map busLocations={busLocations} />

      <h2>Otobüs Tarifeleri</h2>
      <ul>
        {busSchedules.map((schedule) => (
          <li key={schedule._id}>
            <p>Hat No: {schedule.HAT_NO}</p>
            <p>Tarife ID: {schedule.TARIFE_ID}</p>
            <p>Gidiş Saati: {schedule.GIDIS_SAATI}</p>
            <p>Dönüş Saati: {schedule.DONUS_SAATI}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}