import countriesLatam from '../data/countriesLatam.json';
import { useState } from 'react';

function RegisterForm() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [cantons, setCantons] = useState([]);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setProvinces(Object.keys(countriesLatam[country] || {}));
    setSelectedProvince('');
    setCantons([]);
    setSelectedCanton('');
  };

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setSelectedProvince(province);
    setCantons(countriesLatam[selectedCountry][province] || []);
    setSelectedCanton('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nombre: e.target.nombre.value,
      email: e.target.email.value,
      password: e.target.password.value,
      pais: selectedCountry,
      provincia: selectedProvince,
      canton: selectedCanton
    };
    const res = await fetch('http://localhost:8000/backend/api/auth.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre:</label>
      <input name="nombre" required />
      <label>Email:</label>
      <input name="email" type="email" required />
      <label>Contraseña:</label>
      <input name="password" type="password" required />

      <label>País:</label>
      <select value={selectedCountry} onChange={handleCountryChange} required>
        <option value="">Seleccione un país</option>
        {Object.keys(countriesLatam).map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>

      <label>Provincia/Estado:</label>
      <select value={selectedProvince} onChange={handleProvinceChange} required disabled={!provinces.length}>
        <option value="">Seleccione una provincia/estado</option>
        {provinces.map((province) => (
          <option key={province} value={province}>{province}</option>
        ))}
      </select>

      <label>Cantón:</label>
      <select value={selectedCanton} onChange={e => setSelectedCanton(e.target.value)} required disabled={!cantons.length}>
        <option value="">Seleccione un cantón</option>
        {cantons.map((canton) => (
          <option key={canton} value={canton}>{canton}</option>
        ))}
      </select>
      <button type="submit">Registrar</button>
    </form>
  );
}

export default RegisterForm;